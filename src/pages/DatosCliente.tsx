import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import noimagen from "../assets/no-img.avif";
interface Cliente {
  idcliente: number;
  nombre: string;
  correo: string;
  telefono: string;
   activo: boolean;
}

interface Negocio {
  idnegocio: number;
  nombre_comercial: string;
  telefono: string;
  portada: string; 
   activo: boolean;
}

const DatosCliente = () => {

  
  const API_URL = 'https://sistemawebpro.com';

  const [showModalClienteEdit, setShowModalClienteEdit] = useState(false);

  const { id } = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del cliente
        const clienteRes = await axios.get(`${API_URL}/api/clientes/${id}`);
        setCliente(clienteRes.data);
        setNombre(clienteRes.data.nombre);
        setTelefono(clienteRes.data.telefono);
        setCorreo(clienteRes.data.correo);

        // Obtener negocios del cliente
        const negociosRes = await axios.get(`${API_URL}/api/negocios/negocios/${id}`);
        setNegocios(negociosRes.data);
      } catch (error) {
        console.error('Error al obtener datos del cliente o sus negocios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center">Cargando...</p>;

  if (!cliente) return <p className="text-center">Cliente no encontrado.</p>;

  const handleUpdateCliente = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await axios.put(`${API_URL}/api/clientes/${id}`, {
      nombre,
      correo,
      telefono
    });

    // Actualiza el estado del cliente
    setCliente((prev) => prev ? { ...prev, nombre, correo, telefono } : null);

    setShowModalClienteEdit(false);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    alert('Hubo un error al actualizar el cliente.');
  }
};


  // Mostrar la portada de los negocios
  return (
    <div className="divprincipal">
        <div className="container">
        <h2 className="text-center mt-5">Datos del Cliente</h2>
        <div className="row">
            <div className="col-md-4">
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">{cliente.nombre}</h4>
                <p className="card-text"><strong>Teléfono: </strong> {cliente.telefono}</p>
                <p className="card-text"><strong>Email: </strong> {cliente.correo}</p>
                <p className="card-text"><strong>Estado: </strong> {cliente.activo  ? 'Activo' : 'Inactivo'}</p>
                <button className="btn btn-primary" onClick={() => setShowModalClienteEdit(true)}>Editar</button>
                </div>
            </div>
            </div>
        </div>

        <h2 className="text-center mt-5">Negocios de {cliente.nombre}</h2>
       <div className="row">
  {negocios.length > 0 ? (
    negocios.map((negocio) => (
      <div key={negocio.idnegocio} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
        <div className="card h-100 shadow-sm">
          <div className="card-img-container" style={{ height: '200px', overflow: 'hidden' }}>
            <img
              src={
                negocio.portada && negocio.portada.trim() !== ''
                  ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}`
                  : noimagen
              }
              className="card-img-top rounded-0"
              alt="Negocio"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="card-body text-center">
            <p className="mb-1"><strong>Nombre Comercial</strong></p>
            <h5 className="card-title">{negocio.nombre_comercial}</h5>
            <p className="mb-1"><strong>Estado</strong></p>
          <h6 className={`text-muted ${negocio.activo ? 'text-success' : 'text-danger'}`}> {negocio.activo ? 'Activo' : 'Inactivo'}</h6>
            <Link to={`/DatosNegocio/${negocio.idnegocio}`} className="btn btn-primary mt-2">
              Ver más
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center">Este cliente aún no tiene negocios registrados.</p>
  )}
</div>

        </div>

        {showModalClienteEdit && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateCliente}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalClienteEdit(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
  type="text"
  className="form-control"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  required
/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
  type="text"
  className="form-control"
  value={telefono}
  onChange={(e) => setTelefono(e.target.value)}
  required
/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                   <input
  type="email"
  className="form-control"
  value={correo}
  onChange={(e) => setCorreo(e.target.value)}
  required
/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalClienteEdit(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatosCliente;
