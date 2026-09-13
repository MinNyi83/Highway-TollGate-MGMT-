import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, UserPlus, CheckCircle, X } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const statusColors: Record<string, string> = {
  PLANNED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const trainingStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function Training() {
  const [showForm, setShowForm] = useState(false);
  const [enrollModal, setEnrollModal] = useState<string | null>(null);
  const [completeModal, setCompleteModal] = useState<{ trainingId: string; employeeId: string } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [score, setScore] = useState('');
  const [certificate, setCertificate] = useState('');
  const queryClient = useQueryClient();

  const { data: trainings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-training'],
    queryFn: async () => {
      const res = await api.get('/hr/training');
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
      const res = await api.post('/hr/training', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-training'] });
      setShowForm(false);
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async ({ employeeId, trainingId }: { employeeId: string; trainingId: string }) => {
      const res = await api.post('/hr/training/enroll', { employeeId, trainingId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-training'] });
      setEnrollModal(null);
      setSelectedEmployee('');
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (data: { employeeId: string; trainingId: string; score?: number; certificate?: string }) => {
      const res = await api.post('/hr/training/complete', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-training'] });
      setCompleteModal(null);
      setScore('');
      setCertificate('');
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Training</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Training
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Provider</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cost</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollments</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trainings?.map((training: any) => (
                <tr key={training.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{training.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{training.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{training.duration ? `${training.duration}h` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{training.provider || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{training.cost ? `K${Number(training.cost).toLocaleString()}` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{training._count?.enrollments || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[training.status] || ''}`}>
                      {training.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {training.startDate ? new Date(training.startDate).toLocaleDateString() : '-'}
                    {training.endDate ? ` → ${new Date(training.endDate).toLocaleDateString()}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEnrollModal(training.id)}
                        className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-500 font-semibold flex items-center gap-1"
                      >
                        <UserPlus size={12} /> Enroll
                      </button>
                      <button
                        onClick={() => {
                          if (selectedEmployee) {
                            setCompleteModal({ trainingId: training.id, employeeId: selectedEmployee });
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-500 font-semibold flex items-center gap-1"
                      >
                        <CheckCircle size={12} /> Complete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!trainings || trainings.length === 0) && (
          <div className="p-8 text-center text-gray-500 font-medium">No trainings found</div>
        )}
      </div>

      {showForm && (
        <TrainingForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}

      {enrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Enroll Employee</h2>
              <button onClick={() => { setEnrollModal(null); setSelectedEmployee(''); }} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Employee *</label>
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Employee</option>
                {employees?.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setEnrollModal(null); setSelectedEmployee(''); }} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
              <button
                onClick={() => selectedEmployee && enrollMutation.mutate({ employeeId: selectedEmployee, trainingId: enrollModal })}
                disabled={!selectedEmployee || enrollMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
              </button>
            </div>
          </div>
        </div>
      )}

      {completeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Mark Training Complete</h2>
              <button onClick={() => { setCompleteModal(null); setScore(''); setCertificate(''); }} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Employee *</label>
                <select value={completeModal.employeeId} onChange={(e) => setCompleteModal({ ...completeModal, employeeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Employee</option>
                  {employees?.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Score</label>
                <input type="number" value={score} onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional score" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Certificate</label>
                <input type="text" value={certificate} onChange={(e) => setCertificate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional certificate ID" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setCompleteModal(null); setScore(''); setCertificate(''); }} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
              <button
                onClick={() => completeModal.employeeId && completeMutation.mutate({
                  employeeId: completeModal.employeeId,
                  trainingId: completeModal.trainingId,
                  score: score ? parseFloat(score) : undefined,
                  certificate: certificate || undefined,
                })}
                disabled={!completeModal.employeeId || completeMutation.isPending}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {completeMutation.isPending ? 'Saving...' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrainingForm({ onClose, onSubmit, isPending }: { onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [provider, setProvider] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('PLANNED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title, code, description, duration: duration ? parseInt(duration) : undefined,
      provider, cost: cost ? parseFloat(cost) : undefined,
      startDate: startDate || undefined, endDate: endDate || undefined, status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-lg p-6 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Training</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Safety Training" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Code *</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="e.g. SAF-001" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (hours)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cost</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Provider</label>
            <input type="text" value={provider} onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. External Vendor" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {trainingStatuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Creating...' : 'Create Training'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
