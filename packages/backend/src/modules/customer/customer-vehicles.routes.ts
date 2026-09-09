import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { broadcastNotification, broadcastToAdmins } from '../../websocket/gateway';
import { hqPrisma, customerPrisma } from '../../config/database';
import multer from 'multer';
import path from 'path';

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

    const existing = await hqPrisma.vehicle.findUnique({ where: { plateNumber } });
    if (existing) {
      res.status(409).json({ error: 'Vehicle with this plate number already exists' });
      return;
    }

    const account = await customerPrisma.account.findFirst({ where: { userId } });
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const files = req.files as any;
    const vehiclePhoto = files?.vehiclePhoto?.[0]?.filename;
    const wheelTaxCard = files?.wheelTaxCard?.[0]?.filename;

    const vehicle = await hqPrisma.vehicle.create({
      data: {
        plateNumber,
        make,
        model,
        year: parseInt(year),
        color: color || null,
        vehicleClass,
        approvalStatus: 'PENDING',
        vehiclePhoto: vehiclePhoto || null,
        wheelTaxCard: wheelTaxCard || null,
      },
    });

    const tagUid = `RFID-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const rfidTag = await customerPrisma.rFIDTag.create({
      data: {
        tagUid,
        vehicleId: vehicle.id,
        accountId: account.id,
        status: 'ACTIVE',
      },
    });

    const notification = await customerPrisma.notification.create({
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

    const tags = await customerPrisma.rFIDTag.findMany({
      where: { account: { userId } },
      include: {
        account: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    const vehicleIds = tags.map(t => t.vehicleId);
    const vehicles = await hqPrisma.vehicle.findMany({
      where: { id: { in: vehicleIds } },
      include: {
        rfidTags: true,
        _count: { select: { tollEvents: true, violations: true } },
      },
    });

    const vehicleMap = new Map(vehicles.map(v => [v.id, v]));

    res.json(tags.map((t) => {
      const vehicle = vehicleMap.get(t.vehicleId);
      return {
        ...vehicle,
        rfidTag: { id: t.id, tagUid: t.tagUid, status: t.status, issuedAt: t.issuedAt },
        eventCount: vehicle?._count.tollEvents || 0,
        violationCount: vehicle?._count.violations || 0,
      };
    }));
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

    const tag = await customerPrisma.rFIDTag.findFirst({
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

    const vehicle = await hqPrisma.vehicle.update({
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

    const tag = await customerPrisma.rFIDTag.findFirst({
      where: { vehicleId, account: { userId } },
    });
    if (!tag) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    await customerPrisma.rFIDTag.deleteMany({ where: { vehicleId } });
    await hqPrisma.vehicle.delete({ where: { id: vehicleId } });

    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/vehicle-classes', async (req: Request, res: Response) => {
  res.json(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']);
});

export default router;
