import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck } from 'lucide-react';
import api from '../lib/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 relative transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-slate-200/40 dark:border-navy-600/30 z-50">
          <div className="p-4 border-b border-slate-200/40 dark:border-navy-600/30 flex justify-between items-center">
            <h3 className="font-medium text-slate-800 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">No notifications</div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-200/40 dark:border-navy-600/30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 dark:text-slate-200">{notification.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead.mutate(notification.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
