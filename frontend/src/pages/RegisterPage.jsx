import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    username: '',
    email: '',
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
      await axios.post('/api/register/', formData);
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Verifica los datos e intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card form-container">
          <h1 className="text-3xl text-center mb-6">Registrarse</h1>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" htmlFor="first_name">Nombre</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
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
            <div className="mb-4">
              <label className="form-label" htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
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
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Registrarse</button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#1E90FF', textDecoration: 'underline' }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;