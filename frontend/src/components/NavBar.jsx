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
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ViajaFacil</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {firstName ? (
              <li className="nav-item d-flex align-items-center">
                <Link className="nav-link" to="/profile">
                  <svg className="me-2" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Hola {firstName}!
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-primary btn-sm ms-3"
                >
                  Cerrar Sesión
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm me-2" to="/register">
                    Registrarse
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm" to="/login">
                    Iniciar Sesión
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;