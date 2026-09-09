import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';

export default function RevenueForecast() {
  const [months, setMonths] = useState(6);

  const { data, isLoading } = useQuery({
    queryKey: ['forecast', months],
    queryFn: async () => {
      const res = await api.get(`/financial/forecast?months=${months}`);
      return res.data;
    },
  });

  const chartData = [
    ...(data?.historical || []).map((h: any) => ({ ...h, projected: null })),
    ...(data?.forecast || []).map((f: any) => ({ ...f, actual: null })),
  ];

  const lastActual = data?.historical?.[data.historical.length - 1]?.actual || 0;
  const lastForecast = data?.forecast?.[data.forecast.length - 1]?.projected || 0;
  const growth = lastActual > 0 ? ((lastForecast - lastActual) / lastActual * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Revenue Forecast
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Projected revenue based on historical trends</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Forecast Period:</label>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <option value={3}>3 Months</option>
          <option value={6}>6 Months</option>
          <option value={12}>12 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Current Month (Actual)</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{formatMMK(lastActual)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Projected ({months}mo)</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{formatMMK(lastForecast)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Projected Growth</div>
          <div className={`text-2xl font-bold mt-1 ${Number(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth}%
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue Trend & Forecast</h3>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Legend />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
              <Line type="monotone" dataKey="projected" name="Projected" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Forecast Details</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Month</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Actual</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Projected</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {data?.historical?.map((h: any) => (
              <tr key={`${h.year}-${h.month}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{h.month} {h.year}</td>
                <td className="px-4 py-3 text-right font-medium text-blue-600">{formatMMK(h.actual)}</td>
                <td className="px-4 py-3 text-right text-slate-400">-</td>
                <td className="px-4 py-3 text-right text-slate-400">-</td>
              </tr>
            ))}
            {data?.forecast?.map((f: any) => (
              <tr key={`${f.year}-${f.month}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{f.month} {f.year}</td>
                <td className="px-4 py-3 text-right text-slate-400">-</td>
                <td className="px-4 py-3 text-right font-medium text-purple-600">{formatMMK(f.projected)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.confidence > 80 ? 'bg-green-100 text-green-700' : f.confidence > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {f.confidence}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
