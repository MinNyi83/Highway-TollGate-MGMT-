import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export function initializeWebSocket(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      (socket as any).userId = (decoded as any).userId;
      (socket as any).role = (decoded as any).role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    const role = (socket as any).role;
    console.log('Client connected:', socket.id, 'userId:', userId, 'role:', role);

    socket.join(`user-${userId}`);

    if (role === 'ADMIN' || role === 'OPERATOR') {
      socket.join('admin');
    }

    socket.on('join-plaza', (plazaId: string) => {
      socket.join(`plaza-${plazaId}`);
    });

    socket.on('leave-plaza', (plazaId: string) => {
      socket.leave(`plaza-${plazaId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('WebSocket not initialized');
  return io;
}

export function broadcastTollEvent(plazaId: string, event: any) {
  if (io) io.to(`plaza-${plazaId}`).emit('toll-event', event);
}

export function broadcastNotification(userId: string, notification: any) {
  if (io) io.to(`user-${userId}`).emit('notification', notification);
}

export function broadcastToAdmins(event: string, data: any) {
  if (io) io.to('admin').emit(event, data);
}

export function broadcastDeviceStatus(plazaId: string, status: any) {
  if (io) io.to(`plaza-${plazaId}`).emit('device-status', status);
}

export function broadcastBalanceUpdate(userId: string, balance: number) {
  if (io) io.to(`user-${userId}`).emit('balance-update', { balance });
}
