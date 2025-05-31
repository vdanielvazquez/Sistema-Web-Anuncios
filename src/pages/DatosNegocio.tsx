import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/datosnegocio.css';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import noimagen from "../assets/no-img.avif";
import { ModalPortada, ModalGaleria, ModalInfoNegocio, ModalEditarImagen } from '../pages/ModalesDatosNegocio';

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
        setCategorias(res.data);
      })
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);

  useEffect(() => {
    if (editForm.id_categoria) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${editForm.id_categoria}`)
        .then(response => {
          setSubcategorias(response.data);
        })
        .catch(error => {
          console.error("Error al obtener subcategorías:", error);
        });
    }
  }, [editForm.id_categoria]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

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

  const subirGaleria = async () => {
    if (!id || galeria.length === 0) return;
    const formData = new FormData();
    galeria.forEach((file) => formData.append('galeria', file));

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/negocios/${id}`, editForm);
      setNegocio(editForm);
      alert('Negocio actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
      alert('Ocurrió un error al actualizar');
    }
  };

  if (!negocio) return <p>Cargando...</p>;

  return (
    <div className="divprincipal">
      <div className="container">
        <h2 className="text-center mt-5">Detalles del Negocio</h2>
        <div className="row d-flex">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="col-12 col-md-4 d-flex flex-column mb-3">
              <div className="cardN flex-grow-1 d-flex flex-column">
                <h2 className="card-title text-center">
                  {i === 0 ? 'Portada' : i === 1 ? negocio.nombre_comercial : 'Ubicación'}
                </h2>
                <div className="card-bodyN flex-grow-1">
                  {i === 0 && (
                    <img
                      src={
                        negocio.portada && negocio.portada.trim() !== ''
                          ? `${API_URL}/uploads/${negocio.idnegocio}/${negocio.portada}`
                          : noimagen
                      }
                      className="card-img-top rounded-4"
                      alt="Negocio"
                    />
                  )}
                  {i === 1 && (
                    <>
                      <p><strong>Descripción:</strong> {negocio.descripcion}</p>
                      <p><strong>Categoría:</strong> {negocio.categoria}</p>
                      <p><strong>Sub Categoría:</strong> {negocio.subcategoria}</p>
                      <p><strong>Teléfono:</strong> {negocio.telefono}</p>
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
                <div className="card-footer text-center">
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

      {(Array.isArray(negocio.imagenes) && negocio.imagenes.length > 0) ? (
  <div className="row">
    {negocio.imagenes.map((img: string, index: number) => {
      const filename = img.split('/').pop();
      return (
        <div key={index} className="col-xl-3 col-md-4 col-sm-6 col-12 mb-3">
          <div className="card-galeria">
            <div className="card-body">
              <img
                src={img}
                alt={`Galería ${index + 1}`}
                className="gallery-image rounded-4 mb-3"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </div>
            <div className="card-footer d-flex justify-content-between">
              <button className='btn btn-warning me-2' onClick={() => {
                setImagenAEditar(filename!);
                setShowModalEditar(true);
              }}>Editar</button>
              <button className='btn btn-danger' onClick={() => eliminarImagen(filename!)}>Eliminar</button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <p className="text-center">No hay imágenes en la galería.</p>
)}


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

        <ModalInfoNegocio
          show={showModalInfoNegocio}
          onClose={() => setShowModalInfoNegocio(false)}
          editForm={editForm}
          onChange={handleInputChange}
          onSubmit={handleUpdate}
          categorias={categorias}
          subcategorias={subcategorias}
        />

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
