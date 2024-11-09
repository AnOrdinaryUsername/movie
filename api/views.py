from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import AllowAny


from api import models
from .serializers import MovieInfoSerializer


class MovieInfoList(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = models.MovieInfo.objects.all()
    serializer_class = MovieInfoSerializer

class MovieInfoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.MovieInfo.objects.all()
    serializer_class = MovieInfoSerializer
