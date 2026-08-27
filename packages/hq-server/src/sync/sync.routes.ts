import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Verify sync token
function verifySyncToken(req: Request): boolean {
  const token = req.headers['x-sync-token'];
  const expected = process.env.SYNC_TOKEN;
  return token === expected;
}

// Receive data from plaza servers
router.post('/push', async (req: Request, res: Response) => {
  if (!verifySyncToken(req)) {
    res.status(401).json({ error: 'Invalid sync token' });
    return;
  }

  const plazaId = req.headers['x-plaza-id'] as string;
  const { table, recordId, action, payload } = req.body;

  try {
    switch (table) {
      case 'TollEvent':
        if (action === 'CREATE' || action === 'UPDATE') {
          await prisma.tollEvent.upsert({
            where: { id: payload.id },
            update: {
              exitTime: payload.exitTime,
              amount: payload.amount,
              status: payload.status,
            },
            create: {
              id: payload.id,
              vehicleId: payload.vehicleId,
              rfidTagId: payload.rfidTagId,
              laneNumber: payload.laneNumber,
              direction: payload.direction,
              anprPlate: payload.anprPlate,
              entryTime: payload.entryTime,
              exitTime: payload.exitTime,
              amount: payload.amount,
              status: payload.status,
              paymentMethod: payload.paymentMethod,
              processed: true,
            },
          });
        }
        break;

      case 'LocalVehicle':
        if (action === 'CREATE' || action === 'UPDATE') {
          // Upsert into main vehicle table
          await prisma.vehicle.upsert({
            where: { id: payload.hqId || payload.id },
            update: {
              plateNumber: payload.plateNumber,
              make: payload.make,
              model: payload.model,
              year: payload.year,
              color: payload.color,
              vehicleClass: payload.vehicleClass,
            },
            create: {
              id: payload.hqId || payload.id,
              plateNumber: payload.plateNumber,
              make: payload.make,
              model: payload.model,
              year: payload.year,
              color: payload.color,
              vehicleClass: payload.vehicleClass || 'SEDAN',
              status: 'ACTIVE',
            },
          });
        }
        break;
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Sync push error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send data to plaza servers
router.post('/pull', async (req: Request, res: Response) => {
  if (!verifySyncToken(req)) {
    res.status(401).json({ error: 'Invalid sync token' });
    return;
  }

  const plazaId = req.headers['x-plaza-id'] as string;
  const { lastSyncAt, tables } = req.body;

  try {
    const records: any[] = [];
    const since = lastSyncAt ? new Date(lastSyncAt) : new Date(0);

    if (tables.includes('Vehicle')) {
      const vehicles = await prisma.vehicle.findMany({
        where: { updatedAt: { gt: since } },
        take: 100,
      });
      records.push(...vehicles.map((v) => ({ table: 'Vehicle', data: v, action: 'UPDATE' })));
    }

    if (tables.includes('RFIDTag')) {
      const tags = await prisma.rFIDTag.findMany({
        where: { updatedAt: { gt: since } },
        take: 100,
      });
      records.push(...tags.map((t) => ({ table: 'RFIDTag', data: t, action: 'UPDATE' })));
    }

    if (tables.includes('TollRate')) {
      const rates = await prisma.tollRate.findMany({
        where: { updatedAt: { gt: since } },
        take: 100,
      });
      records.push(...rates.map((r) => ({ table: 'TollRate', data: r, action: 'UPDATE' })));
    }

    res.json({ records });
  } catch (error: any) {
    console.error('Sync pull error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Register a new plaza
router.post('/plazas', async (req: Request, res: Response) => {
  if (!verifySyncToken(req)) {
    res.status(401).json({ error: 'Invalid sync token' });
    return;
  }

  const { id, name, gateCode, mileMarker, locationLat, locationLng, lanes } = req.body;

  try {
    const plaza = await prisma.plaza.create({
      data: { id, name, gateCode, mileMarker, locationLat, locationLng, lanes: lanes || 4 },
    });
    res.json(plaza);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plazas status
router.get('/plazas', async (req: Request, res: Response) => {
  if (!verifySyncToken(req)) {
    res.status(401).json({ error: 'Invalid sync token' });
    return;
  }

  const plazas = await prisma.plaza.findMany({
    include: {
      _count: { select: { tollEvents: true } },
    },
  });
  res.json(plazas);
});

export default router;
