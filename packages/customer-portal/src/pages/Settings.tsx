import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Lock, Globe, Moon, Sun, Eye, EyeOff, MessageSquare, Building2, User } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../stores/authStore';
import { showToast } from '../components/Toast';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/customer/profile');
      return res.data;
    },
  });

  const { data: smsHistory } = useQuery({
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Settings</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          {isEnterprise ? <Building2 size={18} /> : <User size={18} />}
          Profile
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Account Type</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              isEnterprise ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {profile?.customerType || 'INDIVIDUAL'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Name</span>
            <span className="text-sm font-medium">{profile?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium">{profile?.email}</span>
          </div>
          {profile?.phone && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm font-medium">{profile?.phone}</span>
            </div>
          )}
          {isEnterprise && (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Company</span>
                <span className="text-sm font-medium">{profile?.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Reg No</span>
                <span className="text-sm font-medium">{profile?.companyRegNo}</span>
              </div>
            </>
          )}
          {!isEnterprise && profile?.nrcNumber && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">NRC</span>
              <span className="text-sm font-medium">{profile?.nrcNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={18} />
          SMS Notifications
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">SMS Enabled</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              profile?.smsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {profile?.smsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {profile?.smsProvider && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Provider</span>
              <span className="text-sm font-medium uppercase">{profile.smsProvider}</span>
            </div>
          )}
        </div>

        {smsHistory && smsHistory.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent SMS</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {smsHistory.slice(0, 5).map((sms: any) => (
                <div key={sms.id} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <span className="font-mono">{sms.phone}</span>
                    <span className={sms.status === 'sent' ? 'text-green-600' : 'text-red-600'}>
                      {sms.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1 truncate">{sms.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          Theme
        </h2>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </button>
      </div>

      {/* Language */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Globe size={18} />
          Language / ဘာသာစကား
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
              language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('my')}
            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
              language === 'my' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            မြန်မာ
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Lock size={18} />
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-gray-400">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-gray-400">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="font-bold mb-2">About</h2>
        <p className="text-sm text-gray-500">TollGate Customer Portal v1.0</p>
        <p className="text-xs text-gray-400 mt-1">Highway Tollgate Management System</p>
      </div>
    </div>
  );
}
