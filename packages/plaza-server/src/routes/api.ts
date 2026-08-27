import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { getQueueStatus } from '../services/offline-queue';

const prisma = new PrismaClient();
const router = Router();

// Get plaza config
router.get('/config', async (_req: Request, res: Response) => {
  const config = await prisma.plazaConfig.findFirst();
  res.json(config);
});

// Get queue status
router.get('/sync/status', async (_req: Request, res: Response) => {
  const status = await getQueueStatus(prisma);
  const config = await prisma.plazaConfig.findFirst();
  res.json({ ...status, lastSync: config?.lastSyncAt });
});

// Get device statuses
router.get('/devices', async (_req: Request, res: Response) => {
  const devices = await prisma.deviceStatus.findMany();
  res.json(devices);
});

// Get toll events (today)
router.get('/events', authMiddleware, async (req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await prisma.tollEvent.findMany({
    where: { createdAt: { gte: today } },
    include: { vehicle: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json(events);
});

// Get toll events summary
router.get('/events/summary', authMiddleware, async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalEvents, totalRevenue, entries, exits] = await Promise.all([
    prisma.tollEvent.count({ where: { createdAt: { gte: today } } }),
    prisma.tollEvent.aggregate({
      where: { createdAt: { gte: today }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.tollEvent.count({ where: { createdAt: { gte: today }, status: 'ENTRY' } }),
    prisma.tollEvent.count({ where: { createdAt: { gte: today }, status: 'COMPLETED' } }),
  ]);

  res.json({
    totalEvents,
    totalRevenue: totalRevenue._sum.amount || 0,
    entries,
    exits,
  });
});

// Get local vehicles
router.get('/vehicles', authMiddleware, async (req: Request, res: Response) => {
  const vehicles = await prisma.localVehicle.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(vehicles);
});

// Get RFID tags
router.get('/tags', authMiddleware, async (req: Request, res: Response) => {
  const tags = await prisma.rFIDTag.findMany({
    include: { vehicle: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tags);
});

// Get toll rates
router.get('/rates', authMiddleware, async (_req: Request, res: Response) => {
  const rates = await prisma.tollRate.findMany({ orderBy: { vehicleClass: 'asc' } });
  res.json(rates);
});

// Get audit logs
router.get('/audit', authMiddleware, async (req: Request, res: Response) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 100,
  });
  res.json(logs);
});

export default router;
