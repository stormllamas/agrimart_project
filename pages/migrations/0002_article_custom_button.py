# Generated by Django 3.0.7 on 2020-08-15 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='custom_button',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
