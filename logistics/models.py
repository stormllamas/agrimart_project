from django.conf import settings

# Packages and Serializers
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Objects
from configuration.models import SiteConfiguration
try:
  site_config = SiteConfiguration.objects.first()
except:
  site_config = None

# Tools
from django.utils.html import mark_safe
from markdown import markdown
from django.utils import timezone
from datetime import date
import datetime
import string
import random
import uuid
import math

def generate_id(prf):
  if prf:
    prefix = prf
  else:
    prefix = ""
  
  date_str = date.today().strftime('Y%m%d')[2:] + str(timezone.now().second)
  rand_str = "".join([random.choice(string.digits) for count in range(3)])
  return prefix + date_str + rand_str

def normal_round(n):
  if n - math.floor(n) < 0.5:
      return math.floor(n)
  return math.ceil(n)
    
class CategoryGroup(models.Model):
  name = models.CharField(max_length=50, blank=True, null=True)

  def __str__(self):
    return self.name

class Category(models.Model):
  name = models.CharField(max_length=50, blank=True, null=True)
  category_group = models.ForeignKey(CategoryGroup, related_name='categories', on_delete=models.CASCADE)

  def __str__(self):
    return self.name

  @property
  def seller_count(self):
    return len(Seller.objects.filter(categories=self.id))

class Seller(models.Model):
  name = models.CharField(max_length=50, unique=True)
  contact = models.CharField(max_length=50)
  description = models.TextField(max_length=4000, default='')
  latitude = models.CharField(max_length=25, blank=True, null=True)
  longitude = models.CharField(max_length=25, blank=True, null=True)
  address = models.CharField(max_length=225, blank=True, null=True)
  thumbnail = models.ImageField(upload_to='photos/sellers/%Y/%m/%d/', blank=True)
  categories = models.ManyToManyField(Category)

  def __str__(self):
    return self.name

  @property
  def name_to_url(self):
    return self.name.replace(' ','-').replace('&', 'and')

class Product(models.Model):
  # Basic Details
  name = models.CharField(max_length=50, unique=True)
  seller = models.ForeignKey(Seller, related_name='products', on_delete=models.SET_NULL, null=True)
  categories = models.ManyToManyField(Category)
  feature = models.BooleanField(default=False)
  description = models.TextField(max_length=4000, default='')
  # Photos
  thumbnail = models.ImageField(upload_to='photos/%Y/%m/%d/')
  photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  # Tracking
  date_published = models.DateTimeField(default=timezone.now, blank=True)
  is_published = models.BooleanField(default=True)

  def __str__(self):
    return self.name

  @property
  def get_summary_as_markdown(self):
    return mark_safe(markdown(self.description, safe_mode='escape'))

  @property
  def name_to_url(self):
    return self.name.replace(' ','-')

  @property
  def cheapest_variant(self):
    return ProductVariant.objects.filter(product=self).order_by('price', 'id').first()

  @property
  def total_rating(self):
    try:
      rating = normal_round(sum([int(review.rating) for review in ProductReview.objects.filter(product_variant__product=self)])/ProductReview.objects.filter(product_variant__product=self).count())
    except:
      rating = 0
    return rating

  @property
  def total_orders(self):
    return sum([int(variant.orders) for variant in self.variants.all()])

  @property
  def total_views(self):
    return sum([int(variant.views) for variant in self.variants.all()])
    
class ProductVariant(models.Model):
  product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
  thumbnail = models.ImageField(upload_to='photos/%Y/%m/%d/')
  # Basic Details
  name = models.CharField(max_length=50)
  price = models.DecimalField(max_digits=30, decimal_places=2)
  # Sale
  sale_price = models.DecimalField(max_digits=30, decimal_places=2, null=True, blank=True)
  sale_price_start_date = models.DateTimeField(default=None, blank=True, null=True)
  sale_price_end_date = models.DateTimeField(default=None, blank=True, null=True)
  # Tracking
  stock = models.IntegerField(default=0)
  views = models.PositiveIntegerField(default=0)
  orders = models.PositiveIntegerField(default=0)
  date_published = models.DateTimeField(default=timezone.now, blank=True)
  is_published = models.BooleanField(default=True)

  def __str__(self):
    return f'{self.name}'

  def sale_price_active(self):
    if self.sale_price:
      if self.sale_price_start_date:
        if self.sale_price_start_date < timezone.now() or self.sale_price_start_date == None:
          if self.sale_price_end_date:
            if self.sale_price_end_date > timezone.now() or self.sale_price_end_date == None:
              return True
            else:
              return False
          else:
            return True
        else:
          return False
      elif self.sale_price_end_date:
        if self.sale_price_end_date > timezone.now() or self.sale_price_end_date == None:
          return True
        else:
          return False
      else:
        return True
    else:
      return False

  @property
  def final_price(self):
    if self.sale_price_active():
      return self.sale_price
    else:
      return self.price

  @property
  def percent_off(self):
    if self.sale_price_active():
      return str(normal_round((1-self.sale_price/self.price)*100))
    else:
      return None

  @property
  def total_rating(self):
    try:
      rating = (sum([review.rating for review in self.reviews.all()]))/self.reviews.all().count()
    except:
      rating = None
    return rating

  @property
  def final_stock(self):
    return self.stock - sum([item.quantity if item.checkout_valid else 0 for item in self.order_items.filter(is_ordered=False)])

class Order(models.Model):
  # Basic Details
  ref_code = models.CharField(max_length=15, blank=True, null=True)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE, null=False)

  # Personal Details
  first_name = models.CharField(max_length=55, blank=True, null=True)
  last_name = models.CharField(max_length=55, blank=True, null=True)
  contact = models.CharField(max_length=55, blank=True, null=True)
  email = models.CharField(max_length=55, blank=True, null=True)
  gender = models.CharField(max_length=25, blank=True, null=True)

  # Pickup Location
  loc1_latitude = models.CharField(max_length=91, blank=True, null=True)
  loc1_longitude = models.CharField(max_length=91, blank=True, null=True)
  loc1_address = models.CharField(max_length=225, blank=True, null=True)
  # Destination Location
  loc2_latitude = models.CharField(max_length=91, blank=True, null=True)
  loc2_longitude = models.CharField(max_length=91, blank=True, null=True)
  loc2_address = models.CharField(max_length=225, blank=True, null=True)
  # Distance Information
  distance_text = models.CharField(max_length=55, blank=True, null=True)
  distance_value = models.PositiveIntegerField(default=0, blank=True, null=True)
  duration_text = models.CharField(max_length=55, blank=True, null=True)
  duration_value = models.PositiveIntegerField(default=0, blank=True, null=True)

  # Status
  is_ordered = models.BooleanField(default=False)
  date_ordered = models.DateTimeField(null=True, blank=True)

  rider = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='accepted_orders', on_delete=models.SET_NULL, blank=True, null=True)
  date_claimed = models.DateTimeField(null=True, blank=True)

  is_paid = models.BooleanField(default=False)
  date_paid = models.DateTimeField(null=True, blank=True)
  payment_type = models.PositiveIntegerField(default=1) # (1) for COD (2) for Card or Detail

  is_pickedup = models.BooleanField(default=False)
  date_pickedup = models.DateTimeField(null=True, blank=True)

  is_delivered = models.BooleanField(default=False)
  date_delivered = models.DateTimeField(null=True, blank=True)
  # Payment information for Paypal
  auth_id = models.CharField(max_length=125, blank=True, null=True)
  capture_id = models.CharField(max_length=125, blank=True, null=True)

  def save(self, *args, **kwargs):
    if self.ref_code == None or self.ref_code == '':
      self.ref_code = generate_id('')
    super(Order, self).save(*args, **kwargs)

  def __str__(self):
    return self.ref_code

  class Meta:
    verbose_name_plural="Orders"

  @property
  def shipping(self):
    total = round((self.distance_value/1000), 0)*site_config.per_km_price if type(self.distance_value) == int else 35
    if total < 35:
      total = 35
    return total

  @property
  def has_valid_item(self):
    has_valid_item = False
    for order_item in self.order_items.all():
      if order_item.checkout_valid:
        has_valid_item = True

    return has_valid_item

  @property
  def count(self):
    return sum([item.quantity if item.product_variant.final_stock > 0 else 0 for item in self.order_items.all()])

  @property
  def ordered_count(self):
    return sum([item.quantity for item in self.order_items.all()])

  @property
  def subtotal(self):
    return sum([item.quantity*item.product_variant.final_price if item.product_variant.final_stock > 0 else 0 for item in self.order_items.all()])

  @property
  def checkout_subtotal(self):
    return sum([item.quantity*item.product_variant.final_price for item in self.order_items.filter(checkout_validity__gte=timezone.now())])

  @property
  def total(self):
    return float(self.subtotal)+float(self.shipping)

  @property
  def checkout_total(self):
    return float(self.checkout_subtotal)+float(self.shipping)


class OrderItem(models.Model):
  order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
  product_variant = models.ForeignKey(ProductVariant, related_name='order_items', on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])

  is_ordered = models.BooleanField(default=False)
  date_ordered = models.DateTimeField(null=True, blank=True)
  ordered_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

  checkout_validity = models.DateTimeField(null=True, blank=True)

  is_pickedup = models.BooleanField(default=False)
  date_pickedup = models.DateTimeField(null=True, blank=True)
  
  is_delivered = models.BooleanField(default=False)
  date_delivered = models.DateTimeField(null=True, blank=True)

  def __str__(self):
    return f'{self.product_variant.product.name}'
  
  # @property
  # def price(self):
  #   return self.product_variant.price * self.quantity

  @property
  def checkout_valid(self):
    if self.checkout_validity:
      return False if self.checkout_validity < timezone.now() else True
    else:
      return False


class Favorite(models.Model):
  product = models.ForeignKey(ProductVariant, related_name='favorited_by', on_delete=models.CASCADE)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='favorites', on_delete=models.CASCADE)

  def __str__(self):
    return f'{self.user} - {self.product.name}'

class ProductReview(models.Model):
  RATING_CHOICES = [
    ('1','1'),
    ('2','2'),
    ('3','3'),
    ('4','4'),
    ('5','5')
  ]
  order_item = models.OneToOneField(OrderItem, related_name='review', on_delete=models.CASCADE)
  product_variant = models.ForeignKey(ProductVariant, related_name='reviews', on_delete=models.CASCADE)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='product_reviews', on_delete=models.CASCADE)
  rating = models.CharField(max_length=1, choices=RATING_CHOICES, default='5')
  comment = models.TextField(max_length=4000, null=True, blank=True)

class OrderReview(models.Model):
  RATING_CHOICES = [
    ('1','1'),
    ('2','2'),
    ('3','3'),
    ('4','4'),
    ('5','5')
  ]
  order = models.OneToOneField(Order, related_name='review', on_delete=models.CASCADE)
  user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='order_reviews', on_delete=models.CASCADE)
  rating = models.CharField(max_length=1, choices=RATING_CHOICES, default='5')
  comment = models.TextField(max_length=4000, null=True, blank=True)

class RefundRequest(models.Model):
  ref_code = models.CharField(max_length=15, blank=True, null=True)
  order_item = models.OneToOneField(OrderItem, related_name='refund_request', on_delete=models.CASCADE)
  comment = models.TextField(max_length=4000, null=True, blank=True)
  date_created = models.DateTimeField(default=timezone.now)
  approved = models.BooleanField(default=False)
  date_approved = models.DateTimeField(null=True, blank=True)
  declined = models.BooleanField(default=False)
  date_declined = models.DateTimeField(null=True, blank=True)
  refunded = models.BooleanField(default=False)
  date_refunded = models.DateTimeField(null=True, blank=True)

  def save(self, *args, **kwargs):
    if self.ref_code == None or self.ref_code == '':
      self.ref_code = generate_id('RF')
    super(RefundRequest, self).save(*args, **kwargs)

  def OIref_code(self):
    return self.order_item.order.ref_code
  
  def product_name(self):
    return self.order_item.name

  def capture_id(self):
    return self.order_item.order.capture_id

  def quantity(self):
    return self.order_item.quantity

  def amount(self):
    return self.order_item.ordered_price_total
  
  def delivery_total(self):
    return self.order_item.delivery_total

  def refund_total(self):
    return self.order_item.ordered_total

  def payment_method(self):
    return self.order_item.payment_method

  class Meta:
    permissions = (
      ('can_access_order_manager', "Can Access Order Manager"),
    )
    