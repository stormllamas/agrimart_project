from django.contrib import admin
from solo.admin import SingletonModelAdmin
from .models import SiteConfiguration


class SingletonModelAdminModified(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['site_name', 'site_logo', 'maintenance_mode', 'beta_mode', 'site_message']}),
    ('Header Details', {'fields': ['main_header_image', 'site_title', 'site_sub_title', 'header_text', 'header_logo_1', 'header_logo_2']}),
    ('Contact Information', {'fields': ['phone', 'email', 'location', 'office_hours']}),
    ('Shop Highlights Page', {'fields': ['highlight_1', 'highlight_2', 'highlight_3', 'highlight_4', 'highlight_5', 'highlight_6', 'shop_spiel_title', 'shop_spiel_text']}),
    ('About Page', {'fields': ['about_sub_header', 'about_text']}),
    ('Deliveries', {'fields': ['per_km_price']}),
  ]

  def has_delete_permission(self, request, obj=None):
    return False
    
  def has_add_permission(self, request, obj=None):
    return False

admin.site.register(SiteConfiguration, SingletonModelAdminModified)
try:
  config = SiteConfiguration.get_solo()
except:
  config = None