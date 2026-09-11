import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download } from 'lucide-react';
import api from '../api/client';
import { formatMMK, formatDate } from '../utils/format';
import ExportButton from '../components/ExportButton';
import ErrorState from '../components/ErrorState';
import { exportToPDF } from '../utils/exportPDF';
import { useLanguage } from '../i18n';

export default function TransactionSearch() {
  const { t } = useLanguage();
  const [plate, setPlate] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['transactions', plate, startDate, endDate, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
      });
      if (plate) params.append('plate', plate);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const res = await api.get(`/financial/transactions?${params.toString()}`);
      return res.data;
    },
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination ?? {};

  const handlePDFExport = () => {
    exportToPDF(
      `Transactions (${startDate} to ${endDate})`,
      transactions,
      [
        { header: 'Plate', key: 'plate' },
        { header: 'Plaza', key: 'plaza' },
        { header: 'Vehicle', key: 'vehicleClass' },
        { header: 'Entry', key: 'entryTime', format: (v: string) => v ? new Date(v).toLocaleString() : '-' },
        { header: 'Exit', key: 'exitTime', format: (v: string) => v ? new Date(v).toLocaleString() : '-' },
        { header: 'Amount (MMK)', key: 'amount', format: (v: number) => v?.toLocaleString() || '0' },
        { header: 'Status', key: 'status' },
      ],
      `transactions-${startDate}-${endDate}`
    );
  };

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-cyan-600" />
            {t('page.transactions')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search and filter toll transactions</p>
        </div>
        <ExportButton onClick={() => {}} onPDF={handlePDFExport} label="Export PDF" />
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">License Plate</label>
            <input
              type="text"
              value={plate}
              onChange={(e) => { setPlate(e.target.value); setPage(1); }}
              placeholder="e.g. 1A-1234"
              className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 w-40"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="text-sm text-slate-500">
            {pagination.total || 0} transactions found
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Searching...</div>
        ) : !transactions.length ? (
          <div className="p-8 text-center text-slate-500">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Plate</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Plaza</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Entry Time</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Exit Time</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {transactions.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-white">{t.plate || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-500">{t.vehicleClass || '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t.plaza || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{t.entryTime ? new Date(t.entryTime).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{t.exitTime ? new Date(t.exitTime).toLocaleString() : '-'}</td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(t.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : t.status === 'ENTRY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
