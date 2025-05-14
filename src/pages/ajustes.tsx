import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

interface Categoria {
  idcategoria: number;
  descripcion: string;
}
interface Subcategoria {
  idsubcategoria: number;
  descripcion: string;
  idcategoria: number;
}
const Ajustes: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

  const [loading, setLoading] = useState(true);
  
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSubcategoria, setShowModalSubcategoria] = useState(false);

  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(undefined);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'danger'>('success');
  
  const API_URL = 'https://backend-anuncios.onrender.com';

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias`); // render
      // const response = await axios.get('http://localhost:3001/api/categorias'); //local
      console.log("Respuesta de la API:", response.data);  // Verifica la estructura de la respuesta
      setCategorias(response.data.data);  // Accede correctamente a 'data'
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSubcategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategorias`); //render
      //const response = await axios.get('http://localhost:3001/api/subcategorias'); //local
      setSubcategorias(response.data.data);
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      await axios.post(`${API_URL}/api/categorias`, {
      //await axios.post('http://localhost:3001/api/categorias', {
        descripcion: nuevaDescripcion,
      });
      setMensaje('Categoría guardada con éxito');
      setTipoMensaje('success');
      setNuevaDescripcion('');
      setShowModalCategoria(false);
      fetchCategorias();
    } catch (error) {
      setMensaje('Error al guardar la categoría');
      setTipoMensaje('danger');
      console.error(error);
    }

    setTimeout(() => setMensaje(null), 3000);
  };


  const handleGuardarSubcategoria = async () => {
    if (categoriaSeleccionada === undefined) {
      setMensaje('Por favor, selecciona una categoría');
      setTipoMensaje('danger');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/subcategorias`,  {
      //await axios.post('http://localhost:3001/api/subcategorias', { //local
        descripcion: nuevaSubcategoria,
        idcategoria: categoriaSeleccionada,
      });
      setMensaje('Subcategoría guardada con éxito');
      setTipoMensaje('success');
      setNuevaSubcategoria('');
      setCategoriaSeleccionada(undefined);
      setShowModalSubcategoria(false);
      fetchSubcategorias();
    } catch (error) {
      setMensaje('Error al guardar la subcategoría');
      setTipoMensaje('danger');
      console.error(error);
    }

    setTimeout(() => setMensaje(null), 3000);
  };


  return (
    <div className="container-fluid mt-5">
     < div className="div-ajustes">
        <h2 className="text-center mb-4">Ajustes</h2>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`} role="alert">
            {mensaje}
          </div>
        )}

        <div className="d-flex">
          <div className="col-xl-3 col-md-6 col-sm-12 col-12 mb-3">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalCategoria(true)}>
              Nueva Categoría
            </button>
            <table className="table table-bordered table-striped mt-4">
              <thead className="thead-dark">
                <tr>
                  <th>Nombre</th>
                  <th className="text-center" style={{ width: '100px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2}>Cargando...</td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.idcategoria}>
                      <td>{cat.descripcion}</td>
                      <td className="d-flex justify-content-center" style={{ width: '100px' }}>
                        <button className="btn btn-warning btn-sm me-2">Editar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* subcategoria */}
          <div className="col-xl-3 col-md-6 col-sm-12 col-12 mb-3">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalSubcategoria(true)}>
              Nueva SubCategoría
            </button>
            <table className="table table-bordered table-striped mt-4">
              <thead className="thead-dark">
                <tr>
                  <th>Nombre</th>
                  <th className="text-center" style={{ width: '100px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
              {subcategorias.map((subcat) => (
                  <tr key={subcat.idsubcategoria}>
                    <td>{subcat.descripcion}</td>
                    <td>{categorias.find((cat) => cat.idcategoria === subcat.idcategoria)?.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal para nueva categoría */}
        {showModalCategoria && (
          <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Categoría</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalCategoria(false)} />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descripción de la categoría"
                    value={nuevaDescripcion}
                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalCategoria(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-success" onClick={handleGuardar}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal para nueva subcategoría */}
        {showModalSubcategoria && (
          <div className="modal show fade d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Agregar Subcategoría</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalSubcategoria(false)} />
                </div>
                <div className="modal-body">
                <select
                    className="form-control mb-3"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
                  >
                    <option value={undefined}>Seleccione una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.idcategoria} value={cat.idcategoria}>
                        {cat.descripcion}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descripción de la subcategoría"
                    value={nuevaSubcategoria}
                    onChange={(e) => setNuevaSubcategoria(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModalSubcategoria(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-success" onClick={handleGuardarSubcategoria}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}











      </div>
    </div>
  );
};

export default Ajustes;
