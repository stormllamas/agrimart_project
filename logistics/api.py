# Packages
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response

# Models
from .models import Product, Seller, CategoryGroup, Category, Order, OrderItem, RefundRequest, Favorite, ProductReview, OrderReview, PromoCode

from django.contrib.auth import get_user_model
User = get_user_model()

from configuration.models import SiteConfiguration
try:
  site_config = SiteConfiguration.objects.first()
except:
  site_config = None

# Permissions and pagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from agrimart.permissions import SiteEnabled
from agrimart.pagination import StandardResultsSetPagination, ProductsPagination, ManagerPagination

# Serializers
from .serializers import AllProductSerializer, ProductSerializer, SellerSerializer, CategoryGroupSerializer, CategorySerializer, OrderSerializer, OrderItemSerializer, RefundRequestSerializer, FavoriteSerializer, ProductReviewSerializer, OrderReviewSerializer

# For Email
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site

# Tools
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
import datetime

# Exceptions
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied

class HighlightsAPI(GenericAPIView):

  def get(self, request):
    best_sellers = [{
      'id': product.id,
      'name': product.name,
      'thumbnail': product.thumbnail.url,
      'name_to_url': product.name_to_url,
      'seller': {
        'id': product.seller.id,
        'name': product.seller.name,
        'name_to_url': product.seller.name_to_url
      },
    } for product in sorted(Product.objects.all(), key=lambda a: a.total_orders, reverse=True)[0:12]]
    
    return Response({
      'best_sellers': best_sellers,
    })
class FilterDetailsAPI(GenericAPIView):

  def get(self, request):
    category_groups = [{
      'id': category_group.id,
      'name': category_group.name,
      'categories': [{
        'id': category.id,
        'name': category.name
      } for category in category_group.categories.all()]
    } for category_group in CategoryGroup.objects.all()]

    sellers = [{
      'id': seller.id,
      'name': seller.name
    } for seller in Seller.objects.all()]
    
    return Response({
      'category_groups': category_groups,
      'sellers': sellers,
    })

class SellerAPI(GenericAPIView):

  def get(self, request, seller_name=None):
    sn = seller_name.replace('-and-', '-&-').replace('-',' ')
    seller = Seller.objects.get(name=sn)

    return Response({
      'id': seller.id,
      'name': seller.name,
      'contact': seller.contact,
      'description': seller.description,
      'latitude': seller.latitude,
      'longitude': seller.longitude,
      'address': seller.address,
      'thumbnail': seller.thumbnail.url,
      'name_to_url': seller.name_to_url,
    })

class AllProductsAPI(ListAPIView):
  serializer_class = AllProductSerializer
  permission_classes = [SiteEnabled]

  def get_queryset(self):
    return Product.objects.all().order_by('id')

class ProductsAPI(GenericAPIView):

  def get(self, request):
    categories = Category.objects.all()
    sellers = Seller.objects.all()
    keywords_query = Q()
    commodity_query = Q()
    category_query = Q()
    brands_query = Q()

    if 'keywords' in self.request.query_params:
      keywords = self.request.query_params.get('keywords', None)
      if keywords:
        keywords_query.add(Q(seller__name__icontains=keywords), Q.OR)
        # keywords_query.add(Q(categories__name__icontains=keywords), Q.OR)
        keywords_query.add(Q(name__icontains=keywords), Q.OR)
        keywords_query.add(Q(description__icontains=keywords), Q.OR)
    
    if 'category' in self.request.query_params:
      categoryQuery = self.request.query_params.getlist('category', None)
      for category in categories:
        if str(category.name) in categoryQuery:
          if category.category_group.name == 'Commodities':
            commodity_query.add(Q(categories__in=[category]), Q.OR)
          elif category.category_group.name == 'Categories':
            category_query.add(Q(categories__in=[category]), Q.OR)
    
    if 'brand' in self.request.query_params:
      sellerQuery = self.request.query_params.getlist('brand', None)
      for seller in sellers:
        # print(seller)
        # print('seller name', str(seller.name))
        if str(seller.name) in sellerQuery:
          brands_query.add(Q(seller=seller.id), Q.OR)
          
    queryset = sorted(Product.objects.filter(Q(is_published=True) & keywords_query & brands_query & commodity_query).filter(category_query).distinct(), key=lambda a: (a.total_orders, -a.id), reverse=True)
    
    queryset_full_length = len(queryset)

    page_query = int(self.request.query_params.get('page', 1))
    from_item = 0
    to_item = 8
    if page_query > 1:
      from_item = (page_query-1)*8
      to_item = page_query*8

    if (page_query*8) >= queryset_full_length:
      next_path = None
    else:
      next_path = f'api/products?page={page_query+1}'

    if page_query > 1:
      previous_path = f'api/products?page={page_query-1}'
    else:
      previous_path = None

      
    products = [{
      'id': product.id,
      'name': product.name,
      'thumbnail': product.thumbnail.url,
      'name_to_url': product.name_to_url,
      'review_count': sum([product_variant.reviews.all().count() for product_variant in product.variants.all()]),
      'total_rating': product.total_rating,
      'cheapest_variant': {
        'price': product.cheapest_variant.price,
        'name': product.cheapest_variant.name,
        'final_price': product.cheapest_variant.final_price,
        'percent_off': product.cheapest_variant.percent_off,
        'total_rating': product.cheapest_variant.total_rating,
        'sale_price_active': product.cheapest_variant.sale_price_active
      },
      'seller': {
        'id': product.seller.id,
        'name': product.seller.name,
        'name_to_url': product.seller.name_to_url
      },
    } for product in queryset[from_item:to_item]]

    return Response({
      'count': len(products),
      'next': next_path,
      'previous': previous_path,
      'results': products,
    })
class ProductAPI(GenericAPIView):
  # queryset = Product.objects.all().order_by('-orders', '-views', 'id')
  serializer_class = ProductSerializer
  permission_classes = [SiteEnabled]

  def get(self, request, product_name=None, seller_name=None):
    pn = product_name.replace('-and-', '-&-').replace('-',' ')
    sn = seller_name.replace('-and-', '-&-').replace('-',' ')
    product = Product.objects.get(name=pn, seller__name=sn)

    categories = [category.name for category in product.categories.all()]

    variants = [{
      'id': variant.id,
      'name': variant.name,
      'price': float(variant.price),
      'sale_price_active': variant.sale_price_active,
      'final_price': variant.final_price,
      'percent_off': variant.percent_off
    } for variant in product.variants.all()]

    return Response({
      'name': product.name,
      'description': product.description,
      'seller': {
        'id': product.seller.id,
        'name': product.seller.name,
        'name_to_url': product.seller.name_to_url,
      },
      'categories': categories,
      'thumbnail': product.thumbnail.url,
      'review_count': sum([product_variant.reviews.all().count() for product_variant in product.variants.all()]),
      'total_rating': product.total_rating,
      'photo_1': product.photo_1.url if product.photo_1 else None,
      'photo_2': product.photo_2.url if product.photo_2 else None,
      'photo_3': product.photo_3.url if product.photo_3 else None,
      'variants': variants
    })
# Need to develop OR include in other API
class SimilarProductsAPI(ListModelMixin, viewsets.GenericViewSet):
  queryset = Product.objects.all()
  serializer_class = ProductSerializer

  def get_queryset(self):
    product = self.kwargs['product']
    commodity = self.kwargs['commodity']
    return Product.objects.filter(commodity__id=commodity).exclude(id=product).order_by('-orders', '-views', 'id')

class CurrentOrderAPI(RetrieveAPIView, UpdateAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def get_object(self):
    Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    if len(Orders) < 1:
      Order.objects.create(user=self.request.user)
      Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    return Orders.first()

  def get(self, request, order_type=None):
    order = self.get_object()

    for order_item in order.order_items.all():
      if order_item.checkout_valid:
        if not request.query_params.get('for_checkout', None):
          order_item.checkout_validity = None
          order_item.save()
      else:
        if order_item.checkout_validity != None:
          order_item.checkout_validity = None
          order_item.save()

        if order_item.product_variant.final_stock > 0 and order_item.quantity > order_item.product_variant.final_stock:
          # Change item quantity based on stock
          order_item.quantity = 10 if order_item.product_variant.final_stock >= 10 else order_item.product_variant.final_stock
          order_item.save()

    order_items = [{
      'id': order_item.id,
      'quantity': order_item.quantity,
      'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
      'thumbnail': order_item.product_variant.thumbnail.url,
      'final_stock': order_item.product_variant.final_stock,
      'checkout_valid': order_item.checkout_valid,
      'order': {
        'id': order_item.order.id,
        'ref_code': order_item.order.ref_code
      },
      'product': {
        'id': order_item.product_variant.product.id,
        'name': order_item.product_variant.product.name,
        'description': order_item.product_variant.product.description,
        'thumbnail': order_item.product_variant.product.thumbnail.url,
        'is_published': order_item.product_variant.product.is_published,
      },
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'final_price': float(order_item.product_variant.final_price),
      },
    } for order_item in sorted(OrderItem.objects.filter(order=order), key=lambda a: (a.product_variant.final_stock, a.id))]
      
    return Response({
      'id': order.id, 'user': order.user.id, 'ref_code': order.ref_code,

      'first_name': order.first_name, 'last_name': order.last_name,
      'contact': order.contact, 'email': order.email, 'gender': order.gender,

      'payment_type': order.payment_type,
      
      'is_ordered': order.is_ordered, 'date_ordered': order.date_ordered,
      'is_paid': order.is_paid, 'date_paid': order.date_paid,
      
      'loc1_latitude': order.loc1_latitude,
      'loc1_longitude': order.loc1_longitude,
      'loc1_address': order.loc1_address,
      'loc2_latitude': order.loc2_latitude,
      'loc2_longitude': order.loc2_longitude,
      'loc2_address': order.loc2_address,

      'has_valid_item': order.has_valid_item,

      'shipping': order.shipping,

      'count': order.count,
      'subtotal': order.subtotal,
      'checkout_subtotal': order.checkout_subtotal,
      'total': order.total,
      'checkout_total': order.checkout_total,

      'order_items': order_items,
    })

class OrdersAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled]

  def get(self, request):

    delivered_query = Q()
    delivered = self.request.query_params.get('delivered', None)
    if delivered == 'true':
      delivered_query.add(Q(is_delivered=True), Q.AND)
    elif delivered == 'false':
      delivered_query.add(Q(is_delivered=False), Q.AND)

    queryset_full_length = Order.objects.filter(Q(user=request.user, is_ordered=True) & delivered_query).count()

    page_query = int(self.request.query_params.get('page', 1))
    from_item = 0
    to_item = 4
    if page_query > 1:
      from_item = (page_query-1)*4
      to_item = page_query*4

    if (page_query*4) >= queryset_full_length:
      next_path = None
    else:
      next_path = f'api/orders?page={page_query+1}'

    if page_query > 1:
      previous_path = f'api/orders?page={page_query-1}'
    else:
      previous_path = None

    orders = [{
      'id': order.id, 'ref_code': order.ref_code,

      'loc1_address': order.loc1_address,
      'loc2_address': order.loc2_address,

      'payment_type': order.payment_type,
      'count': order.ordered_count, 'shipping': order.ordered_shipping, 'initial_shipping': order.initial_shipping, 'total': order.ordered_total,
      
      'subtotal': order.subtotal,
      'ordered_subtotal': order.ordered_subtotal,
      'date_ordered': order.date_ordered,

      'is_processed': order.is_processed, 'date_processed': order.date_processed,
      'is_prepared': order.is_prepared, 'date_prepared': order.date_prepared,
      'is_delivered': order.is_delivered, 'date_delivered': order.date_delivered,
      'is_canceled': order.is_canceled, 'is_canceled': order.is_canceled,
      
      'is_reviewed': True if OrderReview.objects.filter(order=order).exists() else False,

      'promo_code': {
        'order_discount': order.promo_code.order_discount,
        'delivery_discount': order.promo_code.delivery_discount,
      } if order.promo_code else None,
      
      'order_items': [{
        'id': order_item.id,
        'quantity': order_item.quantity,
        'ordered_price': order_item.ordered_price if order_item.ordered_price else 0,
        'is_reviewed': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
        # 'has_refund_request': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
        'is_delivered': order_item.is_delivered,
        'product': {
          'id': order_item.product_variant.product.id,
          'name': order_item.product_variant.product.name,
        },
        'product_variant': {
          'id': order_item.product_variant.id,
          'name': order_item.product_variant.name,
          'thumbnail': order_item.product_variant.thumbnail.url,
        },
      } for order_item in order.order_items.all()]

    } for order in Order.objects.filter(Q(user=request.user, is_ordered=True) & delivered_query).order_by('-date_ordered')[from_item:to_item]]

    return Response({
      'count': len(orders),
      'next': next_path,
      'previous': previous_path,
      'results': orders,
    })
class OrderAPI(RetrieveAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if obj.is_ordered == True and obj.user == request.user:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(Order, id=self.kwargs['pk']))
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    order = self.get_object()

    return Response({
      'id': order.id,
      'ref_code': order.ref_code,
      
      'count': order.count,

      'is_delivered': order.is_delivered,

      'is_ordered': order.is_ordered,
      'date_ordered': order.date_ordered,
      'ordered_subtotal': sum([item.quantity*item.ordered_price if item.is_ordered and item.ordered_price else 0 for item in order.order_items.all()]),

      'is_reviewed': True if OrderReview.objects.filter(order=order).exists() else False,
      'review': {
        'id': order.review.id if OrderReview.objects.filter(order=order).exists() else None,
        'rating': order.review.rating if OrderReview.objects.filter(order=order).exists() else None,
        'comment': order.review.comment if OrderReview.objects.filter(order=order).exists() else None,
      },
      'user': {
        'id': order.user.id
      },
    })

class OrderItemAPI(DestroyAPIView, CreateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if obj.order.user == request.user:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    order_item = self.get_object()

    return Response({
      'id': order_item.id,
      'quantity': order_item.quantity,
      'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
      'is_ordered': order_item.is_ordered,
      'is_prepared': order_item.is_prepared,
      'is_delivered': order_item.is_delivered,
      'is_reviewed': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
      'review': {
        'id': order_item.review.id if ProductReview.objects.filter(order_item=order_item).exists() else None,
        'rating': order_item.review.rating if ProductReview.objects.filter(order_item=order_item).exists() else None,
        'comment': order_item.review.comment if ProductReview.objects.filter(order_item=order_item).exists() else None,
      },
      'order': {
        'id': order_item.order.id,
        'ref_code': order_item.order.ref_code,
        'is_delivered': order_item.order.is_delivered,
        'user': {
          'id': order_item.order.user.id
        },
        'is_reviewed': True if OrderReview.objects.filter(order=order_item.order).exists() else False,
        'review': {
          'id': order_item.order.review.id if OrderReview.objects.filter(order=order_item.order).exists() else None,
          'rating': order_item.order.review.rating if OrderReview.objects.filter(order=order_item.order).exists() else None,
          'comment': order_item.order.review.comment if OrderReview.objects.filter(order=order_item.order).exists() else None,
        }
      },
      'product': {
        'id': order_item.product_variant.product.id,
        'name': order_item.product_variant.product.name,
        'description': order_item.product_variant.product.description,
        'thumbnail': order_item.product_variant.product.thumbnail.url,
      },
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'price': float(order_item.product_variant.final_price),
      },
    })

    try:
      seller = {
        'id': order.seller.id,
        'name': order.seller.name
      }
    except:
      seller = None

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      if serializer.validated_data.get('order').user == request.user:
        order = serializer.validated_data.get('order')
        product_variant = serializer.validated_data.get('product_variant')
        
        try:
          order_item = OrderItem.objects.get(order=order, product_variant=product_variant)
        except:
          order_item = None

        if order_item:
          if order_item.quantity < 10:
            order_item.quantity += 1
            order_item.save()
            return Response({
              'msg': 'Added to Order',
              'class': 'orange',
              'data': {
                'id': order_item.id,
                'order': order_item.order.id,
                'product_variant': order_item.product_variant.id,
                'quantity': order_item.quantity,
              }
            })
          else:
            return Response({
              'msg': 'Cannot add more',
              'class': 'red',
              'data': None
            })

        else:
          serializer.save()

          return Response({
            'msg': 'Added to Order',
            'class': 'orange',
            'data': serializer.data
          })

      else:
        return Response({
          'msg': 'Not Authorized',
          'class': 'red',
          'data': None
        })

    else:
      return Response({
        'msg': 'Body invalid',
        'class': 'red',
        'data': None
      })
class ChangeQuantityAPI(UpdateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.order.user == request.user and obj.order.is_ordered == False:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def update(self, request, pk=None, operation='add'):
    order_item = self.get_object()
    
    if order_item.checkout_validity != None:
      order_item.checkout_validity = None
      order_item.save()

    if order_item.product_variant.final_stock > 0 and order_item.quantity > order_item.product_variant.final_stock:
      order_item.quantity = 10 if order_item.product_variant.final_stock >= 10 else order_item.product_variant.final_stock
      order_item.save()
      return Response({
        'status': 'error',
        'operation': operation,
        'msg': 'Invalid Quantity. Stocks may have changed'
      })

    elif operation == 'add':
      if order_item.quantity < 10 and order_item.product_variant.final_stock >= order_item.quantity+1:
        order_item.quantity += 1
        order_item.save()
        return Response({
          'status': 'okay',
          'operation': operation,
          'msg': 'Quantity addition successful',
          'order_item': {
            'id': order_item.id,
            'quantity': order_item.quantity,
            'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
            'thumbnail': order_item.product_variant.thumbnail.url,
            'final_stock': order_item.product_variant.final_stock,
            'order': {
              'id': order_item.order.id,
              'ref_code': order_item.order.ref_code
            },
            'product': {
              'id': order_item.product_variant.product.id,
              'name': order_item.product_variant.product.name,
              'description': order_item.product_variant.product.description,
              'thumbnail': order_item.product_variant.product.thumbnail.url,
            },
            'product_variant': {
              'id': order_item.product_variant.id,
              'name': order_item.product_variant.name,
              'price': float(order_item.product_variant.final_price),
            },
          }
        })
      else:
        return Response({
          'status': 'error',
          'operation': operation,
          'msg': 'Order Exceeding'
        })

    elif operation == 'subtract':
      if order_item.quantity > 1:
        order_item.quantity -= 1
        order_item.save()
        return Response({
          'status': 'okay',
          'operation': operation,
          'msg': 'Quantity subtraction successful',
          'order_item': {
            'id': order_item.id,
            'quantity': order_item.quantity,
            'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
            'thumbnail': order_item.product_variant.thumbnail.url,
            'final_stock': order_item.product_variant.final_stock,
            'order': {
              'id': order_item.order.id,
              'ref_code': order_item.order.ref_code
            },
            'product': {
              'id': order_item.product_variant.product.id,
              'name': order_item.product_variant.product.name,
              'description': order_item.product_variant.product.description,
              'thumbnail': order_item.product_variant.product.thumbnail.url,
            },
            'product_variant': {
              'id': order_item.product_variant.id,
              'name': order_item.product_variant.name,
              'price': float(order_item.product_variant.final_price),
            },
          }
        })
      else:
        return Response({
          'status': 'error',
          'operation': operation,
          'msg': 'Quantity too low'
        })

class CheckoutAPI(UpdateAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def get_object(self):
    Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    if len(Orders) < 1:
      Order.objects.create(user=self.request.user)
      Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    return Orders.first()

  def update(self, request, order_type=None):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    order = self.get_object()

    try:
      PromoCode.objects.get(id=request.data.get('promo_code'))
      order.promo_code = PromoCode.objects.get(id=request.data.get('promo_code'))
    except:
      promo_code = None

    order.first_name = serializer.validated_data.get('first_name')
    order.last_name = serializer.validated_data.get('last_name')
    order.contact = serializer.validated_data.get('contact')
    order.gender = serializer.validated_data.get('gender')
    order.email = serializer.validated_data.get('email')

    order.loc1_latitude = serializer.validated_data.get('loc1_latitude')
    order.loc1_longitude = serializer.validated_data.get('loc1_longitude')
    order.loc1_address = serializer.validated_data.get('loc1_address')
    order.loc2_latitude = serializer.validated_data.get('loc2_latitude')
    order.loc2_longitude = serializer.validated_data.get('loc2_longitude')
    order.loc2_address = serializer.validated_data.get('loc2_address')
    order.distance_text = serializer.validated_data.get('distance_text')
    order.distance_value = serializer.validated_data.get('distance_value')
    order.duration_text = serializer.validated_data.get('duration_text')
    order.duration_value = serializer.validated_data.get('duration_value')
    
    items_valid = True

    for order_item in order.order_items.all():
      # Check in-stock items for valid quantity
      if not order_item.checkout_valid:
        if order_item.product_variant.final_stock > 0 and order_item.quantity > order_item.product_variant.final_stock:
          # Change item quantity based on stock
          order_item.quantity = 10 if order_item.product_variant.final_stock >= 10 else order_item.product_variant.final_stock
          order_item.save()
          items_valid = False

    if items_valid:
      order.save()
      for order_item in order.order_items.all():
        if order_item.product_variant.final_stock > 0:
          order_item.checkout_validity = timezone.now() + datetime.timedelta(minutes=30)
          order_item.save()

      return Response({
        'status': 'okay',
        'msg': 'Checkout Successful'
      })
    else:
      return Response({
        'status': 'error',
        'msg': 'Invalid Items. Stocks may have changed'
      })
class CompleteOrderAPI(UpdateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def get_object(self):
    Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    if len(Orders) < 1:
      Order.objects.create(user=self.request.user)
      Orders = Order.objects.filter(user=self.request.user, is_ordered=False).order_by('id')

    return Orders.first()

  def update(self, request, paid=None):
    order = self.get_object()

    order_valid = False
    carried_order_items = []

    for order_item in order.order_items.all():
      if order_item.checkout_validity != None:
        if order_valid == False:
          order_valid = True

        order_item.is_ordered = True
        order_item.date_ordered = timezone.now()
        order_item.ordered_price = order_item.product_variant.final_price
        order_item.checkout_validity = None
        order_item.save()

        order_item.product_variant.stock -= order_item.quantity
        order_item.product_variant.save()

      else:
        carried_order_items.append(order_item)


    if order_valid:
      order.is_ordered = True
      order.date_ordered = timezone.now()
      order.ordered_shipping = order.shipping
      order.is_paid = True if paid == 2 else False
      order.date_paid = timezone.now() if paid == 2 else None
      order.payment_type = paid
      order.auth_id = request.data['auth_id'] if paid == 2 else None
      order.capture_id = request.data['capture_id'] if paid == 2 else None
      order.save()
      
      # Carry invalid order items to new order
      new_order = Order.objects.create(user=self.request.user)
        
      for order_item in order.order_items.filter(is_ordered=False):
        order_item.order = new_order
        order_item.save()

      return Response({
        'status': 'success',
        'msg': 'Order Finalized'
      })
    else:
      return Response({
        'status': 'error',
        'msg': 'No items'
      })
class NewOrderUpdateAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled]

  def post(self, request, *args, **kwargs):
    try:
      for monitor in User.objects.filter(groups__name__in=['monitor'], is_active=True, is_staff=True).exclude(groups__name__in=['test']):
        current_site = get_current_site(request)
        mail_subject = 'New Order'
        message = render_to_string(
          'new_order_notification.html',
          {
            'monitor': monitor,
            'domain': current_site.domain,
            'ref_code': request.data.get('ref_code'),
          }
        )
        email = monitor.email
        
        send_mail(
          mail_subject,
          message,
          'Quezon Agrimart <info@quezonagrimart.com.ph>',
          [email],
          fail_silently=False
        )
      return Response({'status': 'okay'})
    except:
      return Response({'status': 'error'})

class ProductReviewAPI(CreateAPIView):
  serializer_class = ProductReviewSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user = serializer.validated_data.get("user")
      product_variant = serializer.validated_data.get("product_variant")
      order_item = serializer.validated_data.get("order_item")
      
      try:
        review_exists = ProductReview.objects.get(product_variant=product_variant, user=user, order_item=order_item)
      except:
        review_exists = None

      if review_exists:
        return Response({
          'status': 'error',
          'message': 'Product already reviewed'
        })
      else:
        if serializer.validated_data.get("user") == request.user:
          serializer.save()
          return Response({
            'status': 'okay',
            'data': serializer.data
          })
        else:
          return Response({
            'status': 'error',
            'message': 'Product already reviewed'
          })

    else:
      return Response({
        'status': 'error',
        'message': 'Product already reviewed'
      })
class OrderReviewAPI(CreateAPIView):
  serializer_class = OrderReviewSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user = serializer.validated_data.get("user")
      order = serializer.validated_data.get("order")
      
      try:
        review_exists = OrderReview.objects.get(user=user, order=order)
      except:
        review_exists = None

      if review_exists:
        return Response({
          'status': 'error',
          'message': 'Order already reviewed'
        })
      else:
        if serializer.validated_data.get("user") == request.user:
          serializer.save()
          return Response({
            'status': 'okay',
            'data': serializer.data
          })
        else:
          return Response({
            'status': 'error',
            'message': 'Order already reviewed'
          })

    else:
      return Response({
        'status': 'error',
        'message': 'Order already reviewed'
      })

# class RequestRefundAPI(CreateAPIView):
#   serializer_class = RefundRequestSerializer
#   permission_classes = [IsAuthenticated, SiteEnabled]

#   def create(self, request, *args, **kwargs):
#     serializer = self.get_serializer(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#       order_item = serializer.validated_data.get("order_item")
#       if order_item.order.user != request.user:
#         return Response({
#           'status': 'error',
#           'message': 'Refund already requested'
#         })
#       else:
#         serializer.save()
#         return Response({
#           'status': 'okay',
#           'data': serializer.data
#         })

#     else:
#       return Response({
#         'status': 'error',
#         'message': 'Refund already requested'
#       })

# class FavoritesAPI(CreateAPIView, ListAPIView):
#   serializer_class = FavoriteSerializer
#   permission_classes = [IsAuthenticated]

#   def get_queryset(self):
#     return Favorite.objects.filter(user=self.request.user).order_by('-date_created')
# # Fetched based on product id in kwargs
# class FavoriteAPI(DestroyAPIView):
  # serializer_class = FavoriteSerializer
  # permission_classes = [IsAuthenticated]

  # def get_object(self):
  #   return get_object_or_404(Favorite, user=self.request.user, product=self.kwargs['product'])