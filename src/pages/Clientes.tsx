import axios from 'axios';

import { useState, useEffect } from 'react';
import { getClientes} from '../api/api';
import type { Cliente } from '../api/api';

const API_URL = 'https://sistemawebpro.com/api';
const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    id: 0,
    nombre: '',
    telefono: '',
    correo: '',
    activo: true,
    Fecha_de_alta:'',
  });

  // Cargar clientes desde la API al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      console.log("Datos obtenidos de la API:", data); // 👀 Verifica qué llega
      setClientes(data);
      setLoading(false);
    };
    fetchClientes();
  }, []);

  // Manejar envío de formulario para crear cliente
 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault(); // 👈 Previene el envío automático del formulario
  
  try {
    const response = await axios.post(`${API_URL}/clientes`, nuevoCliente, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("Cliente creado:", response.data); // 👀 Depuración

    if (response.data) {
      setClientes([...clientes, response.data]);
      setShowModalClienteN(false);
      setNuevoCliente({ id: 0, nombre: '', telefono: '', correo: '',activo: true,Fecha_de_alta:'' });
    }
  } catch (error) {
    console.error('Error al crear cliente:', error);
  }
};

//actualizar estado
const handleToggle = async (id: number, currentState: boolean) => {
  try {
    const newState = !currentState; // Alternar el estado
    const response = await axios.put(`${API_URL}/clientes/${id}`, { activo: newState });

    if (response.status === 200) {
      console.log(`Estado actualizado a: ${newState ? "Activo" : "Inactivo"}`);

      // Usar una función dentro de `setClientes` para asegurarse de trabajar con el estado más reciente
      setClientes(prevClientes =>
        prevClientes.map(cliente =>
          cliente.id === id ? { ...cliente, activo: newState } : cliente
        )
      );
    } else {
      console.error("Error al actualizar el estado");
    }
  } catch (error) {
    console.error("Error en la petición:", error);
  }
};



  return (
    <div className="divprincipal">
      <h2 className="text-center mt-5">Listado de Clientes</h2>
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
            <thead className="thead-dark">
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
              {Array.isArray(clientes) && clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.Fecha_de_alta}</td>
                <td>10</td>
                <td>{cliente.activo ? 'Activo' : 'Inactivo'}</td>
               <td>
                <div className="form-check form-switch">
                  <input   className="form-check-input"   type="checkbox"   id={`switch-${cliente.id}`}   checked={cliente.activo}  onChange={() => handleToggle(cliente.id, cliente.activo)}  />
                  <label className="form-check-label" htmlFor={`switch-${cliente.id}`}></label>
                </div>
                </td>
                <td>
                  <button className="btn btn-warning mx-2">Editar</button>
                  <button className="btn btn-danger mx-2">Detalles</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar nuevo cliente */}
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
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre" value={nuevoCliente.nombre}
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="telefono" value={nuevoCliente.telefono}
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <input type="email" className="form-control" name="correo" value={nuevoCliente.correo}
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })} required />
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
