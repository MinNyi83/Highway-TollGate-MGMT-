import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.localUser.findUnique({ where: { email } });
  if (!user || !user.active) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Dashboard stats
router.get('/dashboard', async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalEvents, totalRevenue, pendingSync, failedSync, vehicles, tags] = await Promise.all([
    prisma.tollEvent.count({ where: { createdAt: { gte: today } } }),
    prisma.tollEvent.aggregate({
      where: { createdAt: { gte: today }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.syncQueue.count({ where: { status: 'PENDING' } }),
    prisma.syncQueue.count({ where: { status: 'FAILED' } }),
    prisma.localVehicle.count(),
    prisma.rFIDTag.count(),
  ]);

  res.json({
    today: {
      events: totalEvents,
      revenue: totalRevenue._sum.amount || 0,
    },
    sync: {
      pending: pendingSync,
      failed: failedSync,
    },
    totals: {
      vehicles,
      tags,
    },
  });
});

// Update plaza config
router.put('/config', async (req: Request, res: Response) => {
  const { name, gateCode, hqServerUrl, syncEnabled } = req.body;

  const config = await prisma.plazaConfig.findFirst();
  if (!config) {
    res.status(404).json({ error: 'Config not found' });
    return;
  }

  const updated = await prisma.plazaConfig.update({
    where: { id: config.id },
    data: { name, gateCode, hqServerUrl, syncEnabled },
  });

  res.json(updated);
});

// Update toll rates
router.put('/rates', async (req: Request, res: Response) => {
  const { rates } = req.body;

  for (const rate of rates) {
    await prisma.tollRate.upsert({
      where: { id: rate.id || '' },
      update: { rateAmount: rate.rateAmount },
      create: {
        vehicleClass: rate.vehicleClass,
        rateAmount: rate.rateAmount,
      },
    });
  }

  const updatedRates = await prisma.tollRate.findMany();
  res.json(updatedRates);
});

// Create local user
router.post('/users', async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  const existing = await prisma.localUser.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ error: 'User already exists' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.localUser.create({
    data: { email, passwordHash, name, role: role || 'OPERATOR' },
  });

  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// Get local users
router.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.localUser.findMany({
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
  });
  res.json(users);
});

// Force sync
router.post('/sync/force', async (req: Request, res: Response) => {
  const pendingItems = await prisma.syncQueue.updateMany({
    where: { status: 'FAILED' },
    data: { status: 'PENDING', retries: 0 },
  });

  res.json({ message: 'Retrying failed sync items', count: pendingItems.count });
});

export default router;
