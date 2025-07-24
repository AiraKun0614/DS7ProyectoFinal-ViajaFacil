import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getCookie } from '../utils/csrf';

function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    // Cargar destinos
    axios.get('/api/destinations/')
      .then(response => {
        setDestinations(response.data);
        setFilteredDestinations(response.data);
      })
      .catch(error => console.error('Error fetching destinations:', error));

    // Cargar favoritos si está autenticado
    if (token) {
      axios.get('/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setFavorites(response.data.map(fav => fav.destination.id)))
        .catch(error => console.error('Error fetching favorites:', error));
    }
  }, [token]);

  useEffect(() => {
    // Filtrar destinos según la búsqueda
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = destinations.filter(destination =>
      destination.name.toLowerCase().includes(lowerQuery) ||
      (destination.category_name && destination.category_name.toLowerCase().includes(lowerQuery))
    );
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() && token) {
      try {
        const csrftoken = getCookie('csrftoken');
        await axios.post('/api/search-history/', { query: searchQuery }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRFToken': csrftoken,
          },
        });
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  };

  const handleToggleFavorite = async (destinationId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    const isFavorite = favorites.includes(destinationId);
    try {
      if (isFavorite) {
        const favorite = await axios.get('/api/favorites/', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.data.find(fav => fav.destination.id === destinationId));
        await axios.delete(`/api/favorites/${favorite.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter(id => id !== destinationId));
      } else {
        const response = await axios.post('/api/favorites/', { destination_id: destinationId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites([...favorites, response.data.destination.id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <main className="container">
        <div className="text-center mb-8">
          <h1 className="text-4xl">Explora Destinos</h1>
          <p className="mt-2 text-lg text-gray-600">Descubre los mejores lugares para tu próxima aventura</p>
        </div>
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Busca por nombre o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Buscar</button>
        </form>
        {filteredDestinations.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron destinos.</p>
        ) : (
          <div className="grid">
            {filteredDestinations.map(destination => (
              <div key={destination.id} className="card">
                <img
                  src={destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                  alt={destination.name}
                  style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px', position: 'relative' }}>
                  <span
                    className={`favorite-star ${favorites.includes(destination.id) ? 'filled' : ''}`}
                    onClick={() => handleToggleFavorite(destination.id)}
                    style={{ position: 'absolute', top: '16px', right: '16px' }}
                  >
                    ★
                  </span>
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