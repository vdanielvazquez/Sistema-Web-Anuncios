import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/css/App.css';
import Navbar from '../src/pages/navbar';

import Negocios from '../src/pages/Negocios';
import Clientes from './pages/Clientes';
import ClienteNuevo from './pages/clientenuevo';
import NuevoNegocio from './pages/nuevonegocio';
import DatosCliente from './pages/datoscliente';    
import DatosNegocio from './pages/datosnegocio';
import Ajustes from './pages/ajustes';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Navbar se coloca fuera de las rutas para que aparezca en todas las páginas */}
        <Navbar />
        <Routes>
          
          {/* Definimos las rutas dentro de Routes */}
          {/* <Route path="/" element={<Inicio />} /> */}
          <Route path="/" element={<Clientes />} />
          <Route path="/negocios" element={<Negocios />} />
          <Route path="/negocios" element={<Negocios />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientenuevo" element={<ClienteNuevo />} />
          <Route path="/nuevonegocio" element={<NuevoNegocio />} />
          <Route path="/cliente/:id" element={<DatosCliente />} />
          <Route path="/datosnegocio/:idcliente" element={<DatosNegocio />} />
          <Route path="/negocio/:id" element={<DatosNegocio />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
