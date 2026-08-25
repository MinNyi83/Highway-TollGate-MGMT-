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
import { deviceManager } from '../../services/devices/device-manager.service';
import { createZKTecoClient } from '../../services/devices/zkteco.service';
import { createHikvisionClient } from '../../services/devices/hikvision.service';
import { createIPCameraService } from '../../services/devices/ipcamera.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
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

// Device Integration Endpoints
router.post('/test/zkteco', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipAddress, port, username, password, useHttps } = req.body;
    const client = createZKTecoClient({ ipAddress, port, username, password, useHttps });
    const online = await client.testConnection();
    const deviceInfo = online ? await client.getDeviceInfo() : null;
    res.json({ online, deviceInfo });
  } catch (error) {
    res.status(500).json({ error: 'Connection test failed' });
  }
});

router.post('/test/hikvision', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipAddress, port, username, password, useHttps } = req.body;
    const client = createHikvisionClient({ ipAddress, port, username, password, useHttps });
    const online = await client.testConnection();
    const deviceInfo = online ? await client.getDeviceInfo() : null;
    res.json({ online, deviceInfo });
  } catch (error) {
    res.status(500).json({ error: 'Connection test failed' });
  }
});

router.post('/test/ipcamera', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipAddress, port, username, password, channel } = req.body;
    const service = createIPCameraService();
    const online = await service.testConnection(ipAddress, port, username, password);
    const snapshot = online ? await service.captureSnapshot({ ipAddress, port, username, password, channel }) : null;
    res.json({ online, snapshotUrl: snapshot });
  } catch (error) {
    res.status(500).json({ error: 'Connection test failed' });
  }
});

router.post('/test/barrier', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { ipAddress, port, serialPort, baudRate, connectionType } = req.body;
    const result = await deviceManager.testDeviceConnection({
      id: 'test',
      plazaId: 'test',
      deviceType: 'BARRIER_GATE',
      ipAddress,
      port,
      metadata: { serialPort, baudRate, connectionType },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Connection test failed' });
  }
});

router.post('/:id/zkteco/attendance', authMiddleware, async (req: Request, res: Response) => {
  try {
    const device = await prisma.deviceStatus.findUnique({ where: { id: req.params.id } });
    if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
    const client = createZKTecoClient({
      ipAddress: device.ipAddress || '',
      port: device.port || 80,
      username: (device.metadata as any)?.username || 'admin',
      password: (device.metadata as any)?.password || 'admin',
    });
    const records = await client.getAttendanceRecords();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

router.post('/:id/hikvision/snapshot', authMiddleware, async (req: Request, res: Response) => {
  try {
    const device = await prisma.deviceStatus.findUnique({ where: { id: req.params.id } });
    if (!device) { res.status(404).json({ error: 'Device not found' }); return; }
    const client = createHikvisionClient({
      ipAddress: device.ipAddress || '',
      port: device.port || 80,
      username: (device.metadata as any)?.username || 'admin',
      password: (device.metadata as any)?.password || 'admin123',
    });
    const snapshot = await client.getSnapshot();
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to capture snapshot' });
  }
});

router.post('/:id/barrier/open', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hwService = deviceManager.getHardwareService(req.params.id);
    if (hwService) {
      await hwService.openBarrier();
      res.json({ message: 'Barrier opening' });
    } else {
      res.status(404).json({ error: 'Device not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to open barrier' });
  }
});

router.post('/:id/barrier/close', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hwService = deviceManager.getHardwareService(req.params.id);
    if (hwService) {
      await hwService.closeBarrier();
      res.json({ message: 'Barrier closing' });
    } else {
      res.status(404).json({ error: 'Device not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to close barrier' });
  }
});

router.post('/:id/led/display', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hwService = deviceManager.getHardwareService(req.params.id);
    if (hwService) {
      await hwService.setLEDDisplay(req.body.text);
      res.json({ message: 'LED updated' });
    } else {
      res.status(404).json({ error: 'Device not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update LED' });
  }
});

router.post('/:id/intercom/start', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hwService = deviceManager.getHardwareService(req.params.id);
    if (hwService) {
      await hwService.startIntercom();
      res.json({ message: 'Intercom started' });
    } else {
      res.status(404).json({ error: 'Device not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to start intercom' });
  }
});

router.post('/:id/intercom/stop', authMiddleware, async (req: Request, res: Response) => {
  try {
    const hwService = deviceManager.getHardwareService(req.params.id);
    if (hwService) {
      await hwService.stopIntercom();
      res.json({ message: 'Intercom stopped' });
    } else {
      res.status(404).json({ error: 'Device not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop intercom' });
  }
});

export default router;
