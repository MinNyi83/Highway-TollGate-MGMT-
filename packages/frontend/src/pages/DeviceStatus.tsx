import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Radio, Camera, Cpu, Plus, X, Wifi, WifiOff, AlertTriangle,
  Settings, Trash2, Edit, TestTube, ChevronDown, ChevronUp, Search
} from 'lucide-react';
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
  plaza: { id: string; name: string };
}

interface Plaza {
  id: string;
  name: string;
  lanes: number;
  status: string;
}

const deviceTypeConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  RFID_READER: { icon: Radio, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'RFID Reader' },
  ANPR_CAMERA: { icon: Camera, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'ANPR Camera' },
  LANE_CONTROLLER: { icon: Cpu, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Lane Controller' },
  LIDAR: { icon: Settings, color: 'text-teal-600', bgColor: 'bg-teal-100', label: 'LIDAR' },
};

const statusConfig: Record<string, { color: string; icon: any }> = {
  ONLINE: { color: 'bg-green-100 text-green-800', icon: Wifi },
  OFFLINE: { color: 'bg-red-100 text-red-800', icon: WifiOff },
  ERROR: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  MAINTENANCE: { color: 'bg-gray-100 text-gray-800', icon: Settings },
};

export default function DeviceStatus() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ deviceId: string; result: any } | null>(null);
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['device-status'],
    queryFn: async () => {
      const response = await api.get('/device-status');
      return response.data;
    },
  });

  const { data: plazas } = useQuery<Plaza[]>({
    queryKey: ['toll-plazas'],
    queryFn: async () => {
      const response = await api.get('/toll-plazas');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/device-status', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/device-status/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-status'] });
      setEditingDevice(null);
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
      const response = await api.post(`/device-status/${id}/test`);
      return response.data;
    },
    onSuccess: (data) => {
      setTestResult({ deviceId: data.deviceId, result: data });
    },
  });

  const filteredDevices = devices?.filter((d) => {
    const matchFilter = filter === 'all' || d.deviceType === filter;
    const matchSearch = search === '' ||
      d.deviceId.toLowerCase().includes(search.toLowerCase()) ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.plaza?.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const deviceCounts = {
    all: devices?.length || 0,
    RFID_READER: devices?.filter((d) => d.deviceType === 'RFID_READER').length || 0,
    ANPR_CAMERA: devices?.filter((d) => d.deviceType === 'ANPR_CAMERA').length || 0,
    LANE_CONTROLLER: devices?.filter((d) => d.deviceType === 'LANE_CONTROLLER').length || 0,
  };

  const handleDelete = (device: Device) => {
    if (window.confirm(`Delete device ${device.deviceId}?`)) {
      deleteMutation.mutate(device.id);
    }
  };

  const getDeviceIcon = (type: string) => {
    const config = deviceTypeConfig[type] || deviceTypeConfig.LANE_CONTROLLER;
    return <config.icon className={config.color} size={24} />;
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hardware Setup</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['all', 'RFID_READER', 'ANPR_CAMERA', 'LANE_CONTROLLER'] as const).map((type) => {
          const config = type === 'all' ? { icon: Settings, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'All Devices' } : deviceTypeConfig[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                filter === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <config.icon className={config.color} size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{deviceCounts[type]}</p>
                  <p className="text-sm text-gray-500">{config.label}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search devices by ID, name, or plaza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Modals */}
      {(showForm || editingDevice) && (
        <DeviceForm
          plazas={plazas || []}
          device={editingDevice}
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

      {/* Device List */}
      <div className="space-y-4">
        {filteredDevices?.map((device) => {
          const typeConf = deviceTypeConfig[device.deviceType] || deviceTypeConfig.LANE_CONTROLLER;
          const statConf = statusConfig[device.status] || statusConfig.OFFLINE;
          const isExpanded = expandedDevice === device.id;

          return (
            <div key={device.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedDevice(isExpanded ? null : device.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${typeConf.bgColor}`}>
                    {getDeviceIcon(device.deviceType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{device.name || device.deviceId}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${statConf.color}`}>
                        {device.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {typeConf.label} - {device.plaza?.name} | Lane {device.lane || 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {device.lastHeartbeat ? new Date(device.lastHeartbeat).toLocaleString() : 'Never'}
                  </span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Connection</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Device ID</p>
                          <p className="font-mono">{device.deviceId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">IP Address</p>
                          <p className="font-mono">{device.ipAddress || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Port</p>
                          <p className="font-mono">{device.port || 'Default'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">API URL</p>
                          <p className="font-mono text-xs truncate">{device.apiUrl || 'Not set'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Hardware Info</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Model</p>
                          <p>{device.model || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Manufacturer</p>
                          <p>{device.manufacturer || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Firmware</p>
                          <p>{device.firmware || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Lane</p>
                          <p>Lane {device.lane || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {testResult?.deviceId === device.deviceId && (
                    <div className={`mt-4 p-3 rounded-lg text-sm ${testResult.result.reachable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {testResult.result.message}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => testMutation.mutate(device.id)}
                      disabled={testMutation.isPending}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    >
                      <TestTube size={14} />
                      Test Connection
                    </button>
                    <button
                      onClick={() => setEditingDevice(device)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(device)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDevices?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Settings size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No devices found</p>
        </div>
      )}
    </div>
  );
}

function DeviceForm({
  plazas,
  device,
  onClose,
  onSubmit,
}: {
  plazas: Plaza[];
  device: Device | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [plazaId, setPlazaId] = useState(device?.plazaId || plazas[0]?.id || '');
  const [deviceType, setDeviceType] = useState(device?.deviceType || 'RFID_READER');
  const [deviceId, setDeviceId] = useState(device?.deviceId || '');
  const [name, setName] = useState(device?.name || '');
  const [ipAddress, setIpAddress] = useState(device?.ipAddress || '');
  const [port, setPort] = useState(device?.port?.toString() || '');
  const [apiUrl, setApiUrl] = useState(device?.apiUrl || '');
  const [apiKey, setApiKey] = useState(device?.apiKey || '');
  const [lane, setLane] = useState(device?.lane?.toString() || '1');
  const [model, setModel] = useState(device?.model || '');
  const [manufacturer, setManufacturer] = useState(device?.manufacturer || '');
  const [firmware, setFirmware] = useState(device?.firmware || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      plazaId,
      deviceType,
      deviceId,
      name: name || undefined,
      ipAddress: ipAddress || undefined,
      port: port ? parseInt(port) : undefined,
      apiUrl: apiUrl || undefined,
      apiKey: apiKey || undefined,
      lane: parseInt(lane),
      model: model || undefined,
      manufacturer: manufacturer || undefined,
      firmware: firmware || undefined,
    });
  };

  const typeConf = deviceTypeConfig[deviceType] || deviceTypeConfig.RFID_READER;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <typeConf.icon className={typeConf.color} size={20} />
            {device ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plaza *</label>
              <select value={plazaId} onChange={(e) => setPlazaId(e.target.value)} required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {plazas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device Type *</label>
              <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="RFID_READER">RFID Reader</option>
                <option value="ANPR_CAMERA">ANPR Camera</option>
                <option value="LANE_CONTROLLER">Lane Controller</option>
                <option value="LIDAR">LIDAR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device ID *</label>
              <input type="text" required value={deviceId} onChange={(e) => setDeviceId(e.target.value)}
                placeholder="e.g. RFID-MAIN-001"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Entry Lane RFID"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lane #</label>
              <input type="number" min="1" value={lane} onChange={(e) => setLane(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm text-gray-700 mb-3">Network Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                <input type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input type="number" value={port} onChange={(e) => setPort(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                <input type="text" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://192.168.1.100:5000/api"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Optional API key"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm text-gray-700 mb-3">Hardware Info</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Impinj"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. R700"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Firmware</label>
                <input type="text" value={firmware} onChange={(e) => setFirmware(e.target.value)}
                  placeholder="v4.5.2"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {device ? 'Save Changes' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
