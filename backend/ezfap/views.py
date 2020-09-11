from django.shortcuts import render

from .models import Weight, Food
from .serializers import WeightSerializer, FoodSerializer, UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from knox.models import AuthToken

import requests
from django import http
from django.conf import settings
from django.template import engines
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import datetime 

'''DEV CONF'''

@csrf_exempt
def catchall_dev(request, upstream='http://localhost:3000'):
    upstream_url = upstream + request.path
    response = requests.get(upstream_url, stream=True)
    content_type = response.headers.get('Content-Type')
    if request.META.get('HTTP_UPGRADE', '').lower() == 'websocket':
        return http.HttpResponse(
            content="WebSocket connections aren't supported",
            status=501,
            reason="Not Implemented"
        )
    elif content_type == 'text/html; charset=UTF-8':
        return http.HttpResponse(
            content=engines['django'].from_string(response.text).render(),
            status=response.status_code,
            reason=response.reason,
        )
    else:
        return http.StreamingHttpResponse(
            streaming_content=response.iter_content(2 ** 12),
            content_type=content_type,
            status=response.status_code,
            reason=response.reason,
        )

catchall_prod = TemplateView.as_view(template_name='index.html')

catchall = catchall_dev if settings.DEBUG else catchall_prod


'''WEIGHT'''

last_month = datetime.datetime.today() - datetime.timedelta(days=30)

@ensure_csrf_cookie
@api_view(['GET', 'POST'])
def weight_list(request):
    if request.method == 'GET':
        data = Weight.objects.filter(user=request.user, date__gte=last_month)
        serializer = WeightSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        #Check previous data
        dt = datetime.datetime.today().strftime('%Y-%m-%d')
        previous = Weight.objects.filter(user=request.user, date=dt)
        if previous:
            tgt = previous.get()
            tgt.kg = request.data["kg"]
            tgt.save()
            return Response(status=status.HTTP_201_CREATED) 
        request.data["user"] = request.user.id
        serializer = WeightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''FOOD'''

@ensure_csrf_cookie
@api_view(['GET', 'POST'])
def food_list(request):
    if request.method == 'GET':
        data = Food.objects.filter(user=request.user)
        serializer = FoodSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        request.data["user"] = request.user.id
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


'''USER'''

class UserAPIView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class RegisterAPIView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })