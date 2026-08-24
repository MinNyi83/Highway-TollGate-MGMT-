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

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plateNumber, make, model, year, color, vehicleClass } = req.body;

    if (!plateNumber || !make || !model || !year || !vehicleClass) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const vehicle = await createVehicle({
      plateNumber,
      make,
      model,
      year,
      color,
      vehicleClass,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const vehicle = await updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
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
