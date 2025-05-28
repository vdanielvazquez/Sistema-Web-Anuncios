import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/css/App.css';
import Navbar from '../src/pages/navbar';

import Clientes from './pages/Clientes';
import Negocios from './pages/Negocios';
import NuevoNegocio from './pages/NuevoNegocio';
import Ajustes from './pages/Ajustes';
import DatosCliente from './pages/DatosCliente';
import DatosNegocio from './pages/DatosNegocio';

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
          <Route path="/clientes" element={<Clientes />} />
          <Route path='/Negocios' element={<Negocios/>}/>
          <Route path='/NuevoNegocio' element={<NuevoNegocio/>}/>
          <Route path='/Ajustes' element={<Ajustes/>}/>
          <Route path="/DatosCliente/:id" element={<DatosCliente />} />
          <Route path="/DatosNegocio/:id" element={<DatosNegocio />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
