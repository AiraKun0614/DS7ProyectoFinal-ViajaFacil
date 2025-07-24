import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavBar() {
  const [firstName, setFirstName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedFirstName = localStorage.getItem('first_name');
    if (token && storedFirstName) {
      setFirstName(storedFirstName);
    } else if (token) {
      axios.get('/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setFirstName(response.data.first_name);
          localStorage.setItem('first_name', response.data.first_name);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('first_name');
          setFirstName(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('first_name');
    setFirstName(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="nav-logo">ViajaFacil</Link>
        <nav className="nav-links">
          {firstName ? (
            <>
              <span className="text-white text-sm" style={{ marginRight: '16px' }}>
                Hola {firstName}!
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