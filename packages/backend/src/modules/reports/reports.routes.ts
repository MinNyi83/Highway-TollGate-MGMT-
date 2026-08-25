import { Router, Request, Response } from 'express';
import {
  getTollEventsByDateRange,
  getTransactionsByDateRange,
  getViolationsByDateRange,
  getTollRevenueByPlaza,
  getViolationStats,
} from './reports.service';
import { authMiddleware } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/events', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const events = await getTollEventsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const transactions = await getTransactionsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/violations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const violations = await getViolationsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(violations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/revenue', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const revenue = await getTollRevenueByPlaza(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/violations/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = await getViolationStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/revenue/csv', authMiddleware, async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      include: { account: true },
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'Date,Account ID,Amount,Type\n';
    transactions.forEach((t) => {
      csv += `${t.createdAt.toISOString()},${t.accountId},${t.amount},${t.type}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/violations/csv', authMiddleware, async (req: Request, res: Response) => {
  try {
    const violations = await prisma.violation.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'Date,Vehicle,Type,Fine Amount,Status\n';
    violations.forEach((v) => {
      csv += `${v.createdAt.toISOString()},${v.vehicle.plateNumber},${v.violationType},${v.fineAmount},${v.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=violations-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
