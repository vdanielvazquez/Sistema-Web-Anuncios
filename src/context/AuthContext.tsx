// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get('https://sistemawebpro.com/api/usuarios/check-session', {
      withCredentials: true,
    })
      .then(res => setUsuario(res.data.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
