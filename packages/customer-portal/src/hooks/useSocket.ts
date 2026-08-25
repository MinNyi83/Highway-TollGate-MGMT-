import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!token) return;

    const socket = io(window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { socket: socketRef.current, isConnected };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification: any) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on('balance-update', (data: { balance: number }) => {
      window.dispatchEvent(new CustomEvent('balance-update', { detail: data }));
    });

    socket.on('toll-event', (event: any) => {
      window.dispatchEvent(new CustomEvent('toll-event', { detail: event }));
    });

    return () => {
      socket.off('notification');
      socket.off('balance-update');
      socket.off('toll-event');
    };
  }, [socket]);

  return { notifications, unreadCount };
}
