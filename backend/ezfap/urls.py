from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

from knox.views import LogoutView
from .views import UserAPIView, RegisterAPIView, LoginAPIView

urlpatterns = [
    path('api/weight/', views.weight_list),
    path('api/food/', views.food_list),
    path('api/sleep/', views.sleep_track),

    path('api/auth/', include('knox.urls')),
    path('api/auth/user', UserAPIView.as_view()),
    path('api/auth/signup', RegisterAPIView.as_view()),
    path('api/auth/login', LoginAPIView.as_view()),
    path('api/auth/logout', LogoutView.as_view(), name='knox_logout'),

    re_path(r'', views.catchall),
]