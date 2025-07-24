import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

function ProfilePage() {
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/favorites/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setFavorites(response.data))
      .catch(error => console.error('Error fetching favorites:', error));

    axios.get('/api/search-history/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setSearchHistory(response.data))
      .catch(error => console.error('Error fetching search history:', error));
  }, [token, navigate]);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`/api/favorites/${favoriteId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleClearSearchHistory = async () => {
    try {
      await axios.delete('/api/search-history/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <main className="container py-4">
        <h1 className="display-5 text-center mb-5">Mi Perfil</h1>
        <div className="profile-section mb-5">
          <h2 className="h4 mb-4">Destinos Favoritos</h2>
          {favorites.length === 0 ? (
            <p className="text-muted">No tienes destinos favoritos.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {favorites.map(fav => (
                <div key={fav.id} className="col">
                  <div className="card h-100">
                    <img
                      src={fav.destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                      alt={fav.destination.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h3 className="card-title">{fav.destination.name}</h3>
                      <p className="card-text text-muted">{fav.destination.category?.name || 'Sin categoría'}</p>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/destination/${fav.destination.id}`}
                          className="btn btn-primary"
                        >
                          Ver Detalles
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(fav.id)}
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="profile-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4">Historial de Búsqueda</h2>
            {searchHistory.length > 0 && (
              <button
                onClick={handleClearSearchHistory}
                className="btn btn-danger"
              >
                Limpiar Historial
              </button>
            )}
          </div>
          {searchHistory.length === 0 ? (
            <p className="text-muted">No tienes búsquedas recientes.</p>
          ) : (
            <ul className="list-group">
              {searchHistory.map(history => (
                <li key={history.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{history.query}</span>
                  <span className="text-muted small">{new Date(history.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;