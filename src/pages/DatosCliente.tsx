import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Cliente {
  idcliente: number;
  nombre: string;
  correo: string;
  telefono: string;
}

interface Negocio {
  idnegocio: number;
  nombre_comercial: string;
  telefono: string;
  portada: string; 
}

const DatosCliente = () => {

  
    const API_URL = 'https://sistemawebpro.com';

  
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
                <h5 className="card-title">{cliente.nombre}</h5>
                <p className="card-text"><strong>Teléfono: </strong> {cliente.telefono}</p>
                <p className="card-text"><strong>Email: </strong> {cliente.correo}</p>
                <a className="btn btn-primary">Editar</a>
                </div>
            </div>
            </div>
        </div>

        <h3 className="text-center mt-5">Negocios de {cliente.nombre}</h3>
        <div className="row">
            {negocios.length > 0 ? (
            negocios.map((negocio) => (
                <div key={negocio.idnegocio} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                <div className="card">
                    <img src={  negocio.portada  ? `${API_URL}/${negocio.idnegocio}/${negocio.portada}`  : 'default-image.jpg'  // Si no tiene portada, muestra una imagen por defecto
                    } className="card-img-top"  alt="Negocio" />
                    <div className="card-body">
                    <p>Nombre Comercial<h3>{negocio.nombre_comercial}</h3></p>
                    <p>Estatuss<h3>{negocio.telefono}</h3></p>
                    <a href={`/negocio/${negocio.idnegocio}`} className="btn btn-primary">Ver más</a>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p className="text-center">Este cliente aún no tiene negocios registrados.</p>
            )}
        </div>
        </div>
    </div>
  );
};

export default DatosCliente;
