import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function healthCheck(): Promise<boolean> {
  try {
    await apiClient.get('/api/health');
    return true;
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<string> {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data.accessToken;
}

export function setAuthToken(token: string) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function createTollEvent(data: {
  vehiclePlateNumber: string;
  rfidTag?: string;
  plazaId: string;
  vehicleClass: string;
  anprPlateNumber?: string;
}) {
  const response = await apiClient.post('/api/toll-events/entry', data);
  return response.data;
}

export async function completeTollEvent(id: string, data: {
  plazaId: string;
  anprPlateNumber?: string;
}) {
  const response = await apiClient.put(`/api/toll-events/${id}/exit`, data);
  return response.data;
}
