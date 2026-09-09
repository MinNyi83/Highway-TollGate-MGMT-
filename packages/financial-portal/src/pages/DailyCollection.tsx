import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import DataTable from '../components/DataTable';
import RegionFilter from '../components/RegionFilter';
import ExportButton from '../components/ExportButton';
import StatusBadge from '../components/StatusBadge';
import { formatMMK, formatDate } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';
import { exportToPDF } from '../utils/exportPDF';

export default function DailyCollection() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [regionId, setRegionId] = useState('');
  const [plazaId, setPlazaId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['daily-collection', date, regionId, plazaId],
    queryFn: async () => {
      const params = new URLSearchParams({ date });
      if (regionId) params.append('regionId', regionId);
      if (plazaId) params.append('plazaId', plazaId);
      const res = await api.get(`/financial/daily-collection?${params.toString()}`);
      return res.data;
    },
  });

  const records = data?.records ?? [];
  const summary = data?.summary ?? {};

  const columns = [
    { key: 'date', label: t('common.dateRange'), render: (v: string) => formatDate(v) },
    { key: 'plazaName', label: t('common.plaza') },
    { key: 'regionName', label: t('common.region') },
    { key: 'rfidTrips', label: 'RFID Trips' },
    { key: 'cashTrips', label: 'Cash Trips' },
    { key: 'totalTrips', label: t('common.trips') },
    { key: 'tollRevenue', label: t('common.revenue'), render: (v: number) => formatMMK(v) },
    { key: 'violationFines', label: t('common.fine'), render: (v: number) => formatMMK(v) },
    { key: 'status', label: t('common.status'), render: (v: string) => <StatusBadge status={v} /> },
  ];

  const handleExport = () => {
    exportToExcel(
      records,
      [
        { header: 'Date', key: 'date' },
        { header: 'Plaza', key: 'plazaName' },
        { header: 'Region', key: 'regionName' },
        { header: 'RFID Trips', key: 'rfidTrips' },
        { header: 'Cash Trips', key: 'cashTrips' },
        { header: 'Total Trips', key: 'totalTrips' },
        { header: 'Toll Revenue (MMK)', key: 'tollRevenue' },
        { header: 'Violation Fines (MMK)', key: 'violationFines' },
        { header: 'Status', key: 'status' },
      ],
      `daily-collection-${date}`
    );
  };

  const handlePDFExport = () => {
    exportToPDF(
      `Daily Collection Statement - ${date}`,
      records,
      [
        { header: 'Date', key: 'date' },
        { header: 'Plaza', key: 'plazaName' },
        { header: 'Region', key: 'regionName' },
        { header: 'RFID Trips', key: 'rfidTrips' },
        { header: 'Cash Trips', key: 'cashTrips' },
        { header: 'Total Trips', key: 'totalTrips' },
        { header: 'Toll Revenue (MMK)', key: 'tollRevenue', format: (v: number) => v?.toLocaleString() || '0' },
        { header: 'Violation Fines (MMK)', key: 'violationFines', format: (v: number) => v?.toLocaleString() || '0' },
        { header: 'Status', key: 'status' },
      ],
      `daily-collection-${date}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            {t('financial.dailyStatement')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'နေ့စဉ်ကောက်ခံမှု ဖော်ပြချက်' : 'Daily Collection Statement'}
          </p>
        </div>
        <ExportButton onClick={handleExport} onPDF={handlePDFExport} />
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.dateRange')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.region')}
            </label>
            <RegionFilter value={regionId} onChange={setRegionId} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.plaza')}
            </label>
            <input
              type="text"
              value={plazaId}
              onChange={(e) => setPlazaId(e.target.value)}
              placeholder={t('common.allPlazas')}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={records}
        emptyMessage={t('common.noData')}
      />

      {records.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            {t('financial.collectionSummary')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-slate-500">{t('common.trips')}</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                {(summary.totalTrips ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('common.revenue')}</p>
              <p className="text-lg font-bold text-emerald-600">
                {formatMMK(summary.totalRevenue ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t('common.fine')}</p>
              <p className="text-lg font-bold text-orange-600">
                {formatMMK(summary.totalFines ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">RFID Trips</p>
              <p className="text-lg font-bold text-blue-600">
                {(summary.rfidTrips ?? 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Cash Trips</p>
              <p className="text-lg font-bold text-purple-600">
                {(summary.cashTrips ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
