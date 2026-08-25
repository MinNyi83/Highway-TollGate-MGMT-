import { Router, Request, Response } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  bindRfidTag,
  unbindRfidTag,
} from './vehicles.service';
import { authMiddleware } from '../../middleware/auth';
import { uploadVehiclePhotos } from '../../middleware/upload';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const vehicles = await getVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, (req: Request, res: Response) => {
  uploadVehiclePhotos(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      const { plateNumber, make, model, year, color, vehicleClass } = req.body;

      if (!plateNumber || !make || !model || !year || !vehicleClass) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const vehiclePhoto = files?.vehiclePhoto?.[0]?.filename || undefined;
      const wheelTaxCard = files?.wheelTaxCard?.[0]?.filename || undefined;

      const vehicle = await createVehicle({
        plateNumber,
        make,
        model,
        year: parseInt(year, 10),
        color,
        vehicleClass,
        vehiclePhoto,
        wheelTaxCard,
      });

      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  uploadVehiclePhotos(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const updateData: any = { ...req.body };

      if (files?.vehiclePhoto?.[0]) {
        updateData.vehiclePhoto = files.vehiclePhoto[0].filename;
      }
      if (files?.wheelTaxCard?.[0]) {
        updateData.wheelTaxCard = files.wheelTaxCard[0].filename;
      }

      const vehicle = await updateVehicle(req.params.id, updateData);
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

router.post('/:id/rfid', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { tagUid, accountId } = req.body;

    if (!tagUid || !accountId) {
      res.status(400).json({ error: 'tagUid and accountId are required' });
      return;
    }

    const tag = await bindRfidTag(req.params.id, { tagUid, accountId });
    res.status(201).json(tag);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.delete('/:id/rfid/:tagId', authMiddleware, async (req: Request, res: Response) => {
  try {
    await unbindRfidTag(req.params.id, req.params.tagId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
