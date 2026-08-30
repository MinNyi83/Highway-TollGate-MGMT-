import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Toll Event Flow', () => {
  let token: string;
  let vehicleId: string;
  let plazaId: string;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: `toll-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Toll Test',
        role: 'ADMIN',
        customerType: 'INDIVIDUAL',
        nrcNumber: '12/TOL(N)123456',
      });
    token = registerResponse.body.token || registerResponse.body.accessToken;

    const user = await prisma.user.findFirst();
    const account = await prisma.account.findFirst();

    const plaza = await prisma.tollPlaza.create({
      data: {
        name: `Test Plaza ${Date.now()}`,
        gateCode: `TP-${Date.now()}`,
        locationLat: 16.8,
        locationLng: 96.1,
      },
    });
    plazaId = plaza.id;

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber: `PLATE-${Date.now()}`,
        vehicleClass: 'SEDAN',
        make: 'Toyota',
        model: 'Camry',
        year: 2024,
      },
    });
    vehicleId = vehicle.id;
  });

  describe('Toll Event Entry', () => {
    it('should create toll event entry', async () => {
      const response = await request(app)
        .post('/api/toll-events/entry')
        .set('Authorization', `Bearer ${token}`)
        .send({
          vehicleId,
          plazaId,
          anprPlate: 'PLATE-123',
          laneNumber: 'LANE-1',
          direction: 'NORTH',
          amount: 500,
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
      .send({
        email: `trans-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Transaction Test',
        role: 'ADMIN',
        customerType: 'INDIVIDUAL',
        nrcNumber: '12/TRN(N)123456',
      });
    token = registerResponse.body.token || registerResponse.body.accessToken;
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

