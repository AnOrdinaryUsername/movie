from django.contrib.auth.models import Group, User
from rest_framework import serializers
from api import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class MovieInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MovieInfo
        fields = ['id', 'genre', 'actors_list', 'media_title', 'media_length', 'media_description']