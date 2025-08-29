import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import noimagen from "../assets/no-img.avif";
import { 
  ModalLogo,
  ModalPortada,
  ModalGaleria,
  ModalEditarImagen,
  ModalEditarInfoNegocio
} from '../pages/ModalesDatosNegocio';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';

// Tipado básico
interface Subcategoria {
  idsubcategoria: number;
  descripcion: string;
}

interface Negocio {
  idnegocio: number;
  nombre_comercial: string;
  descripcion: string;
  promocion?: string;
  condicion?: string;
  categoria?: number;
  subcategoria?: number;
  telefono?: string;
  fecha_de_alta?: string;
  activo?: boolean;
  patrocinado?: boolean;
  suscripcion?: string;
  latitud?: number | string;
  longitud?: number | string;
  portada?: string;
  logo?: string;
  imagenes?: string[];
}

const DatosNegocio: React.FC = () => {
  const API_URL = 'https://sistemawebpro.com';
  const { id } = useParams<{ id: string }>();

  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [editForm, setEditForm] = useState<Partial<Negocio>>({});

  const [portada, setPortada] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [imagenAEditar, setImagenAEditar] = useState<string | null>(null);
  const [imagenNueva, setImagenNueva] = useState<File | null>(null);
  
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [showModalPortada, setShowModalPortada] = useState(false);
  const [showModalGaleria, setShowModalGaleria] = useState(false);
  const [showModalInfoNegocio, setShowModalInfoNegocio] = useState(false);
  const [mostrarModalLogo, setMostrarModalLogo] = useState(false);
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [suscripciones, setSuscripciones] = useState<any[]>([]);

  // Icono de Leaflet
  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Cargar negocio
  const fetchNegocio = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/negocios/imagenes/${id}`);
      setNegocio(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error al obtener el negocio:', error);
    }
  };

  useEffect(() => { fetchNegocio(); }, [id]);

  // Cargar categorías
  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => setCategorias(res.data.data))
      .catch(err => console.error('Error al obtener categorías:', err));
  }, []);

  // Subcategorías cuando cambia categoría
  useEffect(() => {
    const idCat = editForm.categoria || negocio?.categoria;
    if (idCat) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${idCat}`)
        .then(res => setSubcategorias(res.data.data))
        .catch(err => console.error('Error al cargar subcategorías:', err));
    }
  }, [editForm.categoria, negocio?.categoria]);

  // Suscripciones
  useEffect(() => {
    axios.get(`${API_URL}/api/suscripcion`)
      .then(res => setSuscripciones(res.data.data))
      .catch(err => console.error('Error al cargar suscripciones:', err));
  }, []);

  // Validar posición
  const hasValidPosition = negocio?.latitud !== undefined && negocio?.latitud !== null &&
                           negocio?.longitud !== undefined && negocio?.longitud !== null &&
                           !isNaN(Number(negocio.latitud)) && !isNaN(Number(negocio.longitud));

  const position: [number, number] = hasValidPosition
    ? [Number(negocio!.latitud), Number(negocio!.longitud)]
    : [0, 0];

  if (!negocio) return <p>Cargando...</p>;

  // Toggle activo/patrocinado 
  const toggleActivo = async () => {
    try {
      await axios.put(`${API_URL}/api/negocios/${negocio.idnegocio}/activo`, { activo: !negocio.activo });
      setNegocio(prev => prev ? { ...prev, activo: !prev.activo } : prev);
    } catch (err) {
      console.error('Error toggle activo:', err);
    }
  };

  const togglePatrocinado = async () => {
    try {
      await axios.put(`${API_URL}/api/negocios/${negocio.idnegocio}/patrocinado`, { patrocinado: !negocio.patrocinado });
      setNegocio(prev => prev ? { ...prev, patrocinado: !prev.patrocinado } : prev);
    } catch (err) {
      console.error('Error toggle patrocinado:', err);
    }
  };

  // Subir portada
  const subirPortada = async () => {
    if (!portada) return;
    const formData = new FormData();
    formData.append('portada', portada);
    try {
      // Por ejemplo, en React

      await axios.post(`${API_URL}/api/imagenes/portada/${id}/?t=${Date.now()}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModalPortada(false);
      fetchNegocio();
      alert('Portada subida');
    } catch (err) {
      console.error(err); alert('Error al subir portada');
    }
  };
// Subir logo
const subirLogo = async () => {
  if (!archivoLogo) return;
  const formData = new FormData();
  formData.append('logo', archivoLogo);
  try {
    const { data } = await axios.post(`${API_URL}/api/imagenes/logo/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Actualiza el estado con la nueva URL
    setNegocio(prev => prev ? { ...prev, logo: data.logo } : prev);
    setMostrarModalLogo(false);
    alert('Logo actualizado correctamente');
  } catch (err) {
    console.error(err);
    alert('Error al subir logo');
  }
};



  // Subir galería
  const subirGaleria = async () => {
    if (!galeria.length) return;
    const formData = new FormData();
    galeria.forEach(file => formData.append("galeria", file));
    try {
      await axios.post(`${API_URL}/api/imagenes/galeria/${negocio.idnegocio}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e: AxiosProgressEvent) => {
          if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      });
      setShowModalGaleria(false);
      setGaleria([]);
      setUploadProgress(0);
      fetchNegocio();
      alert('Galería subida');
    } catch (err) {
      console.error(err);
      setUploadProgress(0);
      alert('Error al subir galería');
    }
  };

  // Eliminar imagen
  const eliminarImagen = async (filename: string) => {
    if (!window.confirm('¿Eliminar imagen?')) return;
    try {
      await axios.delete(`${API_URL}/api/imagenes/galeria/${id}/${filename}`);
      fetchNegocio();
      alert('Imagen eliminada');
    } catch (err) {
      console.error(err); alert('Error al eliminar');
    }
  };

  // Reemplazar imagen
  const reemplazarImagen = async () => {
    if (!imagenAEditar || !imagenNueva) return;
    const formData = new FormData();
    formData.append('imagen', imagenNueva);
    try {
      await axios.put(`${API_URL}/api/imagenes/galeria/${id}/${imagenAEditar}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModalEditar(false);
      fetchNegocio();
      alert('Imagen reemplazada');
      window.location.reload(); 
    } catch (err) {
      console.error(err); alert('Error al reemplazar imagen');
    }
  };

  // Actualizar info negocio
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/negocios/${id}`, editForm);
      setNegocio(prev => prev ? { ...prev, ...editForm } : prev);
      setShowModalInfoNegocio(false);
      alert('Negocio actualizado');
    } catch (err) {
      console.error(err); alert('Error al actualizar negocio');
    }
  };

  // Actualizar suscripción
  const handleUpdateSuscripcion = async (idsuscripcion: number) => {
    try {
      const resp = await axios.put(`${API_URL}/api/negocios/${negocio.idnegocio}/suscripcion`, { idsuscripcion });
      setNegocio(prev => prev ? { ...prev, suscripcion: resp.data.negocio?.suscripcion } : prev);
      alert('Suscripción actualizada');
    } catch (err: any) {
      console.error(err); alert('Error al actualizar suscripción');
    }
  };

  // Eliminar negocio
  /**
   * const eliminarNegocio = async () => {
    if (!window.confirm('¿Eliminar negocio?')) return;
    try {
      await axios.delete(`${API_URL}/api/negocios/${id}`);
      alert('Negocio eliminado');
      window.location.href = '/negocios';
    } catch (err) { console.error(err); alert('Error al eliminar'); }
  };
   */

  return (
    <div className="divprincipal">
      <div className="container">
        <h2 className="text-center mt-5">Detalles del Negocio</h2>

        {/* Portada */}
        <div className="row">
          <div className="card h-100 m-3 text-center">
            <div className="card-header"><h5>Portada</h5></div>
            <div className="card-body p-2">
              <img
                src={negocio.portada && negocio.portada.trim() !== '' 
                  ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}?t=${Date.now()}`
                  : noimagen}
                className="img-fluid rounded-4"
                style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                alt="Portada"
              />
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={() => setShowModalPortada(true)}>Editar Portada</button>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Info negocio */}
          <div className="col-12 col-md-6">
            <div className="card shadow p-3 m-3">
              <h2 className="text-center">{negocio.nombre_comercial}</h2>
              <p><strong>Descripción:</strong> {negocio.descripcion}</p>
              <p><strong>Promoción:</strong> {negocio.promocion}</p>
              <p><strong>Condiciones:</strong> {negocio.condicion}</p>
              <p>
                <strong>Categoría:</strong> {categorias.find(c => c.idcategoria === negocio.categoria)?.descripcion || 'Sin categoría'}
                <br/>
                <strong>Subcategoría:</strong> {subcategorias.find(s => s.idsubcategoria === negocio.subcategoria)?.descripcion || 'Sin subcategoría'}
              </p>
              <p><strong>Teléfono:</strong> {negocio.telefono}</p>
              <p><strong>Alta:</strong> {negocio.fecha_de_alta ? new Date(negocio.fecha_de_alta).toLocaleDateString() : 'No disponible'}</p>

              {/* Activo/Patrocinado */}
              <p>
                <strong>Estado:</strong> <span className={negocio.activo ? 'text-success' : 'text-danger'}>{negocio.activo ? 'Activo' : 'Inactivo'}</span>
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" checked={negocio.activo} onChange={toggleActivo} />
                </div>
              </p>

              <p>
                <strong>Patrocinado:</strong> <span className={negocio.patrocinado ? 'text-success' : 'text-danger'}>{negocio.patrocinado ? 'Sí' : 'No'}</span>
                <div className="form-check form-switch">
                  <input type="checkbox" className="form-check-input" checked={negocio.patrocinado} onChange={togglePatrocinado} />
                </div>
              </p>

              {/* Suscripción */}
              <p>
                <strong>Suscripción:</strong> {negocio.suscripcion || 'Sin suscripción'}
                <select className="form-select mt-2" value={negocio.suscripcion || ''} onChange={(e) => handleUpdateSuscripcion(Number(e.target.value))}>
                  <option value="">-- Seleccionar suscripción --</option>
                  {suscripciones.map(s => (
                    <option key={s.idsuscripcion} value={s.idsuscripcion}>{s.descripcion} - ${s.precio}</option>
                  ))}
                </select>
              </p>

              <div className="text-center">
                <button className="btn btn-primary m-1" onClick={() => setShowModalInfoNegocio(true)}>Editar Información</button>
                  {/* <button className="btn btn-danger m-1" onClick={eliminarNegocio}>Eliminar Negocio</button> */}
               
              </div>
            </div>
          </div>

          {/* Mapa y Logo */}
          <div className="col-12 col-md-6">
            <div className="shadow rounded-4 m-3" style={{ height: '350px', overflow: 'hidden' }}>
              {hasValidPosition ? (
                <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors"/>
                  <Marker position={position} icon={icon}>
                    <Popup>{negocio.nombre_comercial}<br/></Popup>
                  </Marker>
                </MapContainer>
              ) : <p className="text-center pt-5">No hay coordenadas disponibles</p>}
            </div>

            {/* Logo */}
            <div className="shadow-lg rounded-4 bg-white p-3 mb-4 text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <h5 className="text-primary">Logo del Negocio</h5>
              <img  
                src={negocio.logo && negocio.logo.trim() !== '' ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.logo}?t=${Date.now()}` : noimagen}
                alt="Logo"
                className="img-fluid rounded-circle shadow"
                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '4px solid #0d6efd', backgroundColor: '#f8f9fa' }}
              />
              <div className="mt-3">
                <button className="btn btn-outline-primary" onClick={() => setMostrarModalLogo(true)}>Editar Logo</button>
              </div>
            </div>
          </div>
        </div>

        {/* Galería */}
        <div className="gallery">
          <h2 className="text-center mb-4 titulo2">Galería</h2>
          <button className="btn btn-primary mb-3" onClick={() => setShowModalGaleria(true)}>Agregar fotos</button>
          <div className="row">
            {negocio.imagenes?.map((img, index) => {
              const filename = img.split('/').pop();
              return (
                <div key={index} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
                  <div className="card-galeria">
                    <div className="card-body">
                      <img src={`${API_URL}/uploads/${negocio.idnegocio}/${img}?t=${Date.now()}`} alt={`Galería ${index+1}`} className="gallery-image shadow rounded-4" style={{ width:'100%', height:'200px', objectFit:'cover', margin:'15px'}}/>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                      <button className='btn btn-warning' onClick={() => { setImagenAEditar(filename!); setShowModalEditar(true); }}>Editar</button>
                      <button className='btn btn-danger' onClick={() => eliminarImagen(filename!)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modales */}
        <ModalPortada show={showModalPortada} onClose={() => setShowModalPortada(false)} onUpload={setPortada} onSubmit={subirPortada}/>
        <ModalGaleria show={showModalGaleria} onClose={() => setShowModalGaleria(false)} onUpload={setGaleria} onSubmit={subirGaleria}>
          {uploadProgress > 0 && <div className="progress mb-3"><div className="progress-bar" role="progressbar" style={{width:`${uploadProgress}%`}} aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>{uploadProgress}%</div></div>}
        </ModalGaleria>
        {showModalEditar && <ModalEditarImagen show={showModalEditar} onClose={() => setShowModalEditar(false)} onFileChange={setImagenNueva} onSubmit={reemplazarImagen}/>}
        <ModalEditarInfoNegocio show={showModalInfoNegocio} onClose={() => setShowModalInfoNegocio(false)} editForm={editForm} setEditForm={setEditForm} categorias={categorias} subcategorias={subcategorias} setSubcategorias={setSubcategorias} onSubmit={handleUpdate}/>
        <ModalLogo show={mostrarModalLogo} onClose={() => setMostrarModalLogo(false)} onFileChange={setArchivoLogo} onSubmit={subirLogo}/>
      </div>
    </div>
  );
};

export default DatosNegocio;
