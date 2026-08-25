import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Car,
  MapPin,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  Building2,
  BarChart3,
  Route,
} from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';

interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  totalRevenue: number;
  totalViolations: number;
  averageTripLength: number;
  vehiclesByClass: Record<string, number>;
  tripsByPlaza: Record<string, number>;
  revenueByVehicle: Array<{ plateNumber: string; revenue: number }>;
  recentTrips: Array<{
    id: string;
    vehiclePlate: string;
    plazaName: string;
    mileMarker: number | null;
    entryTime: string;
    exitTime: string | null;
    status: string;
    tollAmount: number;
  }>;
}

interface FleetVehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  vehicleClass: string;
  status: string;
  rfidTag: { id: string; tagUid: string; status: string };
  lastTrip: { plazaName: string; mileMarker: number | null; entryTime: string; status: string } | null;
  pendingViolations: number;
  totalTrips: number;
}

export default function FleetDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'trips' | 'spending'>('overview');

  const { data: stats, isLoading: loadingStats } = useQuery<FleetStats>({
    queryKey: ['fleet-stats'],
    queryFn: async () => {
      const res = await api.get('/fleet/stats');
      return res.data;
    },
  });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery<FleetVehicle[]>({
    queryKey: ['fleet-vehicles'],
    queryFn: async () => {
      const res = await api.get('/fleet/vehicles');
      return res.data;
    },
  });

  const { data: tripData, isLoading: loadingTrips } = useQuery({
    queryKey: ['fleet-trips'],
    queryFn: async () => {
      const res = await api.get('/fleet/trips?limit=20');
      return res.data;
    },
  });

  const { data: spendingData, isLoading: loadingSpending } = useQuery({
    queryKey: ['fleet-spending'],
    queryFn: async () => {
      const res = await api.get('/fleet/spending?period=daily');
      return res.data;
    },
  });

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'vehicles' as const, label: 'Vehicles', icon: Car },
    { id: 'trips' as const, label: 'Trip History', icon: Route },
    { id: 'spending' as const, label: 'Spending', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 size={24} />
            Fleet Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor your fleet vehicles
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Vehicles</p>
                  <p className="text-xl font-bold">{stats?.totalVehicles || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="text-xl font-bold text-green-600">{stats?.activeVehicles || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Route className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Trips</p>
                  <p className="text-xl font-bold">{stats?.totalTrips || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Violations</p>
                  <p className="text-xl font-bold text-red-600">{stats?.totalViolations || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Trip</p>
                  <p className="text-xl font-bold">{stats?.averageTripLength?.toFixed(0) || 0} mi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicles by Class */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Vehicles by Class</h3>
              <div className="space-y-3">
                {stats?.vehiclesByClass && Object.entries(stats.vehiclesByClass).map(([cls, count]) => (
                  <div key={cls} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cls}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / (stats.totalVehicles || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Vehicle */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Top Vehicles by Revenue</h3>
              <div className="space-y-3">
                {stats?.revenueByVehicle?.slice(0, 5).map((item) => (
                  <div key={item.plateNumber} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{item.plateNumber}</span>
                    <span className="text-sm font-medium text-green-600">${item.revenue.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Recent Trips</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vehicle</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plaza</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Mile</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Entry</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.recentTrips?.slice(0, 10).map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{trip.vehiclePlate}</td>
                      <td className="px-4 py-3">{trip.plazaName}</td>
                      <td className="px-4 py-3">{trip.mileMarker ?? '-'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(trip.entryTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trip.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          trip.status === 'ENTRY' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">${trip.tollAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Fleet Vehicles ({vehicles?.length || 0})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Class</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">RFID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Last Trip</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Trips</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Violations</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vehicles?.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{vehicle.plateNumber}</td>
                    <td className="px-4 py-3">{vehicle.year} {vehicle.make} {vehicle.model}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{vehicle.vehicleClass}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vehicle.rfidTag.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.rfidTag.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {vehicle.lastTrip ? (
                        <div>
                          <div>{vehicle.lastTrip.plazaName}</div>
                          <div>{new Date(vehicle.lastTrip.entryTime).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        'No trips'
                      )}
                    </td>
                    <td className="px-4 py-3">{vehicle.totalTrips}</td>
                    <td className="px-4 py-3">
                      {vehicle.pendingViolations > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          {vehicle.pendingViolations}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trips Tab */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Trip History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Vehicle</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Class</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plaza</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Mile</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Entry</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Exit</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tripData?.events?.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{trip.vehiclePlate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{trip.vehicleClass}</span>
                    </td>
                    <td className="px-4 py-3">{trip.plazaName}</td>
                    <td className="px-4 py-3">{trip.mileMarker ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(trip.entryTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {trip.exitTime ? new Date(trip.exitTime).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trip.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        trip.status === 'ENTRY' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">${trip.tollAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spending Tab */}
      {activeTab === 'spending' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Daily Spending</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${spendingData?.totalSpending?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-gray-500">
              {spendingData?.transactionCount || 0} transactions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Spending by Vehicle</h3>
              <div className="space-y-3">
                {spendingData?.spendingByVehicle?.map((item: any) => (
                  <div key={item.plateNumber} className="flex items-center justify-between">
                    <span className="text-sm font-mono">{item.plateNumber}</span>
                    <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Spending by Plaza</h3>
              <div className="space-y-3">
                {spendingData?.spendingByPlaza?.map((item: any) => (
                  <div key={item.plazaName} className="flex items-center justify-between">
                    <span className="text-sm">{item.plazaName}</span>
                    <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
