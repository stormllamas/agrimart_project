from rest_framework import serializers
from .models import Product, Seller, CategoryGroup, Category, Order, OrderItem, RefundRequest, Favorite, ProductReview, OrderReview

class ProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = [
      'id', 'seller_name', 'sid', 'name', 'commodity', 'category', 'price', 'description',
      'thumbnail', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'photo_6',
      'sale_price', 'sale_price_active',
      'percent_off', 'final_price', 'reviews', 'orders', 'stock', 'total_rating']
    
    extra_kwargs = {
      'id': {'read_only': True},
      'seller_name': {'read_only': True},
      'sid': {'read_only': True},
      'name': {'read_only': True},
      'commodity': {'read_only': True},
      'category': {'read_only': True},
      'price': {'read_only': True},
      'description': {'read_only': True},

      'thumbnail': {'read_only': True},
      'photo_1': {'read_only': True},
      'photo_2': {'read_only': True},
      'photo_3': {'read_only': True},
      'photo_4': {'read_only': True},
      'photo_5': {'read_only': True},
      'photo_6': {'read_only': True},

      'sale_price': {'read_only': True},
      'sale_price_active': {'read_only': True},
      
      'percent_off': {'read_only': True},
      'final_price': {'read_only': True},
      'reviews': {'read_only': True},
      'stock': {'read_only': True},
      'total_rating': {'read_only': True},
    }

class AllProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = [
      'name'
    ]

class SellerSerializer(serializers.ModelSerializer):
  class Meta:
    model = Seller
    fields = ['id', 'contact', 'description', 'latitude', 'longitude', 'address', 'thumbnail']

class CategoryGroupSerializer(serializers.ModelSerializer):
  class Meta:
    model = CategoryGroup
    fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields = ['id', 'category_group', 'name', 'thumbnail', 'seller_count']

    
class FavoriteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Favorite
    fields = [
      'id', 'product', 'user', 'date_created',
      'thumbnail', 'name', 'pid', 'stock', 'price', 'sale_price', 'final_price', 'sale_price_active', 'percent_off', 'seller_name', 'seller_id', 'description'
    ]

class OrderSerializer(serializers.ModelSerializer):
  class Meta:
    model = Order
    fields = [
      'id', 'user', 'ref_code',
      
      'first_name', 'last_name',
      'contact', 'email', 'gender',

      'loc1_latitude', 'loc1_longitude', 'loc1_address',
      'loc2_latitude', 'loc2_longitude', 'loc2_address',
      'distance_text', 'distance_value', 'duration_text', 'duration_value',

      'payment_type',
      # 'auth_id', 'capture_id',
      'is_ordered', 'date_ordered', 'is_paid', 'date_paid',

      'shipping',
    ]

# class OrderSerializer(serializers.ModelSerializer):
#   class Meta:
#     model = Order
#     fields = ['checkout_validity']

class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem
    fields = [
      'order', 'product_variant',
      'quantity',
      'is_ordered', 'date_ordered', 'ordered_price'
    ]

class ProductReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProductReview
    fields = '__all__'

class OrderReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderReview
    fields = '__all__'

class RefundRequestSerializer(serializers.ModelSerializer):
  class Meta:
    model = RefundRequest
    fields = [
      'id', 'ref_code', 'order_item', 'comment', 'date_created',

      'approved', 'date_approved',
      'declined', 'date_declined', 
      'refunded', 'date_refunded',
      
      'OIref_code', 'product_name', 'capture_id', 'quantity', 'amount', 'delivery_total', 'refund_total', 'payment_method'
    ]