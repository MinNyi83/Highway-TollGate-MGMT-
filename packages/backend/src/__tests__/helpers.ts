import request from 'supertest';
import app from '../app';

export async function createTestUser(data?: {
  email?: string;
  password?: string;
  role?: string;
  customerType?: string;
  nrcNumber?: string;
  companyName?: string;
  companyRegNo?: string;
}) {
  const customerType = data?.customerType || 'INDIVIDUAL';
  const userData = {
    email: data?.email || `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`,
    password: data?.password || 'password123',
    name: 'Test User',
    role: data?.role || 'ADMIN',
    customerType,
    nrcNumber: data?.nrcNumber || (customerType === 'INDIVIDUAL' ? `12/TEST(N)${Math.floor(100000 + Math.random() * 900000)}` : undefined),
    companyName: customerType === 'ENTERPRISE' ? (data?.companyName || 'Test Corp') : undefined,
    companyRegNo: customerType === 'ENTERPRISE' ? (data?.companyRegNo || 'REG-12345') : undefined,
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(userData);

  const token = response.body.token || response.body.accessToken;
  return { ...response.body, token, accessToken: token, password: userData.password };
}

export async function getAuthToken(email: string, password: string) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.token || response.body.accessToken;
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

