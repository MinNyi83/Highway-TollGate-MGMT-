import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Car } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function RevenueByVehicle() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-by-vehicle', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/financial/revenue-by-vehicle?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
  });

  const vehicleTypes = data?.vehicleTypes ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Car className="w-6 h-6 text-violet-600" />
          Revenue by Vehicle Type
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze revenue contribution by vehicle class</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(data?.totalRevenue || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Trips</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{data?.totalTrips?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Vehicle Types</div>
          <div className="text-2xl font-bold text-violet-600 mt-1">{vehicleTypes.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue Share by Type</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypes}
                  dataKey="revenue"
                  nameKey="vehicleType"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ vehicleType, percentage }) => `${vehicleType} (${percentage}%)`}
                >
                  {vehicleTypes.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatMMK(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Trips by Vehicle Type</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicleType" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" name="Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Vehicle Type Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Vehicle Type</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Trips</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Revenue</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Avg/Trip</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {vehicleTypes.map((v: any) => (
              <tr key={v.vehicleType} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{v.vehicleType}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{v.trips.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(v.revenue)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{formatMMK(v.avgPerTrip)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${v.percentage}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{v.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
