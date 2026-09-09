import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import DataTable from '../components/DataTable';
import RegionFilter from '../components/RegionFilter';
import ExportButton from '../components/ExportButton';
import { formatMMK, formatDate } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';

const currentYear = new Date().getFullYear();

export default function OfficialReceipts() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [fiscalYear, setFiscalYear] = useState(currentYear);
  const [regionId, setRegionId] = useState('');
  const [plazaId, setPlazaId] = useState('');

  const { data: plazas } = useQuery({
    queryKey: ['plazas'],
    queryFn: async () => {
      const res = await api.get('/financial/plazas');
      return res.data.data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['receipts', fiscalYear, regionId, plazaId],
    queryFn: async () => {
      const params = new URLSearchParams({ fiscalYear: String(fiscalYear) });
      if (regionId) params.append('regionId', regionId);
      if (plazaId) params.append('plazaId', plazaId);
      const res = await api.get(`/financial/receipts?${params.toString()}`);
      return res.data.data;
    },
  });

  const records = data?.records ?? [];
  const plazaList = plazas ?? [];

  const columns = [
    { key: 'receiptNo', label: t('financial.receiptNumber') },
    { key: 'date', label: t('common.dateRange'), render: (v: string) => formatDate(v) },
    { key: 'plateNumber', label: 'Plate No.' },
    { key: 'vehicleType', label: 'Vehicle' },
    { key: 'plazaName', label: t('common.plaza') },
    { key: 'regionName', label: t('common.region') },
    { key: 'amount', label: t('common.amount'), render: (v: number) => formatMMK(v) },
    { key: 'accountHolder', label: 'Account Holder' },
  ];

  const handleExport = () => {
    exportToExcel(
      records,
      [
        { header: 'Receipt No', key: 'receiptNo' },
        { header: 'Date', key: 'date' },
        { header: 'Plate Number', key: 'plateNumber' },
        { header: 'Vehicle', key: 'vehicleType' },
        { header: 'Plaza', key: 'plazaName' },
        { header: 'Region', key: 'regionName' },
        { header: 'Amount (MMK)', key: 'amount' },
        { header: 'Account Holder', key: 'accountHolder' },
      ],
      `official-receipts-${fiscalYear}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-cyan-600" />
            {t('page.receipts')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'တရားဝင်ပြေစာ မှတ်တမ်း' : 'Official toll payment receipts'}
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
        </div>
      </div>

      <DataTable columns={columns} data={records} emptyMessage={t('common.noData')} />
    </div>
  );
}
