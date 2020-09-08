from django.contrib import admin
from django.urls import path,include

from ezfap import views
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('ezfap.urls')),
]
