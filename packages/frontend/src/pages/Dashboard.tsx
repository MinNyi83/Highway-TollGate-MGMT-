import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/reports/summary');
      return res.data;
    },
  });

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

  const { data: recentEvents } = useQuery({
    queryKey: ['admin-recent-events'],
    queryFn: async () => {
      const res = await api.get('/toll-events', { params: { limit: 5 } });
      return res.data;
    },
  });

  if (statsLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${stats?.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Vehicles</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalVehicles || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Violations</h3>
          <p className="text-3xl font-bold text-red-600">{stats?.activeViolations || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalEvents || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue by Plaza (Last 30 Days)</h3>
          {revenueData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plazaName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        {/* Violations Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
          {violationData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={violationData} dataKey="count" nameKey="violationType" cx="50%" cy="50%" outerRadius={100} label>
                  {violationData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">Recent Toll Events</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentEvents?.map((event: any) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(event.entryTime).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{event.vehicle?.plateNumber}</td>
                <td className="px-4 py-3 text-sm">{event.plaza?.name}</td>
                <td className="px-4 py-3 text-sm">${event.transaction?.amount || 0}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!recentEvents || recentEvents.length === 0) && (
          <div className="p-8 text-center text-gray-400">No events yet</div>
        )}
      </div>
    </div>
  );
}
