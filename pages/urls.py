from rest_framework import routers
from django.urls import path
from .api import ArticleViewSet, ArticlesViewSet, EventViewSet, ServiceViewSet, ContactViewSet

router = routers.DefaultRouter()

router.register('api/contact', ContactViewSet, 'contact')

urlpatterns = [
  path('api/article/<int:pk>/', ArticleViewSet.as_view(), name='article'),
  path('api/articles/', ArticlesViewSet.as_view(), name='articles'),

  path('api/service/<int:pk>/', ServiceViewSet.as_view(), name='service'),
  path('api/event/<int:pk>/', EventViewSet.as_view(), name='event'),
]

urlpatterns += router.urls