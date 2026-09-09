import { Router, Request, Response } from 'express';
import { hqPrisma, customerPrisma, plazaPrisma } from '../config/database';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const startTime = Date.now();

async function checkDbHealth(client: any, name: string) {
  try {
    const start = Date.now();
    await client.$queryRaw`SELECT 1`;
    return { name, status: 'connected', latencyMs: Date.now() - start };
  } catch {
    return { name, status: 'disconnected', latencyMs: 0 };
  }
}

router.get('/health', async (req: Request, res: Response) => {
  const [hq, customer, plaza] = await Promise.all([
    checkDbHealth(hqPrisma, 'hq'),
    checkDbHealth(customerPrisma, 'customer'),
    checkDbHealth(plazaPrisma, 'plaza'),
  ]);

  const allConnected = hq.status === 'connected' && customer.status === 'connected' && plaza.status === 'connected';
  const healthStatus = allConnected ? 'healthy' : 'degraded';

  res.status(allConnected ? 200 : 503).json({
    status: healthStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    databases: { hq, customer, plaza },
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1),
    },
    cpu: {
      model: os.cpus()[0]?.model || 'unknown',
      cores: os.cpus().length,
      loadAvg: os.loadavg(),
    },
    platform: os.platform(),
    nodeVersion: process.version,
    version: process.env.npm_package_version || '1.0.0',
  });
});

router.get('/health/ready', async (req: Request, res: Response) => {
  try {
    const [hq, customer, plaza] = await Promise.all([
      checkDbHealth(hqPrisma, 'hq'),
      checkDbHealth(customerPrisma, 'customer'),
      checkDbHealth(plazaPrisma, 'plaza'),
    ]);
    const ready = hq.status === 'connected' && customer.status === 'connected' && plaza.status === 'connected';
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not ready',
      databases: { hq: hq.status, customer: customer.status, plaza: plaza.status },
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ status: 'not ready', timestamp: new Date().toISOString() });
  }
});

router.get('/health/live', (req: Request, res: Response) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

router.get('/health/metrics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const [
      userCount,
      vehicleCount,
      eventCount,
      violationCount,
      transactionCount,
      deviceCount,
      accountCount,
      rfidTagCount,
      notificationCount,
    ] = await Promise.all([
      customerPrisma.user.count(),
      hqPrisma.vehicle.count(),
      hqPrisma.tollEvent.count(),
      hqPrisma.violation.count(),
      hqPrisma.transaction.count(),
      hqPrisma.deviceStatus.count(),
      customerPrisma.account.count(),
      customerPrisma.rFIDTag.count(),
      customerPrisma.notification.count(),
    ]);

    const uploadsDir = path.join(__dirname, '../../uploads');
    let uploadsSize = 0;
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      uploadsSize = files.reduce((acc, file) => {
        const stat = fs.statSync(path.join(uploadsDir, file));
        return acc + stat.size;
      }, 0);
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      uptimeFormatted: formatUptime(process.uptime()),
      databases: {
        hq: { status: 'connected' },
        customer: { status: 'connected' },
        plaza: { status: 'connected' },
      },
      counts: {
        users: userCount,
        vehicles: vehicleCount,
        tollEvents: eventCount,
        violations: violationCount,
        transactions: transactionCount,
        devices: deviceCount,
        accounts: accountCount,
        rfidTags: rfidTagCount,
        notifications: notificationCount,
      },
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
        memory: {
          totalMB: (os.totalmem() / 1024 / 1024).toFixed(0),
          freeMB: (os.freemem() / 1024 / 1024).toFixed(0),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1),
        },
        cpu: {
          model: os.cpus()[0]?.model || 'unknown',
          cores: os.cpus().length,
          loadAvg: os.loadavg().map((l) => l.toFixed(2)),
        },
      },
      storage: {
        uploadsSizeMB: (uploadsSize / 1024 / 1024).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Metrics check failed' });
  }
});

router.get('/health/detailed', authMiddleware, async (req: Request, res: Response) => {
  try {
    const [
      userCount,
      vehicleCount,
      eventCount,
      violationCount,
      transactionCount,
      deviceCount,
      accountCount,
      rfidTagCount,
      notificationCount,
    ] = await Promise.all([
      customerPrisma.user.count(),
      hqPrisma.vehicle.count(),
      hqPrisma.tollEvent.count(),
      hqPrisma.violation.count(),
      hqPrisma.transaction.count(),
      hqPrisma.deviceStatus.count(),
      customerPrisma.account.count(),
      customerPrisma.rFIDTag.count(),
      customerPrisma.notification.count(),
    ]);

    const uploadsDir = path.join(__dirname, '../../uploads');
    let uploadsSize = 0;
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      uploadsSize = files.reduce((acc, file) => {
        const stat = fs.statSync(path.join(uploadsDir, file));
        return acc + stat.size;
      }, 0);
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      databases: {
        hq: { status: 'connected' },
        customer: { status: 'connected' },
        plaza: { status: 'connected' },
      },
      counts: {
        users: userCount,
        vehicles: vehicleCount,
        tollEvents: eventCount,
        violations: violationCount,
        transactions: transactionCount,
        devices: deviceCount,
        accounts: accountCount,
        rfidTags: rfidTagCount,
        notifications: notificationCount,
      },
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
        memory: {
          totalMB: (os.totalmem() / 1024 / 1024).toFixed(0),
          freeMB: (os.freemem() / 1024 / 1024).toFixed(0),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1),
        },
        cpu: {
          model: os.cpus()[0]?.model || 'unknown',
          cores: os.cpus().length,
          loadAvg: os.loadavg().map((l) => l.toFixed(2)),
        },
      },
      storage: {
        uploadsSizeMB: (uploadsSize / 1024 / 1024).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Health check failed' });
  }
});

router.get('/health/backup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      databases: { hq: 'tollgate', customer: 'tollgate_customer', plaza: 'tollgate_plaza' },
      users: await customerPrisma.user.findMany({ select: { id: true, email: true, name: true, role: true } }),
      vehicles: await hqPrisma.vehicle.findMany(),
      rfidTags: await customerPrisma.rFIDTag.findMany(),
      accounts: await customerPrisma.account.findMany(),
      tollPlazas: await hqPrisma.tollPlaza.findMany(),
      tollEvents: await hqPrisma.tollEvent.findMany(),
      transactions: await hqPrisma.transaction.findMany(),
      violations: await hqPrisma.violation.findMany(),
      notifications: await customerPrisma.notification.findMany(),
      deviceStatuses: await hqPrisma.deviceStatus.findMany(),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=tollgate-backup-${new Date().toISOString().split('T')[0]}.json`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Backup failed' });
  }
});

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  
  return parts.join(' ');
}

export default router;
