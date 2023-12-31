# Generated by Django 4.2.7 on 2023-11-25 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='details',
            new_name='customer_name',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='meals_and_dishes',
            new_name='order_items',
        ),
        migrations.AlterField(
            model_name='order',
            name='payment_method',
            field=models.CharField(choices=[('CASH', 'Cash'), ('MPESA', 'M-Pesa')], max_length=10),
        ),
    ]
