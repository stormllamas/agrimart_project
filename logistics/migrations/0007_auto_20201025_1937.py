# Generated by Django 3.0.7 on 2020-10-25 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistics', '0006_auto_20201025_1145'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='checkout_validity',
        ),
        migrations.AddField(
            model_name='order',
            name='checkout_validity',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
