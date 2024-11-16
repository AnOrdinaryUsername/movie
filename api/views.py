from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from djoser.serializers import UserCreateSerializer, UserSerializer



from api import models
from .serializers import MovieInfoSerializer, ReviewSerializer


class MovieInfoList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = models.MovieInfo.objects.all()
    serializer_class = MovieInfoSerializer

class MovieInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = MovieInfoSerializer

    def get_object(self, queryset=None):
        return models.MovieInfo.objects.get(pk=self.kwargs['pk'])
    
class UserInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer

    def get_object(self, queryset=None):
        return models.CustomUser.objects.get(pk=self.kwargs['pk'])

class ReviewList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        movie_id = self.kwargs['pk']
        return models.Review.objects.filter(movie=movie_id)
    

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = models.Review.objects.all()
    serializer_class = ReviewSerializer

    def get_object(self, queryset=None):
        return models.Review.objects.get(pk=self.kwargs['pk'])