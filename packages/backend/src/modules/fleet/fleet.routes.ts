import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getFleetStats, getFleetVehicles, getFleetTripHistory, getFleetSpendingReport } from './fleet.service';

const router = Router();

router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const account = await prisma.account.findFirst({ where: { userId } });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const stats = await getFleetStats(account.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const account = await prisma.account.findFirst({ where: { userId } });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const vehicles = await getFleetVehicles(account.id);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/trips', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const account = await prisma.account.findFirst({ where: { userId } });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const { vehicleId, plazaId, startDate, endDate, page, limit } = req.query;
    const result = await getFleetTripHistory(account.id, {
      vehicleId: vehicleId as string,
      plazaId: plazaId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 50,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/spending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const account = await prisma.account.findFirst({ where: { userId } });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const { period, startDate, endDate } = req.query;
    const result = await getFleetSpendingReport(account.id, {
      period: (period as 'daily' | 'weekly' | 'monthly') || 'daily',
      startDate: startDate as string,
      endDate: endDate as string,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
