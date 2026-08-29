import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import api from '../../lib/api';

interface TelemetryData {
  onlinePlazas: number;
  totalPlazas: number;
  vehiclesPerMinute: number;
  todayRevenue: number;
  activeAlerts: number;
  lastSync: string;
}

export default function TelemetryBar() {
  const { socket, isConnected } = useSocket();
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    onlinePlazas: 0,
    totalPlazas: 0,
    vehiclesPerMinute: 0,
    todayRevenue: 0,
    activeAlerts: 0,
    lastSync: new Date().toISOString(),
  });

  const { data: initialData } = useQuery({
    queryKey: ['telemetry-summary'],
    queryFn: async () => {
      const res = await api.get('/reports/summary');
      return res.data;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (initialData) {
      setTelemetry({
        onlinePlazas: initialData.onlinePlazas || 0,
        totalPlazas: initialData.totalPlazas || 0,
        vehiclesPerMinute: initialData.vehiclesPerMinute || 0,
        todayRevenue: initialData.todayRevenue || 0,
        activeAlerts: initialData.activeAlerts || 0,
        lastSync: new Date().toISOString(),
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!socket) return;

    const handleTelemetry = (data: Partial<TelemetryData>) => {
      setTelemetry(prev => ({ ...prev, ...data, lastSync: new Date().toISOString() }));
    };

    const handleNewEvent = () => {
      setTelemetry(prev => ({
        ...prev,
        vehiclesPerMinute: prev.vehiclesPerMinute + 1,
        lastSync: new Date().toISOString(),
      }));
    };

    socket.on('telemetry-update', handleTelemetry);
    socket.on('new-toll-event', handleNewEvent);

    return () => {
      socket.off('telemetry-update', handleTelemetry);
      socket.off('new-toll-event', handleNewEvent);
    };
  }, [socket]);

  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-crimson-400'}`} />
            <span className="text-xs font-medium text-gray-400">
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Plaza Status */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Activity size={14} className="text-cyan-400" />
            <div className="flex items-center gap-2">
              <span className="telemetry-value text-sm text-white">
                {telemetry.onlinePlazas}/{telemetry.totalPlazas}
              </span>
              <span className="text-xs text-gray-400">Plazas Online</span>
            </div>
          </div>

          {/* Throughput */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <TrendingUp size={14} className="text-emerald-400" />
            <div className="flex items-center gap-2">
              <span className="telemetry-value text-sm text-white">
                {telemetry.vehiclesPerMinute}
              </span>
              <span className="text-xs text-gray-400">Vehicles/min</span>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Users size={14} className="text-brand-400" />
            <div className="flex items-center gap-2">
              <span className="telemetry-value text-sm text-emerald-400">
                K{telemetry.todayRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">Today's Revenue</span>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <AlertTriangle size={14} className={telemetry.activeAlerts > 0 ? 'text-amber-400' : 'text-gray-500'} />
            <div className="flex items-center gap-2">
              <span className={`telemetry-value text-sm ${telemetry.activeAlerts > 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                {telemetry.activeAlerts}
              </span>
              <span className="text-xs text-gray-400">Alerts</span>
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>Last sync: {new Date(telemetry.lastSync).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
