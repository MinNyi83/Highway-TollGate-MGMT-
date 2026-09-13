import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../lib/api';
import { TableSkeleton, ChartSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const ratingColors: Record<string, string> = {
  EXCELLENT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  GOOD: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AVERAGE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  BELOW_AVERAGE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  POOR: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];
const ratings = ['EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR'];

export default function Performance() {
  const [employeeId, setEmployeeId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-performance', employeeId],
    queryFn: async () => {
      const res = await api.get('/hr/performance', {
        params: { employeeId },
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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/hr/performance', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-performance'] });
      setShowForm(false);
    },
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6 space-y-6"><ChartSkeleton /><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  const ratingDistribution = ratings.map((r) => ({
    name: r.replace('_', ' '),
    value: reviews?.filter((rev: any) => rev.rating === r).length || 0,
  })).filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Performance Reviews</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="glass-card p-4">
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
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
        {ratingDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {ratingDistribution.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(11, 15, 23, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500">No review data</div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reviewer</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews?.map((review: any) => (
                <tr key={review.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {review.employee?.firstName} {review.employee?.lastName}
                    <span className="block text-xs text-gray-400 font-mono">{review.employee?.employeeNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{review.period}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${ratingColors[review.rating] || ''}`}>
                      {review.rating?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{review.reviewerName || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!reviews || reviews.length === 0) && (
          <div className="p-8 text-center text-gray-500 font-medium">No performance reviews found</div>
        )}
      </div>

      {showForm && (
        <ReviewForm
          employees={employees || []}
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}

function ReviewForm({ employees, onClose, onSubmit, isPending }: { employees: any[]; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [employeeId, setEmployeeId] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [rating, setRating] = useState('GOOD');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ employeeId, reviewerId, period, rating, comments });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Performance Review</h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Reviewer *</label>
            <select required value={reviewerId} onChange={(e) => setReviewerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Reviewer</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Period *</label>
            <input type="month" required value={period} onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rating *</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {ratings.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Comments</label>
            <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional comments..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
