import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();
const startTime = Date.now();

router.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let dbLatency = 0;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
    dbStatus = 'connected';
  } catch {
    // dbStatus stays disconnected
  }

  const healthStatus = dbStatus === 'connected' ? 'healthy' : 'degraded';

  res.status(dbStatus === 'connected' ? 200 : 503).json({
    status: healthStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
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
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', timestamp: new Date().toISOString() });
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
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.tollEvent.count(),
      prisma.violation.count(),
      prisma.transaction.count(),
      prisma.deviceStatus.count(),
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
      database: {
        status: 'connected',
        counts: { userCount, vehicleCount, eventCount, violationCount, transactionCount, deviceCount },
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
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.tollEvent.count(),
      prisma.violation.count(),
      prisma.transaction.count(),
      prisma.deviceStatus.count(),
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
      database: {
        status: 'connected',
        counts: { userCount, vehicleCount, eventCount, violationCount, transactionCount, deviceCount },
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
      users: await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } }),
      vehicles: await prisma.vehicle.findMany(),
      rfidTags: await prisma.rFIDTag.findMany(),
      accounts: await prisma.account.findMany(),
      tollPlazas: await prisma.tollPlaza.findMany(),
      tollEvents: await prisma.tollEvent.findMany(),
      transactions: await prisma.transaction.findMany(),
      violations: await prisma.violation.findMany(),
      notifications: await prisma.notification.findMany(),
      deviceStatuses: await prisma.deviceStatus.findMany(),
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
