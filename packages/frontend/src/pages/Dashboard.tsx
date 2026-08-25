import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, Car, DollarSign, Radio, Wifi, WifiOff } from 'lucide-react';
import api from '../lib/api';
import { useSocket } from '../hooks/useSocket';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const { socket, isConnected } = useSocket();
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const { data: initialStats } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/reports/summary');
      return res.data;
    },
  });

  useEffect(() => {
    if (initialStats) setStats(initialStats);
  }, [initialStats]);

  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue-chart'],
    queryFn: async () => {
      const res = await api.get('/reports/revenue', {
        params: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
        },
      });
      return res.data;
    },
  });

  const { data: violationData } = useQuery({
    queryKey: ['admin-violations-chart'],
    queryFn: async () => {
      const res = await api.get('/reports/violations/stats');
      return res.data;
    },
  });

  const { data: deviceStatuses } = useQuery({
    queryKey: ['device-statuses'],
    queryFn: async () => {
      const res = await api.get('/device-status');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: recentEvents } = useQuery({
    queryKey: ['admin-recent-events'],
    queryFn: async () => {
      const res = await api.get('/toll-events');
      return res.data;
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('new-toll-event', (event: any) => {
      setLiveEvents((prev) => [event, ...prev].slice(0, 10));
      setStats((prev: any) => prev ? { ...prev, totalEvents: prev.totalEvents + 1 } : prev);
    });

    socket.on('device-alert', (data: any) => {
      console.log('Device alert:', data);
    });

    return () => {
      socket.off('new-toll-event');
      socket.off('device-alert');
    };
  }, [socket]);

  const onlineDevices = deviceStatuses?.filter((d: any) => d.status === 'ONLINE').length || 0;
  const offlineDevices = deviceStatuses?.filter((d: any) => d.status !== 'ONLINE').length || 0;

  const combinedEvents = [...liveEvents, ...(recentEvents || []).slice(0, 5)]
    .sort((a: any, b: any) => new Date(b.entryTime || b.createdAt).getTime() - new Date(a.entryTime || a.createdAt).getTime())
    .slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <Wifi size={14} /> Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <WifiOff size={14} /> Offline
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg"><Car className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Vehicles</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalVehicles || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg"><AlertTriangle className="text-red-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Active Violations</p>
              <p className="text-2xl font-bold text-red-600">{stats?.activeViolations || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg"><Activity className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.totalEvents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Health */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Device Health</h3>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> {onlineDevices} Online</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> {offlineDevices} Offline</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {deviceStatuses?.slice(0, 8).map((device: any) => (
            <div key={device.id} className={`p-3 rounded-lg border ${
              device.status === 'ONLINE' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center gap-2">
                <Radio size={14} className={device.status === 'ONLINE' ? 'text-green-600' : 'text-red-600'} />
                <span className="text-xs font-medium truncate">{device.name || device.deviceType}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{device.plaza?.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue by Plaza (30 Days)</h3>
          {revenueData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plazaName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        {/* Violations Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
          {violationData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={violationData} dataKey="count" nameKey="violationType" cx="50%" cy="50%" outerRadius={100} label>
                  {violationData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>
      </div>

      {/* Live Events Feed */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Live Events Feed</h3>
          {liveEvents.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {liveEvents.length} new
            </span>
          )}
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {combinedEvents.map((event: any, idx: number) => (
            <div key={event.id || idx} className={`px-4 py-3 flex items-center justify-between ${
              idx < liveEvents.length ? 'bg-blue-50' : ''
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${idx < liveEvents.length ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                <div>
                  <p className="text-sm font-medium">{event.vehicle?.plateNumber || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{event.plaza?.name || 'Unknown Plaza'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${event.transaction?.amount || 0}</p>
                <p className="text-xs text-gray-400">{new Date(event.entryTime || event.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {combinedEvents.length === 0 && (
            <div className="p-8 text-center text-gray-400">No events yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
