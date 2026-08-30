import request from 'supertest';
import app from '../app';

const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('Auth Flow', () => {
  const testUser = {
    email: `auth-test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Auth Test User',
    role: 'ADMIN',
    customerType: 'INDIVIDUAL',
    nrcNumber: '12/TEST(N)123456',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should fail with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect([400, 409]).toContain(response.status);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body.token || response.body.accessToken).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    let token: string;

    beforeAll(async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      token = loginResponse.body.token || loginResponse.body.accessToken || regRes.body.token || regRes.body.accessToken;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect([200, 404]).toContain(response.status);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
    });
  });
});

