# Generated by Django 3.0.7 on 2020-10-26 11:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logistics', '0010_order_checkout_validity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='checkout_validity',
        ),
    ]
