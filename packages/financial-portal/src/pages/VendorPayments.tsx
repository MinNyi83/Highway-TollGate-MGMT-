import { useQuery } from '@tanstack/react-query';
import { Building } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';

export default function VendorPayments() {
  const { data, isLoading } = useQuery({
    queryKey: ['vendor-payments'],
    queryFn: async () => {
      const res = await api.get('/financial/vendor-payments');
      return res.data;
    },
  });

  const vendors = data?.vendors ?? [];
  const pendingPayments = data?.pendingPayments ?? [];
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Building className="w-6 h-6 text-violet-600" />
          Vendor Payments
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expense tracking and vendor management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Vendors</div>
          <div className="text-2xl font-bold text-violet-600 mt-1">{summary.totalVendors || 0}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Paid</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(summary.totalPaid || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Pending Payments</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{summary.pendingCount || 0} ({formatMMK(summary.pendingAmount || 0)})</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Vendors</h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Vendor</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Category</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Total Paid</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {vendors.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{v.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{v.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(v.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{v.payments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Pending Payments</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pendingPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No pending payments</div>
            ) : (
              pendingPayments.map((p: any) => (
                <div key={p.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">{p.vendor}</div>
                    <div className="text-xs text-slate-500">Due: {p.dueDate} · {p.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-600">{formatMMK(p.amount)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{p.priority}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
