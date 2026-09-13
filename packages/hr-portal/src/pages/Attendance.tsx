import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react';
import api from '../api/client';

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-attendance', date],
    queryFn: async () => { const r = await api.get(`/hr/attendance?date=${date}`); return r.data; },
  });

  const clockInMut = useMutation({
    mutationFn: async (employeeId: string) => { await api.post('/hr/attendance', { employeeId, date, clockIn: new Date().toISOString() }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-attendance'] }),
  });

  const clockOutMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/attendance/${id}/clock-out`, { clockOut: new Date().toISOString() }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-attendance'] }),
  });

  const records = Array.isArray(data?.records) ? data.records : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const statusColor = (s: string) => {
    switch (s) {
      case 'PRESENT': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LATE': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ABSENT': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track employee attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/50">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Clock In</th>
                  <th className="px-4 py-3 font-medium">Clock Out</th>
                  <th className="px-4 py-3 font-medium">Hours</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec: any) => (
                  <tr key={rec.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-4 py-3 font-medium">{rec.employee?.firstName} {rec.employee?.lastName}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString() : '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString() : '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.hoursWorked ? `${rec.hoursWorked}h` : '-'}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColor(rec.status)}`}>{rec.status}</span></td>
                    <td className="px-4 py-3">
                      {!rec.clockOut && rec.clockIn && (
                        <button onClick={() => clockOutMut.mutate(rec.id)} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                          <LogOut size={12} /> Clock Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No attendance records for this date</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
