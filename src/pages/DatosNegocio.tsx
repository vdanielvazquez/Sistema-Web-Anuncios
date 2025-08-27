import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import noimagen from "../assets/no-img.avif";
import { ModalLogo,ModalPortada, ModalGaleria, ModalEditarImagen,ModalEditarInfoNegocio } from '../pages/ModalesDatosNegocio';
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

  
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [suscripciones, setSuscripciones] = useState<any[]>([]);


  interface Subcategoria {
  idsubcategoria: number;
  descripcion: string;
}

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
////

const eliminarNegocio = async () => {
  if (!window.confirm('¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer.')) return;

  try {
    await axios.delete(`${API_URL}/api/negocios/${id}`);
    alert('Negocio eliminado correctamente');
    // Aquí podrías redirigir a otra página, por ejemplo al listado de negocios
    window.location.href = '/negocios'; // Cambia esta ruta según tu app
  } catch (error) {
    console.error('Error al eliminar negocio:', error);
    alert('Error al eliminar el negocio');
  }
};
////

////
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
          setSubcategorias(response.data.data);// Establecer las subcategorías
        })
        .catch(error => {
          if (error.response) {
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
    await axios.post(`${API_URL}/api/imagenes/imagenes/portada/${id}`, formData, {
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
//subir logo
const [mostrarModalLogo, setMostrarModalLogo] = useState(false);
const [archivoLogo, setArchivoLogo] = useState<File | null>(null);

const subirLogo = async () => {
  if (!id || !archivoLogo) return;

  const formData = new FormData();
  formData.append('logo', archivoLogo);

  try {
    await axios.post(`${API_URL}/api/imagenes/imagenes/logo/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Logo actualizado correctamente');
    
    setMostrarModalLogo(false);
    fetchNegocio(); // Recargar datos del negocio actualizado
  } catch (error) {
    console.error('Error al subir logo:', error);
    alert('Error al subir logo');
  }
};


//subir galeria
const subirGaleria = async () => {
  if (!id || galeria.length === 0) return;
  const formData = new FormData();
  galeria.forEach((file) => formData.append('galeria', file));

  try {
    await axios.post(`${API_URL}/api/imagenes/galeria/${id}`, formData, {
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
    await axios.delete(`${API_URL}/api/imagenes/galeria/${id}/${filename}`);
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
    await axios.put(`${API_URL}/api/imagenes/galeria/${id}/${imagenAEditar}`, formData, {
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
       setShowModalEditar(false);
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };


//
  useEffect(() => {
  if (negocio?.categoria) {
    axios.get(`${API_URL}/api/subcategorias/categoria/${negocio.categoria}`)
      .then(response => {
        setSubcategorias(response.data.data);
      })
      .catch(error => {
        console.error("Error al cargar subcategorías:", error);
      });
  }
}, [negocio]);
///7
const toggleActivo = async () => {
  try {
    const respuesta = await axios.put(`${API_URL}/api/negocios/${negocio.idnegocio}/activo`, {
      activo: !negocio.activo,
    });
    setNegocio(respuesta.data.cliente); // Actualiza el estado local
  } catch (error) {
    console.error('Error al cambiar estado activo:', error);
  }
};

const togglePatrocinado = async () => {
  try {
    const respuesta = await axios.put(`${API_URL}/api/negocios/${negocio.idnegocio}/patrocinado`, {
      patrocinado: !negocio.patrocinado,
    });
    setNegocio(respuesta.data.cliente); // Actualiza el estado local
  } catch (error) {
    console.error('Error al cambiar estado patrocinado:', error);
  }
};

//

useEffect(() => {
  const fetchSuscripciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/suscripciones`);
      setSuscripciones(response.data); // aquí asumo que tu API devuelve un array
    } catch (error) {
      console.error('Error al obtener suscripciones:', error);
    }
  };

  fetchSuscripciones();
}, []);


const handleUpdateSuscripcion = async (idsuscripcion: number) => {
  try {
    console.log('Enviando suscripción:', idsuscripcion);
    const response = await axios.put(`${API_URL}/api/negocios/${negocio.id}/suscripcion`, {
      idsuscripcion
    });

    setNegocio(response.data.negocio); // actualiza estado con la respuesta del backend
    alert('Suscripción actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la suscripción:', error);
    alert('Ocurrió un error al actualizar la suscripción');
  }
};

//
  if (!negocio) return <p>Cargando...</p>;
//
const hasValidPosition = negocio.latitud !== undefined && negocio.latitud !== null &&
                         negocio.longitud !== undefined && negocio.longitud !== null &&
                         !isNaN(Number(negocio.latitud)) && !isNaN(Number(negocio.longitud));

const position: [number, number] = hasValidPosition
  ? [Number(negocio.latitud), Number(negocio.longitud)]
  : [0, 0];
//mapa

  return (
    <div className="divprincipal">
      <div className="container">
        <h2 className="text-center mt-5">Detalles del Negocio</h2>
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




        <div className="row">
 {/* Información del negocio */}
<div className="col-12 col-md-6">
  <div
    className="card shadow"
    style={{
      height: '80%',
      padding: '20px',
      margin: '15px',
      fontSize: '1.4rem'
    }}
  >
    {/* Título centrado */}
    <h2 className="card-title text-center" style={{ fontSize: '1.8rem' }}>
      {negocio.nombre_comercial}
    </h2>

    {/* Cuerpo alineado a la izquierda */}
    <div className="card-body text-start">
      <p><strong>Descripción:</strong> {negocio.descripcion}</p>
      <p><strong>Promoción o Descuento:</strong> {negocio.promocion}</p>
      <p><strong>Condiciones:</strong> {negocio.condicion}</p>

      {negocio.categoria || negocio.subcategoria ? (
        <p>
          <strong>Categoría:</strong>{' '}
          {categorias.find(c => c.idcategoria === negocio.categoria)?.descripcion || 'Sin categoría'}
          <br />
          <strong>Subcategoría:</strong>{' '}
          {subcategorias.find(s => s.idsubcategoria === negocio.subcategoria)?.descripcion || 'Sin subcategoría'}
        </p>
      ) : (
        <p>No tiene categorías asociadas</p>
      )}

      <p><strong>Teléfono:</strong> {negocio.telefono}</p>
      <p><strong>Fecha de alta:</strong> {negocio.fecha_de_alta ? new Date(negocio.fecha_de_alta).toLocaleDateString() : 'No disponible'}</p>
     <p>
  <strong>Estado:</strong>{' '}
  <span className={negocio.activo ? 'text-success' : 'text-danger'}>
    {negocio.activo ? 'Activo' : 'Inactivo'}
  </span>
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      checked={negocio.activo}
      onChange={toggleActivo}
    />
  </div>
</p>

<p>
  <strong>Patrocinado:</strong>{' '}
  <span className={negocio.patrocinado ? 'text-success' : 'text-danger'}>
    {negocio.patrocinado ? 'Sí' : 'No'}
  </span>
  <div className="form-check form-switch">
    <input
      className="form-check-input"
      type="checkbox"
      checked={negocio.patrocinado}
      onChange={togglePatrocinado}
    />
  </div>
</p>
<p>
  <strong>Suscripción:</strong>{' '}
  <span className="text-primary">
    {negocio.suscripcion ? negocio.suscripcion : 'Sin suscripción'}
  </span>

  <select
    className="form-select mt-2"
    value={negocio.suscripcion || ''}
    onChange={(e) => handleUpdateSuscripcion(Number(e.target.value))}
  >
    <option value="">-- Seleccionar suscripción --</option>
    {suscripciones.map((s) => (
      <option key={s.idsuscripcion} value={s.idsuscripcion}>
        {s.descripcion} - ${s.precio}
      </option>
    ))}
  </select>
</p>


    </div>

    <div className="card-footer text-center">
      <button className="btn btn-primary mb-3" onClick={() => setShowModalInfoNegocio(true)}>
        Editar Información
      </button>
      <button className="btn btn-danger mb-3 ms-3" onClick={eliminarNegocio}>
        Eliminar Negocio
      </button>
    </div>
  </div>
</div>


  {/* Mapa */}
        <div className="col-12 col-md-6">
  <div className="shadow rounded-4" style={{ height: '350px', width: '100%', margin: '15px 0', overflow: 'hidden' }}>
    {hasValidPosition ? (
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            {negocio.nombre_comercial || 'Negocio'}<br />
            {negocio.estado}, {negocio.municipio}
          </Popup>
        </Marker>
      </MapContainer>
    ) : (
      <p className="text-center pt-5">No hay coordenadas disponibles para mostrar el mapa</p>
    )}
  </div>
 {/* Etiquetas debajo del mapa */}
  <div className="text-center mt-3">
    <div className="row">
      
    </div>
  </div>
<div className="shadow-lg rounded-4 bg-white p-3 mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
  <div className="text-center mb-3">
    <h5 className="fw-bold text-primary">Logo del Negocio</h5>
  </div>
  <div className="d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
    <img
      src={
        negocio.logo && negocio.logo.trim() !== ''
          ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.logo}`
          : noimagen
      }
      alt="Logo del negocio"
      className="img-fluid rounded-circle shadow"
      style={{
        width: '200px',
        height: '200px',
        objectFit: 'cover',
        border: '4px solid #0d6efd',
        backgroundColor: '#f8f9fa'
      }}
    />
  </div>
  <div className="text-center mt-4">
    <button className="btn btn-outline-primary px-4" onClick={() => setMostrarModalLogo(true)}>
      <i className="bi bi-pencil-square me-2"></i>Editar Logo
    </button>
  </div>
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
         <img src={`${API_URL}/uploads/${negocio.idnegocio}/${img}`}  alt={`Galería ${index + 1}`}  className="gallery-image shadow rounded-4"  style={{ width: '100%', height: '200px', objectFit: 'cover',margin: '15px' }}/>
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
          setSubcategorias={setSubcategorias}
          onSubmit={handleUpdate}
        />
        <ModalLogo
  show={mostrarModalLogo}
  onClose={() => setMostrarModalLogo(false)}
  onFileChange={setArchivoLogo}
  onSubmit={subirLogo}
/>

      </div>
    </div>
  );
};

export default DatosNegocio;



