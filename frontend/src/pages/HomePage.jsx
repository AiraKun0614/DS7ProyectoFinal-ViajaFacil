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
    axios.get('/api/destinations/')
      .then(response => {
        setDestinations(response.data);
        setFilteredDestinations(response.data);
      })
      .catch(error => console.error('Error fetching destinations:', error));

    if (token) {
      axios.get('/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setFavorites(response.data.map(fav => fav.destination.id)))
        .catch(error => console.error('Error fetching favorites:', error));
    }
  }, [token]);

  useEffect(() => {
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
      <main className="container py-4">
        <div className="text-center mb-5">
          <h1 className="display-4">Explora Destinos</h1>
          <p className="lead text-muted">Descubre los mejores lugares para tu próxima aventura</p>
        </div>
        <form onSubmit={handleSearch} className="search-container mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Busca por nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="me-1">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Buscar
            </button>
          </div>
        </form>
        {filteredDestinations.length === 0 ? (
          <p className="text-center text-muted">No se encontraron destinos.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredDestinations.map(destination => (
              <div key={destination.id} className="col">
                <div className="card h-100">
                  <img
                    src={destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                    alt={destination.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body position-relative">
                    <svg
                      className={`favorite-star ${favorites.includes(destination.id) ? 'filled' : ''}`}
                      onClick={() => handleToggleFavorite(destination.id)}
                      style={{ position: 'absolute', top: '16px', right: '16px' }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <h2 className="card-title">{destination.name}</h2>
                    <p className="card-text text-muted">{destination.category?.name || 'Sin categoría'}</p>
                    {destination.weather.length > 0 && (
                      <div className="weather-info mt-3">
                        <p className="text-success mb-0">
                          Clima: {destination.weather[0].temperature}°C, {destination.weather[0].condition}
                        </p>
                      </div>
                    )}
                    <Link
                      to={`/destination/${destination.id}`}
                      className="btn btn-primary mt-3"
                    >
                      Ver Detalles
                    </Link>
                  </div>
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