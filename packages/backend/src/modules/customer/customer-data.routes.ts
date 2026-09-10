import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { customerPrisma, hqPrisma } from '../../config/database';
const router = Router();

router.get('/account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await customerPrisma.account.findFirst({
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
    const tags = await customerPrisma.rFIDTag.findMany({
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

router.get('/my-vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tags = await customerPrisma.rFIDTag.findMany({
      where: { account: { userId: req.user!.userId } },
      include: {
        vehicle: true,
      },
    });

    const vehicles = tags.map((t) => ({
      ...t.vehicle,
      rfidTag: { tagNumber: t.tagNumber, status: t.status },
    }));
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/toll-events', authMiddleware, async (req: Request, res: Response) => {
  try {
    const tags = await customerPrisma.rFIDTag.findMany({
      where: { account: { userId: req.user!.userId } },
      select: { vehicleId: true },
    });
    const vehicleIds = tags.map(t => t.vehicleId).filter(Boolean);

    const events = await hqPrisma.tollEvent.findMany({
      where: {
        vehicleId: { in: vehicleIds },
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
    const account = await customerPrisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const transactions = await hqPrisma.transaction.findMany({
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
    const tags = await customerPrisma.rFIDTag.findMany({
      where: { account: { userId: req.user!.userId } },
      select: { vehicleId: true },
    });
    const vehicleIds = tags.map(t => t.vehicleId).filter(Boolean);

    const violations = await hqPrisma.violation.findMany({
      where: {
        vehicleId: { in: vehicleIds },
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

    const { initiateTopUp } = await import('../../services/payment/payment.service');
    const result = await initiateTopUp({
      userId: req.user!.userId,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'manual',
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/topup-history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const account = await customerPrisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const topups = await hqPrisma.transaction.findMany({
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
    const account = await customerPrisma.account.findFirst({
      where: { userId: req.user!.userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const tags = await customerPrisma.rFIDTag.findMany({
      where: { accountId: account.id },
      select: { vehicleId: true },
    });
    const vehicleIds = tags.map(t => t.vehicleId).filter(Boolean);
    const vehicleCount = tags.length;

    const eventCount = await hqPrisma.tollEvent.count({
      where: { vehicleId: { in: vehicleIds } },
    });

    const violationCount = await hqPrisma.violation.count({
      where: {
        vehicleId: { in: vehicleIds },
        status: { not: 'PAID' },
      },
    });

    const recentEvents = await hqPrisma.tollEvent.findMany({
      where: { vehicleId: { in: vehicleIds } },
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
