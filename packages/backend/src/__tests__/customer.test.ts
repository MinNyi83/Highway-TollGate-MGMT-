import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Customer Portal API', () => {
  let customerToken: string;
  let customerEmail: string;

  beforeAll(async () => {
    customerEmail = `customer-${Date.now()}@test.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: customerEmail,
        password: 'password123',
        name: 'Test Customer',
        customerType: 'INDIVIDUAL',
        nrcNumber: '12/TEST(N)123456',
      });
    customerToken = regRes.body.token || regRes.body.accessToken;
  });

  describe('POST /api/customer/login', () => {
    it('should login customer', async () => {
      const res = await request(app)
        .post('/api/customer/login')
        .send({ email: customerEmail, password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/customer/login')
        .send({ email: customerEmail, password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/customer/dashboard', () => {
    it('should return dashboard data', async () => {
      const res = await request(app)
        .get('/api/customer/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('balance');
      expect(res.body).toHaveProperty('vehicleCount');
      expect(res.body).toHaveProperty('recentEvents');
    });

    it('should reject unauthenticated', async () => {
      const res = await request(app).get('/api/customer/dashboard');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/customer/account', () => {
    it('should return account info', async () => {
      const res = await request(app)
        .get('/api/customer/account')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('balance');
      expect(res.body).toHaveProperty('rfidTags');
    });
  });

  describe('POST /api/customer/topup', () => {
    it('should top up account', async () => {
      const res = await request(app)
        .post('/api/customer/topup')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ amount: 50, paymentMethod: 'manual' });
      expect(res.status).toBe(200);
      expect(res.body.balance).toBe(50);
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/customer/topup')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ amount: -10 });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/customer/topup-history', () => {
    it('should return top-up history', async () => {
      const res = await request(app)
        .get('/api/customer/topup-history')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/customer/toll-events', () => {
    it('should return toll events', async () => {
      const res = await request(app)
        .get('/api/customer/toll-events')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/customer/violations', () => {
    it('should return violations', async () => {
      const res = await request(app)
        .get('/api/customer/violations')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/customer/register-vehicle', () => {
    it('should register a vehicle', async () => {
      const res = await request(app)
        .post('/api/customer/register-vehicle')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('plateNumber', `TEST-${Date.now()}`)
        .field('make', 'Toyota')
        .field('model', 'Corolla')
        .field('year', '2024')
        .field('vehicleClass', 'SEDAN');
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('vehicle');
      expect(res.body).toHaveProperty('rfidTag');
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/customer/register-vehicle')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('plateNumber', `TEST-${Date.now()}`);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/customer/my-vehicles', () => {
    it('should return registered vehicles', async () => {
      const res = await request(app)
        .get('/api/customer/my-vehicles')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('should change password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ currentPassword: 'password123', newPassword: 'newpass123' });
      expect(res.status).toBe(200);
    });

    it('should reject wrong current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ currentPassword: 'wrongpass', newPassword: 'newpass123' });
      expect(res.status).toBe(400);
    });
  });
});

describe('Reports API', () => {
  let adminToken: string;

  beforeAll(async () => {
    let res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tollgate.com', password: 'password123' });
    if (res.status !== 200) {
      res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-rep-${Date.now()}@tollgate.com`,
          password: 'password123',
          name: 'System Admin',
          role: 'ADMIN',
          customerType: 'INDIVIDUAL',
          nrcNumber: '12/ADM(N)123456',
        });
    }
    adminToken = res.body.token || res.body.accessToken;
  });

  describe('GET /api/reports/summary', () => {
    it('should return summary stats', async () => {
      const res = await request(app)
        .get('/api/reports/summary')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalVehicles');
      expect(res.body).toHaveProperty('totalRevenue');
      expect(res.body).toHaveProperty('activeViolations');
      expect(res.body).toHaveProperty('totalEvents');
    });
  });

  describe('GET /api/reports/revenue', () => {
    it('should return revenue by plaza', async () => {
      const res = await request(app)
        .get('/api/reports/revenue')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ startDate: '2026-01-01', endDate: '2026-12-31' });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/reports/violations/stats', () => {
    it('should return violation stats', async () => {
      const res = await request(app)
        .get('/api/reports/violations/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Device Status API', () => {
  let adminToken: string;

  beforeAll(async () => {
    let res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tollgate.com', password: 'password123' });
    if (res.status !== 200) {
      res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-dev-${Date.now()}@tollgate.com`,
          password: 'password123',
          name: 'System Admin',
          role: 'ADMIN',
          customerType: 'INDIVIDUAL',
          nrcNumber: '12/DEV(N)123456',
        });
    }
    adminToken = res.body.token || res.body.accessToken;
  });

  describe('GET /api/device-status', () => {
    it('should return device statuses', async () => {
      const res = await request(app)
        .get('/api/device-status')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
