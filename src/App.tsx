import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../src/pages/navbar';

import Negocios from '../src/pages/Negocios';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Navbar se coloca fuera de las rutas para que aparezca en todas las páginas */}
        <Navbar />
        <Routes>
          
          {/* Definimos las rutas dentro de Routes */}
          {/* <Route path="/" element={<Inicio />} /> */}
          
          <Route path="/negocios" element={<Negocios />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
