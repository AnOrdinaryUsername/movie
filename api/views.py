from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.authentication import get_authorization_header
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from djoser.serializers import UserSerializer  # Ensure this import is included

from api.models import CustomUser, MovieInfo, Review
from api.serializers import MovieInfoSerializer, ReviewSerializer


User = get_user_model()


class MovieInfoList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = MovieInfo.objects.all()
    serializer_class = MovieInfoSerializer


class MovieInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = MovieInfoSerializer

    def get_object(self, queryset=None):
        return MovieInfo.objects.get(pk=self.kwargs["pk"])


class UserInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer  # Now properly imported

    def get_object(self, queryset=None):
        return CustomUser.objects.get(pk=self.kwargs["pk"])


class ReviewList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        movie_id = self.kwargs["pk"]
        return Review.objects.filter(movie=movie_id)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_object(self, queryset=None):
        return Review.objects.get(pk=self.kwargs["pk"])


class MovieSearchView(APIView):
    permission_classes = [AllowAny]
    """
    View to handle movie search queries.
    """

    def get(self, request):
        query = request.query_params.get("q", "")  # Get the query string parameter
        if query:
            results = MovieInfo.objects.filter(
                media_title__icontains=query
            )  # Case-insensitive search
            print(f"Search query: {query}")  # Debugging log
            print(f"Results: {results}")  # Debugging log
            serializer = MovieInfoSerializer(results, many=True)
            print(f"Serialized data: {serializer.data}")  # Debugging log
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"error": "No search query provided."}, status=status.HTTP_400_BAD_REQUEST
        )


class UserFavoriteList(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @swagger_auto_schema(responses={200: MovieInfoSerializer(many=True)})
    def get(self, request, pk):
        user = get_object_or_404(User, id=pk)
        favorites = user.favorites.all()
        serializer = MovieInfoSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['movie_id'],
            properties={
                'movie_id': openapi.Schema(type=openapi.FORMAT_UUID),
            }
        ),
        responses={
            201: openapi.Response(
                description="CREATED",
                examples={
                    "application/json": {
                    'message': 'Movie added to favorites'
                    }
                }
            ),
            400: openapi.Response(
                description="BAD REQUEST",
                examples={
                    "application/json": {
                    "error": "movie_id is required"
                    }
                }
            ),
            401: openapi.Response(
                description="UNAUTHORIZED",
                examples={
                    "application/json": {
                    "error": "Invalid token"
                    }
                }
            ),
            404: openapi.Response(
                description="NOT FOUND",
                examples={
                    "application/json": {
                    "detail": "No CustomUser matches the given query."
                    }
                }
            ),
            
            409: openapi.Response(
                description="CONFLICT",
                examples={
                    "application/json": {
                    "error": "Movie already in favorites"
                    }
                }
            ),
        }
    )
    def post(self, request, pk):
        # Get token from Authorization header
        auth = get_authorization_header(request).split()[1].decode()
        # Get user based on token provided
        auth_user = Token.objects.get(key=auth).user

        user = get_object_or_404(User, id=pk)

        # Check if user pk matches the token user
        if auth_user != user:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        movie_id = request.data.get("movie_id")

        if not movie_id:
            return Response(
                {"error": "movie_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        movie = get_object_or_404(MovieInfo, id=movie_id)

        if movie in user.favorites.all():
            return Response(
                {"error": "Movie already in favorites"},
                status=status.HTTP_409_CONFLICT,
            )

        user.favorites.add(movie)
        return Response(
            {"message": "Movie added to favorites"}, status=status.HTTP_201_CREATED
        )

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['movie_id'],
            properties={
                'movie_id': openapi.Schema(type=openapi.FORMAT_UUID),
            }
        ),
        responses={
            204: openapi.Response(
                description="NO CONTENT",
                examples={
                    "application/json": {
                    'message': 'Movie removed from favorites'
                    }
                }
            ),
            400: openapi.Response(
                description="BAD REQUEST",
                examples={
                    "application/json": {
                    "error": "movie_id is required"
                    }
                }
            ),
            401: openapi.Response(
                description="UNAUTHORIZED",
                examples={
                    "application/json": {
                    "error": "Invalid token"
                    }
                }
            ),
            404: openapi.Response(
                description="NOT FOUND",
                examples={
                    "application/json": {
                    "error": "Movie not in favorites"
                    }
                }
            ),
        }
    )
    def delete(self, request, pk):
        # Get token from Authorization header
        auth = get_authorization_header(request).split()[1].decode()
        # Get user based on token provided
        auth_user = Token.objects.get(key=auth).user

        user = get_object_or_404(User, id=pk)

        # Check if user pk matches the token user
        if auth_user != user:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        movie_id = request.data.get("movie_id")

        if not movie_id:
            return Response(
                {"error": "movie_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        movie = get_object_or_404(MovieInfo, id=movie_id)

        if movie in user.favorites.all():
            user.favorites.remove(movie)
            return Response(
                {"message": "Movie removed from favorites"},
                status=status.HTTP_204_NO_CONTENT,
            )
        else:
            return Response(
                {"error": "Movie not in favorites"}, status=status.HTTP_404_NOT_FOUND
            )
