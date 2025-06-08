import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import noimagen from "../assets/no-img.avif";
import { ModalPortada, ModalGaleria, ModalEditarImagen,ModalEditarInfoNegocio } from '../pages/ModalesDatosNegocio';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';



const DatosNegocio = () => {
  const API_URL = 'https://sistemawebpro.com';


  const { id } = useParams();
  const [negocio, setNegocio] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [portada, setPortada] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);


  const [imagenAEditar, setImagenAEditar] = useState<string | null>(null);
  const [imagenNueva, setImagenNueva] = useState<File | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
 
  const [showModalPortada, setShowModalPortada] = useState(false);
  const [showModalGaleria, setShowModalGaleria] = useState(false);
  const [showModalInfoNegocio, setShowModalInfoNegocio] = useState(false);


  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState<any[]>([]);


  // Corrige el icono del marcador por defecto en Leaflet + React (problema común)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => {
        console.log(res.data);  // Confirma la estructura
      setCategorias(res.data.data); // Corregido
      })
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);
  
  useEffect(() => {
    if (editForm.id_categoria) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${editForm.id_categoria}`)
        .then(response => {
          console.log("Código de estado:", response.status);
          console.log("Subcategorías:", response.data);
          setSubcategorias(response.data); // Establecer las subcategorías
        })
        .catch(error => {
          if (error.response) {
            console.error("Respuesta de error:", error.response.data);
            console.error("Código de estado:", error.response.status);
          } else if (error.request) {
            console.error("No se recibió respuesta:", error.request);
          } else {
            console.error("Error de configuración:", error.message);
          }
        });
    }
  }, [editForm.id_categoria]); // Este useEffect se dispara cuando el id_categoria cambia
  
    //mostrar img
    const fetchNegocio = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/negocios/imagenes/${id}`);
        setNegocio(response.data);
        setEditForm(response.data);
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
      }
    }; 
    useEffect(() => {
      fetchNegocio();
    }, [id]);
    
 
//


//subir portada
const subirPortada = async () => {
  if (!id || !portada) return;
  const formData = new FormData();
  formData.append('portada', portada);

  try {
    await axios.post(`${API_URL}/api/negocios/imagenes/portada/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Portada subida con éxito');
    
    setShowModalPortada(false);
    fetchNegocio(); // Recargar datos
  } catch (error) {
    console.error('Error al subir portada:', error);
    alert('Error al subir portada');
  }
};
//subir galeria
const subirGaleria = async () => {
  if (!id || galeria.length === 0) return;
  const formData = new FormData();
  galeria.forEach((file) => formData.append('galeria', file));

  try {
    await axios.post(`${API_URL}/api/negocios/imagenes/galeria/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Galería subida con éxito');
    fetchNegocio(); // Recargar datos
  } catch (error) {
    console.error('Error al subir galería:', error);
    alert('Error al subir galería');
  }
};
//eliminar img
const eliminarImagen = async (filename: string) => {
  if (!window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;
  try {
    await axios.delete(`${API_URL}/api/negocios/imagenes/${id}/${filename}`);
    alert('Imagen eliminada correctamente');
    fetchNegocio(); // recarga galería
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    alert('Error al eliminar la imagen');
  }
};
//reemplazar img
const reemplazarImagen = async () => {
  if (!id || !imagenAEditar || !imagenNueva) return;
  const formData = new FormData();
  formData.append('imagen', imagenNueva);

  try {
    await axios.put(`${API_URL}/api/negocios/imagenes/galeria/${id}/${imagenAEditar}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Imagen reemplazada correctamente');
    setShowModalEditar(false);
    fetchNegocio();
  } catch (error) {
    console.error('Error al reemplazar imagen:', error);
    alert('Error al reemplazar imagen');
  }
};
''


//actualizar info
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando datos:', editForm); 
      await axios.put(`${API_URL}/api/negocios/${id}`, editForm);
      setNegocio(editForm); // actualiza la vista con los nuevos datos
      alert('Negocio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };

  if (!negocio) return <p>Cargando...</p>;

const hasValidPosition = negocio.lat !== undefined && negocio.lat !== null
  && negocio.lng !== undefined && negocio.lng !== null
  && !isNaN(Number(negocio.lat)) && !isNaN(Number(negocio.lng));

const position: [number, number] = hasValidPosition
  ? [Number(negocio.lat), Number(negocio.lng)]
  : [0, 0];

  return (
    <div className="divprincipal">
      <div className="container">
        <h2 className="text-center mt-5">Detalles del Negocio</h2>

      <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
        {hasValidPosition ? (
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position} icon={icon}>
              <Popup>
                {negocio.nombre || 'Negocio'} <br /> {negocio.estado}, {negocio.municipio}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>No hay coordenadas disponibles para mostrar el mapa</p>
        )}
</div>


      <div className="row">
                <div className="card h-100 m-3 text-center">
          <div className="card-header">
            <h5 className="mb-0">Portada</h5>
          </div>
          <div className="card-body p-2">
            <img
              src={negocio.portada && negocio.portada.trim() !== '' 
                ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}`
                : noimagen}
              className="img-fluid rounded-4"
              style={{ height: '250px', objectFit: 'cover', width: '100%' }}
              alt="Portada del negocio"
            />
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => setShowModalPortada(true)}>
              Editar Portada
            </button>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-6 col-lg-8 ">
          <div className="card" style={{ height: '350px', padding: '20px',  margin: '15px', textAlign: 'center'}}>
          <h2 className="card-title">{negocio.nombre_comercial}</h2>
            <div className="card-body">
              <p><strong>Descripción:</strong> {negocio.descripcion}</p>
              {negocio.categoria || negocio.subcategoria ? (
                <p>
                    <strong>Categoría:</strong> {negocio.categoria || 'Sin categoría'} <br />
                    <strong>Subcategoría:</strong> {negocio.subcategoria || 'Sin subcategoría'}
                </p>
                ) : (
                <p>No tiene categorías asociadas</p>
                )}

              <p><strong>Telefono:</strong> {negocio.telefono}</p>
              <p><strong>Fecha de alta:</strong> {new Date(negocio.fecha_de_alta).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {negocio.activo ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div className="card-footer">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalInfoNegocio(true)}>
                Editar Informacion
              </button>
            </div>
          </div>
        </div>
       
      </div>
      <div className="gallery">
      <h2 className="text-center mb-4 titulo2">Galería</h2>
      <button className="btn btn-primary mb-3"  onClick={() => setShowModalGaleria(true)}>
              Agregar fotos
            </button>
      <div className="row">
      {negocio.imagenes?.map((img: string, index: number) => {
  const filename = img.split('/').pop(); // extraer el nombre del archivo

  return (
    <div key={index} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
      <div className="card-galeria">
        <div className="card-body">
         <img src={`${API_URL}/uploads/${negocio.idnegocio}/${img}`}  alt={`Galería ${index + 1}`}  className="gallery-image rounded-4"  style={{ width: '100%', height: '200px', objectFit: 'cover',margin: '15px' }}/>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <button className='btn btn-warning me-2'  onClick={() => { setImagenAEditar(filename!); setShowModalEditar(true);}}>Editar</button>
          <button className='btn btn-danger' onClick={() => eliminarImagen(filename!)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
})}

      </div>
      </div>


        {/* Modales */}
        <ModalPortada
          show={showModalPortada}
          onClose={() => setShowModalPortada(false)}
          onUpload={setPortada}
          onSubmit={subirPortada}
        />

        <ModalGaleria
          show={showModalGaleria}
          onClose={() => setShowModalGaleria(false)}
          onUpload={setGaleria}
          onSubmit={subirGaleria}
        />
        {showModalEditar && (
          <ModalEditarImagen
            show={showModalEditar}
            onClose={() => setShowModalEditar(false)}
            onFileChange={setImagenNueva}
            onSubmit={reemplazarImagen}
          /> 
        )}
        <ModalEditarInfoNegocio
          show={showModalInfoNegocio}
          onClose={() => setShowModalInfoNegocio(false)}
          editForm={editForm}
          setEditForm={setEditForm}
          categorias={categorias}
          subcategorias={subcategorias}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
};

export default DatosNegocio;



