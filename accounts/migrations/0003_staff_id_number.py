# Generated by Django 4.2.7 on 2024-01-13 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_customer_staff_remove_waiter_user_delete_cook_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='staff',
            name='id_number',
            field=models.CharField(max_length=20, null=True),
        ),
    ]