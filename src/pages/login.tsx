import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/usuarios/login', { nombre, contrasena }, { withCredentials: true });
      navigate('/Clientes'); // o la página protegida
    } catch (error) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Usuario" required />
        <input type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
