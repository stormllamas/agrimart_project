from django.db import models
from solo.models import SingletonModel

# Create your models here.

class SiteConfiguration(SingletonModel):
  maintenance_mode = models.BooleanField(default=False)
  beta_mode = models.BooleanField(default=False)

  site_name = models.CharField(max_length=255, default='Site Name')
  site_logo = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  site_message = models.CharField(max_length=125, default='Welcome to Quezon Agrimart!', blank=True, null=True)

  # Contact Information
  phone = models.CharField(max_length=55, default='')
  email = models.EmailField(max_length=55, default='')
  location = models.CharField(max_length=100, default='')
  office_hours = models.CharField(max_length=100, default='')

  # Header Details
  main_header_image = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  site_title = models.CharField(max_length=255, default='Site Title')
  site_sub_title = models.CharField(max_length=255, default='Site Sub Title')
  header_text = models.TextField(max_length=1000, default='Insert Header Text Here')
  header_logo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  header_logo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)

  # Shop Highlights Page
  highlight_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  highlight_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  highlight_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  highlight_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  highlight_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  highlight_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  shop_spiel_title = models.CharField(max_length=55, default='Insert Spiel Title Here')
  shop_spiel_text = models.TextField(max_length=4000, default='Insert Spiel Text Here')
  # About Page
  about_sub_header = models.CharField(max_length=55, default='Insert Sub Header Here')
  about_text = models.TextField(max_length=4000, default='Insert About Text Here')
  
  per_km_price = models.PositiveIntegerField(default=20, null=False)

  def __str__(self):
    return f"{self.site_name}"
  
  # def __unicode__(self):
  #   return u"Site Configuration"

  class Meta:
    verbose_name = "Site Configuration"