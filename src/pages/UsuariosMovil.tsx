import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://sistemawebpro.com";

// Interfaces
interface UsuarioMovil {
  idusuariom: number;
  nombre: string;
  apellido?: string;
  telefono: string;
  correo: string;
  activo: boolean;
  tarjeta?: "pendiente" | "enviada" | "entregada";
  pago?: boolean;
  fecha_pago?: string;
  idusuariosuscripcion?: number;
  estado_suscripcion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  idsuscripcion?: number | null;
  descripcion?: string;
  precio?: string | number;
}

interface Suscripcion {
  idsuscripcion: number;
  descripcion: string;
  precio: number;
}

const UsuariosMovil = () => {
  const [usuarios, setUsuarios] = useState<UsuarioMovil[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);

  // Filtros
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [mostrarActivos, setMostrarActivos] = useState(false);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [mostrarNuevos, setMostrarNuevos] = useState(true); // Por defecto

  const registrosPorPagina = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuarios = await axios.get(`${API_URL}/api/usuariosmovil`);
        const usuariosData: UsuarioMovil[] = resUsuarios.data || [];

        const resSuscripciones = await axios.get(`${API_URL}/api/suscripcion`);
        setSuscripciones(
          Array.isArray(resSuscripciones.data.data) ? resSuscripciones.data.data : []
        );

        const usuariosConSuscripcion = await Promise.all(
          usuariosData.map(async (usuario) => {
            try {
              const res = await axios.get(
                `${API_URL}/api/usuariosmovil/${usuario.idusuariom}/suscripcion`
              );
              return { ...usuario, ...res.data };
            } catch {
              return usuario;
            }
          })
        );

        setUsuarios(usuariosConSuscripcion);
        setTotalPaginas(Math.ceil(usuariosConSuscripcion.length / registrosPorPagina));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchData();
  }, []);

  // Filtrado
  const usuariosFiltrados = usuarios.filter((u) => {
    let coincide = `${u.nombre} ${u.apellido || ""}`
      .toLowerCase()
      .includes(terminoBusqueda.toLowerCase());

    if (!mostrarTodos) {
      if (mostrarActivos) coincide = coincide && u.activo;
      if (mostrarInactivos) coincide = coincide && !u.activo;
      if (mostrarPendientes) coincide = coincide && !u.pago;
      if (mostrarNuevos) coincide = coincide && !u.idusuariosuscripcion && !u.pago;
    }

    return coincide;
  });

  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(inicio, fin);

  // Estadísticas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;
  const usuariosPendientes = usuarios.filter((u) => !u.pago).length;
  const usuariosNuevos = usuarios.filter((u) => !u.idusuariosuscripcion && !u.pago).length;

  const cardsData = [
    { title: totalUsuarios.toString(), description: "Total de Usuarios", filtro: "todos" },
    { title: usuariosActivos.toString(), description: "Usuarios Activos", filtro: "activos" },
    { title: usuariosInactivos.toString(), description: "Usuarios Inactivos", filtro: "inactivos" },
    { title: usuariosPendientes.toString(), description: "Pendiente de Pago", filtro: "pendientes" },
    { title: usuariosNuevos.toString(), description: "Nuevos Usuarios", filtro: "nuevos" },
  ];

  const aplicarFiltro = (filtro: string) => {
    setMostrarTodos(filtro === "todos");
    setMostrarActivos(filtro === "activos");
    setMostrarInactivos(filtro === "inactivos");
    setMostrarPendientes(filtro === "pendientes");
    setMostrarNuevos(filtro === "nuevos");
    setPaginaActual(1);
  };

  // Funciones de actualización
  const toggleActivo = async (id: number, currentActivo: boolean) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/activo`, {
        activo: !currentActivo,
      });
      setUsuarios((prev) =>
        prev.map((u) => (u.idusuariom === id ? { ...u, activo: resp.data.activo } : u))
      );
    } catch {
      alert("No se pudo cambiar el estado");
    }
  };

  const handleUpdateSuscripcion = async (id: number, idsuscripcion: number) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/suscripcion`, { idsuscripcion });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.idusuariom === id
            ? {
                ...u,
                idusuariosuscripcion: resp.data.usuario.idusuariosuscripcion,
                idsuscripcion: resp.data.usuario.idsuscripcion,
                descripcion: resp.data.usuario.descripcion,
                precio: resp.data.usuario.precio,
                fecha_inicio: resp.data.usuario.fecha_inicio,
                fecha_fin: resp.data.usuario.fecha_fin,
                estado_suscripcion: resp.data.usuario.estado_suscripcion,
              }
            : u
        )
      );
      alert("Suscripción actualizada");
    } catch {
      alert("No se pudo actualizar suscripción");
    }
  };

  const handleUpdateTarjeta = async (id: number, tarjeta: "pendiente" | "enviada" | "entregada") => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/tarjeta`, { tarjeta });
      setUsuarios((prev) =>
        prev.map((u) => (u.idusuariom === id ? { ...u, tarjeta: resp.data.tarjeta } : u))
      );
    } catch {
      alert("No se pudo actualizar tarjeta");
    }
  };

  const handleUpdatePago = async (id: number, pago: boolean) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/pago`, { pago });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.idusuariom === id
            ? { ...u, pago: resp.data.pago, fecha_pago: resp.data.fecha_pago }
            : u
        )
      );
    } catch {
      alert("No se pudo actualizar pago");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
  <div className="container my-3">
    <h3 className="text-center mb-3">Usuarios Móvil</h3>

    {/* Tarjetas de estadísticas */}
    <div className="row row-cols-1 row-cols-md-5 g-2 mb-3">
      {cardsData.map((card, i) => (
        <div className="col" key={i}>
          <div
            className="card text-center p-2"
            style={{ cursor: "pointer", fontSize: "0.8rem" }}
            onClick={() => aplicarFiltro(card.filtro)}
          >
            <h5>{card.title}</h5>
            <p className="mb-0">{card.description}</p>
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

      <div className="col-md-8 d-flex gap-2 flex-wrap align-items-center">
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={mostrarTodos}
            onChange={() => aplicarFiltro("todos")}
          />
          <label className="form-check-label">Todos</label>
        </div>

        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={mostrarActivos}
            onChange={() => aplicarFiltro("activos")}
          />
          <label className="form-check-label">Activos</label>
        </div>

        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={mostrarInactivos}
            onChange={() => aplicarFiltro("inactivos")}
          />
          <label className="form-check-label">Inactivos</label>
        </div>

        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={mostrarPendientes}
            onChange={() => aplicarFiltro("pendientes")}
          />
          <label className="form-check-label">Pendiente de Pago</label>
        </div>

        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            checked={mostrarNuevos}
            onChange={() => aplicarFiltro("nuevos")}
          />
          <label className="form-check-label">Nuevos Usuarios</label>
        </div>
      </div>
    </div>

    {/* Tabla */}
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
          {usuariosPagina.map((usuario) => (
            <tr key={usuario.idusuariom}>
              <td>{`${usuario.nombre} ${usuario.apellido || ""}`}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.correo}</td>
              <td>
                <div className="form-check form-switch d-flex justify-content-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={usuario.activo}
                    onChange={() => toggleActivo(usuario.idusuariom, usuario.activo)}
                  />
                </div>
              </td>

              <td>
                <select
                  className="form-select"
                  value={usuario.tarjeta || "pendiente"}
                  onChange={(e) =>
                    handleUpdateTarjeta(
                      usuario.idusuariom,
                      e.target.value as "pendiente" | "enviada" | "entregada"
                    )
                  }
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="enviada">Enviada</option>
                  <option value="entregada">Entregada</option>
                </select>
              </td>

              <td>
                <select
                  className="form-select mb-1"
                  value={usuario.idsuscripcion || ""}
                  onChange={(e) => {
                    if (e.target.value)
                      handleUpdateSuscripcion(usuario.idusuariom, Number(e.target.value));
                  }}
                >
                  <option value="">Cambiar suscripción</option>
                  {suscripciones.map((s) => (
                    <option key={s.idsuscripcion} value={s.idsuscripcion}>
                      {s.descripcion} - ${s.precio}
                    </option>
                  ))}
                </select>

                {usuario.descripcion && (
                  <div style={{ fontSize: "0.75rem", color: "#555" }}>
                    {usuario.descripcion} (${usuario.precio})
                  </div>
                )}
              </td>

              <td>
                {usuario.fecha_inicio && usuario.fecha_fin
                  ? `${formatDate(usuario.fecha_inicio)} → ${formatDate(usuario.fecha_fin)}`
                  : "-"}
              </td>

              <td>
                <div className="form-check d-flex justify-content-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={usuario.pago || false}
                    disabled={usuario.pago || false}
                    onChange={() => handleUpdatePago(usuario.idusuariom, true)}
                  />
                </div>
              </td>

              <td className="text-center">
                {usuario.fecha_pago ? formatDate(usuario.fecha_pago) : "-"}
              </td>

              <td>
                <button>Detalles</button>
              </td>
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
