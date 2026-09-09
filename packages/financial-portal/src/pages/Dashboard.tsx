import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import { DollarSign, Wallet, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import { formatMMK, formatDate } from '../utils/format';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import FinancialAlerts from '../components/FinancialAlerts';
import api from '../api/client';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function Dashboard() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const { data: kpi, isLoading: kpiLoading } = useQuery({
    queryKey: ['dashboard-kpi'],
    queryFn: async () => {
      const res = await api.get('/financial/dashboard/kpi');
      return res.data;
    },
  });

  const { data: revenueByRegion } = useQuery({
    queryKey: ['dashboard-revenue-region'],
    queryFn: async () => {
      const res = await api.get('/financial/dashboard/revenue-by-region');
      return res.data;
    },
  });

  const { data: depositsByRegion } = useQuery({
    queryKey: ['dashboard-deposits-region'],
    queryFn: async () => {
      const res = await api.get('/financial/dashboard/deposits-by-region');
      return res.data;
    },
  });

  const { data: monthlyTrend } = useQuery({
    queryKey: ['dashboard-monthly-trend'],
    queryFn: async () => {
      const res = await api.get('/financial/dashboard/monthly-trend');
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t('page.dashboard')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('financial.collectionSummary')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={t('financial.totalRevenue')}
          value={kpiLoading ? '...' : formatMMK(kpi?.totalRevenue ?? 0)}
          icon={DollarSign}
          color="green"
          subtitle={t('financial.actualRevenue')}
        />
        <KPICard
          title={t('financial.walletDeposits')}
          value={kpiLoading ? '...' : formatMMK(kpi?.walletDeposits ?? 0)}
          icon={Wallet}
          color="blue"
          subtitle="Customer Liabilities"
        />
        <KPICard
          title={t('financial.totalTrips')}
          value={kpiLoading ? '...' : (kpi?.totalTrips ?? 0).toLocaleString()}
          icon={Activity}
          color="purple"
          subtitle={t('financial.transactionVolume')}
        />
        <KPICard
          title={t('financial.outstanding')}
          value={kpiLoading ? '...' : formatMMK(kpi?.outstanding ?? 0)}
          icon={AlertTriangle}
          color="red"
          subtitle={t('financial.settlementStatus')}
        />
      </div>

      <FinancialAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {t('financial.regionSummary')}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueByRegion ?? []} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="regionName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatMMK(value)} />
              <Legend />
              <Bar dataKey="revenue" name={t('common.revenue')} fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {t('financial.walletDepositsByRegion')}
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={depositsByRegion ?? []}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="deposits"
                nameKey="regionName"
                label={({ regionName, percent }) => `${regionName} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {(depositsByRegion ?? []).map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatMMK(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {t('financial.revenueVsDeposits')}
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={monthlyTrend ?? []} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatMMK(value)} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name={t('common.revenue')} stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="deposits" name={t('financial.walletDeposits')} stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
