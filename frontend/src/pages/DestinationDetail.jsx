import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/destinations/${id}/`)
      .then(response => setDestination(response.data))
      .catch(error => console.error('Error fetching destination:', error));
  }, [id]);

  if (!destination) return <div className="container mx-auto p-4">Cargando...</div>;

  const center = {
    lat: destination.latitude,
    lng: destination.longitude,
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{destination.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={destination.image || 'https://via.placeholder.com/400'}
            alt={destination.name}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <p className="text-gray-600">{destination.description}</p>
          <p className="text-gray-500 mt-2">Categoría: {destination.category?.name || 'Sin categoría'}</p>
          {destination.weather.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Clima Actual</h2>
              <p>Temperatura: {destination.weather[0].temperature}°C</p>
              <p>Condición: {destination.weather[0].condition}</p>
              <p>Humedad: {destination.weather[0].humidity}%</p>
              <p>Velocidad del viento: {destination.weather[0].wind_speed} m/s</p>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
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
  );
}

export default DestinationDetail;