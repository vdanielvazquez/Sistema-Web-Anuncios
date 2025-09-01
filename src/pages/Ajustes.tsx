import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import {
  ModalCategoria,
  ModalSubcategoria,
  ModalSuscripcion,
  ModalEditarCategoria, 
  ModalEditarSubcategoria,
  ModalUsuario,
} from '../pages/ModalesAjustes';

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
  const API_URL = 'https://sistemawebpro.com';
  const itemsPerPage = 5;

  // Estados de datos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [suscripciones, setSuscripciones] = useState<{ idsuscripcion: number; descripcion: string; precio: number }[]>([]);
  const [precioSuscripcion, setPrecioSuscripcion] = useState('');


  // Paginación
  const [currentPageCategorias, setCurrentPageCategorias] = useState(0);
  const [currentPageSubcategorias, setCurrentPageSubcategorias] = useState(0);

  // Modales
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSubcategoria, setShowModalSubcategoria] = useState(false);
  const [showModalSuscripcion, setShowModalSuscripcion] = useState(false);
  const [showModalEditarSuscripcion, setShowModalEditarSuscripcion] = useState(false);
  const [suscripcionEditando, setSuscripcionEditando] = useState<{ idsuscripcion: number; descripcion: string; precio: string } | null>(null);

  const [showModalEditarCategoria, setShowModalEditarCategoria] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  const [showModalEditarSubcategoria, setShowModalEditarSubcategoria] = useState(false);
  const [editarDescripcion, setEditarDescripcion] = useState('');

  const [subcategoriaEditando, setSubcategoriaEditando] = useState<Subcategoria | null>(null);
//usuarios
interface Usuario {
  idusuario: number;
  nombre: string;
}

const [usuarios, setUsuarios] = useState<Usuario[]>([]);
const [showModalUsuario, setShowModalUsuario] = useState(false);
const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
const [nombreUsuario, setNombreUsuario] = useState('');
const [contrasenaUsuario, setContrasenaUsuario] = useState('');

  // Formularios
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(undefined);
  const [descripcionSuscripcion, setDescripcionSuscripcion] = useState('');


  // UI
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'danger'>('success');

  // Carga inicial
  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
     fetchSuscripciones();
     fetchUsuarios();
  }, []);

  // Peticiones
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

  // Guardar categoría
  const handleGuardar = async () => {
    try {
      await axios.post(`${API_URL}/api/categorias`, { descripcion: nuevaDescripcion });
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

  // Guardar subcategoría
  const handleGuardarSubcategoria = async () => {
    if (categoriaSeleccionada === undefined) {
      setMensaje('Por favor, selecciona una categoría');
      setTipoMensaje('danger');
      setTimeout(() => setMensaje(null), 3000);
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

  // Guardar suscripción
  const handleGuardarSuscripcion = async () => {
    if (!descripcionSuscripcion || !precioSuscripcion) {
      setMensaje('Por favor, completa todos los campos');
      setTipoMensaje('danger');
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/suscripcion`, {
        descripcion: descripcionSuscripcion,
        precio: parseFloat(precioSuscripcion),
      });
      setMensaje('Suscripción guardada con éxito');
      setTipoMensaje('success');
      setDescripcionSuscripcion('');
      setPrecioSuscripcion('');
      setShowModalSuscripcion(false);
      // fetchSuscripciones(); si se implementa
    } catch (error) {
      setMensaje('Error al guardar la suscripción');
      setTipoMensaje('danger');
      console.error(error);
    }

    setTimeout(() => setMensaje(null), 3000);
  };
  // mostrar suscripciones
  const fetchSuscripciones = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/suscripcion`);
    setSuscripciones(res.data.data); // Ajusta según cómo venga la respuesta
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
  }
};
//modal suscripcion
const abrirModalEditarSuscripcion = (sus: { idsuscripcion: number; descripcion: string; precio: number }) => {
  setSuscripcionEditando({
    ...sus,
    precio: String(sus.precio)
  });
  setShowModalEditarSuscripcion(true);
};

//editar suscripcion 
const guardarCambiosSuscripcion = async () => {
  if (!suscripcionEditando) return;
  try {
    await axios.put(`${API_URL}/api/suscripcion/${suscripcionEditando.idsuscripcion}`, {
      descripcion: suscripcionEditando.descripcion,
      precio: parseFloat(suscripcionEditando.precio),
    });
    setMensaje('Suscripción actualizada con éxito');
    setTipoMensaje('success');
    setShowModalEditarSuscripcion(false);
    fetchSuscripciones();
  } catch (error) {
    setMensaje('Error al actualizar la suscripción');
    setTipoMensaje('danger');
    console.error(error);
  }
  setTimeout(() => setMensaje(null), 3000);
};
const fetchUsuarios = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/usuarios`);
    setUsuarios(res.data);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
  }
};

const abrirModalNuevoUsuario = () => {
  setUsuarioEditando(null);
  setNombreUsuario('');
  setContrasenaUsuario('');
  setShowModalUsuario(true);
};

/*
const abrirModalEditarUsuario = (usuario: Usuario) => {
  setUsuarioEditando(usuario);
  setNombreUsuario(usuario.nombre);
  setContrasenaUsuario('');
  setShowModalUsuario(true);
};*/
 


// Variables de estado para paginación de suscripciones y usuarios
const [currentPageSuscripciones, setCurrentPageSuscripciones] = React.useState(0);
const [currentPageUsuarios, setCurrentPageUsuarios] = React.useState(0);

const handlePageClickSuscripciones = (selectedItem: { selected: number }) => {
  setCurrentPageSuscripciones(selectedItem.selected);
};

const handlePageClickUsuarios = (selectedItem: { selected: number }) => {
  setCurrentPageUsuarios(selectedItem.selected);
};

// Cálculo para paginar suscripciones y usuarios
const displayedSuscripciones = suscripciones.slice(
  currentPageSuscripciones * itemsPerPage,
  (currentPageSuscripciones + 1) * itemsPerPage
);

const displayedUsuarios = usuarios.slice(
  currentPageUsuarios * itemsPerPage,
  (currentPageUsuarios + 1) * itemsPerPage
);

const guardarUsuario = async () => {
  try {
    if (usuarioEditando) {
      await axios.put(`${API_URL}/api/usuarios/${usuarioEditando.idusuario}`, {
        nombre: nombreUsuario,
        contrasena: contrasenaUsuario,
      });
      setMensaje('Usuario actualizado con éxito');
    } else {
      await axios.post(`${API_URL}/api/usuarios`, {
        nombre: nombreUsuario,
        contrasena: contrasenaUsuario,
      });
      setMensaje('Usuario creado con éxito');
    }
    setTipoMensaje('success');
    setShowModalUsuario(false);
    fetchUsuarios();
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    setMensaje('Error al guardar usuario');
    setTipoMensaje('danger');
  } finally {
    setTimeout(() => setMensaje(null), 3000);
  }
};
/*
const eliminarUsuario = async (id: number) => {
  const confirmar = window.confirm('¿Eliminar este usuario?');
  if (!confirmar) return;

  try {
    await axios.delete(`${API_URL}/api/usuarios/${id}`);
    setMensaje('Usuario eliminado con éxito');
    setTipoMensaje('success');
    fetchUsuarios();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    setMensaje('Error al eliminar usuario');
    setTipoMensaje('danger');
  } finally {
    setTimeout(() => setMensaje(null), 3000);
  }
};*/

///
const [editarDescripcionSubcat, setEditarDescripcionSubcat] = useState('');
const [editarCategoriaSubcat, setEditarCategoriaSubcat] = useState<number | undefined>(undefined);

useEffect(() => {
  if (subcategoriaEditando) {
    setEditarDescripcionSubcat(subcategoriaEditando.descripcion);
    setEditarCategoriaSubcat(subcategoriaEditando.idcategoria);
  }
}, [subcategoriaEditando]);

const guardarCambiosSubcategoria = async () => {
  if (!subcategoriaEditando || editarCategoriaSubcat === undefined) return;

  try {
    await axios.put(`${API_URL}/api/subcategorias/${subcategoriaEditando.idsubcategoria}`, {
      descripcion: editarDescripcionSubcat,
      idcategoria: editarCategoriaSubcat,
    });
    setMensaje('Subcategoría actualizada con éxito');
    setTipoMensaje('success');
    setShowModalEditarSubcategoria(false);
    fetchSubcategorias();
  } catch (error) {
    setMensaje('Error al actualizar la subcategoría');
    setTipoMensaje('danger');
    console.error(error);
  }

  setTimeout(() => setMensaje(null), 3000);
};


const guardarCambiosCategoria = async () => {
  if (!categoriaEditando) return;

  try {
    await axios.put(`${API_URL}/api/categorias/${categoriaEditando.idcategoria}`, {
      descripcion: editarDescripcion,
    });
    setMensaje('Categoría actualizada con éxito');
    setTipoMensaje('success');
    setShowModalEditarCategoria(false);
    fetchCategorias();
  } catch (error) {
    setMensaje('Error al actualizar la categoría');
    setTipoMensaje('danger');
    console.error(error);
  }

  setTimeout(() => setMensaje(null), 3000);
};

//eliminar suscripcion
/**
 * const handleEliminarSuscripcion = async (id: number) => {
  const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta suscripción?');
  if (!confirmar) return;

  try {
    await axios.delete(`${API_URL}/api/suscripcion/${id}`);
    setMensaje('Suscripción eliminada con éxito');
    setTipoMensaje('success');
    fetchSuscripciones();
  } catch (error) {
    setMensaje('Error al eliminar la suscripción');
    setTipoMensaje('danger');
    console.error(error);
  }

  setTimeout(() => setMensaje(null), 3000);
};
 */
/////
// Eliminar categoría
const handleEliminarCategoria = async (id: number) => {
  const confirmar = window.confirm('¿Eliminar esta categoría?');
  if (!confirmar) return;

  try {
    await axios.delete(`${API_URL}/api/categorias/${id}`);
    setMensaje('Categoría eliminada con éxito');
    setTipoMensaje('success');
    fetchCategorias();
  } catch (error) {
    setMensaje('Error al eliminar categoría');
    setTipoMensaje('danger');
    console.error(error);
  }

  setTimeout(() => setMensaje(null), 3000);
};

// Eliminar subcategoría
const handleEliminarSubcategoria = async (id: number) => {
  const confirmar = window.confirm('¿Eliminar esta subcategoría?');
  if (!confirmar) return;

  try {
    await axios.delete(`${API_URL}/api/subcategorias/${id}`);
    setMensaje('Subcategoría eliminada con éxito');
    setTipoMensaje('success');
    fetchSubcategorias();
  } catch (error) {
    setMensaje('Error al eliminar subcategoría');
    setTipoMensaje('danger');
    console.error(error);
  }

  setTimeout(() => setMensaje(null), 3000);
};


  // Paginación
  const handlePageClickCategorias = (event: { selected: number }) => {
    setCurrentPageCategorias(event.selected);
  };

  const handlePageClickSubcategorias = (event: { selected: number }) => {
    setCurrentPageSubcategorias(event.selected);
  };

  const displayedCategorias = categorias.slice(
    currentPageCategorias * itemsPerPage,
    (currentPageCategorias + 1) * itemsPerPage
  );

  const displayedSubcategorias = subcategorias.slice(
    currentPageSubcategorias * itemsPerPage,
    (currentPageSubcategorias + 1) * itemsPerPage
  );

  return (
    <div className="divprincipal">
      <div className="div-ajustes">
        <h2 className="text-center mt-5">Ajustes</h2>

        {mensaje && <div className={`alert alert-${tipoMensaje}`}>{mensaje}</div>}

       <div className="d-flex flex-wrap justify-content-between gap-4">
          {/* Categorías */}
           <div className="col-xl-3 col-md-6 col-sm-12 mb-4" style={{ minHeight: '500px' }}>
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
                  <tr><td colSpan={2}>Cargando...</td></tr>
                ) : (
                  displayedCategorias.map((cat) => (
                    <tr key={cat.idcategoria}>
                      <td>{cat.descripcion}</td>
                      <td className="d-flex justify-content-center">
                        <button className="btn btn-warning btn-sm me-2" onClick={() => {  setCategoriaEditando(cat);  setShowModalEditarCategoria(true); }}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarCategoria(cat.idcategoria)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={Math.max(1, Math.ceil(categorias.length / itemsPerPage))}
              onPageChange={handlePageClickCategorias}
              containerClassName="pagination justify-content-center mt-3"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName={`page-item ${currentPageCategorias === 0 ? 'disabled' : ''}`}
              previousLinkClassName="page-link"
              nextClassName={`page-item ${currentPageCategorias === Math.ceil(categorias.length / itemsPerPage) - 1 ? 'disabled' : ''}`}
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
              forcePage={currentPageCategorias}
            />

          </div>

          {/* Subcategorías */}
          <div className="col-xl-3 col-md-6 col-sm-12 mb-4" style={{ minHeight: '500px' }}>
            <button className="btn btn-primary mb-3" onClick={() => setShowModalSubcategoria(true)}>
              Nueva Subcategoría
            </button>
            <table className="table table-bordered table-striped mt-4">
              <thead className="thead-dark">
                <tr>
                  <th>Categoría</th>
                  <th>Subcategoría</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {displayedSubcategorias.map((subcat) => (
                  <tr key={subcat.idsubcategoria}>
                    <td>{categorias.find((cat) => cat.idcategoria === subcat.idcategoria)?.descripcion}</td>
                    <td>{subcat.descripcion}</td>
                    <td className="text-center">
                      <button className="btn btn-warning btn-sm me-2"  onClick={() => {  setSubcategoriaEditando(subcat);  setShowModalEditarSubcategoria(true); }}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminarSubcategoria(subcat.idsubcategoria)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           <ReactPaginate
            previousLabel="Anterior"
            nextLabel="Siguiente"
            breakLabel="..."
            pageCount={Math.max(1, Math.ceil(subcategorias.length / itemsPerPage))}
            onPageChange={handlePageClickSubcategorias}
            containerClassName="pagination justify-content-center mt-3"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName={`page-item ${currentPageSubcategorias === 0 ? 'disabled' : ''}`}
            previousLinkClassName="page-link"
            nextClassName={`page-item ${currentPageSubcategorias === Math.ceil(subcategorias.length / itemsPerPage) - 1 ? 'disabled' : ''}`}
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            forcePage={currentPageSubcategorias}
          />

          </div>

           {/* Suscripciones */}
            <div className="col-xl-3 col-md-6 col-sm-12 mb-4" style={{ minHeight: '500px' }}>
              <button className="btn btn-primary mb-3" onClick={() => setShowModalSuscripcion(true)}>
                Nueva Suscripción
              </button>
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSuscripciones.length === 0 ? (
                    <tr><td colSpan={3}>No hay suscripciones registradas</td></tr>
                  ) : (
                    displayedSuscripciones.map((sus) => (
                      <tr key={sus.idsuscripcion}>
                        <td>{sus.descripcion}</td>
                        <td>${isNaN(Number(sus.precio)) ? '0.00' : Number(sus.precio).toFixed(2)}</td>
                        <td className="text-center">
                          <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModalEditarSuscripcion(sus)}>Editar</button>
                           {/*  <button className="btn btn-danger btn-sm" onClick={() => handleEliminarSuscripcion(sus.idsuscripcion)}>Eliminar</button> */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <ReactPaginate
                previousLabel="Anterior"
                nextLabel="Siguiente"
                breakLabel="..."
                pageCount={Math.max(1, Math.ceil(suscripciones.length / itemsPerPage))}
                onPageChange={handlePageClickSuscripciones}
                containerClassName="pagination justify-content-center mt-3"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName={`page-item ${currentPageSuscripciones === 0 ? 'disabled' : ''}`}
                previousLinkClassName="page-link"
                nextClassName={`page-item ${currentPageSuscripciones === Math.ceil(suscripciones.length / itemsPerPage) - 1 ? 'disabled' : ''}`}
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPageSuscripciones}
              />
            </div>

            {/* Usuarios */}
            <div className="col-xl-3 col-md-6 col-sm-12 mb-4" style={{ minHeight: '500px' }}>
              <button className="btn btn-primary mb-3" onClick={abrirModalNuevoUsuario}>
                Nuevo Usuario
              </button>
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsuarios.length === 0 ? (
                    <tr><td colSpan={2}>No hay usuarios registrados</td></tr>
                  ) : (
                    displayedUsuarios.map((u) => (
                      <tr key={u.idusuario}>
                        <td>{u.nombre}</td>
                        <td className="text-center">
                           {/*  <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModalEditarUsuario(u)}>Editar</button> 
                           <button className="btn btn-danger btn-sm" onClick={() => eliminarUsuario(u.idusuario)}>Eliminar</button>
                           */}                         
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <ReactPaginate
                previousLabel="Anterior"
                nextLabel="Siguiente"
                breakLabel="..."
                pageCount={Math.max(1, Math.ceil(usuarios.length / itemsPerPage))}
                onPageChange={handlePageClickUsuarios}
                containerClassName="pagination justify-content-center mt-3"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName={`page-item ${currentPageUsuarios === 0 ? 'disabled' : ''}`}
                previousLinkClassName="page-link"
                nextClassName={`page-item ${currentPageUsuarios === Math.ceil(usuarios.length / itemsPerPage) - 1 ? 'disabled' : ''}`}
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPageUsuarios}
              />
            </div>
        </div>

        {/* Modales */}
        <ModalCategoria
          show={showModalCategoria}
          descripcion={nuevaDescripcion}
          onChange={setNuevaDescripcion}
          onClose={() => setShowModalCategoria(false)}
          onSave={handleGuardar}
        />

        <ModalSubcategoria
          show={showModalSubcategoria}
          categorias={categorias}
          idCategoria={categoriaSeleccionada}
          descripcion={nuevaSubcategoria}
          onCategoriaChange={setCategoriaSeleccionada}
          onDescripcionChange={setNuevaSubcategoria}
          onClose={() => setShowModalSubcategoria(false)}
          onSave={handleGuardarSubcategoria}
        />

        <ModalSuscripcion
          show={showModalSuscripcion}
          descripcion={descripcionSuscripcion}
          precio={precioSuscripcion}
          onDescripcionChange={setDescripcionSuscripcion}
          onPrecioChange={setPrecioSuscripcion}
          onClose={() => setShowModalSuscripcion(false)}
          onSave={handleGuardarSuscripcion}
        />

        <ModalSuscripcion
          show={showModalEditarSuscripcion}
          descripcion={suscripcionEditando?.descripcion || ''}
          precio={suscripcionEditando?.precio || ''}
          onDescripcionChange={(val) =>
            setSuscripcionEditando((prev) => prev ? { ...prev, descripcion: val } : prev)
          }
          onPrecioChange={(val) =>
            setSuscripcionEditando((prev) => prev ? { ...prev, precio: val } : prev)
          }
          onClose={() => setShowModalEditarSuscripcion(false)}
          onSave={guardarCambiosSuscripcion}
          titulo="Editar Suscripción"
        />
        <ModalEditarCategoria
          show={showModalEditarCategoria}
          descripcion={editarDescripcion}
          onChange={setEditarDescripcion}
          onClose={() => setShowModalEditarCategoria(false)}
          onSave={guardarCambiosCategoria}
        />
        <ModalEditarSubcategoria
          show={showModalEditarSubcategoria}
          categorias={categorias}
          idCategoria={editarCategoriaSubcat}
          descripcion={editarDescripcionSubcat}
          onCategoriaChange={setEditarCategoriaSubcat}
          onDescripcionChange={setEditarDescripcionSubcat}
          onClose={() => setShowModalEditarSubcategoria(false)}
          onSave={guardarCambiosSubcategoria}
        />
        <ModalUsuario
          show={showModalUsuario}
          nombre={nombreUsuario}
          contrasena={contrasenaUsuario}
          onNombreChange={setNombreUsuario}
          onContrasenaChange={setContrasenaUsuario}
          onClose={() => setShowModalUsuario(false)}
          onSave={guardarUsuario}
          titulo={usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
        />

      </div>
    </div>
  );
};

export default Ajustes;
