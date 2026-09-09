import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DollarSign } from 'lucide-react';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';

export default function RevenueByRegion() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['revenue-by-region', startDate, endDate],
    queryFn: async () => {
      const res = await api.get(`/financial/revenue/by-region?startDate=${startDate}&endDate=${endDate}`);
      return res.data;
    },
  });

  const regions = data?.regions ?? [];
  const monthlyData = data?.monthly ?? [];

  const columns = [
    { key: 'regionName', label: t('common.region') },
    { key: 'totalRevenue', label: t('common.revenue'), render: (v: number) => formatMMK(v) },
    { key: 'totalTrips', label: t('common.trips') },
    { key: 'avgPerTrip', label: 'Avg/Trip', render: (v: number) => formatMMK(v) },
    { key: 'growth', label: 'Growth %', render: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` },
  ];

  const monthlyColumns = [
    { key: 'month', label: 'Month' },
    ...regions.map((r: any) => ({
      key: r.regionCode,
      label: r.regionName,
      render: (v: number) => formatMMK(v ?? 0),
    })),
    { key: 'total', label: 'Total', render: (v: number) => formatMMK(v ?? 0) },
  ];

  const handleExport = () => {
    exportToExcel(
      regions,
      [
        { header: 'Region', key: 'regionName' },
        { header: 'Total Revenue (MMK)', key: 'totalRevenue' },
        { header: 'Transaction Count', key: 'totalTrips' },
        { header: 'Avg/Trip (MMK)', key: 'avgPerTrip' },
        { header: 'Growth %', key: 'growth' },
      ],
      `revenue-by-region-${startDate}-${endDate}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            {t('financial.regionSummary')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'ဒေသအလိုက် တံတားခ ဝင်ငွေ' : 'Toll Revenue by Region'}
          </p>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region: any) => (
          <div key={region.regionCode} className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{region.regionName}</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(region.totalRevenue)}</p>
            <p className="text-xs text-slate-400 mt-1">
              {region.totalTrips.toLocaleString()} {t('common.trips').toLowerCase()}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {t('financial.regionSummary')}
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={regions} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="regionName" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatMMK(value)} />
            <Legend />
            <Bar dataKey="totalRevenue" name={t('common.revenue')} fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {monthlyData.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {t('common.period')} {language === 'my' ? 'အလိုက်' : 'by Month'}
            </h2>
          </div>
          <DataTable columns={monthlyColumns} data={monthlyData} emptyMessage={t('common.noData')} />
        </div>
      )}
    </div>
  );
}
