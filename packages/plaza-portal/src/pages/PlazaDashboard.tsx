import { useQuery } from '@tanstack/react-query';
import { BarChart3, Car, Clock, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { getUnsyncedCount } from '../utils/offlineStorage';
import { useState, useEffect } from 'react';
import api from '../api/client';

export default function PlazaDashboard() {
  const { plazaId } = useAuthStore();
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    getUnsyncedCount().then(setPendingCount);
    const handleOnline = () => { setIsOnline(true); getUnsyncedCount().then(setPendingCount); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const { data } = useQuery({
    queryKey: ['plaza-stats'],
    queryFn: async () => {
      try {
        const r = await api.get(`/toll-events?plazaId=${plazaId || 'plaza-01'}&limit=100`);
        return r.data;
      } catch { return { tollEvents: [] }; }
    },
  });

  const events = data?.tollEvents || data?.events || [];
  const todayEvents = events.filter((e: any) => new Date(e.createdAt || e.entryTime).toDateString() === new Date().toDateString());
  const entries = todayEvents.filter((e: any) => e.status === 'ACTIVE' || e.status === 'ENTRY');
  const completed = todayEvents.filter((e: any) => e.status === 'COMPLETED' || e.status === 'EXIT');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Plaza Dashboard</h1>
            <p className="text-xs text-slate-400">{plazaId || 'plaza-01'} · {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi size={16} className="text-emerald-400" /> : <WifiOff size={16} className="text-amber-400" />}
            {pendingCount > 0 && <span className="text-amber-400 text-xs font-medium">{pendingCount} pending</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Today', value: todayEvents.length, icon: BarChart3, color: 'from-purple-500 to-violet-600' },
            { label: 'Active Entries', value: entries.length, icon: Car, color: 'from-emerald-500 to-green-600' },
            { label: 'Completed', value: completed.length, icon: Clock, color: 'from-blue-500 to-cyan-600' },
            { label: 'Pending Sync', value: pendingCount, icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{card.label}</p>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <Icon size={14} className="text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-white mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {events.slice(0, 10).map((ev: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-navy-700/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${ev.type === 'ENTRY' || ev.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-crimson-400'}`} />
                  <span className="text-sm font-mono text-white">{ev.plateNumber || ev.anprPlate}</span>
                  <span className="text-xs text-slate-500">{ev.vehicleClass}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(ev.createdAt || ev.entryTime).toLocaleTimeString()}</span>
              </div>
            ))}
            {events.length === 0 && <p className="text-center text-slate-500 py-4">No events today</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
