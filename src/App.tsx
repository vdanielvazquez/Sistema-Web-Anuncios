import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/css/App.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Navbar from './pages/navbar';
import Login from './pages/Login';

import Clientes from './pages/Clientes';
import Negocios from './pages/Negocios';
import NuevoNegocio from './pages/NuevoNegocio';
import Ajustes from './pages/Ajustes';
import DatosCliente from './pages/DatosCliente';
import DatosNegocio from './pages/DatosNegocio';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Clientes />} />
                      <Route path="/clientes" element={<Clientes />} />
                      <Route path="/Negocios" element={<Negocios />} />
                      <Route path="/NuevoNegocio" element={<NuevoNegocio />} />
                      <Route path="/Ajustes" element={<Ajustes />} />
                      <Route path="/DatosCliente/:id" element={<DatosCliente />} />
                      <Route path="/DatosNegocio/:id" element={<DatosNegocio />} />
                    </Routes>
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
