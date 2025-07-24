import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { getCookie } from '../utils/csrf';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await axios.post('/api/login/', formData, {
        headers: {
          'X-CSRFToken': csrftoken,
        },
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', response.data.username);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card form-container">
          <h1 className="text-3xl text-center mb-6">Iniciar Sesión</h1>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="mb-6">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Iniciar Sesión</button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            ¿No tienes cuenta? <Link to="/register" style={{ color: '#1E90FF', textDecoration: 'underline' }}>Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;