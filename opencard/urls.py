from django.contrib import admin
from django.urls import path, include
from core import views

urlpatterns = [
path('admin/', admin.site.urls),
path("validation-key.txt", views.validation_key)  ,
path('', include('core.urls')),
]
