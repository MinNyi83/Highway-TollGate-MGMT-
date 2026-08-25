import { useQuery } from '@tanstack/react-query';
import { Wallet, Car, Activity, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

interface DashboardData {
  balance: number;
  vehicleCount: number;
  eventCount: number;
  violationCount: number;
  recentEvents: any[];
}

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['customer-dashboard'],
    queryFn: async () => {
      const response = await api.get('/customer/dashboard');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!data) return <div className="text-center py-8 text-gray-500">No data</div>;

  const stats = [
    { label: 'Balance', value: `$${data.balance}`, icon: Wallet, color: 'bg-green-100 text-green-600' },
    { label: 'Vehicles', value: data.vehicleCount, icon: Car, color: 'bg-blue-100 text-blue-600' },
    { label: 'Toll Trips', value: data.eventCount, icon: Activity, color: 'bg-purple-100 text-purple-600' },
    { label: 'Open Violations', value: data.violationCount, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome back!</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold">Recent Toll Events</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.recentEvents.map((event: any) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(event.entryTime).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{event.vehicle?.plateNumber}</td>
                <td className="px-4 py-3 text-sm">{event.plaza?.name}</td>
                <td className="px-4 py-3 text-sm font-medium">${event.transaction?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.recentEvents.length === 0 && (
          <div className="p-8 text-center text-gray-500">No recent events</div>
        )}
      </div>
    </div>
  );
}
