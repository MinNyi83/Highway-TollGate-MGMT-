import { useQuery } from '@tanstack/react-query';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

interface DeviceStatus {
  id: string;
  deviceType: string;
  status: string;
  lastPing: string;
  plaza: { name: string };
}

export default function DeviceStatus() {
  const { data: devices, isLoading } = useQuery<DeviceStatus[]>({
    queryKey: ['device-status'],
    queryFn: async () => {
      const response = await api.get('/device-status');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'OFFLINE':
        return <XCircle className="text-red-500" size={20} />;
      case 'ERROR':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <AlertTriangle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800';
      case 'ERROR':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Device Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{device.deviceType}</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(device.status)}
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Plaza: {device.plaza?.name}</p>
              <p>Last Ping: {device.lastPing ? new Date(device.lastPing).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
      {devices?.length === 0 && (
        <div className="text-center py-8 text-gray-500">No devices found</div>
      )}
    </div>
  );
}
