# Backend Authentication
from django.contrib.auth import get_user_model
User = get_user_model()
from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db.models import Q


class EmailOrUsernameModelBackend(ModelBackend):
  def authenticate(self, request, email=None, password=None, facebook_id=None):
    if email and password:
      try:
        user = User.objects.get(Q(email__exact=email))

        if user.check_password(password):
          return user
        else:
          return None
      except ObjectDoesNotExist:
        return None

    elif email and facebook_id:
      try:
        user = User.objects.get(email__exact=email)
        if user.facebook_id == facebook_id:
          return user
        else:
          return None
      except user.DoesNotExist:
        return None
    else:
      return None

# class FacebookAuthModelBackend(ModelBackend):
#   def authenticate(self, request, email=None, facebook_id=None):
#     print(facebook_id, email)
#     User = get_user_model()
#     try:
#       user = User.objects.get(email__exact=email)
#       if user.facebook_id == facebook_id:
#         return user
#       else:
#         raise ValidationError("Facebook not synced with this account")
#     except user.DoesNotExist:
#       return None