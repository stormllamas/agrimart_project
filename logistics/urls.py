from django.urls import path
from rest_framework import routers
from .api import HighlightsAPI, ProductsAPI, ProductAPI, SellerAPI, SimilarProductsAPI, FilterDetailsAPI, OrdersAPI, OrderAPI, CurrentOrderAPI, CheckoutAPI, CompleteOrderAPI, OrderItemAPI, ChangeQuantityAPI, RequestRefundAPI, FavoritesAPI, FavoriteAPI, ProductReviewAPI, OrderReviewAPI

router = routers.DefaultRouter()

# router.register('api/similar_products/(?P<product>[^/.]+)/(?P<commodity>[^/.]+)', SimilarProductsAPI, 'similar_products')

urlpatterns = [
  path('api/filter_details', FilterDetailsAPI.as_view(), name='filter_details'),
  path('api/highlights', HighlightsAPI.as_view(), name='highlights'),

  path('api/seller/<str:seller_name>/', SellerAPI.as_view(), name='seller'),
  
  path('api/products', ProductsAPI.as_view(), name='products'),
  path('api/product/<str:product_name>/', ProductAPI.as_view(), name='product'),

  path('api/current_order/', CurrentOrderAPI.as_view(), name='current_order'),

  path('api/orders/', OrdersAPI.as_view(), name='orders'),
  path('api/order/<int:pk>/', OrderAPI.as_view(), name='order'),

  path('api/order_item/', OrderItemAPI.as_view(), name='order_item'),
  path('api/order_item/<int:pk>/', OrderItemAPI.as_view(), name='order_item'),
  path('api/change_quantity/<int:pk>/<str:operation>/', ChangeQuantityAPI.as_view(), name='change_quantity'),
  
  path('api/checkout/', CheckoutAPI.as_view(), name='checkout'),
  path('api/complete_order/<int:paid>/', CompleteOrderAPI.as_view(), name='complete_order'),

  path('api/review_product/', ProductReviewAPI.as_view(), name='review_product'),
  path('api/review_order/', OrderReviewAPI.as_view(), name='review_order'),
  path('api/request_refund/', RequestRefundAPI.as_view(), name='request_refund'),

  path('api/favorites/', FavoritesAPI.as_view(), name='favorites'),
  path('api/favorite/<int:product>/', FavoriteAPI.as_view(), name='favorite'),
]

urlpatterns += router.urls