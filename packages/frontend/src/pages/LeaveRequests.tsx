import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle, XCircle, X } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const leaveTypes = ['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY', 'PATERNITY', 'UNPAID', 'OTHER'];

export default function LeaveRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ id: string; employeeName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-leave', statusFilter, leaveType],
    queryFn: async () => {
      const res = await api.get('/hr/leave', {
        params: { status: statusFilter, leaveType },
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

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/hr/leave/${id}/approve`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-leave'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const res = await api.post(`/hr/leave/${id}/reject`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave'] });
      setRejectModal(null);
      setRejectReason('');
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/hr/leave', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leave'] });
      setShowForm(false);
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  const records = data?.items || [];

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Leave Requests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Leave Request
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {leaveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">End Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Days</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.map((leave: any) => (
                <tr key={leave.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {leave.employee?.firstName} {leave.employee?.lastName}
                    <span className="block text-xs text-gray-400 font-mono">{leave.employee?.employeeNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{leave.leaveType}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{leave.days}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[leave.status] || ''}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {leave.status === 'PENDING' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approveMutation.mutate(leave.id)}
                          disabled={approveMutation.isPending}
                          className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-500 font-semibold disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: leave.id, employeeName: `${leave.employee?.firstName} ${leave.employee?.lastName}` })}
                          className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-500 font-semibold flex items-center gap-1"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">No leave requests found</div>
        )}
      </div>

      {showForm && (
        <LeaveRequestForm
          employees={employees || []}
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 text-red-500 rounded-full"><XCircle size={20} /></div>
              <div>
                <h3 className="font-bold text-lg">Reject Leave Request</h3>
                <p className="text-sm text-gray-400">{rejectModal.employeeName}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Reason (optional)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter reason..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
              <button
                onClick={() => rejectModal && rejectMutation.mutate({ id: rejectModal.id, reason: rejectReason })}
                disabled={rejectMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaveRequestForm({ employees, onClose, onSubmit, isPending }: { employees: any[]; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employeeId, leaveType, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">New Leave Request</h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Leave Type *</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {leaveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date *</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date *</label>
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
