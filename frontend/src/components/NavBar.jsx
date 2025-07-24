import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavBar() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUsername(storedUsername);
    } else if (token) {
      axios.get('/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUsername(response.data.username);
          localStorage.setItem('username', response.data.username);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('username');
          setUsername(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="nav-logo">ViajaFacil</Link>
        <nav className="nav-links">
          {username ? (
            <>
              <span className="text-white text-sm" style={{ marginRight: '16px' }}>
                Hola {username}!
              </span>
              <button
                onClick={handleLogout}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Registrarse
              </Link>
              <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
                Iniciar Sesión
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;