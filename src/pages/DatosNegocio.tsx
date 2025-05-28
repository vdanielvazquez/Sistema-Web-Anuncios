import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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

  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);

  // Cargar categorías al iniciar
  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Error al obtener categorías:', err));
  }, []);

  // Cuando cambia categoría en el formulario, cargar subcategorías
  useEffect(() => {
    if (editForm.id_categoria) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${editForm.id_categoria}`)
        .then(res => setSubcategorias(res.data))
        .catch(err => console.error('Error al obtener subcategorías:', err));
    } else {
      setSubcategorias([]); // resetear si no hay categoría seleccionada
      setEditForm((prev: any) => ({ ...prev, id_subcategoria: '' })); // limpiar subcategoria seleccionada
    }
  }, [editForm.id_categoria]);

  // Cargar datos negocio y sus imágenes
  const fetchNegocio = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/negocios/imagenes/${id}`);
      setNegocio(response.data);
      // Inicializar editForm con los datos del negocio y mapear id_categoria y id_subcategoria correctamente
      setEditForm({
        nombre_comercial: response.data.nombre_comercial || '',
        descripcion: response.data.descripcion || '',
        telefono: response.data.telefono || '',
        id_categoria: response.data.id_categoria || '', // Asegúrate que la API incluya esto
        id_subcategoria: response.data.id_subcategoria || '',
        Estado: response.data.Estado || '',
        Municipio: response.data.Municipio || '',
        activo: response.data.activo,
        // otros campos que quieras incluir
      });
    } catch (error) {
      console.error('Error al obtener el negocio:', error);
    }
  };

  useEffect(() => {
    if (id) fetchNegocio();
  }, [id]);

  // Manejo de cambios en inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Subir portada
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
      fetchNegocio();
    } catch (error) {
      console.error('Error al subir portada:', error);
      alert('Error al subir portada');
    }
  };

  // Subir galería
  const subirGaleria = async () => {
    if (!id || galeria.length === 0) return;
    const formData = new FormData();
    galeria.forEach(file => formData.append('galeria', file));

    try {
      await axios.post(`${API_URL}/api/negocios/imagenes/galeria/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Galería subida con éxito');
      setShowModalGaleria(false);
      fetchNegocio();
    } catch (error) {
      console.error('Error al subir galería:', error);
      alert('Error al subir galería');
    }
  };

  // Eliminar imagen
  const eliminarImagen = async (filename: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;
    try {
      await axios.delete(`${API_URL}/api/negocios/imagenes/${id}/${filename}`);
      alert('Imagen eliminada correctamente');
      fetchNegocio();
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };

  // Reemplazar imagen en galería
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

  // Actualizar info negocio
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/negocios/${id}`, editForm);
      alert('Negocio actualizado correctamente');
      setShowModalInfoNegocio(false);
      fetchNegocio();
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };

  if (!negocio) return <p>Cargando...</p>;

  // Función para obtener nombre de categoría por id
  const nombreCategoria = categorias.find(cat => cat.id_categoria === editForm.id_categoria)?.nombre || '';
  // Función para obtener nombre de subcategoría por id
  const nombreSubcategoria = subcategorias.find(sub => sub.id_subcategoria === editForm.id_subcategoria)?.nombre || '';

  return (
    <div className="divprincipal">
      <div className="container">
        <h2 className="text-center mt-5">Detalles del Negocio</h2>

        <div className="row">
          {/* Portada */}
          <div className="col-12 col-sm-6 col-md-6 col-lg-4">
            <div className="card">
              <h2 className="card-title">Portada</h2>
              <div className="card-body">
                <img
                  src={negocio.portada ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}` : 'default-image.jpg'}
                  className="card-img-top rounded-4"
                  alt="Negocio"
                />
              </div>
              <div className="card-footer">
                <button className="btn btn-primary mb-3" onClick={() => setShowModalPortada(true)}>
                  Editar Portada
                </button>
              </div>
            </div>
          </div>

          {/* Info del negocio */}
          <div className="col-12 col-sm-6 col-md-6 col-lg-4">
            <div className="card">
              <h2 className="card-title">{negocio.nombre_comercial}</h2>
              <div className="card-body">
                <p><strong>Descripción:</strong> {negocio.descripcion}</p>
                <p><strong>Categoría:</strong> {nombreCategoria}</p>
                <p><strong>Sub Categoría:</strong> {nombreSubcategoria}</p>
                <p><strong>Teléfono:</strong> {negocio.telefono}</p>
                <p><strong>Fecha de alta:</strong> {new Date(negocio.fecha_de_alta).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {negocio.activo ? 'Activo' : 'Inactivo'}</p>
              </div>
              <div className="card-footer">
                <button className="btn btn-warning" onClick={() => setShowModalInfoNegocio(true)}>Editar info</button>
              </div>
            </div>
          </div>

          {/* Galería */}
          <div className="col-12 col-sm-12 col-md-12 col-lg-4">
            <h2>Galería</h2>
            <div className="d-flex flex-wrap gap-2">
              {negocio.galeria && negocio.galeria.length > 0 ? (
                negocio.galeria.map((img: string, idx: number) => (
                  <div key={idx} className="position-relative">
                    <img
                      src={`${API_URL}/uploads/${negocio.idnegocio}/galeria/${img}`}
                      alt={`Imagen galería ${idx + 1}`}
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                      onClick={() => {
                        setImagenAEditar(img);
                        setShowModalEditar(true);
                      }}
                    />
                    <button
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      style={{ borderRadius: '50%', width: '25px', height: '25px' }}
                      onClick={() => eliminarImagen(img)}
                      title="Eliminar imagen"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay imágenes en la galería.</p>
              )}
            </div>
            <button className="btn btn-primary mt-3" onClick={() => setShowModalGaleria(true)}>Agregar imágenes</button>
          </div>
        </div>

        {/* MODAL EDITAR GALERÍA */}
        {showModalGaleria && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Imágenes a Galería</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalGaleria(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files) setGaleria(Array.from(e.target.files));
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalGaleria(false)}>Cancelar</button>
                  <button
                    className="btn btn-primary"
                    onClick={subirGaleria}
                    disabled={galeria.length === 0}
                  >
                    Subir Imágenes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR IMAGEN GALERÍA */}
        {showModalEditar && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reemplazar Imagen</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalEditar(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImagenNueva(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalEditar(false)}>Cancelar</button>
                  <button
                    className="btn btn-primary"
                    onClick={reemplazarImagen}
                    disabled={!imagenNueva}
                  >
                    Reemplazar Imagen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR PORTADA */}
        {showModalPortada && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cambiar Portada</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalPortada(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setPortada(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalPortada(false)}>Cancelar</button>
                  <button
                    className="btn btn-primary"
                    onClick={subirPortada}
                    disabled={!portada}
                  >
                    Subir Portada
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR INFO NEGOCIO */}
        {showModalInfoNegocio && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Información del Negocio</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalInfoNegocio(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre Comercial</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre_comercial"
                      value={editForm.nombre_comercial || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                      type="text"
                      className="form-control"
                      name="descripcion"
                      value={editForm.descripcion || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={editForm.telefono || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      name="id_categoria"
                      value={editForm.id_categoria || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subcategoría</label>
                    <select
                      className="form-select"
                      name="id_subcategoria"
                      value={editForm.id_subcategoria || ''}
                      onChange={handleInputChange}
                      required
                      disabled={!editForm.id_categoria}
                    >
                      <option value="">Seleccione una subcategoría</option>
                      {subcategorias.map(sub => (
                        <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                          {sub.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Estado"
                      value={editForm.Estado || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Municipio</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Municipio"
                      value={editForm.Municipio || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModalInfoNegocio(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DatosNegocio;
