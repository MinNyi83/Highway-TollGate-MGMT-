import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2 } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';

export default function PlazaPerformance() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: plazas, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['plaza-performance', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/financial/plaza-performance?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
  });

  const sortedByRevenue = [...(plazas || [])].sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);
  const topRevenue = sortedByRevenue[0];
  const totalRevenue = plazas?.reduce((sum: number, p: any) => sum + p.totalRevenue, 0) || 0;
  const totalTrips = plazas?.reduce((sum: number, p: any) => sum + p.totalTrips, 0) || 0;

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Plaza Performance
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Compare toll plaza revenue and traffic</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Plazas</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{plazas?.length || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(totalRevenue)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Trips</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{totalTrips.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue by Plaza</h3>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedByRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <YAxis type="category" dataKey="plazaName" width={150} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Bar dataKey="totalRevenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Plaza Rankings</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">#</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Plaza</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Mile Marker</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Trips</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Revenue</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Avg/Trip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {sortedByRevenue.map((p: any, i: number) => (
              <tr key={p.plazaId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-bold text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{p.plazaName}</td>
                <td className="px-4 py-3 text-slate-500">Mile {p.mileMarker}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{p.totalTrips.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(p.totalRevenue)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{formatMMK(p.avgPerTrip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
