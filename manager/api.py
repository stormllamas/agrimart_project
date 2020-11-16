# Packages
from rest_framework import viewsets, renderers
from rest_framework.generics import GenericAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from agrimart.permissions import SiteEnabled, HasGroupPermission, IsOrderItemRider, IsOrderRider

# Serializers
from .serializers import OrderItemSerializer as AdminOrderItemSerializer
from .serializers import OrderSerializer as AdminOrderSerializer
from logistics.serializers import OrderSerializer

# Models
from logistics.models import Order, OrderItem, Seller
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
from django.core.exceptions import FieldError
    

class DashboardAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, IsAdminUser]

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
      'shipping': order.shipping,
      'total': order.total,
      'date_paid': order.date_paid,
    } for order in Order.objects.filter(is_paid=True, date_paid__gte=timezone.make_aware(datetime.datetime(int(from_date[0]), int(from_date[1]), int(from_date[2]))), date_paid__lte=timezone.make_aware(datetime.datetime(int(to_date[0]), int(to_date[1]), int(to_date[2])))).order_by('date_paid')]

    return Response({
      'shipping_total': shipping_total,
      'sales_total': sales_total,
      'sold': sold,
      'checkouts': checkouts,
      'orders': orders,
      'orders_count': len(orders),
    })

class OrdersAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def get(self, request):
    delivered_query = Q()
    delivered = self.request.query_params.get('delivered', None)
    if delivered == 'true':
      if request.user.is_superuser:
        delivered_query.add(Q(is_delivered=True), Q.AND)
      else:
        delivered_query.add(Q(is_delivered=True, rider=request.user), Q.AND)

    elif delivered == 'false':
      delivered_query.add(Q(is_delivered=False), Q.AND)

    claimed_query = Q()
    claimed = self.request.query_params.get('claimed', None)
    if claimed == 'true':
      if request.user.is_superuser:
        claimed_query.add(Q(rider__isnull=False), Q.AND)
      else:
        claimed_query.add(Q(rider__isnull=False, rider=request.user), Q.AND)
    elif claimed == 'false':
      claimed_query.add(Q(rider__isnull=True), Q.AND)

    pickedup_query = Q()
    pickedup = self.request.query_params.get('pickedup', None)
    if pickedup == 'true':
      if request.user.is_superuser:
        pickedup_query.add(Q(is_pickedup=True), Q.AND)
      else:
        pickedup_query.add(Q(is_pickedup=True, rider=request.user), Q.AND)
    elif pickedup == 'false':
      pickedup_query.add(Q(is_pickedup=False), Q.AND)

    keywords_query = Q()
    keywords = self.request.query_params.get('keywords', None)
    if keywords:
      keywords_query.add(Q(ref_code__icontains=keywords), Q.AND)
    
    results_full_length = Order.objects.filter(Q(is_ordered=True) & delivered_query & claimed_query & pickedup_query & keywords_query).count()

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
      'total': order.total,
      'count': order.count,
      'ordered_count': order.ordered_count,
      'subtotal': sum([item.quantity*item.ordered_price if item.ordered_price else 0 for item in order.order_items.all()]),
      'date_ordered': order.date_ordered,
    } for order in Order.objects.filter(Q(is_ordered=True) & delivered_query & claimed_query & pickedup_query & keywords_query).order_by('-date_delivered','-date_claimed','-date_ordered')[from_item:to_item]]

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
      'is_delivered': order_item.is_delivered,
      'is_pickedup': order_item.is_pickedup,
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

class ClaimOrderAPI(UpdateAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def get_object(self):
    return get_object_or_404(Order, id=self.kwargs['order_id'])

  def update(self, request, order_id=None):
    order = self.get_object()
    if order.rider:
      return Response({
        'status': 'error',
        'msg': 'Order already claimed'
      })

    else:
      order.rider = self.request.user
      order.date_claimed = timezone.now()
      order.save()

      return Response(OrderSerializer(order, context=self.get_serializer_context()).data)

class DeliverOrderItemAPI(UpdateAPIView):
  serializer_class = AdminOrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission, IsOrderItemRider]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.order.rider == request.user and obj.order.is_ordered == True and obj.order.is_pickedup:
          return True
        else:
          raise PermissionDenied
    else:
      return False

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

    elif order_item.is_pickedup == False:
      return Response({
        'status': 'error',
        'msg': 'Item not yet picked up',
      })

    else:
      order_item.is_delivered = True
      order_item.date_delivered = timezone.now()
      order_item.save()

      if order_item.order.order_items.filter(is_delivered=False).count() == 0:
        order_item.order.is_delivered = True
        order_item.order.date_delivered = timezone.now()
        order_item.order.is_paid = True
        order_item.order.date_paid = timezone.now()
        order_item.order.save()

      return Response(AdminOrderItemSerializer(order_item, context=self.get_serializer_context()).data)

class DeliverOrderAPI(UpdateAPIView):
  serializer_class = AdminOrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission, IsOrderRider]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.rider == request.user and obj.is_ordered == True and obj.is_pickedup:
          return True
        else:
          raise PermissionDenied
    else:
      return False

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

class PickupOrderItemAPI(UpdateAPIView):
  serializer_class = AdminOrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission, IsOrderItemRider]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.order.rider == request.user and obj.order.is_ordered == True:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order_item = self.get_object()
    if order_item.is_pickedup:
      return Response({
        'status': 'error',
        'msg': 'Item already picked up',
      })

    else:
      order_item.is_pickedup = True
      order_item.date_pickedup = timezone.now()
      order_item.save()

      if order_item.order.order_items.filter(is_pickedup=False).count() == 0:
        order_item.order.is_pickedup = True
        order_item.order.date_pickedup = timezone.now()
        order_item.order.save()

      return Response(AdminOrderItemSerializer(order_item, context=self.get_serializer_context()).data)

class PickupOrderAPI(UpdateAPIView):
  serializer_class = AdminOrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled, IsAdminUser, HasGroupPermission, IsOrderRider]
  required_groups = {
    'GET': ['rider'],
    'POST': ['rider'],
    'PUT': ['rider'],
  }

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.rider == request.user and obj.is_ordered == True:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(Order, id=self.kwargs['pk']))
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def update(self, request, pk=None):
    order = self.get_object()
    if order.pickedup:
      return Response({
        'status': 'error',
        'msg': 'Order already delivered',
      })

    else:
      order.pickedup = True
      order.date_delivered = timezone.now()
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