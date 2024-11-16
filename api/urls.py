from django.urls import path

from .views import MovieInfoList, MovieInfoDetail, ReviewList, ReviewDetail, UserInfoDetail

urlpatterns = [
    path("movies", MovieInfoList.as_view()),
    path("movies/<uuid:pk>", MovieInfoDetail.as_view()),
    path("movies/<uuid:pk>/reviews", ReviewList.as_view()),
    path("movies/<uuid:movie_id>/reviews/<uuid:pk>", ReviewDetail.as_view()),
    path("users/<int:pk>", UserInfoDetail.as_view())
]