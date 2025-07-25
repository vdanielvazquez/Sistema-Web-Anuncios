import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import usuarioTotal from "../assets/usuario-total.png";
import usuarioActivo from "../assets/usuario-activo.png";
import usuarioInactivo from "../assets/usuario-inactivo.png";

interface Cliente {
  idcliente: number;
  nombre: string;
  telefono: string;
  correo: string;
  fecha_de_alta: string;
  activo: boolean;
}
interface Negocio {
  idnegocio: number;
  idcliente: number;
}
const API_URL = 'https://sistemawebpro.com/api';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[] | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });

  const clientesPorPagina = 10;
  const navigate = useNavigate();

  // Carga clientes y negocios juntos para evitar llamadas dobles
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [clientesRes, negociosRes] = await Promise.all([
          axios.get(`${API_URL}/clientes`),
          axios.get(`${API_URL}/negocios`)
        ]);
        console.log('clientesRes.data:', clientesRes.data);
        console.log('negociosRes.data:', negociosRes.data);
        setClientes(clientesRes.data);
        setNegocios(negociosRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);
///
 
const negociosPorCliente = Array.isArray(negocios) 
  ? negocios.reduce<Record<number, number>>((acc, negocio) => {
      acc[negocio.idcliente] = (acc[negocio.idcliente] || 0) + 1;
      return acc;
    }, {}) 
  : {};
  const handleBuscar = () => {
    const texto = busqueda.toLowerCase().trim();
    if (texto === '') {
      setClientesFiltrados(null);
      return;
    }

    const filtrados = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.telefono.toLowerCase().includes(texto) ||
      cliente.correo.toLowerCase().includes(texto)
    );

    setClientesFiltrados(filtrados);
    setPaginaActual(1);
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/clientes`, nuevoCliente, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data) {
        // Recargar datos para reflejar nuevo cliente y negocios
        const [clientesRes, negociosRes] = await Promise.all([
          axios.get(`${API_URL}/clientes`),
          axios.get(`${API_URL}/negocios`)
        ]);
        setClientes(clientesRes.data);
        setNegocios(negociosRes.data);
        setShowModalClienteN(false);
        setNuevoCliente({ nombre: '', telefono: '', correo: '' });
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  const handleToggleActivo = async (id: number, estadoActual: boolean) => {
    try {
      await axios.put(`${API_URL}/clientes/${id}/activo`, {
        activo: !estadoActual,
      });
      // Recargar datos para reflejar cambio de estado
      const [clientesRes, negociosRes] = await Promise.all([
        axios.get(`${API_URL}/clientes`),
        axios.get(`${API_URL}/negocios`)
      ]);
      setClientes(clientesRes.data);
      setNegocios(negociosRes.data);
    } catch (error) {
      console.error('Error al actualizar estado del cliente:', error);
    }
  };

  const abrirDetalles = (id: number) => {
    navigate(`/DatosCliente/${id}`);
  };

  const handleEliminarCliente = async (id: number) => {
  const confirmar = window.confirm('¿Estás seguro de eliminar este cliente?');
  if (!confirmar) return;

  try {
    await axios.delete(`${API_URL}/clientes/${id}`);
    // Recargar datos después de eliminar
    const [clientesRes, negociosRes] = await Promise.all([
      axios.get(`${API_URL}/clientes`),
      axios.get(`${API_URL}/negocios`)
    ]);
    setClientes(clientesRes.data);
    setNegocios(negociosRes.data);
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
  }
};


  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(cliente => cliente.activo).length;
  const clientesInactivos = totalClientes - clientesActivos;

  const cardsData = [
    { img: usuarioTotal, title: totalClientes.toString(), description: "Total de Clientes" },
    { img: usuarioActivo, title: clientesActivos.toString(), description: "Clientes Activos" },
    { img: usuarioInactivo, title: clientesInactivos.toString(), description: "Clientes Inactivos" },
  ];

  const clientesParaMostrar = clientesFiltrados && clientesFiltrados.length > 0
    ? clientesFiltrados
    : clientes;

  const totalPaginas = Math.ceil(clientesParaMostrar.length / clientesPorPagina);
  const indexUltimoCliente = paginaActual * clientesPorPagina;
  const indexPrimerCliente = indexUltimoCliente - clientesPorPagina;
  const clientesPaginados = clientesParaMostrar.slice(indexPrimerCliente, indexUltimoCliente);

  return (
     <div className="div-custom">
        <h2 className="text-center mt-5">Listado de Clientes</h2>
       {/* Tarjetas estilo estadísticas */}
      <div className="container mt-1">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {cardsData.map((card, index) => (
            <div className="col" key={index}>
              <div className="card d-flex flex-row align-items-center p-3 shadow-sm w-100" style={{ maxWidth: '100%' }}>
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


        {/* Barra de búsqueda y botón */}
        <div className="container mt-4">
          <div className="row gy-3 align-items-end">
            <div className="col-md-6 col-lg-8">
              <label className="form-label fw-semibold">
                Buscar cliente por nombre, teléfono o correo
              </label>
              <div className="input-group">
                <input
                  className="form-control fs-5"
                  type="search"
                  placeholder="Buscar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleBuscar}>Buscar</button>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 text-end">
              <button className="btn btn-success fs-5 w-100" onClick={() => setShowModalClienteN(true)}>
                Nuevo cliente
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de clientes */}
        <div className="container mt-4">
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="table-responsive table-container-xl">
              <table className="table table-bordered table-striped">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Fecha de Alta</th>
                    <th>Número de Negocios</th>
                    <th>Estado</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesPaginados.map((cliente) => (
                    <tr key={cliente.idcliente} className="text-center align-middle">
                      <td>{cliente.nombre}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.correo}</td>
                      <td>{new Date(cliente.fecha_de_alta).toLocaleDateString('es-MX')}</td>
                      <td>{negociosPorCliente[cliente.idcliente] || 0}</td>
                      <td  className={cliente.activo ? 'text-success' : 'text-danger'}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" checked={cliente.activo}  onChange={() => handleToggleActivo(cliente.idcliente, cliente.activo)} />
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-info mx-1" onClick={() => abrirDetalles(cliente.idcliente)}>
                          Detalles
                        </button>
                        <button
    className="btn btn-danger mx-1"
    onClick={() => handleEliminarCliente(cliente.idcliente)}
  >
    Eliminar
  </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Modal nuevo cliente */}
        {showModalClienteN && (
          <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">Nuevo Cliente</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModalClienteN(false)} />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoCliente.nombre}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevoCliente.telefono}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo</label>
                      <input
                        type="email"
                        className="form-control"
                        value={nuevoCliente.correo}
                        onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModalClienteN(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Cliente</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
  );
};

export default Clientes;
