from rest_framework import serializers
from rest_framework import permissions

from .models import Weight
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class WeightSerializer(serializers.ModelSerializer):
    permission_classes = [permissions.IsAuthenticated]

    class Meta:
        model = Weight
        fields = ['pk', 'date', 'kg', 'user']


'''USER'''

User._meta.get_field('email')._unique = True

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password']) #None
        err = str(data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(err)