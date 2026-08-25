import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    // dbStatus stays disconnected
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
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
  });
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

export default router;
