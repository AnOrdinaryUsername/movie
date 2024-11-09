from django.contrib.auth.models import Group, User
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer

from rest_framework import serializers
from api import models


User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "email", "username", "password")


class MovieInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MovieInfo
        fields = [
            "id",
            "genre",
            "actors_list",
            "media_title",
            "media_length",
            "media_description",
            "image_url",
        ]
