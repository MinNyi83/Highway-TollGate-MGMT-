import { useQuery } from '@tanstack/react-query';
import { GitBranch, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';

export default function SettlementPipeline() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settlement-pipeline'],
    queryFn: async () => {
      const res = await api.get('/financial/settlement-pipeline');
      return res.data;
    },
  });

  const summary = data?.summary ?? {};
  const byStatus = data?.byStatus ?? [];
  const recentTransfers = data?.recentTransfers ?? [];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-orange-600" />
          Settlement Pipeline
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track revenue transfer status in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Clock className="w-4 h-4" /> Pending</div>
          <div className="text-3xl font-bold text-amber-600 mt-1">{summary.pending || 0}</div>
          <div className="text-sm text-slate-400 mt-1">{formatMMK(byStatus.find((s: any) => s.status === 'PENDING')?.amount || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><CheckCircle className="w-4 h-4" /> Confirmed</div>
          <div className="text-3xl font-bold text-green-600 mt-1">{summary.confirmed || 0}</div>
          <div className="text-sm text-slate-400 mt-1">{formatMMK(byStatus.find((s: any) => s.status === 'CONFIRMED')?.amount || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">All Time</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{summary.total || 0}</div>
          <div className="text-sm text-slate-400 mt-1">Total transfers</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Pipeline Flow</h3>
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div className="mt-2 font-bold text-amber-600">{summary.pending || 0}</div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>
          <ArrowRight className="w-8 h-8 text-slate-300" />
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 font-bold text-green-600">{summary.confirmed || 0}</div>
            <div className="text-xs text-slate-500">Confirmed</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Transfers</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !recentTransfers.length ? (
          <div className="p-8 text-center text-slate-500">No transfers found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">ID</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Confirmed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentTransfers.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(t.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500">{t.confirmedAt ? new Date(t.confirmedAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
