import os
import django

from django.conf.urls import url
from django.core.asgi import get_asgi_application
from decouple import config

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "agrimart.settings")
django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator

# from logistics.consumers import OrderConsumer

application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    "http": get_asgi_application(),

    # WebSocket chat handler
    "websocket": OriginValidator(
      AuthMiddlewareStack(
        URLRouter([
          # url(r"^order_update/$", OrderConsumer.as_asgi()),
        ])
      ),
      config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
    )
})