# Generated by Django 3.0.7 on 2020-08-10 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0004_siteconfiguration_site_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='siteconfiguration',
            name='site_message',
            field=models.CharField(blank=True, default='Welcome to Quezon Agrimart!', max_length=55, null=True),
        ),
    ]
