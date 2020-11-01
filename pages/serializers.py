from rest_framework import serializers
from .models import Article, Event, Service, Contact

class ArticleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Article
    fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Service
    fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
  class Meta:
    model = Contact
    fields = '__all__'