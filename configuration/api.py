from django.shortcuts import render

# Packages
from rest_framework.permissions import IsAuthenticated

# Models
from django.conf import settings
from .models import SiteConfiguration

# Serializers
from rest_framework import viewsets, mixins
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import SiteConfigurationSerializer

    
class SiteInformationAPI(GenericAPIView):
  def get(self, request, pk=None):
    site_config = SiteConfiguration.objects.first()
    return Response({
      'maintenance_mode': site_config.maintenance_mode,
      'beta_mode': site_config.beta_mode,
      'site_name': site_config.site_name,
      'site_message': site_config.site_message,
      'phone': site_config.phone,
      'email': site_config.email,
      'location': site_config.location,
      'about_text': site_config.about_text,
      'per_km_price': site_config.per_km_price,
      'shipping_base': site_config.shipping_base,

      'site_logo': site_config.site_logo.url,
      'main_header_image': site_config.main_header_image.url,
      'site_title': site_config.site_title,
      'site_sub_title': site_config.site_sub_title,
      'header_text': site_config.header_text,
      'header_logo_1': site_config.header_logo_1.url if site_config.header_logo_1 else None,
      'header_logo_2': site_config.header_logo_2.url if site_config.header_logo_2 else None,

      'highlight_1': site_config.highlight_1.url if site_config.highlight_1 else None,
      'highlight_2': site_config.highlight_2.url if site_config.highlight_2 else None,
      'highlight_3': site_config.highlight_3.url if site_config.highlight_3 else None,
      'highlight_4': site_config.highlight_4.url if site_config.highlight_4 else None,
      'highlight_5': site_config.highlight_5.url if site_config.highlight_5 else None,
      'highlight_6': site_config.highlight_6.url if site_config.highlight_6 else None,
      
      'shop_spiel_title': site_config.shop_spiel_title,
      'shop_spiel_text': site_config.shop_spiel_text,

      'version': settings.APPLICATION_VERSION,
    })
    
class PayPalKeysAPI(GenericAPIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk=None):
    return Response({
      'PAYPAL_CLIENT_ID': settings.PAYPAL_CLIENT_ID,
      'PAYPAL_CLIENT_SECRET': settings.PAYPAL_CLIENT_SECRET,
    })
    
class FacebookKeysAPI(GenericAPIView):

  def get(self, request, pk=None):
    return Response({
      'FACEBOOK_AUTH_ID': settings.FACEBOOK_AUTH_ID,
    })
    
class GoogleKeysAPI(GenericAPIView):

  def get(self, request, pk=None):
    return Response({
      'GOOGLE_API_KEY': settings.GOOGLE_API_KEY,
    })