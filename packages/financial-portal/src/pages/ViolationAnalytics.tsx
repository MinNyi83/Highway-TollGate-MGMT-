import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';

const COLORS = ['#2563eb', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

export default function ViolationAnalytics() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['violations', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/financial/violations?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          Violation Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze violations by type and region</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Violations</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{data?.summary?.totalViolations || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Fines Collected</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">{formatMMK(data?.summary?.totalFines || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">By Violation Type</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.byType || []}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ type, percentage }) => `${type} (${percentage}%)`}
                >
                  {(data?.byType || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">By Region</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.byRegion || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regionName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Violations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Violation Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Type</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Count</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Total Fine</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {(data?.byType || []).map((v: any) => (
              <tr key={v.type} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{v.type}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{v.count.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-amber-600 font-medium">{formatMMK(v.totalFine)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{v.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
