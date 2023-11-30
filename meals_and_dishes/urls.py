from django.urls import path
from meals_and_dishes import views

urlpatterns = [
    path('list', views.list_meals_and_dishes, name='list_meals'),
    path('create', views.create_meals_and_dishes, name='create_meal'),
    path('update-meal-status/<int:meal_id>',
         views.update_meal_status, name='update_meal_status'),
]
