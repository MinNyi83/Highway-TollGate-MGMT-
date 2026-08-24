import { Router, Request, Response } from 'express';
import {
  getTollEventsByDateRange,
  getTransactionsByDateRange,
  getViolationsByDateRange,
  getTollRevenueByPlaza,
  getViolationStats,
} from './reports.service';
import { authMiddleware } from '../../middleware/auth';

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

export default router;
