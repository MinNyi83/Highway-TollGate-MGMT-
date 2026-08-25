import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, X, CheckCheck } from 'lucide-react';
import api from '../lib/api';
import { useNotifications } from '../hooks/useSocket';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-400 hover:text-white">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-bold text-sm">Notifications</h3>
            <div className="flex gap-2">
              <button onClick={() => markAllRead.mutate()} className="text-xs text-blue-600 hover:underline">
                Mark all read
              </button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-72">
            {notifications?.map((n: any) => (
              <div
                key={n.id}
                onClick={() => markRead.mutate(n.id)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-medium">{n.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!notifications || notifications.length === 0) && (
              <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
