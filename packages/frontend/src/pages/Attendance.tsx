import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const statusColors: Record<string, string> = {
  PRESENT: 'bg-emerald-500/20 text-emerald-400',
  ABSENT: 'bg-red-500/20 text-red-400',
  LATE: 'bg-amber-500/20 text-amber-400',
  HALF_DAY: 'bg-orange-500/20 text-orange-400',
  ON_LEAVE: 'bg-purple-500/20 text-purple-400',
};

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [clockInId, setClockInId] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-attendance', employeeId, startDate, endDate, status],
    queryFn: async () => {
      const res = await api.get('/hr/attendance', {
        params: { employeeId, startDate, endDate, status },
      });
      return res.data;
    },
  });

  const { data: employees } = useQuery({
    queryKey: ['hr-employees-list'],
    queryFn: async () => {
      const res = await api.get('/hr/employees', { params: { limit: 200 } });
      return res.data?.items || [];
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async (empId: string) => {
      const res = await api.post('/hr/attendance/clock-in', { employeeId: empId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-attendance'] });
      setClockInId('');
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (empId: string) => {
      const res = await api.post('/hr/attendance/clock-out', { employeeId: empId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-attendance'] });
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  const records = data?.items || [];

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employees</option>
            {employees?.map((emp: any) => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="End Date"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Quick Clock:</span>
            <select
              value={clockInId}
              onChange={(e) => setClockInId(e.target.value)}
              className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Employee</option>
              {employees?.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
            <button
              onClick={() => clockInId && clockInMutation.mutate(clockInId)}
              disabled={!clockInId || clockInMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              <LogIn size={14} /> Clock In
            </button>
            <button
              onClick={() => clockInId && clockOutMutation.mutate(clockInId)}
              disabled={!clockInId || clockOutMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              <LogOut size={14} /> Clock Out
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Clock In</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Clock Out</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hours</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overtime</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.map((record: any) => (
                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {record.employee?.firstName} {record.employee?.lastName}
                    <span className="block text-xs text-gray-400 font-mono">{record.employee?.employeeNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{record.hoursWorked || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{record.overtime || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[record.status] || ''}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">No attendance records found</div>
        )}
      </div>
    </div>
  );
}
