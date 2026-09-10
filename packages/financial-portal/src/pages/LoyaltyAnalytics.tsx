import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Award } from 'lucide-react';
import api from '../api/client';
import ErrorState from '../components/ErrorState';

export default function LoyaltyAnalytics() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['loyalty-analytics'],
    queryFn: async () => {
      const res = await api.get('/financial/loyalty-analytics');
      return res.data;
    },
  });

  const topAccounts = data?.topAccounts ?? [];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-600" />
          Customer Loyalty Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Loyalty points distribution and top performers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Award className="w-4 h-4" /> Total Accounts</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{data?.summary?.totalAccounts || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Star className="w-4 h-4" /> Total Points</div>
          <div className="text-3xl font-bold text-yellow-600 mt-1">{data?.summary?.totalPoints?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Avg Points/Account</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{Math.round(data?.summary?.avgPoints || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Top 10 Accounts by Points</h3>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topAccounts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="accountId" width={120} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="points" name="Points" fill="#eab308" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Top Accounts</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">#</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Account ID</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Points</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {topAccounts.map((a: any, i: number) => (
              <tr key={a.accountId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-bold text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{a.accountId.slice(0, 12)}...</td>
                <td className="px-4 py-3 text-right font-medium text-yellow-600">{a.points.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    a.points > 1000 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : a.points > 500 ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {a.points > 1000 ? 'Gold' : a.points > 500 ? 'Silver' : 'Bronze'}
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
