import React, { useState, useEffect } from 'react';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import '../css/nuevonegocio.css';

// Librerías externas
import axios from 'axios';
import debounce from 'lodash.debounce';
import L from 'leaflet';

// React Leaflet
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

// Assets
import ubicacion from '../assets/ubicacion.png';

// --- Interfaces ---
interface Cliente {
  idcliente: number;
  nombre: string;
}

interface Estado {
  idestado: number;
  estado: string;
}

interface Municipio {
  idmunicipio: number;
  municipio: string;
  latitud: number;
  longitud: number;
}

interface Categoria {
  idcategoria: number;
  descripcion: string;
}

interface Subcategoria {
  idsubcategoria: number;
  descripcion: string;
}

interface FormData {
  Nombre_comercial: string;
  telefono: string;
  idcliente: number | null;
  idestado: number | null;
  idmunicipio: number | null;
  idcategoria?: number | null;
  subcategoria?: number | null;
  latitud?: number;
  longitud?: number;
  codigop?: number;
}

// --- Icono del marcador ---
const iconUbicacion = new L.Icon({
  iconUrl: ubicacion,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// --- Componentes auxiliares para mapa ---

// Captura clicks para actualizar latitud y longitud
const MapClickHandler = ({ setFormData }: { setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
    },
  });
  return null;
};

// Actualiza el centro del mapa
const MapCenterUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 13);
  }, [center, map]);
  return null;
};

// --- Componente principal ---
const NuevoNegocio = () => {
  const API_URL = 'https://sistemawebpro.com';

  // Estados
  const [formData, setFormData] = useState<FormData>({
    Nombre_comercial: '',
    telefono: '',
    idcliente: null,
    idestado: null,
    idmunicipio: null,
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 19.4326, lng: -99.1332 });
  const [clienteInput, setClienteInput] = useState<string>('');
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [telefonoValido, setTelefonoValido] = useState<boolean>(true);

  // Función para geocodificar ubicación
  const buscarUbicacion = async (query: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/negocios/geocodificar`, { params: { q: query } });
      return res.data;
    } catch (err) {
      console.error('Error al geocodificar:', err);
      return null;
    }
  };
///

  // Carga inicial de clientes y estados
  useEffect(() => {
    axios.get(`${API_URL}/api/clientes`)
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al obtener clientes:', err));

    axios.get(`${API_URL}/api/ubicacion/estados`)
      .then(res => setEstados(res.data))
      .catch(err => console.error('Error al obtener estados:', err));
  }, []);

  // Carga municipios al cambiar estado
  useEffect(() => {
    if (formData.idestado) {
      axios.get(`${API_URL}/api/ubicacion/municipios/${formData.idestado}`)
        .then(res => setMunicipios(res.data))
        .catch(err => console.error('Error al obtener municipios:', err));
    } else {
      setMunicipios([]);
      setFormData(prev => ({ ...prev, idmunicipio: null }));
    }
  }, [formData.idestado]);

  // Carga categorías
  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) setCategorias(res.data.data);
        else console.error('La respuesta no contiene categorías válidas');
      })
      .catch(err => console.error('Error al obtener categorias:', err));
  }, []);

  // Carga subcategorías al cambiar categoría
  useEffect(() => {
    if (formData.idcategoria) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${formData.idcategoria}`)
        .then(res => {
          if (res.data.success && Array.isArray(res.data.data)) {
            console.log('Subcategorias recibidas del backend:', res.data.data);
            setSubcategorias(res.data.data);
          } else {
            console.error('Formato de subcategorías inválido', res.data);
            setSubcategorias([]);
          }
        })
        .catch(err => console.error('Error al obtener subcategorías:', err));
    } else {
      setSubcategorias([]);
      setFormData(prev => ({ ...prev, subcategoria: null }));
    }
  }, [formData.idcategoria]);

  // Búsqueda de clientes con debounce
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (clienteInput.trim() === '') {
        setFilteredClientes([]);
        return;
      }
      setFilteredClientes(clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(clienteInput.toLowerCase())
      ));
    }, 300);

    debouncedSearch();

    return () => debouncedSearch.cancel();
  }, [clienteInput, clientes]);

  // Maneja selección de cliente desde la lista
  const handleClienteSelect = (cliente: Cliente) => {
    setFormData(prev => ({ ...prev, idcliente: cliente.idcliente }));
    setClienteInput(cliente.nombre);
    setFilteredClientes([]);

     // Espera un pequeño tiempo antes de limpiar las sugerencias
  setTimeout(() => {
    setFilteredClientes([]);
  }, 400); // 100 ms suele ser suficiente
  };

  // Cambios en municipio, incluye geocodificación
  const handleMunicipioChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    const municipio = municipios.find(m => m.idmunicipio === id);
    setFormData(prev => ({ ...prev, idmunicipio: id }));

    if (municipio && formData.idestado) {
      const estadoNombre = estados.find(est => est.idestado === formData.idestado)?.estado;
      if (estadoNombre) {
        const query = `${municipio.municipio}, ${estadoNombre}, México`;
        const data = await buscarUbicacion(query);
        if (data && data.lat && data.lon) {
          const latNum = parseFloat(data.lat);
          const lonNum = parseFloat(data.lon);
          setMapCenter({ lat: latNum, lng: lonNum });
          setFormData(prev => ({ ...prev, latitud: latNum, longitud: lonNum }));
        } else {
          console.warn('Ubicación no encontrada');
        }
      }
    }
  };

  // Geocodifica por código postal
  useEffect(() => {
    const fetchUbicacionPorCP = async () => {
      if (!formData.codigop || String(formData.codigop).length < 4) return;
      const data = await buscarUbicacion(`${formData.codigop}, México`);
      if (data && data.lat && data.lon) {
        const latNum = parseFloat(data.lat);
        const lonNum = parseFloat(data.lon);
        setMapCenter({ lat: latNum, lng: lonNum });
        setFormData(prev => ({ ...prev, latitud: latNum, longitud: lonNum }));
      } else {
        console.warn('Ubicación no encontrada para el código postal');
      }
    };
    fetchUbicacionPorCP();
  }, [formData.codigop]);

  // Maneja cambios en inputs y selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '');
      if (soloNumeros.length <= 10) {
        setFormData(prev => ({ ...prev, telefono: soloNumeros }));
        setTelefonoValido(soloNumeros.length === 10);
      }
      return;
    }

    const shouldParseToNumber = ['idcliente', 'idcategoria', 'idestado', 'idmunicipio', 'subcategoria'].includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: shouldParseToNumber ? Number(value) : value
    }));
  };

  // Envía formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      idcliente,
      idestado,
      Nombre_comercial,
      telefono,
      idmunicipio,
      idcategoria,
      subcategoria,
      latitud,
      longitud,
      codigop
    } = formData;

    if (
      idcliente == null || idestado == null || !Nombre_comercial || !telefono ||
      idmunicipio == null || idcategoria == null || subcategoria == null
    ) {
      alert('Por favor complete todos los campos.');
      return;
    }

    if (!telefonoValido) {
      alert('El teléfono debe contener exactamente 10 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/negocios`, {
        idcliente,
        idestado,
        Nombre_comercial,
        telefono,
        idmunicipio,
        idcategoria,
        subcategoria,
        latitud,
        longitud,
        codigop,
      });
      alert(response.data.message || 'Negocio registrado correctamente.');
      setFormData({
        Nombre_comercial: '',
        telefono: '',
        idcliente: null,
        idestado: null,
        idmunicipio: null,
        idcategoria: null,
        subcategoria: null,
        latitud: undefined,
        longitud: undefined,
        codigop: undefined,
      });
      setClienteInput('');
      setFilteredClientes([]);
      setMapCenter({ lat: 19.4326, lng: -99.1332 });
    } catch (error) {
      console.error('Error al registrar negocio:', error);
      alert('Error al registrar negocio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="div-custom">
      <div className='container'>
       
        <h2 className="text-center mt-5">Nuevo Negocio</h2>
      <form onSubmit={handleSubmit}>
        {/* Primer nivel: Cliente, Nombre comercial, Teléfono */}
<div className="row">
  <div className="col-md-4 mb-3">
    <label className="form-label">Cliente</label>
    <input
      type="text"
      className="form-control"
      value={clienteInput}
      onChange={e => {
        setClienteInput(e.target.value);
        setFormData(prev => ({ ...prev, idcliente: null }));
      }}
      placeholder="Buscar cliente..."
      autoComplete="off"
      required
    />
    {filteredClientes.length > 0 && (
      <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, maxHeight: 200, overflowY: 'auto' }}>
        {filteredClientes.map(cliente => (
          <li
            key={cliente.idcliente}
            className="list-group-item list-group-item-action"
            onClick={() => handleClienteSelect(cliente)}
            style={{ cursor: 'pointer' }}
          >
            {cliente.nombre}
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Nombre Comercial</label>
    <input
      type="text"
      className="form-control"
      name="Nombre_comercial"
      value={formData.Nombre_comercial}
      onChange={handleChange}
      required
    />
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Teléfono</label>
    <input
      type="text"
      className={`form-control ${!telefonoValido ? 'is-invalid' : ''}`}
      name="telefono"
      value={formData.telefono}
      onChange={handleChange}
      maxLength={10}
      required
    />
    {!telefonoValido && <div className="invalid-feedback">Debe contener 10 dígitos.</div>}
  </div>
</div>

{/* Segundo nivel: Estado, Municipio, Código Postal */}
<div className="row">
  <div className="col-md-4 mb-3">
    <label className="form-label">Estado</label>
    <select
      className="form-select"
      name="idestado"
      value={formData.idestado || ''}
      onChange={handleChange}
      required
    >
      <option value="">Seleccione un estado</option>
      {estados.map(estado => (
        <option key={estado.idestado} value={estado.idestado}>{estado.estado}</option>
      ))}
    </select>
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Municipio</label>
    <select
      className="form-select"
      name="idmunicipio"
      value={formData.idmunicipio || ''}
      onChange={handleMunicipioChange}
      required
      disabled={!formData.idestado}
    >
      <option value="">Seleccione un municipio</option>
      {municipios.map(mun => (
        <option key={mun.idmunicipio} value={mun.idmunicipio}>{mun.municipio}</option>
      ))}
    </select>
  </div>

  <div className="col-md-4 mb-3">
    <label className="form-label">Código Postal</label>
    <input
      type="number"
      className="form-control"
      name="codigop"
      value={formData.codigop || ''}
      onChange={handleChange}
      placeholder="Ej. 50000"
    />
  </div>
</div>

{/* Tercer nivel: Categoría y Subcategoría */}
<div className="row">
  <div className="col-md-6 mb-3">
    <label className="form-label">Categoría</label>
    <select
      className="form-select"
      name="idcategoria"
      value={formData.idcategoria || ''}
      onChange={handleChange}
      required
    >
      <option value="">Seleccione una categoría</option>
      {categorias.map(cat => (
        <option key={cat.idcategoria} value={cat.idcategoria}>{cat.descripcion}</option>
      ))}
    </select>
  </div>

  <div className="col-md-6 mb-3">
    <label className="form-label">Subcategoría</label>
    <select
      className="form-select"
      name="subcategoria"
      value={formData.subcategoria || ''}
      onChange={handleChange}
      required
      disabled={!formData.idcategoria}
    >
      <option value="">Seleccione una subcategoría</option>
      {subcategorias.map(sub => (
        <option key={sub.idsubcategoria} value={sub.idsubcategoria}>{sub.descripcion}</option>
      ))}
    </select>
  </div>
</div>

{/* Mapa grande */}
<div className="mb-4">
  <label className="form-label">Ubicación en el mapa</label>
  <div style={{ height: '400px', width: '100%' }}>
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {formData.latitud && formData.longitud && (
        <Marker position={[formData.latitud, formData.longitud]} icon={iconUbicacion} />
      )}
      <MapClickHandler setFormData={setFormData} />
      <MapCenterUpdater center={mapCenter} />
    </MapContainer>
  </div>
</div>

       

        {/* Botón guardar */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default NuevoNegocio;
