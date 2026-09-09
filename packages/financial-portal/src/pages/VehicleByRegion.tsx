import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Car } from 'lucide-react';
import DataTable from '../components/DataTable';
import RegionFilter from '../components/RegionFilter';
import ExportButton from '../components/ExportButton';
import { useLanguage } from '../i18n';
import en from '../i18n/en';
import my from '../i18n/my';
import api from '../api/client';
import { exportToExcel } from '../utils/excel';

export default function VehicleByRegion() {
  const { language } = useLanguage();
  const t = (key: string) => (language === 'my' ? (my as any) : (en as any))[key] ?? key;

  const [regionId, setRegionId] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-by-region', regionId],
    queryFn: async () => {
      const params = regionId ? `?regionId=${regionId}` : '';
      const res = await api.get(`/financial/vehicles/by-region${params}`);
      return res.data;
    },
  });

  const regions = data?.regions ?? [];

  const columns = [
    { key: 'regionName', label: t('common.region') },
    { key: 'totalVehicles', label: t('financial.vehicleCount') },
    { key: 'motorcycles', label: 'Motorcycles' },
    { key: 'sedans', label: 'Sedans' },
    { key: 'suvs', label: 'SUVs' },
    { key: 'trucks', label: 'Trucks' },
    { key: 'buses', label: 'Buses' },
  ];

  const chartData = regions.map((r: any) => ({
    name: r.regionName,
    Motorcycles: r.motorcycles,
    Sedans: r.sedans,
    SUVs: r.suvs,
    Trucks: r.trucks,
    Buses: r.buses,
  }));

  const handleExport = () => {
    exportToExcel(
      regions,
      [
        { header: 'Region', key: 'regionName' },
        { header: 'Total Vehicles', key: 'totalVehicles' },
        { header: 'Motorcycles', key: 'motorcycles' },
        { header: 'Sedans', key: 'sedans' },
        { header: 'SUVs', key: 'suvs' },
        { header: 'Trucks', key: 'trucks' },
        { header: 'Buses', key: 'buses' },
      ],
      `vehicle-registration-by-region`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-purple-600" />
            {t('page.vehicleByRegion')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'my' ? 'ဒေသအလိုက် ယာဉ်မှတ်ပုံတင် အချက်အလက်' : 'Vehicle registration data by region'}
          </p>
        </div>
        <ExportButton onClick={handleExport} />
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              {t('common.region')}
            </label>
            <RegionFilter value={regionId} onChange={setRegionId} />
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={regions} emptyMessage={t('common.noData')} />

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          {t('financial.vehicleCount')} — {language === 'my' ? 'ယာဉ်အမျိုးအစား ခွဲခြမ်းစိတ်ဖြာချက်' : 'Vehicle Class Distribution'}
        </h2>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Motorcycles" fill="#f59e0b" stackId="a" />
            <Bar dataKey="Sedans" fill="#3b82f6" stackId="a" />
            <Bar dataKey="SUVs" fill="#10b981" stackId="a" />
            <Bar dataKey="Trucks" fill="#ef4444" stackId="a" />
            <Bar dataKey="Buses" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
