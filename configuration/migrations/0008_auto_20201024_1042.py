# Generated by Django 3.0.7 on 2020-10-24 02:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0007_auto_20201017_1703'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CityAddress',
        ),
        migrations.DeleteModel(
            name='CountryAddress',
        ),
        migrations.DeleteModel(
            name='PickupAddress',
        ),
        migrations.DeleteModel(
            name='ProvinceAddress',
        ),
    ]
