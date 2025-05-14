import axios from 'axios';

const API_URL = 'https://sistemawebpro.com/api'; // Ajusta la URL si es necesario

// Definición de la interfaz Cliente
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
}

// Obtener lista de clientes
export const getClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await axios.get<Cliente[]>(`${API_URL}/clientes`); // 👈 Define response type for Axios
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};


// Crear un nuevo cliente
export const createCliente = async (clienteData: Cliente): Promise<Cliente | null> => {
  try {
    const response = await axios.post<Cliente>(`${API_URL}/clientes`, clienteData); // 👈 Define response type
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return null;
  }
};
