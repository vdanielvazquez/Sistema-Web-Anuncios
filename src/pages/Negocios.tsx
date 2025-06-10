import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import noimagen from "../assets/no-img.avif";
import negociototal from "../assets/negocios-total.png";
import negocioactivo from "../assets/negocios-activo.png";
import negocioinactivo from "../assets/negocios-inactivos.png";

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

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<Negocio[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const negociosPorPagina = 8;

  const navigate = useNavigate();
//
  const [formData, setFormData] = useState({
  idestado: '',
  idmunicipio: '',
});

const [estados, setEstados] = useState<Estado[]>([]);
const [municipios, setMunicipios] = useState<Municipio[]>([]);
//
useEffect(() => {
  axios.get(`${API_URL}/api/ubicacion/estados`)
  
    .then(res => {
      console.log("Estados recibidos:", res.data);  
      setEstados(res.data);
    })
    .catch(err => console.error('Error al obtener estados:', err));
}, []);
useEffect(() => {
  if (formData.idestado) {
    axios.get(`${API_URL}/api/ubicacion/municipios/${formData.idestado}`)
      .then(res => setMunicipios(res.data))
      .catch(err => console.error('Error al obtener municipios:', err));
  } else {
    setMunicipios([]);
    setFormData(prev => ({ ...prev, idmunicipio: '' }));
  }
}, [formData.idestado]);

//
interface Estado {
  id: string;
  nombre: string;
}

interface Municipio {
  id: string;
  nombre: string;
}




////////////////////////


  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/negocios`);
        console.log("Negocios recibidos:", response.data);
        setNegocios(response.data);
        setNegociosFiltrados(response.data);
      } catch (error) {
        console.error('Error al obtener negocios:', error);
      }
    };

    fetchNegocios();
  }, []);

  const handleBuscar = () => {
    if (terminoBusqueda.trim() !== '') {
      const filtrados = negocios.filter(n =>
        n.nombre_comercial.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setNegociosFiltrados(filtrados);
      setPaginaActual(1);
    } else {
      setNegociosFiltrados(negocios);
    }
  };

  const totalNegocios = negocios.length;
  const negociosActivos = negocios.filter(n => n.activo).length;
  const negociosInactivos = totalNegocios - negociosActivos;

  const [mostrarActivos, setMostrarActivos] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(true);


  const cardsData = [
    { img: negociototal, title: totalNegocios.toString(), description: "Total de Negocios" },
    { img: negocioactivo, title: negociosActivos.toString(), description: "Negocios Activos" },
    { img: negocioinactivo, title: negociosInactivos.toString(), description: "Negocios Inactivos" },
  ];

  const totalPaginas = Math.ceil(negociosFiltrados.length / negociosPorPagina);
  const indexInicio = (paginaActual - 1) * negociosPorPagina;
  const indexFin = indexInicio + negociosPorPagina;
  const negociosPaginados = negociosFiltrados.slice(indexInicio, indexFin);


/**
 * 
 * 
useEffect(() => {
  let filtrados = negocios;

  if (terminoBusqueda.trim() !== '') {
    filtrados = filtrados.filter(n =>
      n.nombre_comercial.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
  }

  if (mostrarActivos && !mostrarInactivos) {
    filtrados = filtrados.filter(n => n.activo);
  } else if (!mostrarActivos && mostrarInactivos) {
    filtrados = filtrados.filter(n => !n.activo);
  } else if (mostrarActivos && mostrarInactivos) {
  
  }

  setNegociosFiltrados(filtrados);
  setPaginaActual(1); // Reiniciar a la primera página
}, [terminoBusqueda, mostrarActivos, mostrarInactivos, negocios]);

 * 
 */


useEffect(() => {
  let filtrados = negocios;

  if (terminoBusqueda.trim() !== '') {
    filtrados = filtrados.filter(n =>
      n.nombre_comercial.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
  }

  if (!mostrarTodos) {
  if (mostrarActivos) {
    filtrados = filtrados.filter(n => n.activo);
  } else if (mostrarInactivos) {
    filtrados = filtrados.filter(n => !n.activo);
  }
}


  if (formData.idestado) {
    filtrados = filtrados.filter(n => n.Estado === estados.find(e => e.id === formData.idestado)?.nombre);
  }

  if (formData.idmunicipio) {
    filtrados = filtrados.filter(n => n.Municipio === municipios.find(m => m.id === formData.idmunicipio)?.nombre);
  }

  setNegociosFiltrados(filtrados);
  setPaginaActual(1);
}, [
  terminoBusqueda,
  mostrarActivos,
  mostrarInactivos,
  mostrarTodos,
  formData,
  estados,
  municipios,
  negocios,
]);


  return (
    <div className="divprincipal">
      <div className="div-custom">
        <h2 className="text-center mt-5">Listado de Negocios</h2>

        <div className="container mt-4">
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-3 g-3">
            {cardsData.map((card, index) => (
              <div className="col" key={index}>
                <div className="card d-flex flex-row align-items-center p-3 mb-3">
                  <img src={card.img} alt={card.title} className="img-fluid rounded-start" width="100" />
                  <div className="ms-3 text-center">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary position-fixed bottom-0 end-0 m-5"
          onClick={() => navigate('/nuevonegocio')}
          style={{ zIndex: 1050 }}
        >
          Nuevo negocio
        </button>

        <div className="row mb-4 mt-4 px-3 align-items-end">
  {/* Input de búsqueda */}
  <div className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
    <input
      className="form-control fs-5"
      type="search"
      placeholder="Buscar negocio por nombre"
      aria-label="Buscar"
      value={terminoBusqueda}
      onChange={(e) => setTerminoBusqueda(e.target.value)}
    />
  </div>

  {/* Botón buscar */}
  <div className="col-xl-2 col-md-3 col-sm-6 col-12 mb-3">
    <button className="btn btn-success w-100 fs-5" onClick={handleBuscar}>
      Buscar
    </button>
  </div>

  {/* Select Estado */}
  <div className="col-xl-2 col-md-3 col-sm-6 col-12 mb-3">
<select
  className="form-select"
  id="idestado"
  name="idestado"
  value={formData.idestado}
  onChange={(e) => setFormData(prev => ({
    ...prev,
    idestado: e.target.value,
    idmunicipio: '', // Reiniciar municipio
  }))}
>
  <option value="">Estado</option>
  {estados.map((estado: any) => (
    <option key={estado.id} value={estado.id}>{estado.nombre}</option>
  ))}
</select>
  </div>

  {/* Select Municipio */}
  <div className="col-xl-2 col-md-3 col-sm-6 col-12 mb-3">
   <select
  className="form-select"
  id="idmunicipio"
  name="idmunicipio"
  value={formData.idmunicipio}
  onChange={(e) => setFormData(prev => ({
    ...prev,
    idmunicipio: e.target.value
  }))}
  disabled={!formData.idestado}
>
  <option value="">Municipio</option>
  {municipios.map((mun: any) => (
    <option key={mun.id} value={mun.id}>{mun.nombre}</option>
  ))}
</select>
  </div>

  {/* Checkboxes de estado */}
 <div className="col-xl-3 col-md-6 col-12 mb-3 d-flex gap-4 flex-wrap align-items-center">
  <div className="form-check form-switch fs-5">
     <input
    className="form-check-input"
    type="checkbox"
    id="checkActivos"
    checked={mostrarActivos}
    onChange={() => {
      setMostrarActivos(true);
      setMostrarInactivos(false);
      setMostrarTodos(false);
    }}
  />
    <label className="form-check-label" htmlFor="checkActivos">
      Solo activos
    </label>
  </div>

  <div className="form-check form-switch fs-5">
   <input
    className="form-check-input"
    type="checkbox"
    id="checkInactivos"
    checked={mostrarInactivos}
    onChange={() => {
      setMostrarActivos(false);
      setMostrarInactivos(true);
      setMostrarTodos(false);
    }}
  />
    <label className="form-check-label" htmlFor="checkInactivos">
      Solo inactivos
    </label>
  </div>


  <div className="form-check form-switch fs-5">
   <input
  className="form-check-input"
  type="checkbox"
  id="checkTodos"
  checked={mostrarTodos}
  onChange={() => {
    setMostrarActivos(false);
    setMostrarInactivos(false);
    setMostrarTodos(true);
  }}
/>
    <label className="form-check-label" htmlFor="checkInactivos">
      todos
    </label>
  </div>
</div>

</div>

       



        {/* Tarjetas de negocios */}
        <div className="row">
          {negociosPaginados.map(negocio => (
            <div key={negocio.idnegocio} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card-portada h-100 text-center">
                <img
                  src={negocio.portada && negocio.portada.trim() !== ''
                    ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}`
                    : noimagen}
                  style={{ width: '90%', height: '250px', objectFit: 'cover' }}
                  className="card-img-top rounded-4"
                  alt="Negocio"
                />
                <div className="card-body">
                  <h5 className="card-title">{negocio.nombre_comercial}</h5>
                  <button
                    className="btn btn-primary d-block mx-auto"
                    onClick={() => navigate(`/DatosNegocio/${negocio.idnegocio}`)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li key={i + 1} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        )}

        {negociosFiltrados.length === 0 && (
          <p className="text-center">No hay negocios registrados aún.</p>
        )}
      </div>
    </div>
  );
};

export default Negocios;
