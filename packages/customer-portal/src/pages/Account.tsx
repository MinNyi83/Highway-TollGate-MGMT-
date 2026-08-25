import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Plus, Smartphone, Clock, CheckCircle, QrCode } from 'lucide-react';
import api from '../lib/api';

const walletOptions = [
  { id: 'kbzpay', name: 'KBZ Pay', color: 'bg-blue-600', icon: '🏦' },
  { id: 'wavepay', name: 'Wave Pay', color: 'bg-cyan-500', icon: '🌊' },
  { id: 'mmqr', name: 'MMQR', color: 'bg-red-600', icon: '📱' },
  { id: 'manual', name: 'Manual Top-Up', color: 'bg-gray-600', icon: '💳' },
];

const quickAmounts = [5, 10, 20, 50, 100];

export default function Account() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('manual');
  const [showQr, setShowQr] = useState(false);
  const [topUpResult, setTopUpResult] = useState<{ balance: number; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ['customer-account'],
    queryFn: async () => {
      const response = await api.get('/customer/account');
      return response.data;
    },
  });

  const { data: topUpHistory } = useQuery({
    queryKey: ['customer-topup-history'],
    queryFn: async () => {
      const response = await api.get('/customer/topup-history');
      return response.data;
    },
  });

  const topUpMutation = useMutation({
    mutationFn: async ({ amount, paymentMethod }: { amount: number; paymentMethod: string }) => {
      const response = await api.post('/customer/topup', { amount, paymentMethod });
      return response.data;
    },
    onSuccess: (data) => {
      setTopUpResult(data);
      setTopUpAmount('');
      queryClient.invalidateQueries({ queryKey: ['customer-account'] });
      queryClient.invalidateQueries({ queryKey: ['customer-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customer-topup-history'] });
    },
  });

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount <= 0) return;

    if (selectedWallet === 'manual') {
      topUpMutation.mutate({ amount, paymentMethod: 'manual' });
    } else {
      setShowQr(true);
    }
  };

  const handleQrConfirm = () => {
    const amount = parseFloat(topUpAmount);
    topUpMutation.mutate({ amount, paymentMethod: selectedWallet });
    setShowQr(false);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account & Top-Up</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-1">${account?.balance || 0}</p>
            <p className="text-blue-200 text-sm mt-1">Account: {account?.id?.slice(0, 8)}...</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Wallet size={32} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {(['topup', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 font-medium capitalize ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'topup' ? 'Top Up' : 'Top-Up History'}
          </button>
        ))}
      </div>

      {activeTab === 'topup' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Smartphone size={18} />
              Payment Method
            </h2>
            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedWallet === wallet.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <div className="text-left">
                    <p className="font-medium">{wallet.name}</p>
                    {wallet.id !== 'manual' && (
                      <p className="text-xs text-gray-500">Scan QR to pay</p>
                    )}
                  </div>
                  {selectedWallet === wallet.id && (
                    <CheckCircle className="ml-auto text-blue-500" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & QR */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <QrCode size={18} />
              Enter Amount
            </h2>

            {!showQr ? (
              <>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                <div className="flex gap-2 mb-4">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className={`flex-1 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        topUpAmount === amount.toString()
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                {topUpResult && (
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-4">
                    {topUpResult.message} | New balance: ${topUpResult.balance}
                  </div>
                )}

                <button
                  onClick={handleTopUp}
                  disabled={!topUpAmount || topUpMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
                >
                  {topUpMutation.isPending ? 'Processing...' : `Top Up $${topUpAmount || '0'}`}
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-gray-100 p-8 rounded-lg mb-4">
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode size={64} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="font-bold text-lg">${topUpAmount}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {walletOptions.find((w) => w.id === selectedWallet)?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR with your {walletOptions.find((w) => w.id === selectedWallet)?.name} app to complete payment
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQr(false)}
                    className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleQrConfirm}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    I've Paid
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Method</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topUpHistory?.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600">+${t.amount}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {walletOptions.find((w) => w.id === t.paymentMethod)?.name || t.paymentMethod || 'Manual'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!topUpHistory || topUpHistory.length === 0) && (
            <div className="p-8 text-center text-gray-500">No top-up history yet</div>
          )}
        </div>
      )}

      {/* Registered Vehicles */}
      {account?.rfidTags?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="font-bold mb-4">Registered Vehicles</h2>
          <div className="space-y-3">
            {account.rfidTags.map((tag: any) => (
              <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{tag.vehicle?.plateNumber}</p>
                  <p className="text-sm text-gray-500">{tag.vehicle?.year} {tag.vehicle?.make} {tag.vehicle?.model}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${tag.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tag.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{tag.tagUid}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
