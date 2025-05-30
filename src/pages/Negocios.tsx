import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import noimagen from "../assets/no-img.avif";
import usuarioTotal from "../assets/usuario-total.png";
import usuarioActivo from "../assets/usuario-activo.png";
import usuarioInactivo from "../assets/usuario-inactivo.png";

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

  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/negocios`);
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

  const totalClientes = negocios.length;
  const clientesActivos = negocios.filter(n => n.activo).length;
  const clientesInactivos = totalClientes - clientesActivos;

  const cardsData = [
    { img: usuarioTotal, title: totalClientes.toString(), description: "Total de Negocios" },
    { img: usuarioActivo, title: clientesActivos.toString(), description: "Negocios Activos" },
    { img: usuarioInactivo, title: clientesInactivos.toString(), description: "Negocios Inactivos" },
  ];

  const totalPaginas = Math.ceil(negociosFiltrados.length / negociosPorPagina);
  const indexInicio = (paginaActual - 1) * negociosPorPagina;
  const indexFin = indexInicio + negociosPorPagina;
  const negociosPaginados = negociosFiltrados.slice(indexInicio, indexFin);

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

        {/* Filtro de búsqueda */}
        <div className="row mb-4 mt-4 px-3">
          <div className="col-12 col-md-4 mb-3">
            <input
              className="form-control fs-5"
              type="search"
              placeholder="Buscar negocio por nombre"
              aria-label="Buscar"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-2 mb-3">
            <button className="btn btn-success w-100 fs-5" onClick={handleBuscar}>
              Buscar
            </button>
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
