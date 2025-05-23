import React, { useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "../css/nuevonegocio.css"
import { useMap } from 'react-leaflet';

import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';


import debounce from 'lodash.debounce';



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
  idsubcategoria?: number | null;
  latitud?: number;
  longitud?: number;
}

interface Categoria {
  idcategoria: number;
  descripcion: string;
}
interface Subcategoria {
  idsubcategoria: number;
  descripcion: string;
}

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
    Nombre_comercial:'',
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
    }
  }, [formData.idcategoria]);

  useEffect(() => {
    axios.get(`${API_URL}/api/clientes`)
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al obtener clientes:', err));

    axios.get(`${API_URL}/api/ubicacion/estados`)
      .then(res => setEstados(res.data))
      .catch(err => console.error('Error al obtener estados:', err));
  }, []);

  useEffect(() => {
    if (formData.idestado) {
      axios.get(`${API_URL}/api/ubicacion/municipios/${formData.idestado}`)
        .then(res => setMunicipios(res.data))
        .catch(err => console.error('Error al obtener municipios:', err));
    }
  }, [formData.idestado]);

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

const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const id = parseInt(e.target.value);
  const municipio = municipios.find(m => m.idmunicipio === id);

  setFormData(prev => ({
    ...prev,
    idmunicipio: id,
  }));

  if (municipio && formData.idestado) {
    const estadoNombre = estados.find(est => est.idestado === formData.idestado)?.estado;
    if (estadoNombre) {
      geocodeLocation(estadoNombre, municipio.municipio);
    }
  }
};


const geocodeLocation = async (estado: string, municipio: string) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${municipio}, ${estado}, México`,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      setMapCenter({ lat: latNum, lng: lonNum });
      setFormData(prev => ({ ...prev, latitud: latNum, longitud: lonNum }));
    } else {
      console.warn('Ubicación no encontrada');
    }
  } catch (error) {
    console.error('Error al geocodificar ubicación:', error);
  }
};



  const handleClienteSelect = (cliente: Cliente) => {
    setFormData(prev => ({ ...prev, idcliente: cliente.idcliente }));
    setClienteInput(cliente.nombre);
    setFilteredClientes([]);
  };

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: name.startsWith('id') ? Number(value) : value };
      console.log(updatedData.idcategoria);  // Verifica si el idcategoria cambia
      return updatedData;
    });
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      idcliente,
      idestado,
      Nombre_comercial,
      telefono,
      idmunicipio,
      idcategoria,
      idsubcategoria,
      latitud,
      longitud,
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
  
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/negocios`, {
        Nombre_comercial,
        telefono,
        idcliente,
        idestado,
        idmunicipio,
        idcategoria,
        idsubcategoria,
        latitud,
        longitud,
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
        idsubcategoria: null,
        latitud: undefined,
        longitud: undefined,
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
                <input type="text" className="form-control" id="clienteInput" value={clienteInput}
                  onChange={(e) => {setClienteInput(e.target.value); setFormData(prev => ({ ...prev, idcliente: null }));}} required />
                {filteredClientes.length > 0 &&  formData.idcliente === null &&(
                  <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }} role="listbox">
                    {filteredClientes.map(cliente => (
                      <li key={cliente.idcliente} role="option" className="list-group-item list-group-item-action" onClick={() => handleClienteSelect(cliente)} style={{ cursor: 'pointer' }}>
                        {cliente.nombre}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre del Negocio</label>
                <input type="text" className="form-control" id="Nombre_comercial" name="Nombre_comercial" value={formData.Nombre_comercial} onChange={handleChange} required />
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
              </div>

            </div>

            <div className="row">
              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idestado" className="form-label">Estado</label>
                <select className="form-select" id="idestado" name="idestado" value={formData.idestado ?? ''} onChange={handleChange} required>
                  <option value="">Seleccione un estado</option>
                  {estados.map(estado => (
                    <option key={estado.idestado} value={estado.idestado}>
                      {estado.estado}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idmunicipio" className="form-label">Municipio</label>
                <select className="form-select" id="idmunicipio" name="idmunicipio" value={formData.idmunicipio ?? ''} onChange={handleMunicipioChange} required>
                  <option value="">Seleccione un municipio</option>
                  {municipios.map(municipio => (
                    <option key={municipio.idmunicipio} value={municipio.idmunicipio}>
                      {municipio.municipio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-xl-2 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="longitud" className="form-label">Longitud</label>
                <input type="text" className="form-control" id="longitud" name="longitud" value={formData.longitud ?? ''} readOnly />
              </div>

              <div className="col-xl-2 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="latitud" className="form-label">Latitud</label>
                <input type="text" className="form-control" id="latitud" name="latitud" value={formData.latitud ?? ''} readOnly />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idcategoria" className="form-label">Categoría</label>
                <select className="form-select"  id="idcategoria" name="idcategoria"onChange={handleChange}  value={formData.idcategoria ?? ''}  required >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.idcategoria} value={categoria.idcategoria}>
                      {categoria.descripcion}
                    </option>
                  ))}
                </select>
            </div>
            {subcategorias.length > 0 && (
              <div className="col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                <label htmlFor="idsubcategoria" className="form-label">Subcategoría</label>
                <select  className="form-select"  id="idsubcategoria"  name="idsubcategoria" value={formData.idsubcategoria ?? ''} onChange={handleChange}  required={subcategorias.length > 0}>
                  <option value="">Seleccione una subcategoría</option>
                  {subcategorias.map((sub) => (
                    <option key={sub.idsubcategoria} value={sub.idsubcategoria}>
                      {sub.descripcion}
                    </option>
                  ))}
                </select>
              </div> )}
            </div>
            <div className="mb-3 mt-3">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>

           {formData.idestado && formData.idmunicipio && (
            <div className="mb-3">
                <label className="form-label">Ubicación aproximada</label>
                <MapContainer
  center={mapCenter}
  zoom={13}
  style={{ height: "1000px", width: "600px" }}
>
 <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>


  <MapCenterUpdater center={mapCenter} />
  <MapClickHandler setFormData={setFormData} />
  {formData.latitud !== undefined && formData.longitud !== undefined && (
    <Marker position={[formData.latitud, formData.longitud]} />
  )}
</MapContainer>

            </div>
            )}
            </form>
        </div>
      </div>
    </div>
 );
};
export default NuevoNegocio;
