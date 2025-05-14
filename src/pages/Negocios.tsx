import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



interface Negocio {
  idnegocio: number;
  nombre_comercial: string;
  descripcion: string;
  telefono: string;
  fecha_de_alta: string;
  activo: boolean;
  portada: string;
  imagenes: string[];
  Estado: string;
  Municipio: string;
  id_categoria: number;
  id_subcategoria: number;
  categoria?: string;
  subcategoria?: string;
}

const Negocios = () => {

  const API_URL = 'https://sistemawebpro.com';
  const [busqueda, setBusqueda] = useState<string>('');
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<Negocio[]>([]);


  const navigate = useNavigate();
  // Obtener los negocios desde el backend
useEffect(() => {
  const fetchNegocios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/negocios`);
      console.log('Respuesta de negocios:', response.data);
      const data = response.data;

      if (Array.isArray(data)) {
        setNegocios(data);
      } else {
        console.error('La respuesta no es un arreglo:', data);
        setNegocios([]);
      }

    } catch (error) {
      console.error('Error al obtener negocios:', error);
    }
  };

  fetchNegocios();
}, []);


  // Filtrar por nombre al escribir
  useEffect(() => {
    if (busqueda.trim() !== '') {
      const filtrados = negocios.filter(n =>
        n.nombre_comercial.toLowerCase().includes(busqueda.toLowerCase())
      );
      setNegociosFiltrados(filtrados);
    } else {
      setNegociosFiltrados(negocios);
    }
  }, [busqueda, negocios]);

  // Redirigir a nuevo negocio
  const handleClick = () => {
    navigate('/nuevonegocio');
  };

  return (
    <div className="container-fluid mt-5">
      <div className="div-custom">
        <h2 className="titulo">Listado de Negocios</h2>

        {/* Botón para registrar nuevo negocio */}
        <button className="btn btn-primary position-fixed bottom-0 end-0 m-5" onClick={handleClick} style={{ zIndex: 1050 }}>
          Nuevo negocio
        </button>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-12 col-md-4 mb-3">
            <input className="form-control fs-5"  type="search"  placeholder="Buscar negocio por nombre" aria-label="Buscar"  value={busqueda}  onChange={(e) => setBusqueda(e.target.value)}  />
          </div>
        </div>
        {/* Cards */}
        <div className="row">
          {(negociosFiltrados.length > 0 ? negociosFiltrados : negocios).map(negocio => (
            <div key={negocio.idnegocio} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3" style={{ margin: 20 }}>
              <div className="card-portada h-100">
              <img src={ negocio.portada ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}` : 'default-image.jpg' } className="card-img-top rounded-4" alt="Negocio"/>
               <div className="card-body">
                  <h5 className="card-title">{negocio.nombre_comercial }</h5>
                  <button className="btn btn-primary d-block mx-auto"onClick={() => navigate(`/negocio/${negocio.idnegocio}`)}> Ver más</button>
                </div>
              </div>
            </div>
          ))}
          {negocios.length === 0 && (
            <p className="text-center">No hay negocios registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Negocios;

