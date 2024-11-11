from django.urls import path

from .views import MovieInfoList, MovieInfoDetail

urlpatterns = [
    path("movies", MovieInfoList.as_view()),
    path("movies/<uuid:pk>", MovieInfoDetail.as_view()),
]