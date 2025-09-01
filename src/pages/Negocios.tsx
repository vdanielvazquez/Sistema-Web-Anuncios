// ... tus imports y interfaces siguen igual
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://sistemawebpro.com";

interface UsuarioMovil {
  idusuariom: number;
  nombre: string;
  apellido?: string;
  telefono: string;
  correo: string;
  activo: boolean;
  pago?: boolean;
  fecha_pago?: string;
  // otros campos que tengas
}

const UsuariosMovil = () => {
  const [usuarios, setUsuarios] = useState<UsuarioMovil[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioMovil[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [mostrarActivos, setMostrarActivos] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(true);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/usuariosmovil`);
        setUsuarios(res.data);
        setUsuariosFiltrados(res.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  // Filtrado
  useEffect(() => {
    let filtrados = usuarios;

    if (terminoBusqueda.trim() !== "") {
      filtrados = filtrados.filter(u =>
        `${u.nombre} ${u.apellido || ""}`.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
    }

    if (!mostrarTodos) {
      if (mostrarActivos) filtrados = filtrados.filter(u => u.activo);
      if (mostrarInactivos) filtrados = filtrados.filter(u => !u.activo);
      if (mostrarPendientes) filtrados = filtrados.filter(u => !u.pago);
    }

    setUsuariosFiltrados(filtrados);
    setPaginaActual(1);
  }, [terminoBusqueda, mostrarActivos, mostrarInactivos, mostrarPendientes, mostrarTodos, usuarios]);

  // Estadísticas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;
  const usuariosPendientes = usuarios.filter(u => !u.pago).length;

  const cardsData = [
    { title: totalUsuarios.toString(), description: "Total de Usuarios" },
    { title: usuariosActivos.toString(), description: "Usuarios Activos" },
    { title: usuariosInactivos.toString(), description: "Usuarios Inactivos" },
    { title: usuariosPendientes.toString(), description: "Pendiente de Pago" },
  ];

  // Paginación para tabla
  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
  const indexInicio = (paginaActual - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indexInicio, indexFin);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Usuarios Móvil</h2>

      {/* Tarjetas de estadísticas */}
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        {cardsData.map((card, i) => (
          <div className="col" key={i}>
            <div className="card text-center p-3">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Búsqueda y filtros */}
      <div className="row mb-3 align-items-end">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
        </div>

        <div className="col-md-8 d-flex gap-3 flex-wrap align-items-center">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={mostrarTodos}
              onChange={() => {
                setMostrarTodos(true);
                setMostrarActivos(false);
                setMostrarInactivos(false);
                setMostrarPendientes(false);
              }}
            />
            <label className="form-check-label">Todos</label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={mostrarActivos}
              onChange={() => {
                setMostrarActivos(true);
                setMostrarInactivos(false);
                setMostrarPendientes(false);
                setMostrarTodos(false);
              }}
            />
            <label className="form-check-label">Activos</label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={mostrarInactivos}
              onChange={() => {
                setMostrarActivos(false);
                setMostrarInactivos(true);
                setMostrarPendientes(false);
                setMostrarTodos(false);
              }}
            />
            <label className="form-check-label">Inactivos</label>
          </div>

          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={mostrarPendientes}
              onChange={() => {
                setMostrarActivos(false);
                setMostrarInactivos(false);
                setMostrarPendientes(true);
                setMostrarTodos(false);
              }}
            />
            <label className="form-check-label">Pendiente de Pago</label>
          </div>
        </div>
      </div>

      {/* Tu tabla actual */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Activo</th>
              <th>Tarjeta</th>
              <th>Suscripción</th>
              <th>Vigencia</th>
              <th>Pago</th>
              <th>Fecha de pago</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr key={usuario.idusuariom}>
                <td>{`${usuario.nombre} ${usuario.apellido || ""}`}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.activo ? "Sí" : "No"}</td>
                <td>{usuario.pago ? "Sí" : "No"}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>{usuario.fecha_pago ? new Date(usuario.fecha_pago).toLocaleDateString() : "-"}</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </button>
            </li>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default UsuariosMovil;
