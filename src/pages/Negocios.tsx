import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import noimagen from "../assets/no-img.avif";
import negociototal from "../assets/negocios-total.png";
import negocioactivo from "../assets/negocios-activo.png";
import negocioinactivo from "../assets/negocios-inactivos.png";

// Interfaces
interface Negocio {
  idnegocio: number;
  nombre_comercial: string;
  descripcion: string;
  telefono: string;
  fecha_de_alta: string;
  activo: boolean;
  portada: string;
  imagenes: string[];
  idestado: number;
  idmunicipio: number;
  id_categoria: number;
  id_subcategoria: number;
  categoria?: string;
  subcategoria?: string;
}

interface Estado {
  idestado: number;
  estado: string;
}

interface Municipio {
  idmunicipio: number;
  municipio: string;
}

const Negocios = () => {
  const API_URL = 'https://sistemawebpro.com';
  const navigate = useNavigate();

  // Estados
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negociosFiltrados, setNegociosFiltrados] = useState<Negocio[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const negociosPorPagina = 8;

  const [formData, setFormData] = useState({
    idestado: '',
    idmunicipio: '',
  });
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const [mostrarActivos, setMostrarActivos] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(true);

  // Estadísticas
  const totalNegocios = negocios.length;
  const negociosActivos = negocios.filter(n => n.activo).length;
  const negociosInactivos = totalNegocios - negociosActivos;

  const cardsData = [
    { img: negociototal, title: totalNegocios.toString(), description: "Total de Negocios" },
    { img: negocioactivo, title: negociosActivos.toString(), description: "Negocios Activos" },
    { img: negocioinactivo, title: negociosInactivos.toString(), description: "Negocios Inactivos" },
  ];

  // Paginación
  const totalPaginas = Math.ceil(negociosFiltrados.length / negociosPorPagina);
  const indexInicio = (paginaActual - 1) * negociosPorPagina;
  const indexFin = indexInicio + negociosPorPagina;
  const negociosPaginados = negociosFiltrados.slice(indexInicio, indexFin);

  // Obtener estados
  useEffect(() => {
    axios.get(`${API_URL}/api/ubicacion/estados`)
      .then(res => setEstados(res.data))
      .catch(err => console.error('Error al obtener estados:', err));
  }, []);

  // Obtener municipios cuando cambia el estado
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

  // Obtener negocios
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/negocios`);
        setNegocios(res.data);
        setNegociosFiltrados(res.data);
      } catch (error) {
        console.error('Error al obtener negocios:', error);
      }
    };
    fetchNegocios();
  }, []);

  // Filtrar negocios
  useEffect(() => {
    let filtrados = negocios;

    if (terminoBusqueda.trim() !== '') {
      filtrados = filtrados.filter(n =>
        n.nombre_comercial.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    if (!mostrarTodos) {
      filtrados = mostrarActivos
        ? filtrados.filter(n => n.activo)
        : filtrados.filter(n => !n.activo);
    }

    if (formData.idestado) {
      filtrados = filtrados.filter(n => n.idestado === Number(formData.idestado));
    }

    if (formData.idmunicipio) {
      filtrados = filtrados.filter(n => n.idmunicipio === Number(formData.idmunicipio));
    }

    setNegociosFiltrados(filtrados);
    setPaginaActual(1);
  }, [terminoBusqueda, mostrarActivos, mostrarInactivos, mostrarTodos, formData, negocios]);

  // Función de búsqueda
  const handleBuscar = () => {
    if (terminoBusqueda.trim() === '') {
      setNegociosFiltrados(negocios);
    } else {
      const filtrados = negocios.filter(n =>
        n.nombre_comercial.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setNegociosFiltrados(filtrados);
    }
    setPaginaActual(1);
  };

  // Render
  return (
    <div className="divprincipal">
      <div className="div-custom">
        <h2 className="text-center mt-5">Listado de Negocios</h2>

        {/* Estadísticas */}
        <div className="container mt-4">
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {cardsData.map((card, index) => (
              <div className="col" key={index}>
                <div className="card d-flex flex-row align-items-center p-3 mb-3">
                  <img src={card.img} alt={card.title} width="100" />
                  <div className="flex-fill text-center">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón nuevo negocio */}
        <button
          className="btn btn-primary position-fixed bottom-0 end-0 m-5"
          onClick={() => navigate('/nuevonegocio')}
          style={{ zIndex: 1050 }}
        >
          Nuevo negocio
        </button>

        {/* Filtros */}
        <div className="row mb-4 mt-4 px-3 align-items-end">
          <div className="col-xl-3 mb-3">
            <input
              className="form-control fs-5"
              type="search"
              placeholder="Buscar negocio por nombre"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          <div className="col-xl-2 mb-3">
            <button className="btn btn-success w-100 fs-5" onClick={handleBuscar}>
              Buscar
            </button>
          </div>

          <div className="col-xl-2 mb-3">
            <select
              className="form-select"
              value={formData.idestado}
              onChange={(e) =>
                setFormData({ ...formData, idestado: e.target.value, idmunicipio: '' })
              }
            >
              <option value="">Estado</option>
              {estados.map(estado => (
                <option key={estado.idestado} value={estado.idestado}>{estado.estado}</option>
              ))}
            </select>
          </div>

          <div className="col-xl-2 mb-3">
            <select
              className="form-select"
              value={formData.idmunicipio}
              onChange={(e) =>
                setFormData({ ...formData, idmunicipio: e.target.value })
              }
              disabled={!formData.idestado}
            >
              <option value="">Municipio</option>
              {municipios.map(m => (
                <option key={m.idmunicipio} value={m.idmunicipio}>{m.municipio}</option>
              ))}
            </select>
          </div>

          {/* Filtros de estado */}
          <div className="col-xl-3 d-flex gap-4 flex-wrap align-items-center">
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
              <label className="form-check-label" htmlFor="checkActivos">Solo activos</label>
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
              <label className="form-check-label" htmlFor="checkInactivos">Solo inactivos</label>
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
              <label className="form-check-label" htmlFor="checkTodos">Todos</label>
            </div>
          </div>
        </div>

        {/* Tarjetas de negocios */}
        <div className="row">
          {negociosPaginados.map(n => (
            <div key={n.idnegocio} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div className="card-portada h-100 text-center">
                <img
                  src={
                    n.portada && n.portada.trim() !== ''
                      ? `${API_URL}/uploads/${n.idnegocio}/${n.portada}`
                      : noimagen
                  }
                  className="card-img-top rounded-4 shadow"
                  style={{ width: '90%', height: '250px', objectFit: 'cover' }}
                  alt="Negocio"
                />
                <div className="card-body mt-5">
                  <h5 className="card-title">{n.nombre_comercial}</h5>
                  <button
                    className="btn btn-primary d-block mx-auto"
                    onClick={() => navigate(`/DatosNegocio/${n.idnegocio}`)}
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
