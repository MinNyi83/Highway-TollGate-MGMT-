import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export function initializeWebSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-plaza', (plazaId: string) => {
      socket.join(`plaza-${plazaId}`);
      console.log(`Client ${socket.id} joined plaza ${plazaId}`);
    });

    socket.on('leave-plaza', (plazaId: string) => {
      socket.leave(`plaza-${plazaId}`);
      console.log(`Client ${socket.id} left plaza ${plazaId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('WebSocket not initialized');
  }
  return io;
}

export function broadcastTollEvent(plazaId: string, event: any) {
  if (io) {
    io.to(`plaza-${plazaId}`).emit('toll-event', event);
  }
}

export function broadcastNotification(userId: string, notification: any) {
  if (io) {
    io.to(`user-${userId}`).emit('notification', notification);
  }
}

export function broadcastDeviceStatus(plazaId: string, status: any) {
  if (io) {
    io.to(`plaza-${plazaId}`).emit('device-status', status);
  }
}
