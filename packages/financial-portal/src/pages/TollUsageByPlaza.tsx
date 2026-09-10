import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Route } from 'lucide-react';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import ExportButton from '../components/ExportButton';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import ErrorState from '../components/ErrorState';
import { exportToExcel } from '../utils/excel';

export default function TollUsageByPlaza() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [plazaId, setPlazaId] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: plazas, isError: isPlazasError, error: plazasError, refetch: refetchPlazas } = useQuery({
    queryKey: ['plazas'],
    queryFn: async () => {
      const res = await api.get('/financial/plazas');
      return res.data;
    },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['toll-usage', plazaId, startDate, endDate],
    queryFn: async () => {
      if (!plazaId) return null;
      const params = new URLSearchParams({ startDate, endDate });
      const res = await api.get(`/financial/toll-usage/${plazaId}?${params.toString()}`);
      return res.data;
    },
    enabled: !!plazaId,
  });

  const isAnyError = isError || isPlazasError;
  const anyError = error || plazasError;
  const anyRefetch = () => { if (isError) refetch(); if (isPlazasError) refetchPlazas(); };

  if (isAnyError) return <ErrorState message={anyError?.message} onRetry={anyRefetch} />;

  const records = data?.records ?? [];
  const plazaList = plazas ?? [];

  const columns = [
    { key: 'date', label: t('common.dateRange'), render: (v: string) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'totalTrips', label: t('common.trips') },
    { key: 'rfidTrips', label: 'RFID Trips' },
    { key: 'cashTrips', label: 'Cash Trips' },
    { key: 'revenueCollected', label: t('common.revenue'), render: (v: number) => formatMMK(v) },
    { key: 'avgPerTrip', label: 'Avg/Trip', render: (v: number) => formatMMK(v) },
  ];

  const handleExport = () => {
    exportToExcel(
      records,
      [
        { header: 'Date', key: 'date' },
        { header: 'Total Trips', key: 'totalTrips' },
        { header: 'RFID Trips', key: 'rfidTrips' },
        { header: 'Cash Trips', key: 'cashTrips' },
        { header: 'Revenue Collected (MMK)', key: 'revenueCollected' },
        { header: 'Avg per Trip (MMK)', key: 'avgPerTrip' },
      ],
      `toll-usage-${plazaId}-${startDate}-${endDate}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Route className="w-6 h-6 text-orange-600" />
            {t('page.tollUsage')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'ဖြတ်သန်းမှု ပမာဏ ခွဲခြမ်းစိတ်ဖြာချက်' : 'Pass-through transaction volume analysis'}
          </p>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.plaza')}
            </label>
            <select
              value={plazaId}
              onChange={(e) => setPlazaId(e.target.value)}
              className="select-field"
            >
              <option value="">{t('common.allPlazas')}</option>
              {plazaList.map((plaza: any) => (
                <option key={plaza.id} value={plaza.id}>{plaza.name}</option>
              ))}
            </select>
          </div>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />
        </div>
      </div>

      {!plazaId ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Route className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            {language === 'my' ? 'ဂိတ်တစ်ခုကို ရွေးချယ်ပါ' : 'Select a toll plaza to view data'}
          </p>
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={records} emptyMessage={t('common.noData')} />

          {records.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                {t('financial.transactionVolume')} — {language === 'my' ? 'နေ့စဉ်' : 'Daily'}
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={records} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => formatMMK(value)} />
                  <Legend />
                  <Bar dataKey="rfidTrips" name="RFID Trips" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="cashTrips" name="Cash Trips" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
