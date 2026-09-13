import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, X } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  _count?: { assignments: number };
}

export default function Shifts() {
  const [showForm, setShowForm] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const queryClient = useQueryClient();

  const { data: shifts, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-shifts'],
    queryFn: async () => {
      const res = await api.get('/hr/shifts');
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/hr/shifts', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-shifts'] });
      setShowForm(false);
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/hr/shifts/assign', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-shifts'] });
      setShowAssign(false);
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shifts</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAssign(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Users size={16} /> Assign Shift
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add Shift
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Start Time</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">End Time</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Break (min)</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {shifts?.map((shift: Shift) => (
                <tr key={shift.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{shift.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{shift.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{shift.startTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{shift.endTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{shift.breakMinutes || 0}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-sm text-gray-300">
                      <Users size={14} className="text-gray-500" /> {shift._count?.assignments || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!shifts || shifts.length === 0) && (
          <div className="p-8 text-center text-gray-500 font-medium">No shifts configured</div>
        )}
      </div>

      {showForm && (
        <ShiftForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}

      {showAssign && (
        <AssignShiftForm
          shifts={shifts || []}
          employees={employees || []}
          onClose={() => setShowAssign(false)}
          onSubmit={(data) => assignMutation.mutate(data)}
          isPending={assignMutation.isPending}
        />
      )}
    </div>
  );
}

function ShiftForm({ onClose, onSubmit, isPending }: { onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMinutes, setBreakMinutes] = useState('60');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, code, startTime, endTime, breakMinutes: parseInt(breakMinutes) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Shift</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Morning Shift" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code *</label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g. MOR" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time *</label>
              <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time *</label>
              <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Break (minutes)</label>
            <input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Creating...' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignShiftForm({ shifts, employees, onClose, onSubmit, isPending }: { shifts: Shift[]; employees: any[]; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [employeeId, setEmployeeId] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employeeId, shiftId, date });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Assign Shift</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Employee *</label>
            <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Employee</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Shift *</label>
            <select required value={shiftId} onChange={(e) => setShiftId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Shift</option>
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.startTime} - {s.endTime})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Assigning...' : 'Assign Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
