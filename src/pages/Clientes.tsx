import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import usuarioTotal from "../assets/usuario-total.png";
import usuarioActivo from "../assets/usuario-activo.png";
import usuarioInactivo from "../assets/usuario-inactivo.png";


const API_URL = 'https://sistemawebpro.com/api';

interface Cliente {
  idcliente: number;
  nombre: string;
  telefono: string;
  correo: string;
  fecha_de_alta: string;
  activo: boolean;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      console.log("Datos obtenidos de la API:", data);
      setClientes(data);
      setLoading(false);
    };
    fetchClientes();
  }, []);

  const getClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  };
const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/clientes`);
      console.log("Datos obtenidos de la API:", response.data);
      setClientes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Datos enviados:", nuevoCliente);
    try {
      const response = await axios.post(`${API_URL}/clientes`, nuevoCliente, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("Cliente creado:", response.data);

      if (response.data) {
        await fetchClientes(); // actualiza la lista desde el backend
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
      fetchClientes(); // actualiza la lista
    } catch (error) {
      console.error('Error al actualizar estado del cliente:', error);
    }
  };

 const navigate = useNavigate();

  const abrirDetalles = (id: number) => {
    navigate(`/DatosCliente/${id}`); // Ajusta la ruta según tu configuración
  };

  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(cliente => cliente.activo).length;
  const clientesInactivos = totalClientes - clientesActivos;

  const cardsData = [
    { img:usuarioTotal, title: clientes.length.toString(), description: "Total de Clientes" },
    { img: usuarioActivo, title:clientesActivos.toString(), description: "Clientes Activos" },
    { img: usuarioInactivo, title: clientesInactivos.toString(), description: "Clientes Inactivos" },
    { img: usuarioTotal, title: "Título 4", description: "Descripción 4" },
  ];

  return (
    <div className="divprincipal">
      <h2 className="text-center mt-5">Listado de Clientes</h2>

      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
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

      <div className="divclientes mx-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input className="form-control w-50 me-3" type="search" placeholder="Buscar" />
          <button className="btn btn-success" onClick={() => setShowModalClienteN(true)}>
            Nuevo cliente
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="thead-dark text-center">
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
              {clientes.map((cliente) => (
                <tr key={cliente.idcliente} className="text-center align-middle">
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correo}</td>
                  <td>{new Date(cliente.fecha_de_alta).toLocaleDateString('es-MX')}</td>
                  <td>0</td> {/* Aquí puedes mostrar los negocios si los tienes */}
                  <td>{cliente.activo ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input  id={`switch-${cliente.idcliente}`}   className="form-check-input"  type="checkbox" checked={cliente.activo} onChange={() => handleToggleActivo(cliente.idcliente, cliente.activo)} />
                      <label className="form-check-label" htmlFor={`switch-${cliente.idcliente}`}></label>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-warning mx-1">Editar</button>
                   <button className="btn btn-info mx-1" onClick={() => abrirDetalles(cliente.idcliente)}> Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
