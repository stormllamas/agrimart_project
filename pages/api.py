# Packages
from rest_framework import viewsets
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, GenericAPIView
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.response import Response

# Models
from .models import Article, Event, Service

# Permissions and pagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from agrimart.permissions import SiteEnabled
from agrimart.pagination import StandardResultsSetPagination

# Serializers
from .serializers import ArticleSerializer, EventSerializer, ServiceSerializer, ContactSerializer

# For Email
from django.core.mail import send_mail, get_connection
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site

# Tools
from django.shortcuts import get_object_or_404
from django.db.models import Q
from decouple import config
from django.utils import timezone
import datetime

class ArticlesViewSet(GenericAPIView):
  permission_classes = [SiteEnabled]

  def get(self, request):
    queryset_full_length = Article.objects.filter(is_published=True).count()

    page_query = int(self.request.query_params.get('page', 0))
    from_item = 4
    to_item = 10
    if page_query > 1:
      from_item = (page_query-1)*10
      to_item = page_query*10

    if (page_query*10) >= queryset_full_length:
      next_path = None
    else:
      next_path = f'api/articles/?page={page_query+1}'

    if page_query > 1:
      previous_path = f'api/articles/?page={page_query-1}'
    else:
      previous_path = None

    articles = [{
      'id': article.id,
      'title': article.title,
      'link': article.link,
      'summary': article.summary,
      'custom_button': article.custom_button,
      'thumbnail': article.thumbnail.url,
      'photo_1': article.photo_1.url if article.photo_1 else None,
      'photo_2': article.photo_2.url if article.photo_2 else None,
      'photo_3': article.photo_3.url if article.photo_3 else None,
      'photo_4': article.photo_4.url if article.photo_4 else None,
      'photo_5': article.photo_5.url if article.photo_5 else None,
      'photo_6': article.photo_6.url if article.photo_6 else None,
      'date_published': article.date_published,
      'is_published': article.is_published,
      'highlight': article.highlight,
      'views': article.views
    } for article in Article.objects.all().order_by('-highlight', '-date_published')[from_item:to_item]]

    highlight_articles = [{
      'id': article.id,
      'title': article.title,
      'link': article.link,
      'summary': article.summary,
      'custom_button': article.custom_button,
      'thumbnail': article.thumbnail.url,
      'photo_1': article.photo_1.url if article.photo_1 else None,
      'photo_2': article.photo_2.url if article.photo_2 else None,
      'photo_3': article.photo_3.url if article.photo_3 else None,
      'photo_4': article.photo_4.url if article.photo_4 else None,
      'photo_5': article.photo_5.url if article.photo_5 else None,
      'photo_6': article.photo_6.url if article.photo_6 else None,
      'date_published': article.date_published,
      'is_published': article.is_published,
      'highlight': article.highlight,
      'views': article.views
    } for article in Article.objects.all().order_by('-highlight', '-date_published')[0:4]]

    return Response({
      'highlights': highlight_articles,
      'count': queryset_full_length,
      'next': next_path,
      'previous': previous_path,
      'results': articles,
    })

class ArticleViewSet(RetrieveAPIView):
  queryset = Article.objects.filter(is_published=True).order_by('-highlight', '-date_published')
  serializer_class = ArticleSerializer
  pagination_class = StandardResultsSetPagination
  permission_classes = [SiteEnabled]

  def retrieve(self, request, pk=None):
    article = get_object_or_404(Article, pk=pk)
    serializer = ArticleSerializer(article)
    response = Response(serializer.data)

    session_key = f'viewed_article_{pk}'

    if not request.session.get(session_key, False):
      article.views += 1
      article.save()
      serializer = ArticleSerializer(article)
      response = Response(serializer.data)

      request.session[f'viewed_article_{pk}'] = True
      
    return response

class EventViewSet(GenericAPIView):
  permission_classes = [SiteEnabled]

  def get_object(self):
    return get_object_or_404(Event, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    try:
      event = self.get_object()
    except:
      event = Event.objects.all().first()
    session_key = f'viewed_event_{event.id}'

    if not request.session.get(session_key, False):
      event.views += 1
      event.save()
      request.session[f'viewed_event_{pk}'] = True

    return Response({
      'event': {
        'id': event.id,
        'title': event.title,
        'summary': event.summary,
        'thumbnail': event.thumbnail.url if event.thumbnail else None,
        'date': event.date,
      },
      'events': [{
        'id': event.id,
        'title': event.title,
        'summary': event.summary,
        'date': event.date,
      } for event in Event.objects.filter(is_published=True)]
    })

class ServiceViewSet(GenericAPIView):
  permission_classes = [SiteEnabled]

  def get_object(self):
    return get_object_or_404(Service, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    try:
      service = self.get_object()
    except:
      service = Service.objects.all().first()
    session_key = f'viewed_service_{service.id}'

    if not request.session.get(session_key, False):
      service.views += 1
      service.save()
      request.session[f'viewed_service_{pk}'] = True

    return Response({
      'service': {
        'id': service.id,
        'title': service.title,
        'summary': service.summary,
        'photo_1': service.photo_1.url if service.photo_1 else None,
        'photo_2': service.photo_2.url if service.photo_2 else None,
        'photo_3': service.photo_3.url if service.photo_3 else None,
        'photo_4': service.photo_4.url if service.photo_4 else None,
        'photo_5': service.photo_5.url if service.photo_5 else None,
        'photo_6': service.photo_6.url if service.photo_6 else None,
      },
      'services': [{
        'id': service.id,
        'title': service.title,
        'icon': service.icon,
      } for service in Service.objects.filter(is_published=True)]
    })

class ContactViewSet(CreateModelMixin, viewsets.GenericViewSet):
  permission_classes = [SiteEnabled]
  
  serializer_class = ContactSerializer
      
  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if request.user.is_authenticated:
      contact = serializer.save(created_by=self.request.user)
    else:
      contact = serializer.save()

    contact.save()
    
    name = request.data['name']
    email = request.data['email']
    phone = request.data['phone']
    subject = request.data['subject']
    message = request.data['message']
    timestamp = timezone.now()
    mail_subject = 'OPA Inquiry'

    # Success Message to Inquirer
    success_message = render_to_string(
      'inquiry_success.html',
      {
        'name': name,
      }
    )
    
    connection = get_connection(
      # host=my_host, 
      # port=my_port, 
      username=config('SUPPORT_USER'), 
      password=config('SUPPORT_PASSWORD'), 
      # use_tls=my_use_tls
    ) 

    send_mail(
      mail_subject,
      success_message,
      'Quezon Agrimart Support',
      [email],
      connection=connection,
      fail_silently=False
    )

    # Message Notification
    message_notification = render_to_string(
      'inquiry_notification.html',
      {
        'name': name,
        'email': email,
        'phone': phone,
        'subject': subject,
        'message': message,
        'timestamp': timestamp,
      }
    )
    send_mail(
      mail_subject,
      message_notification,
      'Quezon Agrimart Support',
      ['support@quezonagrimart.com.ph'],
      connection=connection,
      fail_silently=False
    )

    return Response({'status': 'okay'})