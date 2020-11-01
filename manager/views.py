# Views
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

# Objects
from shopping.models import Order, OrderItem, RefundRequest
from shopping.models import OrderItem
from django.views.generic.base import TemplateView
from django.views.generic import ListView

# Shortcuts and URLs
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse

# Tools
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from django.utils import timezone
from django.contrib import messages
from django.core.mail import send_mail
from django.db.models import Q
from datetime import date
import datetime

class OrderManagerView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
  context_object_name = 'order_items'
  template_name = 'manager/order_manager.html'
  paginate_by = 25

  #Permissions Required
  login_url = settings.LOGIN_URL
  raise_exception = False
  group_required = u"Staff"
  permission_required = ('shopping.can_access_order_manager')

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['values'] = self.request.GET
    return context

  def get_queryset(self):
    keywords_query = Q()

    if 'keywords' in self.request.GET:
      keywords = self.request.GET['keywords']
      if keywords:
        keywords_query.add(Q(order__ref_code__icontains=keywords), Q.OR)

    queryset = OrderItem.objects.filter(Q(is_ordered=True, is_delivered=False) & keywords_query).order_by('-date_ordered')

    return queryset

  def post(self, request):
    if request.method == 'POST':
      order_items = []

      for checked in request.POST:
        print(checked)
        try:
          checked_value = request.POST.get(checked)
          order_item = get_object_or_404(OrderItem, id=checked_value)
          order_items.append(order_item)

          if order_item.is_delivered != True:
            order_item.is_delivered = True
            order_item.date_delivered = timezone.now()
            order_item.save()
            # send_mail(
            #   f'OPA Order { order_item.ref_code() } Delivery',
            #   f'An Item from you order #{ order_item.ref_code() } has been delivered!\n\n'
            #   f'Items include:\n'
            #   f'{ order_item.name() } x{ order_item.quantity() }'
            #   f'\n'
            #   f'Thank you for shopping with us and supporting local Quezon products!\n',
            #   'me@stormllamas.tech',
            #   [order_item.order.owner.user.email],
            #   fail_silently=False
            # )
        except:
          continue

    if order_items:
      if len(order_items) > 1:
        messages.success(self.request, 'Order items was marked as delivered!')
      else:
        messages.success(self.request, 'Order item was marked as delivered!')
      
      # for order_item in order_items:


    return redirect(reverse('manager:order_manager'))

class RecentlyDeliveredView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
  context_object_name = 'order_items'
  template_name = 'manager/recently_delivered.html'
  paginate_by = 25

  #Permissions Required
  login_url = settings.LOGIN_URL
  raise_exception = False
  group_required = u"Staff"
  permission_required = ('shopping.can_access_order_manager')

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['values'] = self.request.GET
    return context

  def get_queryset(self):
    keywords_query = Q()

    if 'keywords' in self.request.GET:
      keywords = self.request.GET['keywords']
      if keywords:
        keywords_query.add(Q(order__ref_code__icontains=keywords), Q.OR)

    queryset = OrderItem.objects.filter(Q(is_ordered=True, is_delivered=True) & keywords_query).order_by('-date_delivered')

    return queryset

class RefundRequestView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
  context_object_name = 'refund_requests'
  template_name = 'manager/refund_requests.html'
  paginate_by = 25

  #Permissions Required
  login_url = settings.LOGIN_URL
  raise_exception = False
  group_required = u"Staff"
  permission_required = ('shopping.can_access_order_manager')

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['values'] = self.request.GET
    return context

  def get_queryset(self):
    keywords_query = Q()

    if 'keywords' in self.request.GET:
      keywords = self.request.GET['keywords']
      if keywords:
        keywords_query.add(Q(ref_code__icontains=keywords), Q.OR)
        keywords_query.add(Q(order_item__order__ref_code__icontains=keywords), Q.OR)

    queryset = RefundRequest.objects.filter(Q(approved=False, declined=False, refunded=False) & keywords_query).order_by('-date_created')

    return queryset

  def post(self, request):
    if request.method == 'POST':
      refund_request_id = request.POST.get('refund-input')
      refund_response = request.POST.get('refund-response')
      refund_request = get_object_or_404(RefundRequest, id=refund_request_id)

      if refund_response == 'decline-refund':
        if refund_request.approved != True and refund_request.declined != True:
          refund_request.declined = True
          refund_request.save()

        messages.success(self.request, 'Refund Declined')

      elif refund_response == 'approve-refund':
        if refund_request.approved != True and refund_request.declined != True:
          refund_request.approved = True
          refund_request.save()
          # send_mail(
          #   f'OPA Order { order_item.ref_code() } Delivery',
          #   f'An Item from you order #{ order_item.ref_code() } has been delivered!\n\n'
          #   f'Items include:\n'
          #   f'{ order_item.name() } x{ order_item.quantity() }'
          #   f'\n'
          #   f'Thank you for shopping with us and supporting local Quezon products!\n',
          #   'me@stormllamas.tech',
          #   [order_item.order.owner.user.email],
          #   fail_silently=False
          # )

        messages.success(self.request, 'Refund Approved')

    return redirect(reverse('manager:refund_requests'))


class ApprovedRefundsView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
  context_object_name = 'approved_refunds'
  template_name = 'manager/approved_refunds.html'
  paginate_by = 25

  #Permissions Required
  login_url = settings.LOGIN_URL
  raise_exception = False
  group_required = u"Staff"
  permission_required = ('shopping.can_access_order_manager')

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['values'] = self.request.GET
    return context

  def get_queryset(self):
    keywords_query = Q()

    if 'keywords' in self.request.GET:
      keywords = self.request.GET['keywords']
      if keywords:
        keywords_query.add(Q(ref_code__icontains=keywords), Q.OR)
        keywords_query.add(Q(order_item__order__ref_code__icontains=keywords), Q.OR)
        keywords_query.add(Q(order_item__order__capture_id__icontains=keywords), Q.OR)

    queryset = RefundRequest.objects.filter(Q(approved=True, declined=False, refunded=False) & keywords_query).order_by('-date_approved')

    return queryset

  def post(self, request):
    if request.method == 'POST':
      refund_requests = []

      for checked in request.POST:
        try:
          checked_value = request.POST.get(checked)
          refund_request = get_object_or_404(RefundRequest, id=checked_value)
          refund_requests.append(refund_request)

          if refund_request.refunded != True:
            refund_request.refunded = True
            refund_request.save()
            # send_mail(
            #   f'OPA Order { order_item.ref_code() } Delivery',
            #   f'An Item from you order #{ order_item.ref_code() } has been delivered!\n\n'
            #   f'Items include:\n'
            #   f'{ order_item.name() } x{ order_item.quantity() }'
            #   f'\n'
            #   f'Thank you for shopping with us and supporting local Quezon products!\n',
            #   'me@stormllamas.tech',
            #   [order_item.order.owner.user.email],
            #   fail_silently=False
            # )
        except:
          continue

    if refund_requests:
      if len(refund_requests) > 1:
        messages.success(self.request, 'Refund Requests marked as successfully refunded!')
      else:
        messages.success(self.request, 'Refund Request marked as successfully refunded!')

    return redirect(reverse('manager:approved_refunds'))


class ResolvedRefundsView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
  context_object_name = 'resolved_refunds'
  template_name = 'manager/resolved_refunds.html'
  paginate_by = 25

  #Permissions Required
  login_url = settings.LOGIN_URL
  raise_exception = False
  group_required = u"Staff"
  permission_required = ('shopping.can_access_order_manager')

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['values'] = self.request.GET
    return context

  def get_queryset(self):
    keywords_query = Q()

    if 'keywords' in self.request.GET:
      keywords = self.request.GET['keywords']
      if keywords:
        keywords_query.add(Q(ref_code__icontains=keywords), Q.OR)
        keywords_query.add(Q(order_item__order__ref_code__icontains=keywords), Q.OR)
        keywords_query.add(Q(order_item__order__capture_id__icontains=keywords), Q.OR)

    queryset = RefundRequest.objects.filter(Q(approved=True, declined=False, refunded=True) & keywords_query).order_by('-date_refunded')

    return queryset