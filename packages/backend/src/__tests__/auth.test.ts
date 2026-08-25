import request from 'supertest';
import app from '../app';

const API_URL = process.env.API_URL || 'http://localhost:3000';

describe('Auth Flow', () => {
  const testUser = {
    email: `auth-test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Auth Test User',
    role: 'ADMIN',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
    });

    it('should fail with duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
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
      await request(app).post('/api/auth/register').send(testUser);
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      token = loginResponse.body.accessToken;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
    });
  });
});
