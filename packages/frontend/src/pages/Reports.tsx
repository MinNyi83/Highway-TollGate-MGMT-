import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import api from '../lib/api';
import { FileSpreadsheet, TrendingUp, Car, AlertTriangle, DollarSign } from 'lucide-react';

interface RevenueData { plazaName: string; totalRevenue: number; transactionCount: number; }
interface ViolationData { violationType: string; count: number; totalFines: number; }
interface SummaryData { totalVehicles: number; totalRevenue: number; activeViolations: number; totalEvents: number; }
interface DailyRevenue { date: string; revenue: number; transactions: number; }

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B'];

const VIOLATION_LABELS: Record<string, string> = {
  NO_RFID: 'No RFID',
  INSUFFICIENT_BALANCE: 'Insufficient Balance',
  RFID_ANPR_MISMATCH: 'RFID/ANPR Mismatch',
  UNREGISTERED_VEHICLE: 'Unregistered',
};

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: summary } = useQuery<SummaryData>({
    queryKey: ['reports', 'summary'],
    queryFn: async () => (await api.get('/reports/summary')).data,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueData[]>({
    queryKey: ['reports', 'revenue', startDate, endDate],
    queryFn: async () => (await api.get('/reports/revenue', { params: { startDate, endDate } })).data,
  });

  const { data: violationData, isLoading: violationLoading } = useQuery<ViolationData[]>({
    queryKey: ['reports', 'violations'],
    queryFn: async () => (await api.get('/reports/violations/stats')).data,
  });

  const { data: dailyRevenue } = useQuery<DailyRevenue[]>({
    queryKey: ['reports', 'daily-revenue', startDate, endDate],
    queryFn: async () => {
      const transactions = await api.get('/reports/transactions', { params: { startDate, endDate } });
      const daily: Record<string, { revenue: number; transactions: number }> = {};
      transactions.data.forEach((t: any) => {
        const day = new Date(t.createdAt).toISOString().split('T')[0];
        if (!daily[day]) daily[day] = { revenue: 0, transactions: 0 };
        daily[day].revenue += Number(t.amount);
        daily[day].transactions += 1;
      });
      return Object.entries(daily).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));
    },
  });

  const { data: events } = useQuery({
    queryKey: ['reports', 'events', startDate, endDate],
    queryFn: async () => (await api.get('/reports/events', { params: { startDate, endDate } })).data,
  });

  const exportExcel = async (type: string) => {
    const response = await api.get(`/reports/${type}/excel`, {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-report.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const isLoading = revenueLoading || violationLoading;

  const plazaRevenueByGateCode = revenueData?.map((r) => ({
    ...r,
    name: r.plazaName,
  })) || [];

  const violationChartData = violationData?.map((v) => ({
    name: VIOLATION_LABELS[v.violationType] || v.violationType,
    value: v.count,
    fines: v.totalFines,
  })) || [];

  const eventsByPlaza: Record<string, number> = {};
  events?.forEach((e: any) => {
    const name = e.plaza?.name || 'Unknown';
    eventsByPlaza[name] = (eventsByPlaza[name] || 0) + 1;
  });
  const eventsChartData = Object.entries(eventsByPlaza).map(([name, count]) => ({ name, count }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <button onClick={() => exportExcel('transactions')} className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-green-700">
            <FileSpreadsheet size={16} /> Transactions Excel
          </button>
          <button onClick={() => exportExcel('violations')} className="bg-orange-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-orange-700">
            <FileSpreadsheet size={16} /> Violations Excel
          </button>
          <button onClick={() => exportExcel('revenue')} className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-blue-700">
            <FileSpreadsheet size={16} /> Revenue Excel
          </button>
          <button onClick={() => exportExcel('events')} className="bg-purple-600 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm hover:bg-purple-700">
            <FileSpreadsheet size={16} /> Events Excel
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg"><Car size={20} className="text-blue-600" /></div>
            <div><p className="text-sm text-gray-500">Total Vehicles</p><p className="text-2xl font-bold">{summary.totalVehicles}</p></div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg"><DollarSign size={20} className="text-green-600" /></div>
            <div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-green-600">{Number(summary.totalRevenue).toLocaleString()} <span className="text-sm font-normal">MMK</span></p></div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg"><AlertTriangle size={20} className="text-orange-600" /></div>
            <div><p className="text-sm text-gray-500">Active Violations</p><p className="text-2xl font-bold text-orange-600">{summary.activeViolations}</p></div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg"><TrendingUp size={20} className="text-purple-600" /></div>
            <div><p className="text-sm text-gray-500">Total Events</p><p className="text-2xl font-bold text-purple-600">{summary.totalEvents}</p></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Revenue by Plaza</h3>
              {plazaRevenueByGateCode.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={plazaRevenueByGateCode}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MMK`, 'Revenue']} />
                    <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No revenue data</div>
              )}
              {plazaRevenueByGateCode.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500"><th>Plaza</th><th className="text-right">Transactions</th><th className="text-right">Revenue (MMK)</th></tr></thead>
                    <tbody>
                      {plazaRevenueByGateCode.map((r) => (
                        <tr key={r.plazaName} className="border-t"><td>{r.plazaName}</td><td className="text-right">{r.transactionCount}</td><td className="text-right font-medium">{Number(r.totalRevenue).toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
              {violationChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={violationChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                      {violationChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number, name: string) => [v, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No violation data</div>
              )}
              {violationChartData.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500"><th>Type</th><th className="text-right">Count</th><th className="text-right">Total Fines (MMK)</th></tr></thead>
                    <tbody>
                      {violationData?.map((v) => (
                        <tr key={v.violationType} className="border-t">
                          <td><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[violationData.indexOf(v) % COLORS.length] }}></span>{VIOLATION_LABELS[v.violationType] || v.violationType}</span></td>
                          <td className="text-right">{v.count}</td>
                          <td className="text-right font-medium">{Number(v.totalFines).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Daily Revenue Trend</h3>
              {dailyRevenue && dailyRevenue.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number, name: string) => [name === 'revenue' ? `${v.toLocaleString()} MMK` : v, name === 'revenue' ? 'Revenue' : 'Transactions']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                    <Line type="monotone" dataKey="transactions" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} name="Transactions" yAxisId={0} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No daily data</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Events by Plaza</h3>
              {eventsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={eventsChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" name="Events" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No event data</div>
              )}
              {eventsChartData.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500"><th>Plaza</th><th className="text-right">Events</th></tr></thead>
                    <tbody>
                      {eventsChartData.map((e) => (
                        <tr key={e.name} className="border-t"><td>{e.name}</td><td className="text-right font-medium">{e.count}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
