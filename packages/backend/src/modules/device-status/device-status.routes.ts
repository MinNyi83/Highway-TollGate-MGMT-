import { Router, Request, Response } from 'express';
import {
  getDeviceStatuses,
  getDeviceStatusById,
  getDeviceStatusesByPlaza,
  createDeviceStatus,
  updateDeviceStatus,
  deleteDeviceStatus,
  testDeviceConnection,
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
      res.status(404).json({ error: 'Device not found' });
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
    const { plazaId, deviceType, deviceId, name, ipAddress, port, apiUrl, apiKey, lane, model, manufacturer, firmware, metadata } = req.body;
    if (!plazaId || !deviceType || !deviceId) {
      res.status(400).json({ error: 'plazaId, deviceType, and deviceId are required' });
      return;
    }
    const status = await createDeviceStatus({ plazaId, deviceType, deviceId, name, ipAddress, port, apiUrl, apiKey, lane, model, manufacturer, firmware, metadata });
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

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await deleteDeviceStatus(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/test', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await testDeviceConnection(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
