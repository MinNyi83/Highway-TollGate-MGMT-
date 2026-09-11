import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Lock, Globe, Moon, Sun, Eye, EyeOff, MessageSquare, Building2, User } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../stores/authStore';
import { showToast } from '../components/Toast';
import ErrorState from '../components/ErrorState';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { data: profile, isError, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/customer/profile');
      return res.data;
    },
  });

  const { data: smsHistory, isError: isSmsError } = useQuery({
    queryKey: ['sms-history'],
    queryFn: async () => {
      const res = await api.get('/customer/sms-history');
      return res.data;
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      await api.put('/auth/change-password', { currentPassword, newPassword });
    },
    onSuccess: () => {
      showToast('success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      showToast('error', error.response?.data?.error || 'Failed to change password');
    },
  });

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }
    changePasswordMutation.mutate();
  };

  const isEnterprise = profile?.customerType === 'ENTERPRISE';

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-slate-800 dark:text-white">Settings</h1>

      {/* Profile Info */}
      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 mb-4 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          {isEnterprise ? <Building2 size={18} /> : <User size={18} />}
          Profile
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Account Type</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              isEnterprise ? 'bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-400'
            }`}>
              {profile?.customerType || 'INDIVIDUAL'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Name</span>
            <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Email</span>
            <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.email}</span>
          </div>
          {profile?.phone && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Phone</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.phone}</span>
            </div>
          )}
          {isEnterprise && (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Company</span>
                <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Reg No</span>
                <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.companyRegNo}</span>
              </div>
            </>
          )}
          {!isEnterprise && profile?.nrcNumber && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">NRC</span>
              <span className="text-sm font-medium text-slate-800 dark:text-white">{profile?.nrcNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 mb-4 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <MessageSquare size={18} />
          SMS Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">SMS Enabled</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              profile?.smsEnabled ? 'bg-green-100 dark:bg-green-500/15 text-green-800 dark:text-green-400' : 'bg-slate-100 dark:bg-navy-700 text-slate-800 dark:text-slate-400'
            }`}>
              {profile?.smsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {profile?.smsProvider && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Provider</span>
              <span className="text-sm font-medium uppercase text-slate-800 dark:text-white">{profile.smsProvider}</span>
            </div>
          )}
        </div>

        {smsHistory && smsHistory.length > 0 && (
          <div className="mt-4 border-t border-slate-200/40 dark:border-navy-600/30 pt-4">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recent SMS</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {smsHistory.slice(0, 5).map((sms: any) => (
                <div key={sms.id} className="text-xs p-2 bg-slate-50 dark:bg-navy-700/40 rounded">
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-800 dark:text-slate-200">{sms.phone}</span>
                    <span className={sms.status === 'sent' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {sms.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 truncate">{sms.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 mb-4 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          Theme
        </h2>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-slate-200 dark:border-navy-600 hover:border-slate-300 dark:hover:border-navy-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={20} className="text-slate-300" /> : <Sun size={20} className="text-slate-600" />}
            <span className="font-medium text-slate-800 dark:text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </button>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 mb-4 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Globe size={18} />
          Language / ဘာသာစကား
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
              language === 'en'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-navy-600 hover:border-slate-300 dark:hover:border-navy-500 text-slate-700 dark:text-slate-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('my')}
            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
              language === 'my'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-navy-600 hover:border-slate-300 dark:hover:border-navy-500 text-slate-700 dark:text-slate-300'
            }`}
          >
            မြန်မာ
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 mb-4 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
          <Lock size={18} />
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-navy-700 text-slate-800 dark:text-white pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-navy-700 text-slate-800 dark:text-white pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-navy-700 text-slate-800 dark:text-white"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
          >
            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 md:p-6 border border-slate-200/60 dark:border-navy-700/40">
        <h2 className="font-bold mb-2 text-slate-800 dark:text-white">About</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">TollGate Customer Portal v1.0</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Highway Tollgate Management System</p>
      </div>
    </div>
  );
}
