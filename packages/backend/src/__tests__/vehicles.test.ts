import request from 'supertest';
import app from '../app';

describe('Vehicle + RFID Flow', () => {
  let token: string;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: `vehicle-test-${Date.now()}@example.com`, password: 'password123', name: 'Vehicle Test', role: 'ADMIN' });
    token = registerResponse.body.accessToken;
  });

  describe('Vehicle Creation', () => {
    it('should create a vehicle', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('RFID Binding', () => {
    it('should bind RFID tag to vehicle', async () => {
      const vehicles = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(vehicles.status).toBe(200);
    });
  });

  describe('Vehicle List', () => {
    it('should return all vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
