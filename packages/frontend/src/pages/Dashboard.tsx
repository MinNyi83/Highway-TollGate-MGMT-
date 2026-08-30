import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, Car, DollarSign, Radio } from 'lucide-react';
import api from '../lib/api';
import { useSocket } from '../hooks/useSocket';
import TelemetryBar from '../components/command-hub/TelemetryBar';
import PlazaGrid from '../components/command-hub/PlazaGrid';
import LiveEventStream from '../components/command-hub/LiveEventStream';
import ViolationWorkbench from '../components/command-hub/ViolationWorkbench';
import OperatorQuickActions from '../components/command-hub/OperatorQuickActions';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { socket } = useSocket();
  const [stats, setStats] = useState<any>(null);

  const { data: initialStats, refetch: refetchStats } = useQuery({
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

  useEffect(() => {
    if (!socket) return;

    socket.on('new-toll-event', () => {
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

  return (
    <div className="min-h-screen bg-gradient-command">
      {/* Telemetry Bar */}
      <TelemetryBar />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Operator Quick Actions & Gate Control Ribbon (Stitch UI) */}
        <OperatorQuickActions onEventCreated={() => refetchStats()} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="text-emerald-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="telemetry-value text-2xl text-emerald-400">
                  K{stats?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Car className="text-cyan-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Vehicles</p>
                <p className="telemetry-value text-2xl text-cyan-400">
                  {stats?.totalVehicles || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-crimson-500/20 flex items-center justify-center">
                <AlertTriangle className="text-crimson-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Violations</p>
                <p className="telemetry-value text-2xl text-crimson-400">
                  {stats?.activeViolations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Activity className="text-brand-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Events</p>
                <p className="telemetry-value text-2xl text-brand-400">
                  {stats?.totalEvents || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plaza Grid */}
        <PlazaGrid />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue by Plaza (30 Days)</h3>
            {revenueData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="plazaName" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(11, 15, 23, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Bar dataKey="totalRevenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>

          {/* Violations Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Violations by Type</h3>
            {violationData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={violationData}
                    dataKey="count"
                    nameKey="violationType"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {violationData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(11, 15, 23, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
        </div>

        {/* Peak-Hour Hourly Traffic Congestion Throughput */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Peak-Hour Highway Traffic Throughput</h3>
              <p className="text-xs text-gray-400">Hourly vehicle flow distribution across all active lanes</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              OPTIMAL FLOW: 850 vph/lane
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={[
                { hour: '00:00', vehicles: 120, avgSpeed: 75 },
                { hour: '03:00', vehicles: 85, avgSpeed: 80 },
                { hour: '06:00', vehicles: 450, avgSpeed: 65 },
                { hour: '08:00', vehicles: 980, avgSpeed: 45 },
                { hour: '10:00', vehicles: 740, avgSpeed: 60 },
                { hour: '12:00', vehicles: 620, avgSpeed: 65 },
                { hour: '14:00', vehicles: 580, avgSpeed: 70 },
                { hour: '17:00', vehicles: 1120, avgSpeed: 40 },
                { hour: '19:00', vehicles: 890, avgSpeed: 55 },
                { hour: '21:00', vehicles: 430, avgSpeed: 70 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(11, 15, 23, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Bar dataKey="vehicles" name="Vehicles / Hour" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Event Stream */}
        <LiveEventStream />

        {/* Violation Workbench */}
        <ViolationWorkbench />

        {/* Device Health */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Device Health</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                {onlineDevices} Online
              </span>
              <span className="flex items-center gap-2 text-crimson-400">
                <div className="w-2 h-2 bg-crimson-400 rounded-full" />
                {offlineDevices} Offline
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {deviceStatuses?.slice(0, 12).map((device: any) => (
              <div
                key={device.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  device.status === 'ONLINE'
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-crimson-500/30 bg-crimson-500/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Radio size={12} className={device.status === 'ONLINE' ? 'text-emerald-400' : 'text-crimson-400'} />
                  <span className="text-xs font-medium text-white truncate">
                    {device.name || device.deviceType}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 truncate">{device.plaza?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
