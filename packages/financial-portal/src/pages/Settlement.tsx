import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, CheckCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import RegionFilter from '../components/RegionFilter';
import StatusBadge from '../components/StatusBadge';
import ExportButton from '../components/ExportButton';
import { formatMMK, formatDate } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import ErrorState from '../components/ErrorState';
import { exportToExcel } from '../utils/excel';

export default function Settlement() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [regionId, setRegionId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['settlement', startDate, endDate, regionId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      if (regionId) params.append('regionId', regionId);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/financial/settlement?${params.toString()}`);
      return res.data;
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/financial/settlement/confirm', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlement'] });
      setSelectedIds([]);
    },
  });

  const records = data?.records ?? [];

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.id]);
            } else {
              setSelectedIds((prev) => prev.filter((id) => id !== row.id));
            }
          }}
          className="rounded border-slate-300"
        />
      ),
    },
    { key: 'date', label: t('common.dateRange'), render: (v: string) => formatDate(v) },
    { key: 'plazaName', label: t('common.plaza') },
    { key: 'regionName', label: t('common.region') },
    { key: 'amount', label: t('common.amount'), render: (v: number) => formatMMK(v) },
    { key: 'trips', label: t('common.trips') },
    { key: 'status', label: t('common.status'), render: (v: string) => <StatusBadge status={v} /> },
    { key: 'bankName', label: t('financial.bankName') },
    { key: 'depositRef', label: t('financial.depositRef') },
    { key: 'remittanceDate', label: t('financial.transferDate'), render: (v: string) => v ? formatDate(v) : '—' },
  ];

  const handleExport = () => {
    exportToExcel(
      records,
      [
        { header: 'Date', key: 'date' },
        { header: 'Plaza', key: 'plazaName' },
        { header: 'Region', key: 'regionName' },
        { header: 'Amount (MMK)', key: 'amount' },
        { header: 'Trips', key: 'trips' },
        { header: 'Status', key: 'status' },
        { header: 'Bank Name', key: 'bankName' },
        { header: 'Deposit Ref', key: 'depositRef' },
        { header: 'Remittance Date', key: 'remittanceDate' },
      ],
      `settlement-${startDate}-${endDate}`
    );
  };

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            {t('page.settlement')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'ဘဏ္ဌာသို့ လွှဲပြောင်းမှု စီမံခြင်း' : 'Revenue remittance management'}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => confirmMutation.mutate(selectedIds)}
              className="btn-success flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {t('common.confirm')} ({selectedIds.length})
            </button>
          )}
          <ExportButton onClick={handleExport} />
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
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
            >
              <option value="">{t('common.allStatuses')}</option>
              <option value="PENDING">{t('status.pending')}</option>
              <option value="TRANSFERRED">{t('status.transferred')}</option>
              <option value="CONFIRMED">{t('status.confirmed')}</option>
              <option value="DISPUTED">{t('status.disputed')}</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={records} emptyMessage={t('common.noData')} />
    </div>
  );
}
