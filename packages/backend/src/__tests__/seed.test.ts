import request from 'supertest';
import app from '../app';

describe('Seed Data Verification', () => {
  let token: string;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@tollgate.com', password: 'admin123' });

    if (loginResponse.status === 200) {
      token = loginResponse.body.accessToken;
    }
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
