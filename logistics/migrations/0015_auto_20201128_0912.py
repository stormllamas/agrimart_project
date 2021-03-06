# Generated by Django 3.0.7 on 2020-11-28 01:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistics', '0014_auto_20201128_0905'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='date_canceled',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='is_canceled',
            field=models.BooleanField(default=False),
        ),
    ]
