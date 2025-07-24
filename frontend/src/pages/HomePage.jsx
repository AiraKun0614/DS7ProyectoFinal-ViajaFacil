import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('/api/destinations/')
      .then(response => setDestinations(response.data))
      .catch(error => console.error('Error fetching destinations:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-100">
      <header className="bg-blue-500 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors duration-200">
            ViajaFacil
          </Link>
          <nav className="flex space-x-4">
            <Link to="/register" className="btn-primary px-3 py-2 text-sm">
              Registrarse
            </Link>
            <Link to="/login" className="btn-primary px-3 py-2 text-sm">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Explora Destinos</h1>
          <p className="mt-2 text-lg text-gray-600">Descubre los mejores lugares para tu próxima aventura</p>
        </div>
        {destinations.length === 0 ? (
          <p className="text-center text-gray-500">No hay destinos disponibles. ¡Agrega algunos en el panel de administración!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(destination => (
              <div key={destination.id} className="card overflow-hidden">
                <img
                  src={destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold truncate">{destination.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">{destination.category?.name || 'Sin categoría'}</p>
                  {destination.weather.length > 0 && (
                    <div className="weather-info mt-3">
                      <p className="text-green-700 text-sm">
                        Clima: {destination.weather[0].temperature}°C, {destination.weather[0].condition}
                      </p>
                    </div>
                  )}
                  <Link
                    to={`/destination/${destination.id}`}
                    className="btn-primary mt-4 inline-block text-center"
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