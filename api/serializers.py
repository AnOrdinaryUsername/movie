from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from api import models

# Use the custom user model
User = get_user_model()

# User creation serializer (inherited from Djoser)
class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        ref_name = 'CustomUserCreateSerializer'
        model = User
        fields = ("id", "email", "username", "password")


# Standard User serializer for retrieving user details
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username"]


# Genre serializer
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Genre
        fields = ['id', 'name']


# Person serializer
class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = ['name', 'birthday', 'description', 'image_url']


# Actor serializer with nested Person information
class ActorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="person.name")
    birthday = serializers.DateField(source="person.birthday")
    description = serializers.CharField(source="person.description")
    image_url = serializers.CharField(source="person.image_url", required=False)

    class Meta:
        model = models.Actor
        fields = ['id', 'name', 'birthday', 'description', 'image_url']


# Review serializer
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = ['id', 'user', 'movie', 'content']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ['id', 'user', 'movie', 'rating']

# Movie serializer with nested Genre and Actor serializers
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
            "media_release_date",  # Correcting the typo in the field name
            "media_length",
            "media_description",
            "image_url",
        ]
