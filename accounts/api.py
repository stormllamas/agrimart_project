# Packages
from rest_framework import viewsets
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.generics import GenericAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer, ResetPasswordSerializer, SocialAuthSerializer, AddressSerializer

#Auth
from rest_framework.response import Response
from knox.models import AuthToken
from agrimart.permissions import IsOwner

# Models
from django.conf import settings
from .models import Address
from django.contrib.auth import get_user_model
User = get_user_model()

# For Email
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .tokens import account_activation_token
from django.core.exceptions import ValidationError

# Tools
from django.shortcuts import get_object_or_404
from django.utils import timezone
import datetime
import re
    
class LoginAPI(GenericAPIView):
  serializer_class = LoginSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data

    addresses = [{
      'id': address.id,
      'user': address.user.id,
      'latitude': address.latitude,
      'longitude': address.longitude,
      'address': address.address,
    } for address in user.addresses.all()]

    user_data = UserSerializer(user, context=self.get_serializer_context()).data
    user_data['addresses'] = addresses

    _, token = AuthToken.objects.create(user)

    response = Response({
      'user': user_data,
      'token': token
    })

    request.session['auth_token'] = token
    request.session.set_expiry(60*60)

    return response

class SocialAuthAPI(GenericAPIView):
  serializer_class = SocialAuthSerializer

  def post(self, request, *args, **kwargs):
    if request.data['fbid'] == settings.FACEBOOK_AUTH_ID:
      serializer = self.get_serializer(data=request.data)
      regex = r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'
      if re.search(regex, request.data['email']):
        try:
          user = User.objects.get(email=request.data['email'], is_active=True, facebook_id=request.data['facebook_id'])
        except:
          user = None

        if user:
    
          addresses = [{
            'id': address.id,
            'user': address.user.id,
            'latitude': address.latitude,
            'longitude': address.longitude,
            'address': address.address,
          } for address in user.addresses.all()]

          groups = [{
            'id': group.id,
            'name': group.name,
          } for group in user.groups.all()]

          _, token = AuthToken.objects.create(user)
          response = Response({
            'user': {
              'id': user.id,
              'username': user.username,
              'email': user.email,
              'first_name': user.first_name,
              'last_name': user.last_name,
              'contact': user.contact,
              'gender': user.gender,
              'picture': user.picture,
              'is_staff': user.is_staff,
              'is_superuser': user.is_superuser,
              'addresses': addresses,
              'groups': groups,
            },
            'token': token
          })

          request.session['auth_token'] = token
          request.session.set_expiry(60*60)

          return response

      else:
        raise ValidationError('Invalid email') 

      if serializer.is_valid(raise_exception=True):
        user = serializer.save()

        user.is_active = True
        user.save()

        # current_site = get_current_site(self.request)
        # mail_subject = 'Welcome to Quezon Agrimart'
        # message = render_to_string(
        #   'welcome_email.html',
        #   {
        #     'user': user,
        #     'domain': current_site.domain,
        #   }
        # )
        # send_mail(
        #   mail_subject,
        #   message,
        #   'Quezon Agrimart',
        #   [user.email],
        #   fail_silently=False
        # )
    
        addresses = [{
          'id': address.id,
          'user': address.user.id,
          'latitude': address.latitude,
          'longitude': address.longitude,
          'address': address.address,
        } for address in user.addresses.all()]

        groups = [{
          'id': group.id,
          'name': group.name,
        } for group in user.groups.all()]

        _, token = AuthToken.objects.create(user)
        response = Response({
          'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'contact': user.contact,
            'gender': user.gender,
            'picture': user.picture,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'addresses': addresses,
            'groups': groups,
          },
          'token': token
        })

        request.session['auth_token'] = token
        request.session.set_expiry(60*60)

        return response
    else:
      return Response({
        'status': ''
      })
      
class SingupAPI(GenericAPIView):
  serializer_class = RegisterSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    print(serializer.is_valid(raise_exception=True))
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    user.is_active = False
    user.save()
    
    current_site = get_current_site(self.request)
    mail_subject = 'Activate your OPA account'
    message = render_to_string(
      'acc_active_email.html',
      {
        'user': user,
        'domain': current_site.domain,
        'uid':urlsafe_base64_encode(force_bytes(user.pk)),
        'token':account_activation_token.make_token(user),
      }
    )
    print(message)
    
    # email = user.email
    # send_mail(
    #   mail_subject,
    #   message,
    #   'Quezon Agrimart',
    #   [email],
    #   fail_silently=False
    # )

    return Response({'status': 'okay'})

class LogoutAPI(GenericAPIView):
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def post(self, request, *args, **kwargs):
    self.object = self.get_object()
    AuthToken.objects.filter(user=self.object).delete()
    response = Response({
      'status': 'okay'
    })

    del request.session['auth_token']
    return response
    
class TokenAPI(GenericAPIView):

  def get(self, request, pk=None):
    if request.session.get('auth_token', False):
      return Response(request.session.get('auth_token'))
    else:
      return Response(None)
    
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

class UserAPI(RetrieveAPIView, UpdateAPIView):
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def get(self, request):
    user = request.user
    
    addresses = [{
      'id': address.id,
      'user': address.user.id,
      'latitude': address.latitude,
      'longitude': address.longitude,
      'address': address.address,
    } for address in user.addresses.all()]

    groups = [{
      'id': group.id,
      'name': group.name,
    } for group in user.groups.all()]
    
    return Response({
      'id': user.id,
      'username': user.username,
      'email': user.email,
      'first_name': user.first_name,
      'last_name': user.last_name,
      'contact': user.contact,
      'gender': user.gender,
      'picture': user.picture,
      'is_staff': user.is_staff,
      'is_superuser': user.is_superuser,
      'addresses': addresses,
      'groups': groups,
    })

class AddressAPI(CreateModelMixin, DestroyModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
  serializer_class = AddressSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return get_object_or_404(Address, id=self.kwargs['pk'])

class ActivateAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      uid = force_text(urlsafe_base64_decode(request.data['uidb64']))
      user = User.objects.get(id=uid)
      print(user)
      print(request.data['token'])
      print(account_activation_token.check_token(user, request.data['token']))
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None and account_activation_token.check_token(user, request.data['token']):
      user.is_active = True
      user.save()

      current_site = get_current_site(self.request)
      mail_subject = 'Welcome to Quezon Agrimart'
      message = render_to_string(
        'welcome_email.html',
        {
          'user': user,
          'domain': current_site.domain,
        }
      )
      # send_mail(
      #   mail_subject,
      #   message,
      #   'Quezon Agrimart',
      #   [user.email],
      #   fail_silently=False
      # )

      _, token = AuthToken.objects.create(user)
      response = Response({
        'status': 'okay',
        'user': UserSerializer(user, context=self.get_serializer_context()).data,
        'token': token
      })

      request.session['auth_token'] = token
      request.session.set_expiry(60*60)
      # response.set_cookie('token', value=token, max_age=60*60, httponly=True, samesite='strict')

      return response
    else:
      return Response({
        'status': 'error',
      })

class ChangePasswordAPI(RetrieveAPIView, UpdateAPIView):
  model = User
  serializer_class = ChangePasswordSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def update(self, request, *args, **kwargs):
    self.object = self.get_object()
    serializer = self.get_serializer(data=request.data)

    if serializer.is_valid():
      # Check old password
      if not self.object.check_password(serializer.data.get("old_password")):
        return Response({
        'status': 'error',
        'message': 'Wrong Password',
      })
      # set_password also hashes the password that the user will get
      self.object.set_password(serializer.data.get("new_password"))
      self.object.save()

      return Response({
        'status': 'okay',
        'message': 'Password updated successfully',
      })

    return Response(serializer.errors)
      
# Request reset - Password Reset
class PasswordResetAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      email = request.data['email']
      user = User.objects.get(email=email)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None:
      current_site = get_current_site(self.request)
      mail_subject = 'Reset your Agrimart account\'s Password'
      message = render_to_string(
        'password_reset_email.html',
        {
          'user': user,
          'domain': current_site.domain,
          'uid':urlsafe_base64_encode(force_bytes(user.pk)),
          'token':account_activation_token.make_token(user),
        }
      )
      send_mail(
        mail_subject,
        message,
        'Quezon Agrimart',
        [email],
        fail_silently=False
      )
      
      return Response({
        'status': 'okay',
        'message': 'Email has been sent. Please check your email',
      })
    else:
      return Response({
        'status': 'error',
        'message': 'User with entered email does not exist',
      })

# Verify secret and token - Password Reset
class VerifyPasswordResetAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      uid = force_text(urlsafe_base64_decode(request.data['uidb64']))
      user = User.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None and account_activation_token.check_token(user, request.data['token']):
      return Response({
        'status': 'okay',
        'user': UserSerializer(user, context=self.get_serializer_context()).data,
      })
    else:
      return Response({
        'status': 'error',
      })
# Process reset - Password Reset
class ResetPasswordAPI(RetrieveAPIView, UpdateAPIView):
  model = User
  serializer_class = ResetPasswordSerializer

  def get_object(self):
    try:
      uid = force_text(urlsafe_base64_decode(self.request.data['uidb64']))
      user = User.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    return user

  def update(self, request, *args, **kwargs):
    self.object = self.get_object()
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid():
      if self.object is not None and account_activation_token.check_token(self.object, serializer.data.get("token")):
        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()
        return Response({
          'status': 'okay',
        })
      else:
        return Response({
          'status': 'error',
        })