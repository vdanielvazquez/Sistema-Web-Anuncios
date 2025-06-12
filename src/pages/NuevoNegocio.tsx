import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "../css/nuevonegocio.css";
import { useMap } from 'react-leaflet';

import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

import debounce from 'lodash.debounce';
import ubicacion from "../assets/ubicacion.png";
import L from 'leaflet';


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

interface Categoria {
  idcategoria: number;
  descripcion: string;
}

interface Subcategoria {
  subcategoria: number;
  descripcion: string;
}
const iconUbicacion = new L.Icon({
  iconUrl: ubicacion,
  iconSize: [32, 32], // tamaño del icono, ajusta si quieres
  iconAnchor: [16, 32], // punto del icono que estará en la posición exacta (normalmente la punta)
  popupAnchor: [0, -32], // si usas popup, ajusta dónde aparece
});

const MapClickHandler = ({ setFormData }: { setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setFormData(prev => ({
        ...prev,
        latitud: lat,
        longitud: lng,
      }));
    },
  });

  return null;
};

const MapCenterUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 13);
  }, [center, map]);

  return null;
};


const NuevoNegocio = () => {
  const [formData, setFormData] = useState<FormData>({
    Nombre_comercial: '',
    telefono: '',
    idcliente: null,
    idestado: null,
    idmunicipio: null,
  });

  const API_URL = 'https://sistemawebpro.com';
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 19.4326, lng: -99.1332 });

  const [clienteInput, setClienteInput] = useState<string>('');
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

 const buscarUbicacion = async (query: string) => {
  try {
    const res = await axios.get(`${API_URL}/api/negocios/geocodificar`, {
      params: { q: query }
    });
    return res.data;
  } catch (err) {
    console.error('Error al geocodificar:', err);
    return null;
  }
};
const [telefonoValido, setTelefonoValido] = useState<boolean>(true);

  // Carga inicial de clientes y estados
  useEffect(() => {
    axios.get(`${API_URL}/api/clientes`)
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al obtener clientes:', err));

    axios.get(`${API_URL}/api/ubicacion/estados`)
      .then(res => setEstados(res.data))
      .catch(err => console.error('Error al obtener estados:', err));
  }, []);

  // Carga de municipios al cambiar estado
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

  // Carga de categorías
  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategorias(res.data.data);
        } else {
          console.error('La respuesta no contiene categorías válidas');
        }
      })
      .catch(err => console.error('Error al obtener categorias:', err));
  }, []);

  // Carga de subcategorías al cambiar categoría
  useEffect(() => {
    if (formData.idcategoria) {
      axios.get(`${API_URL}/api/subcategorias/categoria/${formData.idcategoria}`)
        .then(res => {
          if (res.data.success && Array.isArray(res.data.data)) {
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

  // Búsqueda filtrada de clientes con debounce
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (clienteInput.trim() === '') {
        setFilteredClientes([]);
        return;
      }
      setFilteredClientes(
        clientes.filter(cliente =>
          cliente.nombre.toLowerCase().includes(clienteInput.toLowerCase())
        )
      );
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [clienteInput, clientes]);

  const handleClienteSelect = (cliente: Cliente) => {
    setFormData(prev => ({ ...prev, idcliente: cliente.idcliente }));
    setClienteInput(cliente.nombre);
    setFilteredClientes([]);
  };



const handleMunicipioChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const id = parseInt(e.target.value);
  const municipio = municipios.find(m => m.idmunicipio === id);

  setFormData(prev => ({
    ...prev,
    idmunicipio: id,
  }));

  if (municipio && formData.idestado) {
    const estadoNombre = estados.find(est => est.idestado === formData.idestado)?.estado;
    if (estadoNombre) {
      const query = `${municipio.municipio}, ${estadoNombre}, México`;
      const data = await buscarUbicacion(query); // <--- aquí sigue igual
     if (data && data.lat && data.lon) {
        const latNum = parseFloat(data.lat);
        const lonNum = parseFloat(data.lon);
        setMapCenter({ lat: latNum, lng: lonNum });
        setFormData(prev => ({ ...prev, latitud: latNum, longitud: lonNum }));
      }  else {
        console.warn('Ubicación no encontrada');
      }
    }
  }
};
///
useEffect(() => {
  const fetchUbicacionPorCP = async () => {
    if (!formData.codigop || String(formData.codigop).length < 4) return;

    if (!formData.codigop) return;

    const data = await buscarUbicacion(`${formData.codigop}, México`);
    if (data && data.lat && data.lon) {
      const latNum = parseFloat(data.lat);
      const lonNum = parseFloat(data.lon);
      setMapCenter({ lat: latNum, lng: lonNum });
      setFormData(prev => ({
        ...prev,
        latitud: latNum,
        longitud: lonNum
      }));
    } else {
      console.warn('Ubicación no encontrada para el código postal');
    }
  };

  fetchUbicacionPorCP();
}, [formData.codigop]);


/////////
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // Validar el campo de teléfono
  if (name === 'telefono') {
    const soloNumeros = value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
    if (soloNumeros.length <= 10) {
      setFormData(prev => ({ ...prev, telefono: soloNumeros }));
      setTelefonoValido(soloNumeros.length === 10);
    }
    return; // Salir para no ejecutar el resto
  }

  // Para los demás campos
  setFormData(prev => {
    const shouldParseToNumber = ['idcliente', 'idcategoria', 'idestado', 'idmunicipio', 'subcategoria'].includes(name);
    return {
      ...prev,
      [name]: shouldParseToNumber ? Number(value) : value
    };
  });
};



//
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
      codigop,
    } = formData;

    // Validar campos obligatorios
    const missingFields = [];
    if (!Nombre_comercial) missingFields.push("Nombre del negocio");
    if (!telefono) missingFields.push("Teléfono");
    if (!idcliente) missingFields.push("Representante Legal");
    if (!idestado) missingFields.push("Estado");
    if (!idmunicipio) missingFields.push("Municipio");
    if (!idcategoria) missingFields.push("Categoría");

    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos: ${missingFields.join(", ")}`);
      return;
    }

    
  // Aquí el log para ver qué datos se envían
  console.log('Datos enviados al backend:', {
    Nombre_comercial,
    telefono,
    idcliente,
    idestado,
    idmunicipio,
    idcategoria,
    subcategoria,
    latitud,
    longitud,
    codigop,
  });
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/negocios`, {
        Nombre_comercial,
        telefono,
        idcliente,
        idestado,
        idmunicipio,
        idcategoria,
        subcategoria,
        latitud,
        longitud,
        codigop,
      });

      alert('Negocio registrado correctamente.');

      // Limpiar formulario
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
    } catch (err) {
      console.error('Error al registrar negocio:', err);
      alert('Hubo un error al guardar el negocio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="divprincipal">
      <div className='d-flex flexnegocion'>
        <div className='divnegocion'>
          <form onSubmit={handleSubmit}>
            <h2>Nuevo negocio</h2>
            <div className="row">

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="clienteInput" className="form-label">Representante Legal</label>
                <input  type="text"  className="form-control"  id="clienteInput"  value={clienteInput}  onChange={(e) => { setClienteInput(e.target.value); setFormData(prev => ({ ...prev, idcliente: null })); }} required />
                {filteredClientes.length > 0 && formData.idcliente === null && (
                  <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }} role="listbox">
                    {filteredClientes.map(cliente => (
                      <li key={cliente.idcliente} role="option"  className="list-group-item list-group-item-action"  onClick={() => handleClienteSelect(cliente)}  style={{ cursor: 'pointer' }}  >  {cliente.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="Nombre_comercial" className="form-label">Nombre del Negocio</label>
                <input
                  type="text"
                  className="form-control"
                  id="Nombre_comercial"
                  name="Nombre_comercial"
                  value={formData.Nombre_comercial}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
               <input
                  type="tel"
                  className={`form-control ${formData.telefono ? (telefonoValido ? 'is-valid' : 'is-invalid') : ''}`}
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idestado" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="idestado"
                  name="idestado"
                  value={formData.idestado ?? ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  {estados.map((estado) => (
                    <option key={estado.idestado} value={estado.idestado}>
                      {estado.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idmunicipio" className="form-label">Municipio</label>
                <select
                  className="form-select"
                  id="idmunicipio"
                  name="idmunicipio"
                  value={formData.idmunicipio ?? ''}
                  onChange={handleMunicipioChange}
                  required
                  disabled={!formData.idestado}
                >
                  <option value="">Seleccione un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.idmunicipio} value={municipio.idmunicipio}>
                      {municipio.municipio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idcategoria" className="form-label">Categoría</label>
                <select
                  className="form-select"
                  id="idcategoria"
                  name="idcategoria"
                  value={formData.idcategoria ?? ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.idcategoria} value={categoria.idcategoria}>
                      {categoria.descripcion}
                    </option>
                  ))}
                </select>
              </div>

           <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
  <label htmlFor="subcategoria" className="form-label">Subcategoría</label>
<select
  className="form-select"
  id="subcategoria"
  name="subcategoria"
  value={formData.subcategoria ?? ''}
  onChange={handleChange}
  required
>
  <option value="">Seleccione una subcategoría</option>
  {subcategorias.map((sub) => (
    <option key={sub.subcategoria} value={sub.subcategoria}>
      {sub.descripcion}
    </option>
  ))}
</select>

</div>


              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="codigop" className="form-label">Código Postal</label>
                <input
                  type="number"
                  className="form-control"
                  id="codigop"
                  name="codigop"
                  value={formData.codigop ?? ''}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Ubicación en mapa</label>
                <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler setFormData={setFormData} />
                  <MapCenterUpdater center={mapCenter} />
                  {formData.latitud && formData.longitud && (
                    <Marker position={[formData.latitud, formData.longitud]} icon={iconUbicacion}/>
                  )}
                </MapContainer>
              </div>

            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoNegocio;
