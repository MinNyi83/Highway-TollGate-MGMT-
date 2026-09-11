import { useQuery } from '@tanstack/react-query';
import { PieChart } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

export default function CostAllocation() {
  const { t } = useLanguage();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['cost-allocation'],
    queryFn: async () => {
      const res = await api.get('/financial/cost-allocation');
      return res.data;
    },
  });

  const allocations = data?.allocations ?? [];
  const costBreakdown = data?.costBreakdown ?? [];
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <PieChart className="w-6 h-6 text-indigo-600" />
          {t('page.costAllocation')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Shared costs distributed across regions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Costs</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{formatMMK(data?.totalCosts || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Regions</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{allocations.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Categories</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{costBreakdown.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Cost Breakdown</h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : (
            <div className="p-6">
              {costBreakdown.map((item: any, i: number) => (
                <div key={item.category} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-slate-300">{item.category}</span>
                    <span className="font-medium text-slate-800 dark:text-white">{formatMMK(item.total)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                    <div className="h-3 rounded-full" style={{ width: `${(item.total / (data?.totalCosts || 1)) * 100}%`, backgroundColor: colors[i % colors.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Allocation by Region</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Region</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Share</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Allocated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {allocations.map((a: any) => (
                <tr key={a.regionId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{a.region}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{(a.share * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right font-medium text-indigo-600">{formatMMK(a.totalAllocated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
