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

let authToken: string | null = null;

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
  const token = response.data.token || response.data.accessToken;
  setAuthToken(token);
  return token;
}

export function setAuthToken(token: string) {
  authToken = token;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function getVehicles(): Promise<any[]> {
  const response = await apiClient.get('/api/vehicles');
  return response.data;
}

export async function getTollPlazas(): Promise<any[]> {
  const response = await apiClient.get('/api/toll-plazas');
  return response.data;
}

export async function createEntryEvent(data: {
  vehicleId: string;
  plazaId: string;
  rfidTagId?: string;
  anprPlate?: string;
}) {
  const response = await apiClient.post('/api/toll-events/entry', data);
  return response.data;
}

export async function completeExitEvent(eventId: string, data: {
  anprPlate?: string;
}) {
  const response = await apiClient.put(`/api/toll-events/${eventId}/exit`, data);
  return response.data;
}

export async function getTollEvents(): Promise<any[]> {
  const response = await apiClient.get('/api/toll-events');
  return response.data;
}

export async function getAccounts(): Promise<any[]> {
  const response = await apiClient.get('/api/accounts');
  return response.data;
}
