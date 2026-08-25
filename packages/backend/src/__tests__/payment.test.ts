import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Payment Gateway', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Create test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `payment-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Payment Test User',
        customerType: 'INDIVIDUAL',
        nrcNumber: '12/ABM(N)123456',
      });

    userId = registerRes.body.user.id;
    authToken = registerRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/payments/methods', () => {
    it('should return list of payment methods', async () => {
      const res = await request(app)
        .get('/api/payments/methods')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('configured');
    });
  });

  describe('POST /api/payments/topup', () => {
    it('should initiate manual top-up', async () => {
      const res = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000, paymentMethod: 'manual' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.balance).toBeDefined();
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: -100, paymentMethod: 'manual' });

      expect(res.status).toBe(400);
    });

    it('should reject amount exceeding limit', async () => {
      const res = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 2000000, paymentMethod: 'manual' });

      expect(res.status).toBe(400);
    });

    it('should initiate mock QR payment when API keys not configured', async () => {
      const res = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 10000, paymentMethod: 'kbzpay' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.qrCode).toBeDefined();
      expect(res.body.transactionId).toBeDefined();
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/payments/topup')
        .send({ amount: 5000, paymentMethod: 'manual' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/payments/status/:transactionId', () => {
    it('should return payment status', async () => {
      // First create a top-up
      const topupRes = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000, paymentMethod: 'manual' });

      const transactionId = topupRes.body.orderId;

      const res = await request(app)
        .get(`/api/payments/status/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('transactionId');
    });

    it('should return failed for non-existent transaction', async () => {
      const res = await request(app)
        .get('/api/payments/status/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('failed');
    });
  });

  describe('POST /api/payments/refund', () => {
    it('should process refund for completed transaction', async () => {
      // First create a completed top-up
      const topupRes = await request(app)
        .post('/api/payments/topup')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 5000, paymentMethod: 'manual' });

      const transactionId = topupRes.body.orderId;

      const res = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ transactionId, amount: 2500, reason: 'Test refund' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should require transaction ID and amount', async () => {
      const res = await request(app)
        .post('/api/payments/refund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
