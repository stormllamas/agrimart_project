from django.urls import path
from . import views

urlpatterns = [
  path('', views.IndexView.as_view(), name='index'),

  path('signup', views.IndexView.as_view(), name='signup'),
  path('activate/<uidb64>/<token>/', views.IndexView.as_view(), name='activate'),
  path('confirm_email/<email>', views.IndexView.as_view(), name='confirm_email'),
  path('login', views.IndexView.as_view(), name='login'),
  path('logout', views.IndexView.as_view(), name='logout'),
  
  path('password_reset', views.IndexView.as_view(), name='password_reset'),
  path('check_email/<email>', views.IndexView.as_view(), name='check_email'),
  path('password_reset_form/<uidb64>/<token>/', views.IndexView.as_view(), name='password_reset_form'),

  path('profile', views.IndexView.as_view(), name='profile'),
  path('security', views.IndexView.as_view(), name='security'),
  path('cart', views.IndexView.as_view(), name='cart'),
  path('orders', views.IndexView.as_view(), name='orders'),
  # path('favorites', views.IndexView.as_view(), name='favorites'),

  path('testimonies', views.IndexView.as_view(), name='testimonies'),
  path('read', views.IndexView.as_view(), name='read'),
  path('events', views.IndexView.as_view(), name='events'),
  path('services', views.IndexView.as_view(), name='services'),
  path('contact', views.IndexView.as_view(), name='contact'),
  # path('about', views.IndexView.as_view(), name='about'),

  path('shop', views.IndexView.as_view(), name='shophighlights'),
  path('shop/products', views.IndexView.as_view(), name='products'),
  path('shop/product', views.IndexView.as_view(), name='product'),
  path('seller', views.IndexView.as_view(), name='seller'),
  path('checkout', views.IndexView.as_view(), name='checkout'),
  path('payments', views.IndexView.as_view(), name='payments'),

  path('product_review/<int:pk>', views.IndexView.as_view(), name='product_review'),
  path('order_review/<int:pk>', views.IndexView.as_view(), name='order_review'),

  path('order_manager/dashboard', views.IndexView.as_view(), name='admin_dashboard'),
  path('order_manager/unclaimed', views.IndexView.as_view(), name='unclaimed'),
  path('order_manager/claimed', views.IndexView.as_view(), name='claimed'),
  path('order_manager/undelivered', views.IndexView.as_view(), name='undelivered'),
  path('order_manager/delivered', views.IndexView.as_view(), name='delivered'),
  # path('review', views.IndexView.as_view(), name='review'),
  # path('request_refund', views.IndexView.as_view(), name='request_refund'),
]