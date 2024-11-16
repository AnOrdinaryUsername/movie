from django.contrib.auth.models import Group, User
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer

from rest_framework import serializers
from api import models


User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        ref_name = 'CustomUserCreateSerializer'
        model = User
        fields = ("id", "email", "username", "password")


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Genre
        fields = ['id', 'name']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = ['name', 'birthday', 'description', 'image_url']

class ActorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="person.name")
    birthday = serializers.DateField(source="person.birthday")
    description = serializers.CharField(source="person.description")
    image_url = serializers.CharField(source="person.image_url", required=False)

    class Meta:
        model = models.Actor
        fields = ['id', 'name', 'birthday', 'description', 'image_url']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = ['id', 'user', 'movie', 'content']
        
class MovieInfoSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True)
    actors_list = ActorSerializer(many=True)

    class Meta:
        model = models.MovieInfo
        fields = [
            "id",
            "genres",
            "actors_list",
            "media_title",
            "media_length",
            "media_description",
            "image_url"
        ]
