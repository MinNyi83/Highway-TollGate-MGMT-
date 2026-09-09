import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileBarChart, Download } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import RegionFilter from '../components/RegionFilter';
import { formatMMK } from '../utils/format';
import { exportToPDF } from '../utils/exportPDF';

export default function FinancialReports() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [regionId, setRegionId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reports-summary', startDate, endDate, regionId],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      if (regionId) params.append('regionId', regionId);
      const res = await api.get(`/financial/reports/summary?${params.toString()}`);
      return res.data;
    },
  });

  const summary = data?.summary ?? {};
  const byRegion = data?.byRegion ?? [];

  const handlePDFExport = () => {
    exportToPDF(
      `Financial Report (${startDate} to ${endDate})`,
      byRegion,
      [
        { header: 'Plaza/Region', key: 'region' },
        { header: 'Trips', key: 'trips' },
        { header: 'Revenue (MMK)', key: 'revenue', format: (v: number) => v?.toLocaleString() || '0' },
      ],
      `financial-report-${startDate}-${endDate}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-teal-600" />
            Financial Reports Generator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate custom financial reports</p>
        </div>
        <button
          onClick={handlePDFExport}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Region</label>
            <RegionFilter value={regionId} onChange={setRegionId} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(summary.totalRevenue || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Fines</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{formatMMK(summary.totalFines || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Trips</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{(summary.totalTrips || 0).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Transactions</div>
          <div className="text-2xl font-bold text-violet-600 mt-1">{(summary.totalTransactions || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Revenue by Plaza/Region</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !byRegion.length ? (
          <div className="p-8 text-center text-slate-500">No data found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Plaza/Region</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Trips</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Revenue</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Avg/Trip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {byRegion.map((r: any) => (
                <tr key={r.region} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{r.region}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{r.trips.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatMMK(r.revenue)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{formatMMK(r.trips > 0 ? r.revenue / r.trips : 0)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">Total</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">{byRegion.reduce((s: number, r: any) => s + r.trips, 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatMMK(byRegion.reduce((s: number, r: any) => s + r.revenue, 0))}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">
                  {formatMMK(byRegion.reduce((s: number, r: any) => s + r.trips, 0) > 0 ? byRegion.reduce((s: number, r: any) => s + r.revenue, 0) / byRegion.reduce((s: number, r: any) => s + r.trips, 0) : 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
