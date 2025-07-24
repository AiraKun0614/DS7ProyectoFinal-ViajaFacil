import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NavBar from '../components/NavBar';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    axios.get(`/api/destinations/${id}/`)
      .then(response => setDestination(response.data))
      .catch(error => console.error('Error fetching destination:', error));

    if (token) {
      axios.get('/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const isFav = response.data.some(fav => fav.destination.id === parseInt(id));
          setIsFavorite(isFav);
        })
        .catch(error => console.error('Error fetching favorites:', error));
    }
  }, [id, token]);

  const handleToggleFavorite = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        const favorite = await axios.get('/api/favorites/', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.data.find(fav => fav.destination.id === parseInt(id)));
        await axios.delete(`/api/favorites/${favorite.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post('/api/favorites/', { destination_id: id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!destination) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <p className="text-muted fs-4">Cargando...</p>
      </div>
    );
  }

  const center = {
    lat: destination.latitude,
    lng: destination.longitude,
  };

  return (
    <div>
      <NavBar />
      <main className="container py-4">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card h-100">
              <img
                src={destination.image || 'https://via.placeholder.com/400?text=Sin+Imagen'}
                alt={destination.name}
                className="card-img-top"
                style={{ height: '256px', objectFit: 'cover' }}
              />
              <div className="card-body position-relative">
                <svg
                  className={`favorite-star ${isFavorite ? 'filled' : ''}`}
                  onClick={handleToggleFavorite}
                  style={{ position: 'absolute', top: '16px', right: '16px' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <h1 className="card-title">{destination.name}</h1>
                <p className="card-text">{destination.description}</p>
                <p className="card-text text-muted">Categoría: {destination.category?.name || 'Sin categoría'}</p>
                {destination.weather.length > 0 && (
                  <div className="weather-info mt-3">
                    <h2 className="h5 text-success">Clima Actual</h2>
                    <p>Temperatura: {destination.weather[0].temperature}°C</p>
                    <p>Condición: {destination.weather[0].condition}</p>
                    <p>Humedad: {destination.weather[0].humidity}%</p>
                    <p>Velocidad del viento: {destination.weather[0].wind_speed} m/s</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title h5">Ubicación</h2>
                <LoadScript googleMapsApiKey="AIzaSyB3653Nw0EzJT0TMhQ5eRz3HHJYPx3gbj8">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={10}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DestinationDetail;
