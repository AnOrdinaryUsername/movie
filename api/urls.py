from django.urls import path

from .views import MovieInfoList, MovieInfoDetail

urlpatterns = [
    path("movie", MovieInfoList.as_view()),
    path("movie/<uuid:pk>", MovieInfoList.as_view()),
]