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
    const response = await axios.get(`${API_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

// Crear un nuevo cliente
export const createCliente = async (clienteData: Cliente): Promise<Cliente | null> => {
  try {
    const response = await axios.post(`${API_URL}/clientes`, clienteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return null;
  }
};
