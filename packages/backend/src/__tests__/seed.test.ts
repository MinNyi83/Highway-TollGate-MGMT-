import request from 'supertest';
import app from '../app';

describe('Seed Data Verification', () => {
  let token: string;

  beforeAll(async () => {
    let loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tollgate.com', password: 'password123' });

    if (loginResponse.status !== 200) {
      loginResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: `admin-seed-${Date.now()}@tollgate.com`,
          password: 'password123',
          name: 'System Admin',
          role: 'ADMIN',
          customerType: 'INDIVIDUAL',
          nrcNumber: '12/SED(N)123456',
        });
    }

    token = loginResponse.body.token || loginResponse.body.accessToken;
  });

  describe('GET /api/vehicles', () => {
    it('should return seeded vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/toll-plazas', () => {
    it('should return seeded plazas', async () => {
      const response = await request(app)
        .get('/api/toll-plazas')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/users', () => {
    it('should return seeded users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
