import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardCheck } from 'lucide-react';
import DataTable from '../components/DataTable';
import RegionFilter from '../components/RegionFilter';
import StatusBadge from '../components/StatusBadge';
import ExportButton from '../components/ExportButton';
import ApprovalModal from '../components/ApprovalModal';
import { formatMMK } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { exportToExcel } from '../utils/excel';

const currentYear = new Date().getFullYear();

export default function MonthlyReconciliation() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [fiscalYear, setFiscalYear] = useState(currentYear);
  const [month, setMonth] = useState('');
  const [regionId, setRegionId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reconciliation', fiscalYear, month, regionId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ fiscalYear: String(fiscalYear) });
      if (month) params.append('month', month);
      if (regionId) params.append('regionId', regionId);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/financial/reconciliation?${params.toString()}`);
      return res.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/financial/reconciliation/${id}/submit`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reconciliation'] }),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      await api.post(`/financial/reconciliation/${id}/approve`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
      setModalOpen(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      await api.post(`/financial/reconciliation/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
      setModalOpen(false);
    },
  });

  const records = data?.records ?? [];

  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'regionName', label: t('common.region') },
    { key: 'totalRevenue', label: t('common.revenue'), render: (v: number) => formatMMK(v) },
    { key: 'totalSettled', label: t('financial.totalSettled'), render: (v: number) => formatMMK(v) },
    { key: 'outstanding', label: t('financial.outstanding'), render: (v: number) => formatMMK(v) },
    { key: 'fineRevenue', label: t('common.fine'), render: (v: number) => formatMMK(v) },
    { key: 'status', label: t('common.status'), render: (v: string) => <StatusBadge status={v} /> },
    {
      key: 'actions',
      label: '',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'DRAFT' && user?.role === 'FINANCIAL_ADMIN' && (
            <button
              onClick={() => submitMutation.mutate(row.id)}
              className="btn-primary text-xs px-2 py-1"
            >
              {t('common.submit')}
            </button>
          )}
          {row.status === 'SUBMITTED' && user?.role === 'FINANCIAL_MANAGER' && (
            <button
              onClick={() => {
                setSelectedRecord(row);
                setModalOpen(true);
              }}
              className="btn-success text-xs px-2 py-1"
            >
              {t('common.approve')}
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleExport = () => {
    exportToExcel(
      records,
      [
        { header: 'Month', key: 'month' },
        { header: 'Region', key: 'regionName' },
        { header: 'Total Revenue (MMK)', key: 'totalRevenue' },
        { header: 'Total Settled (MMK)', key: 'totalSettled' },
        { header: 'Outstanding (MMK)', key: 'outstanding' },
        { header: 'Fine Revenue (MMK)', key: 'fineRevenue' },
        { header: 'Status', key: 'status' },
      ],
      `reconciliation-${fiscalYear}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-600" />
            {t('page.reconciliation')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'လစဉ်ဘဏ္ဍာရေးပေါင်းစည်းခြင်း စီမံခြင်း' : 'Monthly financial reconciliation management'}
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
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="select-field"
            >
              <option value="">{language === 'my' ? 'အားလုံး' : 'All Months'}</option>
              {(language === 'my' ? my.months : en.months).map((m: string, i: number) => (
                <option key={i} value={String(i + 1)}>{m}</option>
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
              {t('common.status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
            >
              <option value="">{t('common.allStatuses')}</option>
              <option value="DRAFT">{t('status.draft')}</option>
              <option value="SUBMITTED">{t('status.submitted')}</option>
              <option value="APPROVED">{t('status.approved')}</option>
              <option value="REJECTED">{t('status.rejected')}</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={records} emptyMessage={t('common.noData')} />

      {modalOpen && selectedRecord && (
        <ApprovalModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onApprove={(notes) => approveMutation.mutate({ id: selectedRecord.id, notes })}
          onReject={(reason) => rejectMutation.mutate({ id: selectedRecord.id, reason })}
          title={`${t('common.approve')} - ${selectedRecord.month} ${selectedRecord.regionName}`}
        />
      )}
    </div>
  );
}
