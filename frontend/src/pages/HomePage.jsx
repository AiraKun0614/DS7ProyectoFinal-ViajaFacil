import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

function HomePage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('/api/destinations/')
      .then(response => setDestinations(response.data))
      .catch(error => console.error('Error fetching destinations:', error));
  }, []);

  return (
    <div>
      <NavBar />
      <main className="container">
        <div className="text-center mb-8">
          <h1 className="text-4xl">Explora Destinos</h1>
          <p className="mt-2 text-lg text-gray-600">Descubre los mejores lugares para tu próxima aventura</p>
        </div>
        {destinations.length === 0 ? (
          <p className="text-center text-gray-500">No hay destinos disponibles. ¡Agrega algunos en el panel de administración!</p>
        ) : (
          <div className="grid">
            {destinations.map(destination => (
              <div key={destination.id} className="card">
                <img
                  src={destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                  alt={destination.name}
                  style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <h2 className="text-xl truncate">{destination.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{destination.category?.name || 'Sin categoría'}</p>
                  {destination.weather.length > 0 && (
                    <div className="weather-info mt-3">
                      <p className="text-sm" style={{ color: '#2ECC71' }}>
                        Clima: {destination.weather[0].temperature}°C, {destination.weather[0].condition}
                      </p>
                    </div>
                  )}
                  <Link
                    to={`/destination/${destination.id}`}
                    className="btn-primary mt-4"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;