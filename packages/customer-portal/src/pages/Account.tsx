import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Plus, CheckCircle, QrCode, Loader2, AlertCircle, History, CreditCard } from 'lucide-react';
import api from '../lib/api';

const walletOptions = [
  { id: 'kbzpay', name: 'KBZ Pay', icon: '🏦', color: 'from-red-500 to-rose-600' },
  { id: 'wavepay', name: 'Wave Pay', icon: '🌊', color: 'from-blue-500 to-cyan-600' },
  { id: 'mmqr', name: 'MMQR', icon: '📱', color: 'from-green-500 to-emerald-600' },
  { id: 'manual', name: 'Manual', icon: '💳', color: 'from-violet-500 to-purple-600' },
];

const quickAmounts = [1000, 5000, 10000, 20000, 50000];

export default function Account() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('manual');
  const [showQr, setShowQr] = useState(false);
  const [qrData, setQrData] = useState<{ qrCode: string; transactionId: string; orderId: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'polling' | 'completed' | 'failed'>('idle');
  const [topUpResult, setTopUpResult] = useState<{ balance: number; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');
  const queryClient = useQueryClient();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const startPaymentPolling = useCallback((transactionId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await api.get(`/payments/status/${transactionId}`);
        const status = response.data;

        if (status.status === 'completed') {
          setPaymentStatus('completed');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setTimeout(() => {
            setShowQr(false);
            setQrData(null);
            setPaymentStatus('idle');
            setTopUpAmount('');
            setTopUpResult({ balance: status.amount || 0, message: 'Payment confirmed! Balance updated.' });
            queryClient.invalidateQueries({ queryKey: ['customer-account'] });
            queryClient.invalidateQueries({ queryKey: ['customer-topup-history'] });
          }, 2000);
        } else if (status.status === 'failed') {
          setPaymentStatus('failed');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
      }
    }, 3000);

    setTimeout(() => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        setPaymentStatus('failed');
      }
    }, 300000);
  }, [queryClient, topUpAmount]);

  const topUpMutation = useMutation({
    mutationFn: async ({ amount, paymentMethod }: { amount: number; paymentMethod: string }) => {
      const response = await api.post('/payments/topup', { amount, paymentMethod });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.qrCode && data.transactionId) {
        setQrData({ qrCode: data.qrCode, transactionId: data.transactionId, orderId: data.orderId });
        setShowQr(true);
        setPaymentStatus('polling');
        startPaymentPolling(data.transactionId);
      } else {
        setTopUpResult(data);
        setTopUpAmount('');
        queryClient.invalidateQueries({ queryKey: ['customer-account'] });
        queryClient.invalidateQueries({ queryKey: ['customer-topup-history'] });
      }
    },
  });

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount <= 0) return;
    topUpMutation.mutate({ amount, paymentMethod: selectedWallet });
  };

  const closeQrModal = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setShowQr(false);
    setQrData(null);
    setPaymentStatus('idle');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account</h1>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-500/25">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -right-4 -bottom-10 w-24 h-24 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-emerald-100" />
            <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold">{account?.balance?.toLocaleString() || 0}</span>
            <span className="text-emerald-200 text-sm font-medium">MMK</span>
          </div>
          {account?.accountNumber && (
            <p className="text-emerald-200 text-xs mt-2 font-mono">Account: {account.accountNumber}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {([
          { key: 'topup', label: 'Top Up', icon: Plus },
          { key: 'history', label: 'History', icon: History },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* QR Modal */}
      {showQr && qrData && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeQrModal} />
          <div className="relative bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full max-w-sm p-6 md:m-4 animate-slide-in">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4 md:hidden" />
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                paymentStatus === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                paymentStatus === 'failed' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {paymentStatus === 'polling' ? (
                  <Loader2 size={28} className="text-blue-500 animate-spin" />
                ) : paymentStatus === 'completed' ? (
                  <CheckCircle size={28} className="text-emerald-500" />
                ) : paymentStatus === 'failed' ? (
                  <AlertCircle size={28} className="text-red-500" />
                ) : (
                  <QrCode size={28} className="text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {paymentStatus === 'completed' ? 'Payment Confirmed!' :
                 paymentStatus === 'failed' ? 'Payment Failed' :
                 paymentStatus === 'polling' ? 'Waiting for Payment' : 'Scan to Pay'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {parseFloat(topUpAmount).toLocaleString()} MMK via {walletOptions.find(w => w.id === selectedWallet)?.name}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4 flex items-center justify-center h-48">
              {paymentStatus === 'polling' ? (
                <div className="text-center">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-2" />
                  <p className="text-xs text-gray-400 dark:text-gray-500">Open your payment app and scan</p>
                </div>
              ) : paymentStatus === 'completed' ? (
                <CheckCircle size={64} className="text-emerald-500" />
              ) : paymentStatus === 'failed' ? (
                <AlertCircle size={64} className="text-red-500" />
              ) : (
                <QrCode size={64} className="text-gray-300 dark:text-gray-600" />
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={closeQrModal} className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                {paymentStatus === 'failed' ? 'Try Again' : 'Cancel'}
              </button>
              {paymentStatus === 'failed' && (
                <button
                  onClick={() => { setPaymentStatus('polling'); startPaymentPolling(qrData.transactionId); }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topup' && (
        <div className="space-y-5">
          {/* Payment Methods */}
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Payment Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                    selectedWallet === wallet.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${wallet.color} flex items-center justify-center text-white text-lg`}>
                    {wallet.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{wallet.name}</p>
                    {selectedWallet === wallet.id && (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Enter Amount</h2>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-lg">K</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl text-2xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 mb-5">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount.toString())}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    topUpAmount === amount.toString()
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                  }`}
                >
                  {amount >= 1000 ? `${amount / 1000}K` : amount}
                </button>
              ))}
            </div>

            {topUpResult && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                <CheckCircle size={16} />
                {topUpResult.message} New balance: K{topUpResult.balance?.toLocaleString()}
              </div>
            )}

            <button
              onClick={handleTopUp}
              disabled={!topUpAmount || topUpMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25"
            >
              {topUpMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </span>
              ) : (
                `Top Up ${parseFloat(topUpAmount || '0').toLocaleString()} MMK`
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {topUpHistory?.map((t: any) => (
            <div key={t.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Plus size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">+{Number(t.amount).toLocaleString()} MMK</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-[10px] rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                  {walletOptions.find(w => w.id === t.paymentMethod?.split('_')[0])?.name || 'Manual'}
                </span>
                {t.status && (
                  <span className={`px-2 py-1 text-[10px] rounded-full font-semibold ${
                    t.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                    t.status === 'PENDING' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {t.status}
                  </span>
                )}
              </div>
            </div>
          ))}
          {(!topUpHistory || topUpHistory.length === 0) && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                <History size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No top-up history yet</p>
            </div>
          )}
        </div>
      )}

      {/* Registered Vehicles */}
      {account?.rfidTags?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 pb-3">
            <h2 className="font-bold text-gray-900 dark:text-white">Registered Vehicles</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {account.rfidTags.map((tag: any) => (
              <div key={tag.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{tag.vehicle?.plateNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tag.vehicle?.year} {tag.vehicle?.make} {tag.vehicle?.model}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] rounded-full font-semibold ${
                  tag.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {tag.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
