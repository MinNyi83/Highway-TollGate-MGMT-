import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Lock, Globe, Moon, Sun, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { useLanguage } from '../hooks/useLanguage';
import { showToast } from '../components/Toast';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Settings</h1>

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

      {/* App Info */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="font-bold mb-2">About</h2>
        <p className="text-sm text-gray-500">TollGate Customer Portal v1.0</p>
        <p className="text-xs text-gray-400 mt-1">Highway Tollgate Management System</p>
      </div>
    </div>
  );
}
