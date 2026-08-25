import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth';
import { broadcastNotification, broadcastToAdmins } from '../../websocket/gateway';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WEBP, HEIC allowed'));
  },
});

router.post('/register-vehicle', authMiddleware, upload.fields([
  { name: 'vehiclePhoto', maxCount: 1 },
  { name: 'wheelTaxCard', maxCount: 1 },
]), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { plateNumber, make, model, year, color, vehicleClass } = req.body;
    if (!plateNumber || !make || !model || !year || !vehicleClass) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const existing = await prisma.vehicle.findUnique({ where: { plateNumber } });
    if (existing) {
      res.status(409).json({ error: 'Vehicle with this plate number already exists' });
      return;
    }

    const account = await prisma.account.findFirst({ where: { userId } });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const files = req.files as any;
    const vehiclePhoto = files?.vehiclePhoto?.[0]?.filename;
    const wheelTaxCard = files?.wheelTaxCard?.[0]?.filename;

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber,
        make,
        model,
        year: parseInt(year),
        color: color || null,
        vehicleClass,
        vehiclePhoto: vehiclePhoto || null,
        wheelTaxCard: wheelTaxCard || null,
      },
    });

    const tagUid = `RFID-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const rfidTag = await prisma.rFIDTag.create({
      data: {
        tagUid,
        vehicleId: vehicle.id,
        accountId: account.id,
        status: 'ACTIVE',
      },
    });

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'VEHICLE_REGISTERED',
        message: `Vehicle ${plateNumber} registered with RFID tag ${tagUid}`,
      },
    });
    broadcastNotification(userId, notification);

    broadcastToAdmins('new-vehicle-registration', {
      vehicle,
      rfidTag,
      userId,
    });

    res.status(201).json({
      vehicle,
      rfidTag: { id: rfidTag.id, tagUid: rfidTag.tagUid, status: rfidTag.status },
      message: `Vehicle registered. RFID Tag: ${tagUid}`,
    });
  } catch (error) {
    console.error('Vehicle registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tags = await prisma.rFIDTag.findMany({
      where: { account: { userId } },
      include: {
        vehicle: {
          include: {
            rfidTags: true,
            _count: { select: { tollEvents: true, violations: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.json(tags.map((t) => ({
      ...t.vehicle,
      rfidTag: { id: t.id, tagUid: t.tagUid, status: t.status, issuedAt: t.issuedAt },
      eventCount: t.vehicle._count.tollEvents,
      violationCount: t.vehicle._count.violations,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/my-vehicles/:vehicleId', authMiddleware, upload.fields([
  { name: 'vehiclePhoto', maxCount: 1 },
  { name: 'wheelTaxCard', maxCount: 1 },
]), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { vehicleId } = req.params;

    const tag = await prisma.rFIDTag.findFirst({
      where: { vehicleId, account: { userId } },
    });
    if (!tag) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    const { make, model, year, color } = req.body;
    const files = req.files as any;

    const updateData: any = {};
    if (make) updateData.make = make;
    if (model) updateData.model = model;
    if (year) updateData.year = parseInt(year);
    if (color) updateData.color = color;
    if (files?.vehiclePhoto?.[0]) updateData.vehiclePhoto = files.vehiclePhoto[0].filename;
    if (files?.wheelTaxCard?.[0]) updateData.wheelTaxCard = files.wheelTaxCard[0].filename;

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData,
    });

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/my-vehicles/:vehicleId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { vehicleId } = req.params;

    const tag = await prisma.rFIDTag.findFirst({
      where: { vehicleId, account: { userId } },
    });
    if (!tag) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    await prisma.rFIDTag.deleteMany({ where: { vehicleId } });
    await prisma.vehicle.delete({ where: { id: vehicleId } });

    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/vehicle-classes', async (req: Request, res: Response) => {
  res.json(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']);
});

export default router;
