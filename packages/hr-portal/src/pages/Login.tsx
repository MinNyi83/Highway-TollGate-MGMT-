import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(token, user);
      // Sync to HR system
      try {
        await api.post('/hr/auth/sync', {}, { headers: { Authorization: `Bearer ${token}` } });
      } catch {}
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500 rounded-full opacity-10 blur-3xl" />

      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.02] select-none">
        <div className="absolute -rotate-30 top-1/3 left-1/4 text-6xl font-bold text-white whitespace-nowrap">NYIMIN © 2026</div>
        <div className="absolute -rotate-30 top-2/3 left-1/4 text-6xl font-bold text-white whitespace-nowrap">NYIMIN © 2026</div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] text-white/20 select-none pointer-events-none">© 2026 nyimin. All rights reserved.</div>

      <div className="relative z-10 glass-card rounded-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-800 dark:text-white">TollGate</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">HR Management System</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field w-full" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In to HR Portal
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">HR Staff Access Only</p>
      </div>
    </div>
  );
}
