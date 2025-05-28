import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

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
  const [currentPageCategorias, setCurrentPageCategorias] = useState(0);
  const [currentPageSubcategorias, setCurrentPageSubcategorias] = useState(0);
  const itemsPerPage = 3;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);

  // Datos provisionales para evitar error de variables no definidas
  const [suscripciones] = useState<{ id: number; dias: number }[]>([]);
  
  const [loading, setLoading] = useState(true);

  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSubcategoria, setShowModalSubcategoria] = useState(false);

  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(undefined);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'danger'>('success');

  const API_URL = 'https://sistemawebpro.com';

  // Paginación categorías
  const displayedCategorias = categorias.slice(
    currentPageCategorias * itemsPerPage,
    (currentPageCategorias + 1) * itemsPerPage
  );

  // Paginación subcategorías
  const displayedSubcategorias = subcategorias.slice(
    currentPageSubcategorias * itemsPerPage,
    (currentPageSubcategorias + 1) * itemsPerPage
  );

  const handlePageClickCategorias = (event: { selected: number }) => {
    setCurrentPageCategorias(event.selected);
  };

  const handlePageClickSubcategorias = (event: { selected: number }) => {
    setCurrentPageSubcategorias(event.selected);
  };

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categorias`);
      setCategorias(response.data.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subcategorias`);
      setSubcategorias(response.data.data);
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      await axios.post(`${API_URL}/api/categorias`, {
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
      await axios.post(`${API_URL}/api/subcategorias`, {
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
    <div className="divprincipal">
      <div className="div-ajustes">
        <h2 className="text-center mt-5">Ajustes</h2>

        {mensaje && (
          <div className={`alert alert-${tipoMensaje}`} role="alert">
            {mensaje}
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between">
          {/* Categorías */}
          <div className="col-xl-3 col-md-6 col-sm-12 col-12 mb-3">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalCategoria(true)}>
              Nueva Categoría
            </button>
            <table className="table table-bordered table-striped mt-4">
              <thead className="thead-dark">
                <tr>
                  <th>Nombre</th>
                  <th className="text-center" style={{ width: '100px' }}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2}>Cargando...</td>
                  </tr>
                ) : (
                  displayedCategorias.map((cat) => (
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
            <ReactPaginate
            previousLabel={<button className="btn btn-outline-primary btn-sm">← Anterior</button>}
            nextLabel={<button className="btn btn-outline-primary btn-sm">Siguiente →</button>}
            breakLabel={<span className="px-2">...</span>}
            pageCount={Math.ceil(categorias.length / itemsPerPage)}
            onPageChange={handlePageClickCategorias}
            containerClassName={"pagination justify-content-center mt-3"}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName=""
            nextClassName="page-item"
            nextLinkClassName=""
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            forcePage={currentPageCategorias}
          />

          </div>

          {/* Subcategorías */}
          <div className="col-xl-3 col-md-6 col-sm-12 col-12 mb-3">
            <button className="btn btn-primary mb-3" onClick={() => setShowModalSubcategoria(true)}>
              Nueva SubCategoría
            </button>
            <table className="table table-bordered table-striped mt-4">
              <thead className="thead-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                </tr>
              </thead>
              <tbody>
                {displayedSubcategorias.map((subcat) => (
                  <tr key={subcat.idsubcategoria}>
                    <td>{subcat.descripcion}</td>
                    <td>{categorias.find((cat) => cat.idcategoria === subcat.idcategoria)?.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"← Anterior"}
              nextLabel={"Siguiente →"}
              breakLabel={"..."}
              pageCount={Math.ceil(subcategorias.length / itemsPerPage)}
              onPageChange={handlePageClickSubcategorias}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              forcePage={currentPageSubcategorias}
            />
          </div>

          {/* Suscripciones */}
          <div className="col-xl-3 col-md-6 col-sm-12 col-12 mb-3">
            <button className="btn btn-primary mb-3">Nueva Suscripción</button>
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Descripcion</th>
                  <th>Número de Negocios</th>
                </tr>
              </thead>
              <tbody>
                {suscripciones.length === 0 ? (
                  <tr>
                    <td>No hay suscripciones</td>
                    <td>10</td>
                  </tr>
                ) : (
                  suscripciones.map((sus) => (
                    <tr key={sus.id}>
                      <td>{sus.dias}</td>
                    </tr>
                  ))
                )}
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
                    value={categoriaSeleccionada ?? ''}
                    onChange={(e) =>
                      setCategoriaSeleccionada(e.target.value ? Number(e.target.value) : undefined)
                    }
                  >
                    <option value="">Seleccione una categoría</option>
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
