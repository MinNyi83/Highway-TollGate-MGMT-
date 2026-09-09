import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Wallet, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import RegionFilter from '../components/RegionFilter';
import ExportButton from '../components/ExportButton';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function TopUpByRegion() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [regionId, setRegionId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['topup-by-region', startDate, endDate, regionId],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      if (regionId) params.append('regionId', regionId);
      const res = await api.get(`/financial/topup/by-region?${params.toString()}`);
      return res.data.data;
    },
  });

  const regions = data?.regions ?? [];

  const columns = [
    { key: 'regionName', label: t('common.region') },
    { key: 'totalDeposits', label: t('common.amount'), render: (v: number) => formatMMK(v) },
    { key: 'transactionCount', label: t('common.trips') },
    { key: 'avgDeposit', label: 'Avg Deposit', render: (v: number) => formatMMK(v) },
    { key: 'lastUpdated', label: 'Last Updated', render: (v: string) => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  const handleExport = () => {
    exportToExcel(
      regions,
      [
        { header: 'Region', key: 'regionName' },
        { header: 'Total Deposits (MMK)', key: 'totalDeposits' },
        { header: 'Transaction Count', key: 'transactionCount' },
        { header: 'Avg Deposit (MMK)', key: 'avgDeposit' },
        { header: 'Last Updated', key: 'lastUpdated' },
      ],
      `wallet-deposits-by-region-${startDate}-${endDate}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            {t('page.topupByRegion')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('financial.walletDepositsByRegion')}
          </p>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {language === 'my' ? 'အရေးကြီးသည်' : 'Important'}
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            {t('financial.walletDeposits')} —
            {language === 'my'
              ? ' ဒီငွေတွေက ဖောင်းကွန်းသုံးစွဲသူတွေရဲ့ ပိုက်ဆံအိတ်ထဲမှာ ဖြည့်ထားတဲ့ငွေဖြစ်ပြီး ကုမ္ပဏီရဲ့ ဝင်ငွေမဟုတ်ပါ။'
              : ' These are customer wallet balances (liabilities), not company revenue.'}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.region')}
            </label>
            <RegionFilter value={regionId} onChange={setRegionId} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region: any) => (
          <div key={region.regionCode} className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{region.regionName}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{formatMMK(region.totalDeposits)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {region.transactionCount.toLocaleString()} {t('common.trips').toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={regions} emptyMessage={t('common.noData')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {t('financial.walletDepositsByRegion')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regions} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="regionName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Legend />
              <Bar dataKey="totalDeposits" name={t('common.amount')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {t('financial.walletDepositsByRegion')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regions}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="totalDeposits"
                nameKey="regionName"
                label={({ regionName, percent }) => `${regionName} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {regions.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatMMK(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
