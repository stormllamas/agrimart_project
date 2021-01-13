from django.contrib import admin
from .models import Product, ProductVariant, Seller, Category, CategoryGroup, Order, OrderItem, ProductReview, OrderReview, RefundRequest

class CategoryInLine(admin.TabularInline):
  model = Category
  extra = 1
  verbose_name_plural = "Categories"

class ProductVariantInLine(admin.TabularInline):
  model = ProductVariant
  extra = 1

class ProductAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['name', 'seller', 'categories', 'description']}),
    ('Photos', {'fields': ['thumbnail', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'photo_6']}),
    ('Tracking', {'fields': ['date_published', 'is_published']}),
  ]
  inlines = [ProductVariantInLine]
  list_display = ('name', 'is_published', 'date_published')
  list_filter = ('seller',)
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(Product, ProductAdmin)

class SellerAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['name', 'contact', 'categories', 'user']}),
    ('Location', {'fields': ['latitude', 'longitude', 'address']}),
    ('Display', {'fields': ['thumbnail']}),
  ]
  # inlines = [ProductInLine]
  list_display = ('name', 'contact')
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(Seller, SellerAdmin)

class CategoryGroupAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['name']}),
  ]
  inlines = [CategoryInLine]
  list_display = ('name',)
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(CategoryGroup, CategoryGroupAdmin)


class OrderItemInLine(admin.TabularInline):
  model = OrderItem
  extra = 1
  verbose_name_plural = "Order Items"

class OrderAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['ref_code', 'user']}),
    ('Personal Details', {'fields': ['first_name', 'last_name', 'contact', 'email', 'gender']}),
    ('Delivery Points', {'fields': ['loc1_latitude', 'loc1_longitude', 'loc1_address', 'loc2_latitude', 'loc2_longitude', 'loc2_address', 'distance_value', 'distance_text', 'duration_value', 'duration_text']}),
    ('Payments', {'fields': ['payment_type']}),
    ('Status', {'fields': ['is_ordered', 'date_ordered', 'ordered_shipping', 'is_paid', 'date_paid', 'is_processed', 'date_processed', 'is_prepared', 'date_prepared', 'is_delivered', 'date_delivered']}),
  ]
  inlines = [OrderItemInLine]
  list_display = ('ref_code', 'user', 'is_ordered', 'date_ordered', 'is_processed', 'is_delivered', 'payment_type', 'is_paid')
  list_display_links = ('ref_code',)
  list_filter = ('payment_type', 'is_ordered', 'is_delivered', 'is_paid')
  list_per_page = 50
  search_fields = ('user', 'ref_code')

admin.site.register(Order, OrderAdmin)

class ProductReviewAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['order_item', 'product_variant', 'user', 'rating', 'comment']}),
  ]
  list_display = ('order_item', 'product_variant', 'user', 'rating')
  list_filter = ('rating',)
  list_display_links = ('order_item',)
  list_per_page = 50
  search_fields = ('order_item',)

admin.site.register(ProductReview, ProductReviewAdmin)

class OrderReviewAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['order', 'user', 'rating', 'comment']}),
  ]
  list_display = ('order', 'user', 'rating')
  list_filter = ('rating',)
  list_display_links = ('order',)
  list_per_page = 50
  search_fields = ('order',)

admin.site.register(OrderReview, OrderReviewAdmin)

class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ('ref_code', 'order_item', 'approved', 'declined', 'refunded')
    list_editable = ('approved', 'declined', 'refunded')
    list_display_links = ('ref_code',)
    list_filter = ('approved', 'refunded')
    list_per_page = 25
    search_fields = ('ref_code', 'order_item')

admin.site.register(RefundRequest, RefundRequestAdmin)