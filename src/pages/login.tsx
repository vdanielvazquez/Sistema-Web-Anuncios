import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/login.css';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { setUsuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        'https://sistemawebpro.com/api/usuarios/login',
        { nombre, contrasena },
        { withCredentials: true }
      );

      setUsuario({ nombre });
      navigate('/');
    } catch (error) {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="page-login">
      <div className="container">
          <div className="heading">Iniciar Sesión</div>
          <form onSubmit={handleLogin}  className="form">
            <input  type="text"  className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} required  autoFocus/>
            <input type="password" className="input" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required/>
            <button type="submit" className="btn login-button">Ingresar</button>
          </form>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </div> 
    </div>
  );
};

export default Login;
