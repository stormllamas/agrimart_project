from django.urls import path, include
from rest_framework import routers
from .api import DashboardAPI, OrderItemsAPI, DeliverOrderItemAPI, DeliverOrderAPI, PrepareOrderItemAPI, PrepareOrderAPI, OrdersAPI, OrderAPI, ProcessOrderAPI, CancelOrderAPI, SellerDashboardDataAPI
from knox import views as knox_views

urlpatterns = [
  path('api/manager/dashboard_data', DashboardAPI.as_view(), name='dashboard_data'),
  path('api/manager/seller_dashboard_data', SellerDashboardDataAPI.as_view(), name='seller_dashboard_data'),
  path('api/manager/orders', OrdersAPI.as_view(), name='orders'),
  path('api/manager/order/<int:pk>/', OrderAPI.as_view(), name='order'),
  path('api/manager/process_order/<int:order_id>/', ProcessOrderAPI.as_view(), name='process_order'),
  path('api/manager/cancel_order/<int:order_id>/', CancelOrderAPI.as_view(), name='cancel_order'),
  path('api/manager/deliver_order_item/<int:pk>/', DeliverOrderItemAPI.as_view(), name='deliver_order_item'),
  path('api/manager/deliver_order/<int:pk>/', DeliverOrderAPI.as_view(), name='deliver_order'),
  path('api/manager/prepare_order_item/<int:pk>/', PrepareOrderItemAPI.as_view(), name='prepare_order_item'),
  path('api/manager/prepare_order/<int:pk>/', PrepareOrderAPI.as_view(), name='prepare_order'),
  path('api/manager/order_items', OrderItemsAPI.as_view(), name='order_items'),
]