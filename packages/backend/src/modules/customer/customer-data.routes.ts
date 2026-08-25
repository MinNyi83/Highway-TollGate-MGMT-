import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId: req.user!.userId },
      include: {
        user: { select: { id: true, email: true, name: true } },
        rfidTags: {
          include: {
            vehicle: { select: { id: true, plateNumber: true, make: true, model: true, year: true, vehicleClass: true, vehiclePhoto: true } },
          },
        },
      },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tags = await prisma.rFIDTag.findMany({
      where: { account: { userId: req.user!.userId } },
      include: {
        vehicle: {
          include: {
            rfidTags: true,
          },
        },
      },
    });

    const vehicles = tags.map((t) => t.vehicle);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/toll-events', authMiddleware, async (req: Request, res: Response) => {
  try {
    const events = await prisma.tollEvent.findMany({
      where: {
        vehicle: {
          rfidTags: {
            some: { account: { userId: req.user!.userId } },
          },
        },
      },
      include: {
        vehicle: { select: { plateNumber: true, make: true, model: true } },
        plaza: { select: { name: true } },
        transaction: { select: { amount: true, status: true } },
        violation: { select: { violationType: true, fineAmount: true, status: true } },
      },
      orderBy: { entryTime: 'desc' },
      take: 100,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      where: { accountId: account.id },
      include: {
        event: {
          include: {
            plaza: { select: { name: true } },
            vehicle: { select: { plateNumber: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/violations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const violations = await prisma.violation.findMany({
      where: {
        vehicle: {
          rfidTags: {
            some: { account: { userId: req.user!.userId } },
          },
        },
      },
      include: {
        vehicle: { select: { plateNumber: true, make: true, model: true } },
        event: { include: { plaza: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(violations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/topup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const account = await prisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const updated = await prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    });

    await prisma.transaction.create({
      data: {
        accountId: account.id,
        amount,
        type: 'TOPUP',
        status: 'COMPLETED',
        paymentMethod: paymentMethod || 'manual',
      },
    });

    res.json({ balance: updated.balance, message: `Added $${amount} to account` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/topup-history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const topups = await prisma.transaction.findMany({
      where: { accountId: account.id, type: 'TOPUP' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(topups);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const vehicleCount = await prisma.rFIDTag.count({
      where: { accountId: account.id },
    });

    const eventCount = await prisma.tollEvent.count({
      where: { vehicle: { rfidTags: { some: { accountId: account.id } } } },
    });

    const violationCount = await prisma.violation.count({
      where: {
        vehicle: { rfidTags: { some: { accountId: account.id } } },
        status: { not: 'PAID' },
      },
    });

    const recentEvents = await prisma.tollEvent.findMany({
      where: { vehicle: { rfidTags: { some: { accountId: account.id } } } },
      include: {
        plaza: { select: { name: true } },
        vehicle: { select: { plateNumber: true } },
        transaction: { select: { amount: true } },
      },
      orderBy: { entryTime: 'desc' },
      take: 5,
    });

    res.json({
      balance: account.balance,
      vehicleCount,
      eventCount,
      violationCount,
      recentEvents,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
