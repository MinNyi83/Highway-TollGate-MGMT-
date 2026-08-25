import request from 'supertest';
import app from '../app';

export async function createTestUser(data?: { email?: string; password?: string; role?: string }) {
  const userData = {
    email: data?.email || `test-${Date.now()}@example.com`,
    password: data?.password || 'password123',
    name: 'Test User',
    role: data?.role || 'ADMIN',
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(userData);

  return { ...response.body, password: userData.password };
}

export async function getAuthToken(email: string, password: string) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.accessToken;
}

export async function createTestVehicle(token: string, data?: { plateNumber?: string; rfidTag?: string }) {
  const vehicleData = {
    plateNumber: data?.plateNumber || `TEST-${Date.now()}`,
    rfidTag: data?.rfidTag || `RF${Date.now()}`,
    vehicleClass: 'SEDAN',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    color: 'White',
  };

  const response = await request(app)
    .get('/api/vehicles')
    .set('Authorization', `Bearer ${token}`);

  return vehicleData;
}
