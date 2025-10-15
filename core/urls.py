from django.urls import path
from . import views


urlpatterns = [
path('', views.index, name='index'),
path('api/hello', views.api_hello, name='api_hello'),
path("", views.home, name="home"),
    path("start-payment/", views.start_payment, name="start_payment"),
    path("pi-webhook/", views.pi_webhook, name="pi_webhook")
]