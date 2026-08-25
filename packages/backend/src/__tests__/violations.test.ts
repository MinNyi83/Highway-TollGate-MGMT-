import request from 'supertest';
import app from '../app';

describe('Violation Flow', () => {
  let token: string;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email: `violation-test-${Date.now()}@example.com`, password: 'password123', name: 'Violation Test', role: 'ADMIN' });
    token = registerResponse.body.accessToken;
  });

  describe('Violation List', () => {
    it('should return violations', async () => {
      const response = await request(app)
        .get('/api/violations')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
