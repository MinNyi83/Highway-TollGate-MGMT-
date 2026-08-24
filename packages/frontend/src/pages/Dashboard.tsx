import { useQuery } from '@tanstack/react-query';

interface Stats {
  totalVehicles: number;
  totalRevenue: number;
  activeViolations: number;
  totalEvents: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // For now, return mock data
      return {
        totalVehicles: 0,
        totalRevenue: 0,
        activeViolations: 0,
        totalEvents: 0,
      };
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalVehicles || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Violations</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.activeViolations || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue by Plaza</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
