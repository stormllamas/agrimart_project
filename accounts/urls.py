from django.urls import path, include
from rest_framework import routers
from .api import UserAPI, SingupAPI, ResendActivationAPI, LoginAPI, LogoutAPI, ActivateAPI, ChangePasswordAPI, PasswordResetAPI, VerifyPasswordResetAPI, ResetPasswordAPI, TokenAPI, PayPalKeysAPI, SocialAuthAPI, FacebookKeysAPI, AddressAPI
from knox import views as knox_views

router = routers.DefaultRouter()

router.register('api/auth/address', AddressAPI, 'address')

urlpatterns = [
  path('api/auth', include('knox.urls')),
  path('api/auth/token', TokenAPI.as_view(), name='token'),
  path('api/auth/paypal_keys', PayPalKeysAPI.as_view(), name='paypal_keys'),
  path('api/auth/facebook_keys', FacebookKeysAPI.as_view(), name='facebook_keys'),

  path('api/auth/signup', SingupAPI.as_view(), name='signup'),
  path('api/auth/resend_activation', ResendActivationAPI.as_view(), name='resend_activation'),
  path('api/auth/social_auth', SocialAuthAPI.as_view(), name='social_auth'),

  path('api/auth/activate', ActivateAPI.as_view(), name='activate'),
  path('api/auth/login', LoginAPI.as_view(), name='login'),
  path('api/auth/logout', LogoutAPI.as_view(), name='logout'),

  path('api/auth/user', UserAPI.as_view(), name='get_user'),

  path('api/auth/change_password', ChangePasswordAPI.as_view(), name='change_password'),
  path('api/auth/request_password_reset', PasswordResetAPI.as_view(), name='request_password_reset'),
  path('api/auth/verify_password_reset', VerifyPasswordResetAPI.as_view(), name='verify_password_reset'),
  path('api/auth/reset_password', ResetPasswordAPI.as_view(), name='reset_password'),
]

urlpatterns += router.urls