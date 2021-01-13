import asyncio
import json
from django.contrib.auth import get_user_model
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async

from .models import Order
from django.contrib.auth import get_user_model
User = get_user_model()

class OrderConsumer(AsyncConsumer):
  async def websocket_connect(self, event):
    print("connected", event)

    bookings = 'order_update'
    self.bookings = bookings

    await self.channel_layer.group_add(
      bookings,
      self.channel_name
    )

    await self.send({
      "type": "websocket.accept"
    })

  async def websocket_receive(self, event):
    print("receive", event)
    dict_data = event.get('text', None)
    if dict_data:
      loaded_dict_data = json.loads(dict_data)

    await self.channel_layer.group_send(
      self.bookings,
      {
        'type': 'mark_order',
        'text': loaded_dict_data
      }
    )

  async def mark_order(self, event):
    print('message', event)
    order = await self.get_order(int(event['text']['order_id']))
    mark = event['text']['mark']
    
    await self.send({
      "type": "websocket.send",
      "text": json.dumps({
        "mark": mark,
        "order": {
          'id': order.id
        },
      })
    })


  async def websocket_disconnect(self, event):
    print("disconnect", event)

  @database_sync_to_async
  def get_order(self, order_id):
    return Order.objects.get(pk=order_id)

  @database_sync_to_async
  def get_user(self, user_id):
    return User.objects.get(pk=user_id)