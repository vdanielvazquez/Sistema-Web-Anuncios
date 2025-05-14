import { useState, useEffect } from 'react';
import { getClientes, createCliente } from '../api/api';
import type { Cliente } from '../api/api';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    id: 0,
    nombre: '',
    telefono: '',
    correo: '',
  });

  // Cargar clientes desde la API al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
      setLoading(false);
    };
    fetchClientes();
  }, []);

  // Manejar envío de formulario para crear cliente
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clienteCreado = await createCliente(nuevoCliente);
    if (clienteCreado) {
      setClientes([...clientes, clienteCreado]);
      setShowModalClienteN(false);
      setNuevoCliente({ id: 0, nombre: '', telefono: '', correo: '' });
    }
  };

  return (
    <div className="divprincipal">
      <h2 className="text-center my-4">Listado de Clientes</h2>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <button className="btn btn-warning">Editar</button>
                    <button className="btn btn-danger">Eliminar</button>
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
