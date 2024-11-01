from django.urls import path

from .views import MovieInfoList, MovieInfoDetail

urlpatterns = [
    path("", MovieInfoList.as_view()),
    path("<uuid:pk>/", MovieInfoList.as_view()),
]