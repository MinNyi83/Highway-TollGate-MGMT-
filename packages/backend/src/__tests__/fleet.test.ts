import request from 'supertest';
import app from '../app';
import { PrismaClient, CustomerType } from '@prisma/client';

const prisma = new PrismaClient();

describe('Fleet Management', () => {
  let enterpriseToken: string;
  let enterpriseUserId: string;
  let individualToken: string;

  beforeAll(async () => {
    // Create enterprise user
    const enterpriseRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `fleet-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Fleet Test Company',
        customerType: 'ENTERPRISE',
        companyName: 'Test Transport Co',
        companyRegNo: 'REG-2024-001',
        phone: '09-976543210',
      });

    enterpriseUserId = enterpriseRes.body.user.id;
    enterpriseToken = enterpriseRes.body.token;

    // Create individual user
    const individualRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `individual-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Individual Test User',
        customerType: 'INDIVIDUAL',
        nrcNumber: '12/ABM(N)123456',
      });

    individualToken = individualRes.body.token;

    // Create vehicles for enterprise account
    const account = await prisma.account.findFirst({ where: { userId: enterpriseUserId } });
    if (account) {
      // Create vehicles
      const vehicles = await Promise.all([
        prisma.vehicle.create({
          data: {
            plateNumber: `FLEET-${Date.now()}-1`,
            make: 'Toyota',
            model: 'HiAce',
            year: 2023,
            vehicleClass: 'BUS',
          },
        }),
        prisma.vehicle.create({
          data: {
            plateNumber: `FLEET-${Date.now()}-2`,
            make: 'Hino',
            model: 'Ranger',
            year: 2022,
            vehicleClass: 'TRUCK',
          },
        }),
      ]);

      // Create RFID tags
      await Promise.all(
        vehicles.map((vehicle) =>
          prisma.rFIDTag.create({
            data: {
              tagUid: `TAG-FLEET-${Date.now()}-${vehicle.plateNumber}`,
              vehicleId: vehicle.id,
              accountId: account.id,
            },
          })
        )
      );
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/fleet/stats', () => {
    it('should return fleet stats for enterprise user', async () => {
      const res = await request(app)
        .get('/api/fleet/stats')
        .set('Authorization', `Bearer ${enterpriseToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalVehicles');
      expect(res.body).toHaveProperty('activeVehicles');
      expect(res.body).toHaveProperty('totalTrips');
      expect(res.body).toHaveProperty('totalRevenue');
      expect(res.body).toHaveProperty('totalViolations');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/fleet/stats');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/fleet/vehicles', () => {
    it('should return fleet vehicles', async () => {
      const res = await request(app)
        .get('/api/fleet/vehicles')
        .set('Authorization', `Bearer ${enterpriseToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/fleet/trips', () => {
    it('should return trip history', async () => {
      const res = await request(app)
        .get('/api/fleet/trips')
        .set('Authorization', `Bearer ${enterpriseToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('events');
      expect(res.body).toHaveProperty('pagination');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/fleet/trips?page=1&limit=10')
        .set('Authorization', `Bearer ${enterpriseToken}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
    });
  });

  describe('GET /api/fleet/spending', () => {
    it('should return spending report', async () => {
      const res = await request(app)
        .get('/api/fleet/spending?period=daily')
        .set('Authorization', `Bearer ${enterpriseToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalSpending');
      expect(res.body).toHaveProperty('transactionCount');
      expect(res.body).toHaveProperty('spendingByVehicle');
    });
  });
});
