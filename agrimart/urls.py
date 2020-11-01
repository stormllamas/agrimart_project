from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

from frontend import views as frontend_views

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('configuration.urls')),
    path('', include('accounts.urls')),
    path('', include('manager.urls')),
    path('', include('pages.urls')),
    path('', include('logistics.urls')),
    path('admin/', admin.site.urls),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if not settings.DEBUG:
    urlpatterns += [url(r'^.*$', frontend_views.IndexView.as_view(), name="page404")]