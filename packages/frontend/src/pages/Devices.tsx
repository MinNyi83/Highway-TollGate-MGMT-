import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit, Trash2, X, Wifi, WifiOff, AlertTriangle, Settings, Cpu, Radio, Camera, Cog, Wrench } from 'lucide-react';
import api from '../lib/api';

interface Device {
  id: string;
  plazaId: string;
  deviceType: string;
  deviceId: string;
  name?: string;
  ipAddress?: string;
  port?: number;
  apiUrl?: string;
  apiKey?: string;
  lane?: number;
  model?: string;
  manufacturer?: string;
  firmware?: string;
  status: string;
  lastHeartbeat?: string;
  metadata?: any;
  createdAt: string;
  plaza?: { id: string; name: string; gateCode?: string };
}

interface TollPlaza {
  id: string;
  name: string;
  gateCode?: string;
}

const DEVICE_TYPES = [
  { value: 'RFID_READER', label: 'RFID Reader', icon: Radio, color: 'text-blue-600 bg-blue-50' },
  { value: 'ANPR_CAMERA', label: 'ANPR Camera', icon: Camera, color: 'text-emerald-600 bg-emerald-50' },
  { value: 'LIDAR', label: 'LiDAR', icon: Cpu, color: 'text-violet-600 bg-violet-50' },
  { value: 'LANE_CONTROLLER', label: 'Lane Controller', icon: Cog, color: 'text-amber-600 bg-amber-50' },
  { value: 'BARRIER_GATE', label: 'Barrier Gate', icon: Wrench, color: 'text-red-600 bg-red-50' },
  { value: 'TICKET_DISPENSER', label: 'Ticket Dispenser', icon: Settings, color: 'text-gray-600 bg-gray-50' },
  { value: 'LED_SIGN', label: 'LED Sign', icon: Cpu, color: 'text-yellow-600 bg-yellow-50' },
  { value: 'INTERCOM', label: 'Intercom', icon: Radio, color: 'text-cyan-600 bg-cyan-50' },
  { value: 'IP_CAMERA', label: 'IP Camera', icon: Camera, color: 'text-indigo-600 bg-indigo-50' },
];

const STATUS_COLORS: Record<string, string> = {
  ONLINE: 'bg-green-100 text-green-700',
  OFFLINE: 'bg-gray-100 text-gray-600',
  ERROR: 'bg-red-100 text-red-700',
  MAINTENANCE: 'bg-amber-100 text-amber-700',
};

export default function Devices() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['device-status'],
    queryFn: async () => {
      const r = await api.get('/device-status');
      return r.data;
    },
  });

  const { data: plazas } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas'],
    queryFn: async () => {
      const r = await api.get('/toll-plazas');
      return r.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await api.post('/device-status', data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const r = await api.put(`/device-status/${id}`, data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
      setEditingDevice(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/device-status/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await api.post(`/device-status/${id}/test`);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
    },
  });

  const filteredDevices = (devices || []).filter((d) => {
    const matchesSearch = !search ||
      d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.ipAddress?.includes(search) ||
      d.plaza?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || d.deviceType === filterType;
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const deviceStats = {
    total: devices?.length || 0,
    online: devices?.filter((d) => d.status === 'ONLINE').length || 0,
    offline: devices?.filter((d) => d.status === 'OFFLINE').length || 0,
    error: devices?.filter((d) => d.status === 'ERROR').length || 0,
    maintenance: devices?.filter((d) => d.status === 'MAINTENANCE').length || 0,
  };

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Devices', value: deviceStats.total, color: 'text-blue-600 bg-blue-50' },
          { label: 'Online', value: deviceStats.online, color: 'text-green-600 bg-green-50' },
          { label: 'Offline', value: deviceStats.offline, color: 'text-gray-600 bg-gray-100' },
          { label: 'Error', value: deviceStats.error, color: 'text-red-600 bg-red-50' },
          { label: 'Maintenance', value: deviceStats.maintenance, color: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Device Management</h1>
        <button
          onClick={() => { setEditingDevice(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Register Device
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search device ID, name, IP, plaza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          {DEVICE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
          <option value="ERROR">Error</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => {
          const deviceType = DEVICE_TYPES.find((t) => t.value === device.deviceType);
          const TypeIcon = deviceType?.icon || Cpu;
          return (
            <div key={device.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${deviceType?.color || 'text-gray-600 bg-gray-50'} flex items-center justify-center`}>
                    <TypeIcon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{device.name || device.deviceId}</p>
                    <p className="text-xs text-gray-500">{deviceType?.label}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[device.status] || 'bg-gray-100 text-gray-600'}`}>
                  {device.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Cpu size={12} />
                  <span className="font-mono">{device.deviceId}</span>
                </div>
                {device.ipAddress && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {device.status === 'ONLINE' ? <Wifi size={12} className="text-green-500" /> : <WifiOff size={12} className="text-gray-400" />}
                    <span>{device.ipAddress}{device.port ? `:${device.port}` : ''}</span>
                  </div>
                )}
                {device.plaza && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{device.plaza.name} ({device.plaza.gateCode})</span>
                  </div>
                )}
                {device.lane !== undefined && device.lane !== null && (
                  <div className="text-xs text-gray-400">Lane {device.lane}</div>
                )}
                {device.model && (
                  <div className="text-xs text-gray-400">{device.manufacturer} {device.model}</div>
                )}
              </div>

              <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                <button
                  onClick={() => testMutation.mutate(device.id)}
                  disabled={testMutation.isPending}
                  className="flex-1 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {testMutation.isPending ? 'Testing...' : 'Test'}
                </button>
                <button
                  onClick={() => { setEditingDevice(device); setShowForm(true); }}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this device?')) deleteMutation.mutate(device.id); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {filteredDevices.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Cpu size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No devices found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <DeviceForm
          device={editingDevice}
          plazas={plazas || []}
          onClose={() => { setShowForm(false); setEditingDevice(null); }}
          onSubmit={(data) => {
            if (editingDevice) {
              updateMutation.mutate({ id: editingDevice.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
        />
      )}
    </div>
  );
}

function DeviceForm({ device, plazas, onClose, onSubmit }: { device: any | null; plazas: TollPlaza[]; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    plazaId: device?.plazaId || '',
    deviceType: device?.deviceType || 'RFID_READER',
    deviceId: device?.deviceId || '',
    name: device?.name || '',
    ipAddress: device?.ipAddress || '',
    port: device?.port?.toString() || '',
    apiUrl: device?.apiUrl || '',
    apiKey: device?.apiKey || '',
    lane: device?.lane?.toString() || '',
    model: device?.model || '',
    manufacturer: device?.manufacturer || '',
    firmware: device?.firmware || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      port: form.port ? parseInt(form.port) : undefined,
      lane: form.lane ? parseInt(form.lane) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{device ? 'Edit Device' : 'Register New Device'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Toll Plaza *</label>
              <select required value={form.plazaId} onChange={(e) => setForm({ ...form, plazaId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Plaza</option>
                {plazas.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.gateCode})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Device Type *</label>
              <select required value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DEVICE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Device ID *</label>
              <input required value={form.deviceId} onChange={(e) => setForm({ ...form, deviceId: e.target.value })} placeholder="e.g. RFID-001" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lane 1 RFID" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">IP Address</label>
              <input value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} placeholder="192.168.1.100" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Port</label>
              <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} placeholder="80" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lane Number</label>
              <input type="number" value={form.lane} onChange={(e) => setForm({ ...form, lane: e.target.value })} placeholder="1" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Manufacturer</label>
              <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} placeholder="e.g. ZKTeco" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
              <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. UHF4" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Firmware</label>
              <input value={form.firmware} onChange={(e) => setForm({ ...form, firmware: e.target.value })} placeholder="v2.1.0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">API URL</label>
            <input value={form.apiUrl} onChange={(e) => setForm({ ...form, apiUrl: e.target.value })} placeholder="http://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
              {device ? 'Update' : 'Register Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
