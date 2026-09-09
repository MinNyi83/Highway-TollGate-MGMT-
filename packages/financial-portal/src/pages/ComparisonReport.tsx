import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';

export default function ComparisonReport() {
  const { language } = useLanguage();
  const t = (key: string) => key;

  const { data: comparison, isLoading } = useQuery({
    queryKey: ['comparison-report'],
    queryFn: async () => {
      const res = await api.get('/financial/comparison');
      return res.data;
    },
  });

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const totalCurrent = comparison?.reduce((sum: number, r: any) => sum + r.currentRevenue, 0) || 0;
  const totalPrevious = comparison?.reduce((sum: number, r: any) => sum + r.previousRevenue, 0) || 0;
  const yoyGrowth = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Comparison Report</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Year-over-year revenue comparison</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">{currentYear} Revenue</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{formatMMK(totalCurrent)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">{lastYear} Revenue</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{formatMMK(totalPrevious)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">YoY Growth</div>
          <div className={`text-2xl font-bold mt-1 flex items-center gap-1 ${Number(yoyGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Number(yoyGrowth) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {yoyGrowth}%
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Monthly Revenue Comparison</h3>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Legend />
              <Bar dataKey="currentRevenue" name={`${currentYear}`} fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previousRevenue" name={`${lastYear}`} fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Month</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{currentYear}</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">{lastYear}</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {comparison?.map((row: any) => (
              <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{row.month}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{formatMMK(row.currentRevenue)}</td>
                <td className="px-4 py-3 text-right text-slate-500">{formatMMK(row.previousRevenue)}</td>
                <td className={`px-4 py-3 text-right font-medium ${Number(row.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.growth}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
