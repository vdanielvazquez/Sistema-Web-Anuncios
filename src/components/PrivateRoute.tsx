// src/components/PrivateRoute.tsx

import { useContext, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { usuario, cargando } = useContext(AuthContext);

  if (cargando) return <div>Cargando...</div>;

  return usuario ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
