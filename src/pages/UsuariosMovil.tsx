import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://sistemawebpro.com"; // Ajusta si tu endpoint es distinto

// Interfaces
interface UsuarioMovil {
  idusuariom: number;
  nombre: string;
  apellido?: string; // 👈 añadimos apellido
  telefono: string;
  correo: string;
  activo: boolean;
  tarjeta?: "pendiente" | "enviada" | "entregada";
  pago?: boolean;
  fecha_pago?: string; // 👈 nueva fecha de pago
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

  const registrosPorPagina = 5;

  useEffect(() => {
  const fetchData = async () => {
    try {
      // Traer usuarios
      const resUsuarios = await axios.get(`${API_URL}/api/usuariosmovil`);
      const usuariosData: UsuarioMovil[] = resUsuarios.data || [];

      // Traer suscripciones disponibles
      const resSuscripciones = await axios.get(`${API_URL}/api/suscripcion`);
      setSuscripciones(Array.isArray(resSuscripciones.data.data) ? resSuscripciones.data.data : []);

      // Traer suscripción actual de cada usuario
      const usuariosConSuscripcion = await Promise.all(
        usuariosData.map(async (usuario) => {
          try {
            const res = await axios.get(
              `${API_URL}/api/usuariosmovil/${usuario.idusuariom}/suscripcion`
            );
            return { ...usuario, ...res.data };
          } catch (err) {
            // Si no hay suscripción activa, devolvemos el usuario sin suscripción
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


  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPagina = usuarios.slice(inicio, fin);

  // Cambiar estado activo
  const toggleActivo = async (id: number, currentActivo: boolean) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/activo`, {
        activo: !currentActivo,
      });
      setUsuarios((prev) =>
        prev.map((u) => (u.idusuariom === id ? { ...u, activo: resp.data.activo } : u))
      );
    } catch (err) {
      console.error("Error al actualizar activo:", err);
      alert("No se pudo cambiar el estado");
    }
  };

  // Cambiar suscripción
  const handleUpdateSuscripcion = async (id: number, idsuscripcion: number) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/suscripcion`, {
        idsuscripcion,
      });

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
    } catch (err) {
      console.error("Error al actualizar suscripción:", err);
      alert("No se pudo actualizar suscripción");
    }
  };

  // Cambiar tarjeta
  const handleUpdateTarjeta = async (id: number, tarjeta: "pendiente" | "enviada" | "entregada") => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/tarjeta`, { tarjeta });
      setUsuarios((prev) =>
        prev.map((u) => (u.idusuariom === id ? { ...u, tarjeta: resp.data.tarjeta } : u))
      );
    } catch (err) {
      console.error("Error al actualizar tarjeta:", err);
      alert("No se pudo actualizar tarjeta");
    }
  };

  // Cambiar pago
  const handleUpdatePago = async (id: number, pago: boolean) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuariosmovil/${id}/pago`, { pago });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.idusuariom === id
            ? { ...u, pago: resp.data.pago, fecha_pago: resp.data.fecha_pago } // 👈 guardamos fecha_pago
            : u
        )
      );
    } catch (err) {
      console.error("Error al actualizar pago:", err);
      alert("No se pudo actualizar pago");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">Usuarios Móvil</h3>

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
              <th>Dirección </th> 
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((usuario) => (
              <tr key={usuario.idusuariom}>
                {/* Nombre + Apellido */}
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

                {/* Tarjeta */}
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

                {/* Suscripción */}
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
                    <div style={{ fontSize: "0.85rem", color: "#555" }}>
                      {usuario.descripcion} (${usuario.precio})
                    </div>
                  )}
                </td>

                {/* Vigencia */}
                <td>
                  {usuario.fecha_inicio && usuario.fecha_fin
                    ? `${formatDate(usuario.fecha_inicio)} → ${formatDate(usuario.fecha_fin)}`
                    : "-"}
                </td>
                {/* Pago */}
                <td>
                    <div className="form-check d-flex justify-content-center">
                        <input
                        className="form-check-input"
                        type="checkbox"
                        checked={usuario.pago || false}
                        disabled={usuario.pago || false} // deshabilita si ya está pagado
                        onChange={async () => {
                            try {
                            // Marcar pago
                            await handleUpdatePago(usuario.idusuariom, true);
                            // Actualizar fecha de pago
                            const resp = await axios.put(`${API_URL}/api/usuariosmovil/${usuario.idusuariom}/fecha_pago`);
                            setUsuarios((prev) =>
                                prev.map((u) =>
                                u.idusuariom === usuario.idusuariom
                                    ? { ...u, pago: true, fecha_pago: resp.data.fecha_pago }
                                    : u
                                )
                            );
                            } catch (err) {
                            console.error("Error al marcar pago:", err);
                            alert("No se pudo actualizar el pago");
                            }
                        }}
                        />
                    </div>
                </td>
                {/* Fecha de pago */}
                <td className="text-center">
                {usuario.fecha_pago ? new Date(usuario.fecha_pago).toLocaleDateString() : "-"}
                </td>
                <td><button>Detalels</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>
              Anterior
            </button>
          </li>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <li key={i + 1} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UsuariosMovil;
