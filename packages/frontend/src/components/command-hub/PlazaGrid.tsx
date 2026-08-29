import { useQuery } from '@tanstack/react-query';
import { MapPin, Wifi, WifiOff, Cpu, HardDrive, Clock } from 'lucide-react';
import api from '../../lib/api';

interface Plaza {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  deviceCount: number;
  onlineDevices: number;
  lastSync: string;
  todayRevenue: number;
  todayVehicles: number;
}

export default function PlazaGrid() {
  const { data: plazas, isLoading } = useQuery({
    queryKey: ['plazas-grid'],
    queryFn: async () => {
      const res = await api.get('/toll-plazas');
      return res.data;
    },
    refetchInterval: 15000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'plaza-node-online';
      case 'OFFLINE': return 'plaza-node-offline';
      case 'WARNING': return 'plaza-node-warning';
      default: return 'plaza-node-offline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE': return <Wifi size={16} className="text-emerald-400" />;
      case 'OFFLINE': return <WifiOff size={16} className="text-crimson-400" />;
      case 'WARNING': return <Cpu size={16} className="text-amber-400" />;
      default: return <WifiOff size={16} className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Toll Plaza Network</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Toll Plaza Network</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2 text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            {plazas?.filter((p: Plaza) => p.status === 'ONLINE').length || 0} Online
          </span>
          <span className="flex items-center gap-2 text-crimson-400">
            <div className="w-2 h-2 rounded-full bg-crimson-400" />
            {plazas?.filter((p: Plaza) => p.status === 'OFFLINE').length || 0} Offline
          </span>
        </div>
      </div>

      {/* Highway Corridor Visualization */}
      <div className="relative mb-6">
        {/* Highway Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-brand-500/50 -translate-y-1/2" />
        
        {/* Plaza Nodes */}
        <div className="flex justify-between items-center relative z-10 py-4">
          {plazas?.map((plaza: Plaza) => (
            <div
              key={plaza.id}
              className={`plaza-node ${getStatusColor(plaza.status)}`}
              title={plaza.name}
            >
              {getStatusIcon(plaza.status)}
            </div>
          ))}
        </div>
      </div>

      {/* Plaza Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plazas?.map((plaza: Plaza) => (
          <div
            key={plaza.id}
            className="glass-card-hover p-4 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white">{plaza.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{plaza.location}</p>
              </div>
              <span className={`status-${plaza.status.toLowerCase()} px-2 py-0.5 rounded-full text-xs font-medium`}>
                {plaza.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <HardDrive size={10} />
                  <span>Devices</span>
                </div>
                <p className="telemetry-value text-sm text-white">
                  {plaza.onlineDevices}/{plaza.deviceCount}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <Clock size={10} />
                  <span>Last Sync</span>
                </div>
                <p className="text-xs text-gray-300">
                  {new Date(plaza.lastSync).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400">
                K{plaza.todayRevenue?.toLocaleString() || '0'} revenue
              </span>
              <span className="text-cyan-400">
                {plaza.todayVehicles || '0'} vehicles
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
