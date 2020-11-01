from django.db import models
from django.conf import settings

# Custom User
from django.contrib.auth.models import UserManager, AbstractUser

class User(AbstractUser):
  # Additional fields
  facebook_id = models.CharField(max_length=25, blank=True, null=True)

  email = models.EmailField(max_length=254, unique=True, blank=False, null=False)
  username = models.CharField(max_length=55, unique=True)
  contact = models.CharField(max_length=55, blank=True, null=True)
  gender = models.CharField(max_length=10, blank=True, null=True)
  picture = models. URLField(max_length=500, blank=True, null=True)

  objects = UserManager()
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['first_name', 'last_name']

  def __str__(self):
    return self.email

  # @property
  # def favoritesPID(self):
  #   return [favorite.product.id for favorite in self.favorites.all()]

   
class Address(models.Model):
  # Basic Details
  user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)

  latitude = models.CharField(max_length=91)
  longitude = models.CharField(max_length=91)
  address = models.CharField(max_length=225)

  def __str__(self):
    return f'{self.user.email}'