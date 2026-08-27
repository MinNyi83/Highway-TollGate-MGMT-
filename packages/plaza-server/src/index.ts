import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { setupRFIDReader } from './services/rfid-reader';
import { setupSyncEngine } from './services/sync-engine';
import { setupOfflineQueue } from './services/offline-queue';
import { setupTollProcessor } from './services/toll-processor';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'plaza', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Serve admin panel static files
app.use('/admin', express.static('src/admin-panel'));

async function main() {
  console.log('=== TollGate Plaza Server ===');

  // Ensure plaza config exists
  const config = await prisma.plazaConfig.findFirst();
  if (!config) {
    await prisma.plazaConfig.create({
      data: {
        id: process.env.PLAZA_ID || 'plaza-001',
        name: process.env.PLAZA_NAME || '0 Mile Plaza',
        gateCode: process.env.GATE_CODE || '0MILE',
        mileMarker: parseFloat(process.env.MILE_MARKER || '0'),
        hqServerUrl: process.env.HQ_SERVER_URL || 'http://localhost:3000',
      },
    });
    console.log('Created default plaza config');
  }

  // Initialize services
  await setupTollProcessor(prisma);
  await setupOfflineQueue(prisma);
  await setupSyncEngine(prisma, io);
  await setupRFIDReader(prisma, io);

  // WebSocket for real-time events
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const port = parseInt(process.env.PORT || '4000');
  httpServer.listen(port, () => {
    console.log(`Plaza server running on port ${port}`);
    console.log(`Admin panel: http://localhost:${port}/admin`);
    console.log(`Plaza: ${config?.name || 'Default'}`);
    console.log(`Gate Code: ${config?.gateCode || '0MILE'}`);
  });
}

main().catch((e) => {
  console.error('Failed to start plaza server:', e);
  process.exit(1);
});
