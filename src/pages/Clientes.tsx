import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/cliente.css';

interface Cliente {
  idcliente: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface FormData {
  nombre: string;
  telefono: string;
  correo: string;
}

const API_URL = 'https://backend-anuncios.onrender.com';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalClienteN, setShowModalClienteN] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    telefono: '',
    correo: '',
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Obtener clientes al cargar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/clientes`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.nombre || !formData.telefono || !formData.correo) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.correo)) {
      setError('El correo electrónico no es válido');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/clientes`, formData);
      console.log('Cliente guardado:', response.data);

      setFormData({ nombre: '', telefono: '', correo: '' });
      setShowModalClienteN(false);
      setClientes([...clientes, response.data]);
      alert('Cliente agregado correctamente');
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Hubo un error al guardar el cliente');
    } finally {
      setLoading(false);
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
              {clientes.map(cliente => (
                <tr key={cliente.idcliente}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.correo}</td>
                  <td>
                    <button className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/cliente/${cliente.idcliente}`)}>
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
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
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalClienteN(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
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
