import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/destinations/')
      .then(response => setDestinations(response.data))
      .catch(error => console.error('Error fetching destinations:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ViajaFacil - Explora Destinos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map(destination => (
          <div key={destination.id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={destination.image || 'https://via.placeholder.com/300'}
              alt={destination.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{destination.name}</h2>
            <p className="text-gray-600">{destination.category?.name || 'Sin categoría'}</p>
            {destination.weather.length > 0 && (
              <p className="text-gray-500">
                Clima: {destination.weather[0].temperature}°C, {destination.weather[0].condition}
              </p>
            )}
            <Link
              to={`/destination/${destination.id}`}
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Ver Detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;