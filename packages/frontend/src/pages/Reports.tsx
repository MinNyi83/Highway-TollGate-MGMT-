import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';

interface RevenueData {
  plazaName: string;
  totalRevenue: number;
  transactionCount: number;
}

interface ViolationData {
  violationType: string;
  count: number;
  totalFines: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Reports() {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueData[]>({
    queryKey: ['reports', 'revenue', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/reports/revenue', {
        params: { startDate, endDate },
      });
      return response.data;
    },
  });

  const { data: violationData, isLoading: violationLoading } = useQuery<ViolationData[]>({
    queryKey: ['reports', 'violations'],
    queryFn: async () => {
      const response = await api.get('/reports/violations/stats');
      return response.data;
    },
  });

  const isLoading = revenueLoading || violationLoading;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Revenue by Plaza</h3>
            {revenueData && revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="plazaName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No revenue data
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Violations by Type</h3>
            {violationData && violationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={violationData}
                    dataKey="count"
                    nameKey="violationType"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {violationData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No violation data
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
