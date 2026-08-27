import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../backend/src/middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(authMiddleware);

// Get all plazas
router.get('/', async (_req: Request, res: Response) => {
  const plazas = await prisma.plaza.findMany({
    include: {
      _count: {
        select: { tollEvents: true },
      },
    },
    orderBy: { mileMarker: 'asc' },
  });
  res.json(plazas);
});

// Get plaza by ID
router.get('/:id', async (req: Request, res: Response) => {
  const plaza = await prisma.plaza.findUnique({
    where: { id: req.params.id },
    include: {
      _count: {
        select: { tollEvents: true },
      },
    },
  });

  if (!plaza) {
    res.status(404).json({ error: 'Plaza not found' });
    return;
  }

  res.json(plaza);
});

// Create plaza
router.post('/', async (req: Request, res: Response) => {
  const { name, gateCode, mileMarker, locationLat, locationLng, lanes } = req.body;

  const existing = await prisma.plaza.findUnique({ where: { gateCode } });
  if (existing) {
    res.status(400).json({ error: 'Gate code already exists' });
    return;
  }

  const plaza = await prisma.plaza.create({
    data: {
      name,
      gateCode,
      mileMarker,
      locationLat,
      locationLng,
      lanes: lanes || 4,
    },
  });

  res.json(plaza);
});

// Update plaza
router.put('/:id', async (req: Request, res: Response) => {
  const { name, gateCode, mileMarker, locationLat, locationLng, lanes, status } = req.body;

  const plaza = await prisma.plaza.update({
    where: { id: req.params.id },
    data: {
      name,
      gateCode,
      mileMarker,
      locationLat,
      locationLng,
      lanes,
      status,
    },
  });

  res.json(plaza);
});

// Delete plaza
router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.plaza.delete({ where: { id: req.params.id } });
  res.json({ message: 'Plaza deleted' });
});

// Get plaza statistics
router.get('/:id/stats', async (req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalEvents, totalRevenue, activeVehicles] = await Promise.all([
    prisma.tollEvent.count({
      where: { lane: { plazaId: req.params.id }, createdAt: { gte: today } },
    }),
    prisma.tollEvent.aggregate({
      where: { lane: { plazaId: req.params.id }, createdAt: { gte: today }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.vehicle.count({ where: { status: 'ACTIVE' } }),
  ]);

  res.json({
    todayEvents: totalEvents,
    todayRevenue: totalRevenue._sum.amount || 0,
    activeVehicles,
  });
});

export default router;
