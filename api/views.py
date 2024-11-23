from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import permissions, viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from djoser.serializers import UserSerializer  # Ensure this import is included

from api.models import CustomUser, MovieInfo, Review
from api.serializers import MovieInfoSerializer, ReviewSerializer


class MovieInfoList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = MovieInfo.objects.all()
    serializer_class = MovieInfoSerializer


class MovieInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = MovieInfoSerializer

    def get_object(self, queryset=None):
        return MovieInfo.objects.get(pk=self.kwargs['pk'])
    

class UserInfoDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UserSerializer  # Now properly imported

    def get_object(self, queryset=None):
        return CustomUser.objects.get(pk=self.kwargs['pk'])


class ReviewList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ReviewSerializer

    def get_queryset(self):
        movie_id = self.kwargs['pk']
        return Review.objects.filter(movie=movie_id)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_object(self, queryset=None):
        return Review.objects.get(pk=self.kwargs['pk'])


class MovieSearchView(APIView):
    """
    View to handle movie search queries.
    """
    def get(self, request):
        query = request.query_params.get('q', '')  # Get the query string parameter
        if query:
            results = MovieInfo.objects.filter(media_title__icontains=query)  # Case-insensitive search
            print(f"Search query: {query}")  # Debugging log
            print(f"Results: {results}")  # Debugging log
            serializer = MovieInfoSerializer(results, many=True)
            print(f"Serialized data: {serializer.data}")  # Debugging log
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "No search query provided."}, status=status.HTTP_400_BAD_REQUEST)
