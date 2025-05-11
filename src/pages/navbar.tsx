import React from 'react';
import { Link } from 'react-router-dom'; // Para navegación interna

// Componente Navbar
const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Mi Aplicación</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/negocios">Negocios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ajustes">Ajustes</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
