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
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del cliente
        const clienteRes = await axios.get(`${API_URL}/api/clientes/${id}`);
        setCliente(clienteRes.data);

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
                <a className="btn btn-primary">Editar</a>
                </div>
            </div>
            </div>
        </div>

        <h2 className="text-center mt-5">Negocios de {cliente.nombre}</h2>
        <div className="row">
            {negocios.length > 0 ? (
            negocios.map((negocio) => (
                <div key={negocio.idnegocio} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card">
                    <img  src={negocio.portada && negocio.portada.trim() !== ''  ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}`: noimagen}className="card-img-top rounded-4" alt="Negocio"/>
            
                    <div className="card-body">
                    <p>Nombre Comercial<h3>{negocio.nombre_comercial}</h3></p>
                    <p>Estado<h3>{negocio.activo  ? 'Activo' : 'Inactivo'}</h3></p>
                    <Link to={`/DatosNegocio/${negocio.idnegocio}`} className="btn btn-primary">Ver más</Link>
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
              <form >
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo Cliente</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalClienteEdit(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cliente.nombre}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cliente.telefono}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      className="form-control"
                      value={cliente.correo}
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
