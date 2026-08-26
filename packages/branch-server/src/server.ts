import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { SyncService } from './services/sync.service';
import { TollCollectionService } from './services/toll-collection.service';
import { HardwareService } from './services/hardware.service';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.HQ_URL || '*',
    methods: ['GET', 'POST'],
  },
});

const prisma = new PrismaClient();
const syncService = new SyncService(prisma);
const tollCollectionService = new TollCollectionService(prisma, syncService);
const hardwareService = new HardwareService(io);

// Middleware
app.use(logger);
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      plazaId: process.env.PLAZA_ID,
      timestamp: new Date().toISOString(),
      database: 'connected',
      syncStatus: syncService.getSyncStatus(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// Toll Events
app.get('/api/toll-events', async (req, res) => {
  try {
    const events = await prisma.tollEvent.findMany({
      include: { vehicle: true, plaza: true },
      orderBy: { entryTime: 'desc' },
      take: 100,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch toll events' });
  }
});

app.post('/api/toll-events/entry', async (req, res) => {
  try {
    const event = await tollCollectionService.processEntry(req.body);
    io.emit('toll-event:entry', event);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process entry' });
  }
});

app.post('/api/toll-events/exit', async (req, res) => {
  try {
    const event = await tollCollectionService.processExit(req.body);
    io.emit('toll-event:exit', event);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process exit' });
  }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { rfidTags: true },
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Toll Plazas
app.get('/api/toll-plazas', async (req, res) => {
  try {
    const plazas = await prisma.tollPlaza.findMany({
      include: { tollRates: true },
    });
    res.json(plazas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch toll plazas' });
  }
});

// Device Status
app.get('/api/device-status', async (req, res) => {
  try {
    const devices = await prisma.deviceStatus.findMany({
      include: { plaza: true },
    });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device status' });
  }
});

// Sync endpoints
app.get('/api/sync/status', async (req, res) => {
  res.json(syncService.getSyncStatus());
});

app.post('/api/sync/force', async (req, res) => {
  try {
    await syncService.forceSync();
    res.json({ status: 'sync initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Hardware events
app.post('/api/hardware/rfid-scan', async (req, res) => {
  try {
    const event = await hardwareService.handleRFIDScan(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process RFID scan' });
  }
});

app.post('/api/hardware/anpr-detect', async (req, res) => {
  try {
    const event = await hardwareService.handleANPRDetection(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process ANPR detection' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('subscribe:lane', (laneId) => {
    socket.join(`lane:${laneId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    // Initialize sync service
    await syncService.initialize();
    logger.info('Sync service initialized');

    // Start periodic sync
    syncService.startPeriodicSync();
    logger.info('Periodic sync started');

    // Start hardware monitoring
    hardwareService.startMonitoring();
    logger.info('Hardware monitoring started');

    httpServer.listen(PORT, () => {
      logger.info(`Branch server running on port ${PORT}`);
      logger.info(`Plaza ID: ${process.env.PLAZA_ID}`);
      logger.info(`HQ URL: ${process.env.HQ_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
