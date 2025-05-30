import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import noimagen from "../assets/no-img.avif";
import { ModalPortada,ModalGaleria,  ModalInfoNegocio,  ModalEditarImagen,} from '../pages/ModalesDatosNegocio'; 

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


  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => {
        console.log(res.data);  // Verifica qué datos recibes
        setCategorias(res.data);
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
    /*
    const fetchNegocio = async () => {
      try {
       
        const response = await axios.get(`${API_URL}/api/negocios/imagenes/${id}`);
        setNegocio(response.data);
        setEditForm(response.data);
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
      }
    };
    */

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
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

//subir fotos
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


//actualizar info
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/negocios/${id}`, editForm);
      setNegocio(editForm); // actualiza la vista con los nuevos datos
      alert('Negocio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };

  if (!negocio) return <p>Cargando...</p>;

  return (
    <div className="divprincipal">
      <div className='container'>
      <h2 className="text-center mt-5">Detalles del Negocio</h2>
      <div className="row d-flex">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="col-12 col-md-4 d-flex flex-column mb-3">
            <div className="cardN flex-grow-1 d-flex flex-column">
                <h2 className="card-title text-center">{
                i === 0 ? 'Portada' : 
                i === 1 ? negocio.nombre_comercial : 
                'Ubicación'
                }</h2>
                <div className="card-bodyN flex-grow-1">
                {i === 0 && (
                    <img
                    src={negocio.portada && negocio.portada.trim() !== '' 
                        ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}` 
                        : noimagen}  
                    className="card-img-top rounded-4"  
                    alt="Negocio" 
                    />
                )}
          {i === 1 && (
            <>
              <p><strong>Descripción:</strong> {negocio.descripcion}</p>
              <p><strong>Categorías:</strong></p>


              <p><strong>Categoría:</strong> {negocio.categoria}</p>
              <p><strong>Sub Categoría:</strong> {negocio.subcategoria}</p>
              <p><strong>Telefono:</strong> {negocio.telefono}</p>
              <p><strong>Fecha de alta:</strong> {new Date(negocio.fecha_de_alta).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {negocio.activo ? 'Activo' : 'Inactivo'}</p>
            </>
          )}
          {i === 2 && (
            <>
              <p><strong>Estado:</strong> {negocio.Estado}</p>
              <p><strong>Municipio:</strong> {negocio.Municipio}</p>
            </>
          )}
        </div>
        <div className="card-footer N text-center">
                    {i === 0 && (
                        <button className="btn btn-primary mb-3" onClick={() => setShowModalPortada(true)}>
                        Editar Portada
                        </button>
                    )}
                    {i === 1 && (
                        <button className="btn btn-primary mb-3" onClick={() => setShowModalInfoNegocio(true)}>
                        Editar Información
                        </button>
                    )}
                    {i === 2 && (
                        <button className="btn btn-primary mb-3" onClick={() => setShowModalInfoNegocio(true)}>
                        Editar Ubicación
                        </button>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>

      <div className="gallery">
      <h2 className="text-center mb-4 titulo2">Galería</h2>
      <button className="btn btn-primary mb-3"  onClick={() => setShowModalGaleria(true)}> Agregar fotos </button>
      <div className="row">
      {negocio.imagenes?.map((img: string, index: number) => {
  const filename = img.split('/').pop(); // extraer el nombre del archivo

  return (
    <div key={index} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
      <div className="card-galeria">
        <div className="card-body">
          <img src={img} alt={`Galería ${index + 1}`} className="gallery-image rounded-4 mb-3" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          
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

       {/* Modal para portada */}
        <ModalPortada
        show={showModalPortada}
        onClose={() => setShowModalPortada(false)}
        onUpload={setPortada}
        onSubmit={subirPortada}
        />
      
      {/* Modal para galeria */}
        <ModalGaleria
        show={showModalGaleria}
        onClose={() => setShowModalGaleria(false)}
        onUpload={setGaleria}
        onSubmit={subirGaleria}
        />
        
        {/* Modal para info del negocio */}
        <ModalInfoNegocio
        show={showModalInfoNegocio}
        onClose={() => setShowModalInfoNegocio(false)}
        editForm={editForm}
        onChange={handleInputChange}
        onSubmit={handleUpdate}
        categorias={categorias}
        subcategorias={subcategorias}
        />
        {/* Modal para reemplazar img */}
        {showModalEditar && (
        <ModalEditarImagen
        show={showModalEditar}
        onClose={() => setShowModalEditar(false)}
        onFileChange={setImagenNueva}
        onSubmit={reemplazarImagen}
        />
      )}

      </div>
    </div>
  );
};

export default DatosNegocio;



