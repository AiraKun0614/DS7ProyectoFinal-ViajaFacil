import requests
from django.utils import timezone
from .models import Destination, WeatherInfo

def fetch_weather_data(destination):
    api_key = '11adc0d5c1f70794edfc4cb1e0950d81'
    url = f'http://api.openweathermap.org/data/2.5/weather?lat={destination.latitude}&lon={destination.longitude}&appid={api_key}&units=metric'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        weather_info = WeatherInfo(
            destination=destination,
            temperature=data['main']['temp'],
            condition=data['weather'][0]['description'],
            humidity=data['main']['humidity'],
            wind_speed=data['wind']['speed'],
            date=timezone.now()
        )
        weather_info.save()
        return weather_info
    except requests.RequestException as e:
        print(f"Error fetching weather data for {destination.name}: {e}")
        return None