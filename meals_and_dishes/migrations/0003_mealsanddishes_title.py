# Generated by Django 4.2.7 on 2023-12-01 12:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals_and_dishes', '0002_mealsanddishes_is_ready'),
    ]

    operations = [
        migrations.AddField(
            model_name='mealsanddishes',
            name='title',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
