# Packages
from rest_framework import viewsets, renderers
from rest_framework.generics import GenericAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from agrimart.permissions import SiteEnabled, HasGroupPermission
# Serializers
from .serializers import OrderItemSerializer as AdminOrderItemSerializer
from .serializers import OrderSerializer as AdminOrderSerializer
from logistics.serializers import OrderSerializer

# Models
from logistics.models import Order, OrderItem, Seller, Product, ProductVariant
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()

# Tools
from agrimart.pagination import ManagerPagination
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
import datetime

# Exceptions
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
    

class DashboardAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def get(self, request):
    from_date = self.request.query_params.get('from_date', None).split('-')
    to_date = self.request.query_params.get('to_date', None).split('-')
    
    shipping_total = sum([order.shipping for order in Order.objects.filter(is_paid=True, date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2]))))])
    sales_total = sum([order.total for order in Order.objects.filter(is_paid=True, date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2]))))])
    sold = sum([order_item.quantity for order_item in OrderItem.objects.filter(order__is_paid=True, order__date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), order__date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2]))))])
    checkouts = Order.objects.filter(is_paid=True, date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2])))).count()

    orders = [{
      'id': order.id,
      'ref_code': order.ref_code,
      'shipping': order.ordered_shipping,
      'total': order.ordered_total,
      'date_paid': order.date_paid,
    } for order in Order.objects.filter(is_paid=True, date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2])))).order_by('date_paid')[:7]]

    return Response({
      'shipping_total': shipping_total,
      'sales_total': sales_total,
      'sold': sold,
      'checkouts': checkouts,
      'orders': orders,
      'orders_count': len(orders),
    })

class SellerDashboardDataAPI(RetrieveAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled, HasGroupPermission]
  required_groups = {
    'GET': ['seller'],
    'POST': ['seller'],
    'PUT': ['seller'],
  }

  def get(self, request, pk=None):
    try:
      user_seller = request.user.seller
    except:
      raise PermissionDenied

    from_date = self.request.query_params.get('from_date', None).split('-')
    to_date = self.request.query_params.get('to_date', None).split('-')
    
    sales_total = sum([order_item.ordered_price*order_item.quantity for order_item in OrderItem.objects.filter(product_variant__product__seller=request.user.seller, order__is_paid=True, order__date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), order__date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2]))))])
    sold = sum([order_item.ordered_price*order_item.quantity for order_item in OrderItem.objects.filter(product_variant__product__seller=request.user.seller, order__is_paid=True, order__date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), order__date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2]))))])

    orders = [{
      'id': order_item.id,
      'ref_code': order_item.order.ref_code,
      'ordered_price': order_item.ordered_price,
      'quantity': order_item.quantity,
      'date_paid': order_item.order.date_paid,
    } for order_item in sorted(OrderItem.objects.filter(product_variant__product__seller=request.user.seller, order__is_paid=True, order__date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), order__date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2])))), key=lambda a: (a.order.date_paid), reverse=True)]

    recent_orders = [{
      'id': order_item.id,
      'ref_code': order_item.order.ref_code,
      'name': f'{order_item.product_variant.product.name} - {order_item.product_variant.name}',
      'thumbnail': order_item.product_variant.thumbnail.url,
      'ordered_price': order_item.ordered_price,
      'quantity': order_item.quantity,
    } for order_item in sorted(OrderItem.objects.filter(product_variant__product__seller=request.user.seller, order__is_paid=True), key=lambda a: (a.order.date_paid), reverse=True)]

    products = [{
      'id': variant.id,
      'name': f'{variant.product.name} - {variant.name}',
      'thumbnail': variant.thumbnail.url,
      'final_price': variant.final_price,
      'percent_off': variant.percent_off,
      'stock': variant.stock,
      'orders': variant.total_orders,
    } for variant in sorted(ProductVariant.objects.filter(product__seller=request.user.seller), key=lambda a: a.total_orders, reverse=True)]

    return Response({
      'seller' : {
        'name': user_seller.name
      },
      'sales_total': sales_total,
      'sold': sold,
      'orders_count': len(orders),

      'products': products,
      'orders': orders,
      'recent_orders': recent_orders,
    })

class OrdersAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def get(self, request):
    processed_query = Q()
    processed = self.request.query_params.get('processed', None)
    if processed == 'true':
      processed_query.add(Q(is_processed=True), Q.AND)
    elif processed == 'false':
      processed_query.add(Q(is_processed=False), Q.AND)

    prepared_query = Q()
    prepared = self.request.query_params.get('prepared', None)
    if prepared == 'true':
      prepared_query.add(Q(is_prepared=True), Q.AND)
    elif prepared == 'false':
      prepared_query.add(Q(is_prepared=False), Q.AND)
    
    delivered_query = Q()
    delivered = self.request.query_params.get('delivered', None)
    if delivered == 'true':
      delivered_query.add(Q(is_delivered=True), Q.AND)
    elif delivered == 'false':
      delivered_query.add(Q(is_delivered=False), Q.AND)

    keywords_query = Q()
    keywords = self.request.query_params.get('keywords', None)
    if keywords:
      keywords_query.add(Q(ref_code__icontains=keywords), Q.AND)
    
    queryset = Order.objects.filter(Q(is_ordered=True) & delivered_query & processed_query & prepared_query & keywords_query)
    results_full_length = queryset.count()

    range_query = self.request.query_params.get('range', None)
    if range_query == None:
      page_query = int(self.request.query_params.get('page', 0))
      from_item = 0
      to_item = 50
      if page_query > 1:
        from_item = (page_query-1)*50
        to_item = page_query*50

      if (page_query*50) > results_full_length:
        next_path = None
      else:
        next_path = f'api/admin/orders?page={page_query+1}'

      if page_query > 1:
        previous_path = f'api/admin/orders?page={page_query-1}'
      else:
        previous_path = None

    else:
      next_path = None
      previous_path = None
      range_query = range_query.split('-')
      from_item = int(range_query[0])-1
      to_item = int(range_query[1])

    orders = [{
      'id': order.id,
      'ref_code': order.ref_code,
      'loc1_address': order.loc1_address,
      'loc2_address': order.loc2_address,
      'payment_type': order.payment_type,
      'shipping': order.shipping,
      'total': order.ordered_total,
      'count': order.ordered_count,
      'subtotal': order.ordered_subtotal,
      'date_ordered': order.date_ordered,
    } for order in queryset.order_by('-date_delivered','-date_processed','-date_ordered')[from_item:to_item]]

    return Response({
      'count': len(orders),
      'next': next_path,
      'previous': previous_path,
      'results': orders,
    })

class OrderAPI(RetrieveAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def get_object(self):
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    order = self.get_object()

    order_items = [{
      'id': order_item.id,
      'quantity': order_item.quantity,
      'is_prepared': order_item.is_prepared,
      'is_delivered': order_item.is_delivered,
      'ordered_price': order_item.ordered_price if order_item.ordered_price else 0,
      'product': {
        'id': order_item.product_variant.product.id,
        'name': order_item.product_variant.product.name,
        'description': order_item.product_variant.product.description,
      },
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'price': order_item.ordered_price,
        'thumbnail': order_item.product_variant.thumbnail.url,
      },
    } for order_item in order.order_items.all()]

    return Response({
      'id': order.id,
      'ref_code': order.ref_code,
      'payment_type': order.payment_type,

      'loc1_address': order.loc1_address, 'loc1_latitude': order.loc1_latitude, 'loc1_longitude': order.loc1_longitude,
      'loc2_address': order.loc2_address, 'loc2_latitude': order.loc2_latitude, 'loc2_longitude': order.loc2_longitude,
      
      'subtotal': sum([item.quantity*item.ordered_price if item.is_ordered and item.ordered_price else 0 for item in order.order_items.all()]),
      'shipping': order.shipping, 'total': order.total,
      'count': order.count,

      'is_delivered': order.is_delivered,

      'is_ordered': order.is_ordered,
      'date_ordered': order.date_ordered,

      'order_items': order_items,

      'first_name': order.first_name, 'last_name': order.last_name,
      'contact': order.contact, 'email': order.email, 'gender': order.gender,
    })

class OrderItemsAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def get(self, request):
    if self.request.query_params.get('delivered') == 'true':
      delivered_query = True
    else:
      delivered_query = False

    keywords_query = Q()
    keywords = self.request.query_params.get('keywords', None)
    if keywords:
      keywords_query.add(Q(order__ref_code__icontains=keywords), Q.OR)
    
    results_full_length = OrderItem.objects.filter(Q(is_delivered=delivered_query) & keywords_query).count()

    range_query = self.request.query_params.get('range', None)
    if range_query == None:
      page_query = int(self.request.query_params.get('page', 0))
      from_item = 0
      to_item = 50
      if page_query > 1:
        from_item = (page_query-1)*50
        to_item = page_query*50

      if (page_query*50) > results_full_length:
        next_path = None
      else:
        next_path = f'api/admin/order_items?page={page_query+1}'

      if page_query > 1:
        previous_path = f'api/admin/order_items?page={page_query-1}'
      else:
        previous_path = None

    else:
      next_path = None
      previous_path = None
      range_query = range_query.split('-')
      from_item = int(range_query[0])-1
      to_item = int(range_query[1])

    order_items = [{
      'id': order_item.id,
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'product': {
          'id': order_item.product_variant.product.id,
          'name': order_item.product_variant.product.name
        }
      },
      'order': {
        'id': order_item.order.id,
        'ref_code': order_item.order.ref_code,
        'payment_type': order_item.order.payment_type,
        'loc1_address': order_item.order.loc1_address,
        'loc2_address': order_item.order.loc2_address,
        'shipping': order_item.order.shipping,
        'net_total': order_item.order.net_total
      },
      'quantity': order_item.quantity,
      'ordered_price': order_item.ordered_price,
      'date_ordered': order_item.date_ordered,
      'date_delivered': order_item.date_delivered,
    } for order_item in OrderItem.objects.filter(Q(is_delivered=delivered_query) & keywords_query).order_by('-date_delivered','-date_ordered')[from_item:to_item]]

    return Response({
      'count': len(order_items),
      'next': next_path,
      'previous': previous_path,
      'results': order_items,
    })

class ProcessOrderAPI(UpdateAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def get_object(self):
    return get_object_or_404(Order, id=self.kwargs['order_id'])

  def update(self, request, order_id=None):
    order = self.get_object()
    if order.is_processed:
      return Response({
        'status': 'error',
        'msg': 'Order already processed'
      })

    else:
      order.is_processed = True
      order.date_processed = timezone.now()
      order.save()

      return Response(OrderSerializer(order, context=self.get_serializer_context()).data)

class PrepareOrderItemAPI(UpdateAPIView):
  serializer_class = AdminOrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def check_object_permissions(self, request, obj):
    if obj.order.is_ordered == True:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order_item = self.get_object()
    if order_item.is_prepared:
      return Response({
        'status': 'error',
        'msg': 'Item already prepared',
      })

    else:
      order_item.is_prepared = True
      order_item.date_prepared = timezone.now()
      order_item.save()

      order_prepared = False

      if order_item.order.order_items.filter(is_prepared=False).count() == 0:
        order_item.order.is_prepared = True
        order_item.order.date_prepared = timezone.now()
        order_item.order.save()
        order_prepared = True

      return Response({
        'status': 'ok',
        'msg': 'Item picked up',
        'order_prepared': order_prepared,
      })
class PrepareOrderAPI(UpdateAPIView):
  serializer_class = AdminOrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def check_object_permissions(self, request, obj):
    if obj.is_ordered == True:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(Order, id=self.kwargs['pk']))
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order = self.get_object()
    if order.is_prepared:
      return Response({
        'status': 'error',
        'msg': 'Order already prepared',
      })

    else:
      order.is_prepared = True
      order.date_prepared = timezone.now()
      order.save()

      return Response(AdminOrderSerializer(order, context=self.get_serializer_context()).data)

class DeliverOrderItemAPI(UpdateAPIView):
  serializer_class = AdminOrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def check_object_permissions(self, request, obj):
    if obj.order.is_ordered == True and obj.order.is_prepared:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order_item = self.get_object()
    if order_item.is_delivered:
      return Response({
        'status': 'error',
        'msg': 'Item already delivered',
      })

    elif order_item.is_prepared == False:
      return Response({
        'status': 'error',
        'msg': 'Item not yet prepared',
      })

    else:
      order_item.is_delivered = True
      order_item.date_delivered = timezone.now()
      order_item.save()

      order_delivered = False

      if order_item.order.order_items.filter(is_delivered=False).count() == 0:
        order_item.order.is_delivered = True
        order_item.order.date_delivered = timezone.now()
        order_item.order.is_paid = True
        order_item.order.date_paid = timezone.now()
        order_item.order.save()
        order_delivered = True

      return Response({
        'status': 'ok',
        'msg': 'Item delivered',
        'order_delivered': order_delivered,
      })
class DeliverOrderAPI(UpdateAPIView):
  serializer_class = AdminOrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser]

  def check_object_permissions(self, request, obj):
    if obj.is_ordered == True and obj.is_pickedup:
      return True
    else:
      raise PermissionDenied

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(Order, id=self.kwargs['pk']))
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order = self.get_object()
    if order.is_delivered:
      return Response({
        'status': 'error',
        'msg': 'Order already delivered',
      })

    else:
      order.is_delivered = True
      order.date_delivered = timezone.now()
      order.is_paid = True
      order.date_paid = timezone.now()
      order.save()

      return Response(AdminOrderSerializer(order, context=self.get_serializer_context()).data)

# class RefundsAPI(GenericAPIView):
#   serializer_class = OrderSerializer
#   permission_classes = [IsAuthenticated, IsAdminUser]

#   def get_queryset(self):
#     delivered_query = self.request.query_params.get('delivered', None)

#     if delivered_query:
#       queryset = Seller.objects.filter(delivered=delivered_query).order_by('id')

#     return queryset

# class RefundsAPI(GenericAPIView):
#   permission_classes = [IsAuthenticated, IsAdminUser]

#   def get(self, request):
#     keywords_query = Q()
#     keywords = self.request.query_params.get('keywords', None)
#     if keywords:
#       keywords_query.add(Q(order__ref_code__icontains=keywords), Q.OR)

#     range_query = self.request.query_params.get('range', None)
#     if range_query == None:
#       page_query = int(self.request.query_params.get('page', 0))
#       from_item = 0
#       to_item = 50
#       if page_query > 1:
#         from_item = (page_query-1)*50
#         to_item = page_query*50

#     else:
#       range_query = range_query.split('-')
#       from_item = int(range_query[0])-1
#       to_item = int(range_query[1])
    
#     if self.request.query_params.get('delivered') == 'true':
#       delivered_query = True
#     else:
#       delivered_query = False

#     order_items = [{
#       'id': order_item.id,
#       'product_variant': {
#         'id': order_item.product_variant.id,
#         'name': order_item.product_variant.name,
#         'product': {
#           'id': order_item.product_variant.product.id,
#           'name': order_item.product_variant.product.name
#         }
#       },
#       'order': {
#         'id': order_item.order.id,
#         'ref_code': order_item.order.ref_code,
#         'payment_type': order_item.order.payment_type,
#         'loc1_address': order_item.order.loc1_address,
#         'loc2_address': order_item.order.loc2_address,
#         'shipping': order_item.order.shipping,
#         'net_total': order_item.order.net_total
#       },
#       'quantity': order_item.quantity,
#       'ordered_price': order_item.ordered_price,
#       'date_ordered': order_item.date_ordered,
#       'date_delivered': order_item.date_delivered,
#     } for order_item in OrderItem.objects.filter(Q(is_delivered=delivered_query) & keywords_query).order_by('-date_delivered','date_ordered')[from_item:to_item]]
    
#     queryset_full_length = OrderItem.objects.filter(Q(is_delivered=delivered_query) & keywords_query).count()
#     if (page_query*50) > queryset_full_length:
#       next_path = None
#     else:
#       next_path = f'api/admin/order_items?page={page_query+1}'

#     if page_query > 1:
#       previous_path = f'api/admin/order_items?page={page_query-1}'
#     else:
#       previous_path = None

#     return Response({
#       'count': len(order_items),
#       'next': next_path,
#       'previous': previous_path,
#       'queryset': order_items,
#     })