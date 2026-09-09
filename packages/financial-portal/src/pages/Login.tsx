import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import api from '../api/client';
import { useLanguage } from '../i18n';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-command relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-4 left-4 text-[10px] text-white/20 select-none pointer-events-none">© 2026 nyimin</div>
      <div className="absolute top-4 right-4 text-[10px] text-white/20 select-none pointer-events-none">Licensed Software - Unauthorized Use Prohibited</div>

      <div className="relative z-10 glass-card rounded-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">TollGate</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ဘဏ္ဍာရေးစနစ် | Financial System</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('email') || 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t('password') || 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('login') || 'Login'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          Financial Staff Access Only
        </p>
      </div>
    </div>
  );
}
