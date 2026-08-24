import { Router, Request, Response } from 'express';
import {
  getDeviceStatuses,
  getDeviceStatusById,
  getDeviceStatusesByPlaza,
  createDeviceStatus,
  updateDeviceStatus,
} from './device-status.service';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const statuses = await getDeviceStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const status = await getDeviceStatusById(req.params.id);
    if (!status) {
      res.status(404).json({ error: 'Device status not found' });
      return;
    }
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/plaza/:plazaId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const statuses = await getDeviceStatusesByPlaza(req.params.plazaId);
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plazaId, deviceType, deviceId, metadata } = req.body;

    if (!plazaId || !deviceType || !deviceId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const status = await createDeviceStatus({ plazaId, deviceType, deviceId, metadata });
    res.status(201).json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const status = await updateDeviceStatus(req.params.id, req.body);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
