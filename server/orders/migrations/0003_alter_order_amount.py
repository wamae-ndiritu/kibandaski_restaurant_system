# Generated by Django 4.2.7 on 2023-12-09 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_rename_details_order_customer_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='amount',
            field=models.FloatField(default=0.0),
        ),
    ]