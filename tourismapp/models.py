from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.name

class Destination(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='destinations')
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Destino"
        verbose_name_plural = "Destinos"

    def __str__(self):
        return self.name

class WeatherInfo(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='weather')
    temperature = models.FloatField()
    condition = models.CharField(max_length=100)
    humidity = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    wind_speed = models.FloatField()
    date = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Información Climática"
        verbose_name_plural = "Informaciones Climáticas"

    def __str__(self):
        return f"{self.destination.name} - {self.date.strftime('%Y-%m-%d')}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuario"

    def __str__(self):
        return self.user.username

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='favorited_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Favorito"
        verbose_name_plural = "Favoritos"
        unique_together = ('user', 'destination')

    def __str__(self):
        return f"{self.user.username} - {self.destination.name}"

class SearchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_history')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='searches')
    search_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Historial de Búsqueda"
        verbose_name_plural = "Historial de Búsquedas"

    def __str__(self):
        return f"{self.user.username} - {self.destination.name} - {self.search_date.strftime('%Y-%m-%d %H:%M')}"