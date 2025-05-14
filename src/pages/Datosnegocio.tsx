import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DatosNegocio = () => {
  const API_URL = 'https://backend-anuncios.onrender.com';

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
    const fetchNegocio = async () => {
      try {
       
        const response = await axios.get(`${API_URL}/api/negocios/imagenes/${id}`);
        //const response = await axios.get(`http://localhost:3001/api/negocios/imagenes/${id}`);//local
        setNegocio(response.data);
        setEditForm(response.data);
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
      }
    };
    
    useEffect(() => {
      fetchNegocio();
    }, [id]);
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

//subir fotos
const subirPortada = async () => {
  if (!id || !portada) return;
  const formData = new FormData();
  formData.append('portada', portada);

  try {
    await axios.post(`${API_URL}/api/negocios/imagenes/portada/${id}`, formData, {
      //await axios.post(`http://localhost:3001/api/negocios/imagenes/portada/${id}`, formData, {
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
    //await axios.post(`http://localhost:3001/api/negocios/imagenes/galeria/${id}`, formData, {//local
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
    //await axios.delete(`http://localhost:3001/api/negocios/imagenes/${id}/${filename}`);//local
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
      //await axios.put(`http://localhost:3001/api/negocios/imagenes/galeria/${id}/${imagenAEditar}`, formData, {//local
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
      //await axios.put(`http://localhost:3001/api/negocios/${id}`, editForm);//local
      setNegocio(editForm); // actualiza la vista con los nuevos datos
      alert('Negocio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };

  if (!negocio) return <p>Cargando...</p>;

  return (
    <div className="container-fluid  mt-5">
      <div className='div-datos-negocio'>
      <h2 className="text-center mb-4">Detalles del Negocio</h2>
      <div className="row">
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 ">
          <div className="card">
            <h2 className="card-title">Portada</h2>
            <div className="card-body">
            <img src={ negocio.portada ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}` : 'default-image.jpg' } className="card-img-top rounded-4" alt="Negocio"/> 
            </div>
            <div className="card-footer">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalPortada(true)}>
              Editar Portada
            </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 ">
          <div className="card">
          <h2 className="card-title">{negocio.nombre_comercial}</h2>
            <div className="card-body">
              <p><strong>Descripción:</strong> {negocio.descripcion}</p>
              <p><strong>Categoría:</strong> {negocio.categoria}</p>
              <p><strong>Sub Categoría:</strong> {negocio.subcategoria}</p>
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
        <div className="col-12 col-sm-6 col-md-6 col-lg-4 ">
          <div className="card">
          <h2 className="card-title">Ubicacion</h2>
            <div className="card-body">
            <p><strong>Estado:</strong> {negocio.Estado}</p>
            <p><strong>Municipio:</strong> {negocio.Municipio}</p>
            </div>
            <div className="card-footer">
             <button className="btn btn-primary mb-3" onClick={() => setShowModalInfoNegocio(true)}>
                Editar Ubicacion
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
          <img src={img} alt={`Galería ${index + 1}`} className="gallery-image rounded-4" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          
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
       {showModalPortada && (
          <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Portada</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalPortada(false)} />
                </div>
                <div className="modal-body">
                <div className="mb-2">
                    <label>Imagen de portada:</label>
                    <input  type="file"  className="form-control"  onChange={e => setPortada(e.target.files?.[0] || null)}  />
                </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalPortada(false)}>
                    Cancelar
                  </button>
                  <button  type="button"  className="btn btn-success"  onClick={subirPortada}  >
                    Subir imágen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {/* Modal para galeria */}
       {showModalGaleria && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Fotos a la galería</h5>
                <button type="button" className="btn-close" onClick={() => setShowModalGaleria(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Galería (puedes seleccionar varias):</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={e => setGaleria(Array.from(e.target.files || []))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModalGaleria(false)}>Cancelar</button>
                <button type="button" className="btn btn-success" onClick={subirGaleria}>
                  Subir imágenes de galería
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        
        {/* Modal para info del negocio */}
       {showModalInfoNegocio && (
          <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalInfoNegocio(false)} />
                </div>
                <div className="modal-body">
                <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Nombre Comercial</label>
                  <input  type="text"  className="form-control"  name="nombre_comercial" value={editForm.nombre_comercial || ''}  onChange={handleInputChange}  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripcion</label>
                  <input  type="text"  className="form-control"  name="descripcion"  value={editForm.descripcion || ''}  onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input  type="text"  className="form-control"  name="telefono"  value={editForm.telefono || ''}  onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                <select className="form-select"  name="id_categoria"  value={editForm.id_categoria || ''} onChange={(e) => setEditForm({   ...editForm,  id_categoria: e.target.value,  id_subcategoria: '', }) } >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat: any) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <select className="form-select" name="id_subcategoria"  value={editForm.id_subcategoria || ''} onChange={(e) => setEditForm({ ...editForm, id_subcategoria: e.target.value, })}
                    disabled={!editForm.id_categoria}>
                  <option value="">Seleccione una subcategoría</option>
                  {subcategorias.map((sub: any) => (
                    <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                      {sub.nombre}
                    </option>
                  ))}
                </select>
                </div>
                <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModalInfoNegocio(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">Guardar Cambios</button>
                </div>
              </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal para reemplazar img */}
        {showModalEditar && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reemplazar Imagen</h5>
                <button type="button" className="btn-close" onClick={() => setShowModalEditar(false)} />
              </div>
              <div className="modal-body">
                <label>Selecciona nueva imagen:</label>
                <input type="file" className="form-control" onChange={e => setImagenNueva(e.target.files?.[0] || null)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModalEditar(false)}>Cancelar</button>
                <button className="btn btn-success" onClick={reemplazarImagen}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default DatosNegocio;



