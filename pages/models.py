from django.db import models
from django.conf import settings

# Tools
from django.utils import timezone
from django.utils.html import mark_safe
from markdown import markdown

class Article(models.Model):
  title = models.CharField(max_length=50)
  link = models.URLField(
    max_length=200,
    db_index=True,
    null=True, blank=True
  )
  summary = models.TextField(max_length=4000)
  custom_button = models.CharField(max_length=50, blank=True)
  thumbnail = models.ImageField(upload_to='photos/%Y/%m/%d/')
  photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  date_published = models.DateTimeField(default=timezone.now, blank=True)
  is_published = models.BooleanField(default=True)
  highlight = models.BooleanField(default=False)
  views = models.PositiveIntegerField(default=0)

  def __str__(self):
    return self.title

  @property
  def get_summary_as_markdown(self):
    return mark_safe(markdown(self.summary, safe_mode='escape'))


class Event(models.Model):
  title = models.CharField(max_length=50)
  summary = models.TextField(max_length=4000)
  thumbnail = models.ImageField(upload_to='photos/%Y/%m/%d/')
  date = models.DateTimeField(null=False, blank=False)
  is_published = models.BooleanField(default=True)
  views = models.PositiveIntegerField(default=0)

  def __str__(self):
    return self.title

  def get_summary_as_markdown(self):
    return mark_safe(markdown(self.summary, safe_mode='escape'))

class Service(models.Model):
  title = models.CharField(max_length=50)
  summary = models.TextField(max_length=4000)
  photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/')
  photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
  icon = models.CharField(max_length=50)
  is_published = models.BooleanField(default=True)
  views = models.PositiveIntegerField(default=0)

  def __str__(self):
    return self.title

  @property
  def get_summary_as_markdown(self):
    return mark_safe(markdown(self.summary, safe_mode='escape'))

class Contact(models.Model):
  name = models.CharField(max_length=50)
  email = models.CharField(max_length=50)
  phone = models.CharField(max_length=50, blank=True, null=True)
  subject = models.CharField(max_length=200)
  message = models.TextField(blank=True)
  contact_date = models.DateTimeField(default=timezone.now, blank=True)
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='contacts', on_delete=models.SET_NULL, null=True, blank=True)