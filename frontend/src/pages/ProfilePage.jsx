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

    // Cargar favoritos
    axios.get('/api/favorites/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setFavorites(response.data))
      .catch(error => console.error('Error fetching favorites:', error));

    // Cargar historial de búsqueda
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
      <main className="container">
        <h1 className="text-3xl text-center mb-8">Mi Perfil</h1>
        <div className="mb-12">
          <h2 className="text-2xl mb-4">Destinos Favoritos</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500">No tienes destinos favoritos.</p>
          ) : (
            <div className="grid">
              {favorites.map(fav => (
                <div key={fav.id} className="card">
                  <img
                    src={fav.destination.image || 'https://via.placeholder.com/300?text=Sin+Imagen'}
                    alt={fav.destination.name}
                    style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px' }}>
                    <h3 className="text-xl truncate">{fav.destination.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{fav.destination.category?.name || 'Sin categoría'}</p>
                    <div className="mt-4 flex gap-4">
                      <Link
                        to={`/destination/${fav.destination.id}`}
                        className="btn-primary"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="btn-primary"
                        style={{ backgroundColor: '#EF4444', padding: '8px 16px' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl">Historial de Búsqueda</h2>
            {searchHistory.length > 0 && (
              <button
                onClick={handleClearSearchHistory}
                className="btn-primary"
                style={{ backgroundColor: '#EF4444', padding: '8px 16px' }}
              >
                Limpiar Historial
              </button>
            )}
          </div>
          {searchHistory.length === 0 ? (
            <p className="text-gray-500">No tienes búsquedas recientes.</p>
          ) : (
            <ul className="space-y-2">
              {searchHistory.map(history => (
                <li key={history.id} className="card p-4 flex justify-between items-center">
                  <p className="text-gray-600">{history.query}</p>
                  <p className="text-sm text-gray-400">{new Date(history.created_at).toLocaleString()}</p>
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