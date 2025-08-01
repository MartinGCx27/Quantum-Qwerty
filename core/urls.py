from django.urls import path
from . import views
urlpatterns = [
        path('', views.index, name='index'),
        path('ContactUs/', views.ContactUs, name='contactus'),
        path('aboutUs/', views.aboutUs, name='about'),
        path('services', views.services, name='services'),
        path('error404/', views.error404_view, name='error 404'),
    ]