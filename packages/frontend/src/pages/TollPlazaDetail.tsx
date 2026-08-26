import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../lib/api';
import { ArrowLeft, MapPin, Cpu, Wifi, WifiOff, AlertTriangle, Wrench, Plus, Trash2, X } from 'lucide-react';

interface DeviceStatus {
  id: string;
  deviceType: string;
  deviceId: string;
  name: string | null;
  ipAddress: string | null;
  port: number | null;
  lane: number | null;
  model: string | null;
  manufacturer: string | null;
  firmware: string | null;
  status: string;
  lastHeartbeat: string | null;
}

interface TollPlaza {
  id: string;
  name: string;
  gateCode: string | null;
  locationLat: number;
  locationLng: number;
  mileMarker: number | null;
  lanes: number;
  status: string;
  tollRates: Array<{ id: string; vehicleClass: string; rateAmount: number }>;
  deviceStatuses: DeviceStatus[];
}

const DEVICE_TYPES = ['RFID_READER', 'ANPR_CAMERA', 'LIDAR', 'LANE_CONTROLLER', 'BARRIER_GATE', 'TICKET_DISPENSER', 'LED_SIGN', 'INTERCOM', 'IP_CAMERA'];
const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  ONLINE: { bg: 'bg-green-100', text: 'text-green-800', icon: <Wifi size={14} /> },
  OFFLINE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <WifiOff size={14} /> },
  ERROR: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertTriangle size={14} /> },
  MAINTENANCE: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Wrench size={14} /> },
};

interface DeviceForm {
  deviceType: string;
  deviceId: string;
  name: string;
  ipAddress: string;
  port: string;
  lane: string;
  model: string;
  manufacturer: string;
  firmware: string;
}

const emptyDeviceForm: DeviceForm = { deviceType: 'RFID_READER', deviceId: '', name: '', ipAddress: '', port: '', lane: '1', model: '', manufacturer: '', firmware: '' };

export default function TollPlazaDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceForm, setDeviceForm] = useState<DeviceForm>(emptyDeviceForm);
  const [deviceError, setDeviceError] = useState('');
  const [deleteDeviceId, setDeleteDeviceId] = useState<string | null>(null);

  const { data: plaza, isLoading } = useQuery<TollPlaza>({
    queryKey: ['toll-plaza', id],
    queryFn: async () => {
      const response = await api.get(`/toll-plazas/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const createDeviceMutation = useMutation({
    mutationFn: async (data: DeviceForm) => {
      return api.post('/device-status', {
        plazaId: id,
        deviceType: data.deviceType,
        deviceId: data.deviceId,
        name: data.name || undefined,
        ipAddress: data.ipAddress || undefined,
        port: data.port ? parseInt(data.port) : undefined,
        lane: data.lane ? parseInt(data.lane) : undefined,
        model: data.model || undefined,
        manufacturer: data.manufacturer || undefined,
        firmware: data.firmware || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plaza', id] });
      setShowDeviceModal(false);
      setDeviceForm(emptyDeviceForm);
      setDeviceError('');
    },
    onError: (err: any) => setDeviceError(err.response?.data?.error || 'Failed to add device'),
  });

  const deleteDeviceMutation = useMutation({
    mutationFn: async (deviceId: string) => {
      return api.delete(`/device-status/${deviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plaza', id] });
      setDeleteDeviceId(null);
    },
  });

  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeviceError('');
    if (!deviceForm.deviceId.trim()) { setDeviceError('Device ID is required'); return; }
    createDeviceMutation.mutate(deviceForm);
  };

  const handleDeviceChange = (field: keyof DeviceForm, value: string) => {
    setDeviceForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDeviceType = (type: string) => type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleString() : 'Never';

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!plaza) return <div className="text-center py-8 text-red-600">Plaza not found</div>;

  const devices = plaza.deviceStatuses || [];
  const online = devices.filter((d) => d.status === 'ONLINE').length;
  const offline = devices.filter((d) => d.status === 'OFFLINE').length;
  const errors = devices.filter((d) => d.status === 'ERROR').length;
  const maintenance = devices.filter((d) => d.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      <Link to="/toll-plazas" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
        <ArrowLeft size={16} /> Back to Toll Plazas
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{plaza.name}</h1>
            {plaza.gateCode && <p className="text-gray-500 font-mono mt-1">Gate Code: {plaza.gateCode}</p>}
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${
            plaza.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {plaza.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-gray-500 text-xs">Location</p>
            <p className="font-medium flex items-center gap-1"><MapPin size={14} /> {plaza.locationLat}, {plaza.locationLng}</p>
          </div>
          {plaza.mileMarker != null && (
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-gray-500 text-xs">Mile Marker</p>
              <p className="font-medium">{plaza.mileMarker} Mile</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-gray-500 text-xs">Lanes</p>
            <p className="font-medium">{plaza.lanes}</p>
          </div>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-gray-500 text-xs">Devices</p>
            <p className="font-medium">{devices.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{online}</p>
          <p className="text-sm text-green-700">Online</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-gray-600">{offline}</p>
          <p className="text-sm text-gray-700">Offline</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{errors}</p>
          <p className="text-sm text-red-700">Error</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{maintenance}</p>
          <p className="text-sm text-yellow-700">Maintenance</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Toll Rates</h2>
        </div>
        <div className="p-6">
          {plaza.tollRates.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Vehicle Class</th>
                  <th className="pb-2 font-medium text-right">Rate (MMK)</th>
                </tr>
              </thead>
              <tbody>
                {plaza.tollRates.map((rate) => (
                  <tr key={rate.id} className="border-b last:border-0">
                    <td className="py-2">{rate.vehicleClass}</td>
                    <td className="py-2 text-right font-medium">{Number(rate.rateAmount)} MMK</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">No toll rates configured</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Device Status</h2>
          <button onClick={() => { setDeviceForm(emptyDeviceForm); setDeviceError(''); setShowDeviceModal(true); }}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 text-sm hover:bg-blue-700">
            <Plus size={16} /> Add Device
          </button>
        </div>
        <div className="p-6">
          {devices.length > 0 ? (
            <div className="space-y-3">
              {devices.map((device) => {
                const sc = STATUS_COLORS[device.status] || STATUS_COLORS.OFFLINE;
                return (
                  <div key={device.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Cpu size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{device.name || device.deviceId}</p>
                        <p className="text-sm text-gray-500">{formatDeviceType(device.deviceType)} {device.lane ? `- Lane ${device.lane}` : ''}</p>
                        {device.ipAddress && <p className="text-xs text-gray-400">{device.ipAddress}{device.port ? `:${device.port}` : ''}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${sc.bg} ${sc.text}`}>
                          {sc.icon} {device.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">Last heartbeat: {formatDate(device.lastHeartbeat)}</p>
                      </div>
                      {deleteDeviceId === device.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => deleteDeviceMutation.mutate(device.id)} disabled={deleteDeviceMutation.isPending}
                            className="text-xs bg-red-600 text-white px-2 py-1 rounded">Yes</button>
                          <button onClick={() => setDeleteDeviceId(null)} className="text-xs border px-2 py-1 rounded">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteDeviceId(device.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">No devices registered for this plaza</p>
          )}
        </div>
      </div>

      {showDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add Device</h2>
              <button onClick={() => setShowDeviceModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleDeviceSubmit} className="p-6 space-y-4">
              {deviceError && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">{deviceError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Type *</label>
                  <select value={deviceForm.deviceType} onChange={(e) => handleDeviceChange('deviceType', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {DEVICE_TYPES.map((t) => <option key={t} value={t}>{formatDeviceType(t)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device ID *</label>
                  <input type="text" value={deviceForm.deviceId} onChange={(e) => handleDeviceChange('deviceId', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. RFID-001" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={deviceForm.name} onChange={(e) => handleDeviceChange('name', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lane 1 RFID Reader" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <input type="text" value={deviceForm.ipAddress} onChange={(e) => handleDeviceChange('ipAddress', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="192.168.1.100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input type="number" value={deviceForm.port} onChange={(e) => handleDeviceChange('port', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="8080" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lane</label>
                  <input type="number" min="1" value={deviceForm.lane} onChange={(e) => handleDeviceChange('lane', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input type="text" value={deviceForm.model} onChange={(e) => handleDeviceChange('model', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input type="text" value={deviceForm.manufacturer} onChange={(e) => handleDeviceChange('manufacturer', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firmware</label>
                  <input type="text" value={deviceForm.firmware} onChange={(e) => handleDeviceChange('firmware', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowDeviceModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={createDeviceMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {createDeviceMutation.isPending ? 'Adding...' : 'Add Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
