from django.urls import path
from . import views
urlpatterns = [
        path('', views.index, name='index'),
        path('ContactUs/', views.ContactUs, name='contactus'),
        path('services', views.services, name='services'),
    ]