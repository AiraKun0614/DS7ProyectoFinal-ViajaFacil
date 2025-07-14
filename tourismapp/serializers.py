from rest_framework import serializers
from .models import Category, Destination, WeatherInfo, Favorite, SearchHistory
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class WeatherInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherInfo
        fields = ['temperature', 'condition', 'humidity', 'wind_speed', 'date']

class DestinationSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    weather = WeatherInfoSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Destination
        fields = ['id', 'name', 'description', 'latitude', 'longitude', 'category', 'category_id', 'image', 'weather']

class FavoriteSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='destination', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'destination', 'destination_id', 'added_at']
        read_only_fields = ['user', 'added_at']

class SearchHistorySerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='destination', write_only=True
    )

    class Meta:
        model = SearchHistory
        fields = ['id', 'user', 'destination', 'destination_id', 'search_date']
        read_only_fields = ['user', 'search_date']