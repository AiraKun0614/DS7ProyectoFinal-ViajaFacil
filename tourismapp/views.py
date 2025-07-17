from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Category, Destination, WeatherInfo, Favorite, SearchHistory
from .serializers import CategorySerializer, DestinationSerializer, WeatherInfoSerializer, FavoriteSerializer, SearchHistorySerializer
from .utils import fetch_weather_data

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]  # Solo admins pueden modificar categorías

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [AllowAny]  # Usuarios autenticados pueden ver destinos

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        fetch_weather_data(instance)  # Actualiza datos climáticos al recuperar un destino
        return super().retrieve(request, *args, **kwargs)

class WeatherInfoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WeatherInfo.objects.all()
    serializer_class = WeatherInfoSerializer
    permission_classes = [IsAuthenticated]

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SearchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = SearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)