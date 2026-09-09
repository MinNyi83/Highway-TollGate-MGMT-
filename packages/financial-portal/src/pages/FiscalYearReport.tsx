import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import RegionFilter from '../components/RegionFilter';
import ExportButton from '../components/ExportButton';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';

const currentYear = new Date().getFullYear();

export default function FiscalYearReport() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [fiscalYear, setFiscalYear] = useState(currentYear);
  const [regionId, setRegionId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['fiscal-year', fiscalYear, regionId],
    queryFn: async () => {
      const params = new URLSearchParams({ fiscalYear: String(fiscalYear) });
      if (regionId) params.append('regionId', regionId);
      const res = await api.get(`/financial/fiscal-year/summary?${params.toString()}`);
      return res.data.data;
    },
  });

  const summary = data?.summary ?? {};
  const monthlyBreakdown = data?.monthly ?? [];
  const quarterly = data?.quarterly ?? [];

  const monthlyColumns = [
    { key: 'month', label: 'Month' },
    { key: 'revenue', label: t('common.revenue'), render: (v: number) => formatMMK(v ?? 0) },
    { key: 'deposits', label: t('financial.walletDeposits'), render: (v: number) => formatMMK(v ?? 0) },
    { key: 'transactions', label: t('common.trips') },
    { key: 'outstanding', label: t('financial.outstanding'), render: (v: number) => formatMMK(v ?? 0) },
  ];

  const quarterlyColumns = [
    { key: 'quarter', label: t('financial.fiscalQuarter') },
    { key: 'revenue', label: t('common.revenue'), render: (v: number) => formatMMK(v ?? 0) },
    { key: 'deposits', label: t('financial.walletDeposits'), render: (v: number) => formatMMK(v ?? 0) },
    { key: 'transactions', label: t('common.trips') },
    { key: 'outstanding', label: t('financial.outstanding'), render: (v: number) => formatMMK(v ?? 0) },
  ];

  const handleExport = () => {
    exportToExcel(
      monthlyBreakdown.map((m: any, idx: number) => ({
        month: (language === 'my' ? my.months : en.months)[idx],
        revenue: m.revenue,
        deposits: m.deposits,
        transactions: m.transactions,
        outstanding: m.outstanding,
      })),
      [
        { header: 'Month', key: 'month' },
        { header: 'Revenue (MMK)', key: 'revenue' },
        { header: 'Wallet Deposits (MMK)', key: 'deposits' },
        { header: 'Transactions', key: 'transactions' },
        { header: 'Outstanding (MMK)', key: 'outstanding' },
      ],
      `fiscal-year-report-${fiscalYear}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            {t('page.fiscalYear')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'ဘဏ္ဍာနှစ် အစီရင်ခံစာ' : 'Annual fiscal year financial summary'}
          </p>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('financial.fiscalYear')}
            </label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(Number(e.target.value))}
              className="select-field"
            >
              {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.region')}
            </label>
            <RegionFilter value={regionId} onChange={setRegionId} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('financial.totalRevenue')}
          value={formatMMK(summary.totalRevenue ?? 0)}
          icon={Calendar}
          color="green"
        />
        <KPICard
          title={t('financial.walletDeposits')}
          value={formatMMK(summary.totalDeposits ?? 0)}
          icon={Calendar}
          color="blue"
        />
        <KPICard
          title={t('financial.totalTrips')}
          value={(summary.totalTransactions ?? 0).toLocaleString()}
          icon={Calendar}
          color="purple"
        />
        <KPICard
          title={t('financial.outstanding')}
          value={formatMMK(summary.outstanding ?? 0)}
          icon={Calendar}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {language === 'my' ? 'လစဉ် ဝင်ငွေလမ်းကြောင်း' : 'Monthly Revenue Trend'}
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={monthlyBreakdown.map((m: any, idx: number) => ({
                month: (language === 'my' ? my.months : en.months)[idx],
                ...m,
              }))}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name={t('common.revenue')} stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="deposits" name={t('financial.walletDeposits')} stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {t('financial.quarterlySummary')}
          </h2>
          <DataTable columns={quarterlyColumns} data={quarterly} emptyMessage={t('common.noData')} />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {language === 'my' ? 'လစဉ် အသေးစိတ်' : 'Monthly Breakdown'}
          </h2>
        </div>
        <DataTable
          columns={monthlyColumns}
          data={monthlyBreakdown.map((m: any, idx: number) => ({
            month: (language === 'my' ? my.months : en.months)[idx],
            ...m,
          }))}
          emptyMessage={t('common.noData')}
        />
      </div>
    </div>
  );
}
