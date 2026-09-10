import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';

export default function BudgetTracker() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['budget-tracker', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await api.get(`/financial/budget-tracker?${params.toString()}`);
      return res.data;
    },
  });

  const items = data?.items ?? [];
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-600" />
          Budget Tracker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track budget vs actual spending by region</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Budget</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{formatMMK(summary.totalBudget || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Actual</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(summary.totalActual || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Variance</div>
          <div className={`text-2xl font-bold mt-1 ${(summary.totalActual || 0) > (summary.totalBudget || 0) ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatMMK((summary.totalActual || 0) - (summary.totalBudget || 0))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Budget by Region</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Region</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Budget</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Actual</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Variance</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((item: any) => (
                <tr key={item.region} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{item.region}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{formatMMK(item.budget)}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(item.actual)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 ${item.variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {item.variance > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {formatMMK(Math.abs(item.variance))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(item.utilization, 100)}%` }} />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 text-xs">{item.utilization.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
