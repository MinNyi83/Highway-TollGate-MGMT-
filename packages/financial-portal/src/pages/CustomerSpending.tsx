import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';

export default function CustomerSpending() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['customer-spending', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/financial/customer-spending?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
  });

  const top10 = data?.top10 ?? [];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-600" />
          Customer Spending Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Top spending customers and patterns</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Customers</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{data?.summary?.totalCustomers || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Spent</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{formatMMK(data?.summary?.totalSpent || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Avg per Customer</div>
          <div className="text-3xl font-bold text-pink-600 mt-1">{formatMMK(data?.summary?.avgSpendPerCustomer || 0)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top 10 Spending Customers</h3>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={top10} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="plate" width={100} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Bar dataKey="totalSpent" fill="#ec4899" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Customer Rankings</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">#</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">License Plate</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Trips</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Total Spent</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Avg/Trip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {top10.map((c: any, i: number) => (
              <tr key={c.plate} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-bold text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-white">{c.plate}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{c.trips.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(c.totalSpent)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{formatMMK(c.avgPerTrip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
