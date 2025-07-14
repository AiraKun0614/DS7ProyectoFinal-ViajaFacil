from django.contrib import admin
from .models import Category, Destination, WeatherInfo, UserProfile, Favorite, SearchHistory

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at',)

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'latitude', 'longitude', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('category', 'created_at')
    fields = ('name', 'description', 'latitude', 'longitude', 'category', 'image')

@admin.register(WeatherInfo)
class WeatherInfoAdmin(admin.ModelAdmin):
    list_display = ('destination', 'temperature', 'condition', 'date', 'updated_at')
    search_fields = ('destination__name', 'condition')
    list_filter = ('date', 'condition')
    readonly_fields = ('updated_at',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username', 'bio')

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'destination', 'added_at')
    search_fields = ('user__username', 'destination__name')
    list_filter = ('added_at',)

@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'destination', 'search_date')
    search_fields = ('user__username', 'destination__name')
    list_filter = ('search_date',)