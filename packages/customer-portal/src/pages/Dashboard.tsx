import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, Car, Activity, AlertTriangle } from 'lucide-react';
import api from '../lib/api';
import { StatSkeleton, CardSkeleton } from '../components/Skeleton';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: async () => {
      const response = await api.get('/customer/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-8 text-gray-500">No data</div>;

  const stats = [
    { label: 'Balance', value: `$${data.balance}`, icon: Wallet, color: 'bg-green-100 text-green-600' },
    { label: 'Vehicles', value: data.vehicleCount, icon: Car, color: 'bg-blue-100 text-blue-600' },
    { label: 'Trips', value: data.eventCount, icon: Activity, color: 'bg-purple-100 text-purple-600' },
    { label: 'Violations', value: data.violationCount, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Welcome back!</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-3 md:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold">Recent Toll Events</h2>
        </div>

        <table className="w-full hidden md:table">
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
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">{new Date(event.entryTime).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{event.vehicle?.plateNumber}</td>
                <td className="px-4 py-3 text-sm">{event.plaza?.name}</td>
                <td className="px-4 py-3 text-sm font-medium">${event.transaction?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden divide-y">
          {data.recentEvents.map((event: any) => (
            <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{event.vehicle?.plateNumber}</span>
                <span className="font-bold text-sm">${event.transaction?.amount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{event.plaza?.name}</span>
                <span className="text-xs text-gray-400">{new Date(event.entryTime).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {data.recentEvents.length === 0 && (
          <div className="p-8 text-center text-gray-500">No recent events</div>
        )}
      </div>
    </div>
  );
}
