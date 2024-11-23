from django.urls import path

from .views import (
    MovieInfoList,
    MovieInfoDetail,
    ReviewList,
    ReviewDetail,
    UserInfoDetail,
    MovieSearchView,  # Import the new search view
)

urlpatterns = [
    path("movies", MovieInfoList.as_view()),
    path("movies/<uuid:pk>", MovieInfoDetail.as_view()),
    path("movies/<uuid:pk>/reviews", ReviewList.as_view()),
    path("movies/<uuid:movie_id>/reviews/<uuid:pk>", ReviewDetail.as_view()),
    path("users/<int:pk>", UserInfoDetail.as_view()),
    path("movies/search", MovieSearchView.as_view(), name="movie-search"),  # Add search endpoint
]
