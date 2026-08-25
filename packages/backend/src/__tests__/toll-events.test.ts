import request from 'supertest';
import app from '../app';

describe('Toll Event Flow', () => {
  let token: string;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: `toll-test-${Date.now()}@example.com`, password: 'password123', name: 'Toll Test', role: 'ADMIN' });
    token = registerResponse.body.accessToken;
  });

  describe('Toll Event Entry', () => {
    it('should create toll event entry', async () => {
      const response = await request(app)
        .post('/api/toll-events/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
          vehiclePlateNumber: 'TEST-1234',
          rfidTag: 'rf1234567890',
          plazaId: 'plaza-1',
          vehicleClass: 'SEDAN',
          anprPlateNumber: 'TEST-1234',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});

describe('Transaction Flow', () => {
  let token: string;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: `trans-test-${Date.now()}@example.com`, password: 'password123', name: 'Transaction Test', role: 'ADMIN' });
    token = registerResponse.body.accessToken;
  });

  describe('Transaction List', () => {
    it('should return transactions', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
