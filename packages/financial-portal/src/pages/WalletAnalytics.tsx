import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function WalletAnalytics() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['wallet-analytics'],
    queryFn: async () => {
      const res = await api.get('/financial/wallet-analytics');
      return res.data;
    },
  });

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-600" />
          Wallet Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customer wallet balances and top-up patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Users className="w-4 h-4" /> Total Accounts</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{data?.summary?.totalAccounts || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Wallet className="w-4 h-4" /> Total Balance</div>
          <div className="text-3xl font-bold text-emerald-600 mt-1">{formatMMK(data?.summary?.totalBalance || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><TrendingUp className="w-4 h-4" /> Avg Balance</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{formatMMK(data?.summary?.avgBalance || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Balance by Account Type</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.byType || []}
                  dataKey="totalBalance"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ type, count }) => `${type} (${count})`}
                >
                  {(data?.byType || []).map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatMMK(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Monthly Top-Up Trend</h3>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.topUpTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: number) => formatMMK(value)} />
                <Bar dataKey="amount" name="Top-Ups" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Top-Ups</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">ID</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {(data?.recentTopUps || []).map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(t.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.status === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
