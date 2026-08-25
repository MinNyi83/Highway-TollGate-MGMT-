import { useQuery } from '@tanstack/react-query';
import { Database, HardDrive, Cpu, MemoryStick, Download, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export default function SystemHealth() {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/health/detailed');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const handleBackup = async () => {
    try {
      const res = await api.get('/health/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tollgate-backup-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">System Health</h1>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button onClick={handleBackup} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
            <Download size={14} />
            Backup
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h2 className="font-bold text-lg">System Status: Operational</h2>
        </div>
        <p className="text-sm text-gray-500">Last checked: {new Date(health?.timestamp).toLocaleString()}</p>
        <p className="text-sm text-gray-500">Uptime: {Math.floor(health?.uptime / 3600)}h {Math.floor((health?.uptime % 3600) / 60)}m</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Database */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-blue-600" size={24} />
            <h3 className="font-bold">Database</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium">{health?.database?.status}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Users</span><span className="font-medium">{health?.database?.counts?.userCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Vehicles</span><span className="font-medium">{health?.database?.counts?.vehicleCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Toll Events</span><span className="font-medium">{health?.database?.counts?.eventCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Violations</span><span className="font-medium">{health?.database?.counts?.violationCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Transactions</span><span className="font-medium">{health?.database?.counts?.transactionCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Devices</span><span className="font-medium">{health?.database?.counts?.deviceCount}</span></div>
          </div>
        </div>

        {/* CPU */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-purple-600" size={24} />
            <h3 className="font-bold">CPU</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Model</span><span className="font-medium text-xs">{health?.system?.cpu?.model}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Cores</span><span className="font-medium">{health?.system?.cpu?.cores}</span></div>
            <div>
              <div className="flex justify-between mb-1"><span className="text-gray-500">Load Average</span></div>
              <div className="flex gap-2">
                {health?.system?.cpu?.loadAvg?.map((load: string, i: number) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-gray-400">{['1m', '5m', '15m'][i]}</p>
                    <p className="font-medium">{load}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <MemoryStick className="text-green-600" size={24} />
            <h3 className="font-bold">Memory</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">{health?.system?.memory?.totalMB} MB</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Free</span><span className="font-medium">{health?.system?.memory?.freeMB} MB</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Usage</span><span className="font-medium">{health?.system?.memory?.usagePercent}%</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${health?.system?.memory?.usagePercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <HardDrive className="text-orange-600" size={24} />
          <h3 className="font-bold">Storage</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Uploads Directory</span>
            <span className="font-medium">{health?.storage?.uploadsSizeMB} MB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Node Version</span>
            <span className="font-medium">{health?.system?.nodeVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Platform</span>
            <span className="font-medium">{health?.system?.platform}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
