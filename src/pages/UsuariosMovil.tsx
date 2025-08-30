import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "https://sistemawebpro.com"; // 👈 ajusta si tu endpoint es distinto

// Interfaces
interface UsuarioMovil {
  idusuariom: number;
  nombre: string;
  telefono: string;
  correo: string;
  activo: boolean;
  tarjeta?: string;
  suscripcion?: number | null;
  pago?: string;
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
        const resUsuarios = await axios.get(`${API_URL}/api/usuarios`);
        setUsuarios(resUsuarios.data);

        const resSuscripciones = await axios.get(`${API_URL}/api/suscripciones`);
        setSuscripciones(resSuscripciones.data);

        setTotalPaginas(Math.ceil(resUsuarios.data.length / registrosPorPagina));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchData();
  }, []);

  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPagina = usuarios.slice(inicio, fin);

  // ✅ Cambiar estado activo en backend
  const toggleActivo = async (id: number, currentActivo: boolean) => {
    try {
      const resp = await axios.put(`${API_URL}/api/usuarios/${id}/activo`, {
        activo: !currentActivo,
      });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.idusuariom === id ? { ...u, activo: resp.data.activo } : u
        )
      );
    } catch (err) {
      console.error("Error al actualizar activo:", err);
      alert("No se pudo cambiar el estado");
    }
  };

  // ✅ Cambiar suscripción en backend
  const handleUpdateSuscripcion = async (id: number, idsuscripcion: number) => {
    try {
      const resp = await axios.put(
        `${API_URL}/api/usuarios/${id}/suscripcion`,
        { idsuscripcion }
      );

      setUsuarios((prev) =>
        prev.map((u) =>
          u.idusuariom === id
            ? { ...u, suscripcion: resp.data.usuario.suscripcion }
            : u
        )
      );

      alert("Suscripción actualizada");
    } catch (err) {
      console.error("Error al actualizar suscripción:", err);
      alert("No se pudo actualizar suscripción");
    }
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
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((usuario) => (
              <tr key={usuario.idusuariom}>
                <td>{usuario.nombre}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.correo}</td>
                <td>
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={usuario.activo}
                      onChange={() =>
                        toggleActivo(usuario.idusuariom, usuario.activo)
                      }
                    />
                  </div>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={usuario.tarjeta || "Pendiente"}
                    onChange={(e) =>
                      setUsuarios((prev) =>
                        prev.map((u) =>
                          u.idusuariom === usuario.idusuariom
                            ? { ...u, tarjeta: e.target.value }
                            : u
                        )
                      )
                    }
                  >
                    <option>Pendiente</option>
                    <option>Enviada</option>
                    <option>Entregada</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={usuario.suscripcion || ""}
                    onChange={(e) =>
                      handleUpdateSuscripcion(
                        usuario.idusuariom,
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value="">-- Seleccionar suscripción --</option>
                    {suscripciones.map((s) => (
                      <option key={s.idsuscripcion} value={s.idsuscripcion}>
                        {s.descripcion} - ${s.precio}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{usuario.pago || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
              <button
                className="page-link"
                onClick={() => setPaginaActual(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              paginaActual === totalPaginas ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UsuariosMovil;
