import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NavBar from '../components/NavBar';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    axios.get(`/api/destinations/${id}/`)
      .then(response => setDestination(response.data))
      .catch(error => console.error('Error fetching destination:', error));
  }, [id]);

  if (!destination) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-gray-500 text-lg">Cargando...</p>
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
      <main className="container">
        <div className="grid">
          <div className="card">
            <img
              src={destination.image || 'https://via.placeholder.com/400?text=Sin+Imagen'}
              alt={destination.name}
              style={{ width: '100%', height: '256px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            />
            <div style={{ padding: '24px' }}>
              <p className="text-base mb-4" style={{ color: '#4B5563' }}>{destination.description}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>Categoría: {destination.category?.name || 'Sin categoría'}</p>
              {destination.weather.length > 0 && (
                <div className="weather-info mt-4">
                  <h2 className="text-lg mb-2" style={{ color: '#2ECC71' }}>Clima Actual</h2>
                  <p style={{ color: '#1F2937' }}>Temperatura: {destination.weather[0].temperature}°C</p>
                  <p style={{ color: '#1F2937' }}>Condición: {destination.weather[0].condition}</p>
                  <p style={{ color: '#1F2937' }}>Humedad: {destination.weather[0].humidity}%</p>
                  <p style={{ color: '#1F2937' }}>Velocidad del viento: {destination.weather[0].wind_speed} m/s</p>
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <h2 className="text-lg mb-4">Ubicación</h2>
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
      </main>
    </div>
  );
}

export default DestinationDetail;

