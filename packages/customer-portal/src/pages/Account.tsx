import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Plus, Smartphone, CheckCircle, QrCode, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

const walletOptions = [
  { id: 'kbzpay', name: 'KBZ Pay', icon: '🏦' },
  { id: 'wavepay', name: 'Wave Pay', icon: '🌊' },
  { id: 'mmqr', name: 'MMQR', icon: '📱' },
  { id: 'manual', name: 'Manual', icon: '💳' },
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
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

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
        setQrData({
          qrCode: data.qrCode,
          transactionId: data.transactionId,
          orderId: data.orderId,
        });
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

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Account</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs md:text-sm">Available Balance</p>
            <p className="text-3xl md:text-4xl font-bold mt-1">{account?.balance?.toLocaleString() || 0} MMK</p>
          </div>
          <div className="bg-white/20 p-3 md:p-4 rounded-full">
            <Wallet size={28} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 md:mb-6 border-b">
        {(['topup', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-2 md:px-4 font-medium text-sm md:text-base ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
            }`}
          >
            {tab === 'topup' ? 'Top Up' : 'History'}
          </button>
        ))}
      </div>

      {activeTab === 'topup' && (
        <>
          {/* QR Modal */}
          {showQr && qrData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
                <div className="bg-gray-100 p-6 rounded-lg mb-4">
                  <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed rounded-lg flex items-center justify-center">
                    {paymentStatus === 'polling' ? (
                      <div className="text-center">
                        <Loader2 size={48} className="mx-auto text-blue-500 mb-2 animate-spin" />
                        <p className="font-bold text-lg">{parseFloat(topUpAmount).toLocaleString()} MMK</p>
                        <p className="text-xs text-gray-400">{walletOptions.find((w) => w.id === selectedWallet)?.name}</p>
                        <p className="text-xs text-blue-500 mt-2">Waiting for payment...</p>
                      </div>
                    ) : paymentStatus === 'completed' ? (
                      <div className="text-center">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                        <p className="font-bold text-lg text-green-600">Payment Confirmed!</p>
                      </div>
                    ) : paymentStatus === 'failed' ? (
                      <div className="text-center">
                        <AlertCircle size={48} className="mx-auto text-red-500 mb-2" />
                        <p className="font-bold text-lg text-red-600">Payment Failed</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <QrCode size={48} className="mx-auto text-gray-400 mb-2" />
                        <p className="font-bold text-lg">{parseFloat(topUpAmount).toLocaleString()} MMK</p>
                        <p className="text-xs text-gray-400">{walletOptions.find((w) => w.id === selectedWallet)?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {paymentStatus === 'polling'
                    ? 'Scan QR code with your payment app'
                    : paymentStatus === 'completed'
                    ? 'Payment successful!'
                    : paymentStatus === 'failed'
                    ? 'Payment timed out or failed'
                    : `Scan with ${walletOptions.find((w) => w.id === selectedWallet)?.name} app`}
                </p>
                <div className="flex gap-2">
                  <button onClick={closeQrModal} className="flex-1 py-2 border rounded-lg">
                    {paymentStatus === 'failed' ? 'Try Again' : 'Cancel'}
                  </button>
                  {paymentStatus === 'failed' && (
                    <button
                      onClick={() => {
                        setPaymentStatus('polling');
                        startPaymentPolling(qrData.transactionId);
                      }}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods - Horizontal scroll on mobile */}
          <div className="mb-4 md:mb-6">
            <h2 className="font-bold mb-3 flex items-center gap-2 text-sm">
              <Smartphone size={16} />
              Payment Method
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWallet(wallet.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 min-w-[120px] md:min-w-0 transition-all ${
                    selectedWallet === wallet.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <span className="text-xl">{wallet.icon}</span>
                  <span className="font-medium text-sm whitespace-nowrap">{wallet.name}</span>
                  {selectedWallet === wallet.id && <CheckCircle className="ml-auto text-blue-500" size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="font-bold mb-3 text-sm">Enter Amount</h2>
            <input
              type="number"
              min="1"
              step="0.01"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Amount"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            <div className="grid grid-cols-5 gap-2 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopUpAmount(amount.toString())}
                  className={`py-2 border rounded-lg text-sm font-medium transition-colors ${
                    topUpAmount === amount.toString()
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {amount.toLocaleString()}
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
              {topUpMutation.isPending ? 'Processing...' : `Top Up ${parseFloat(topUpAmount || '0').toLocaleString()} MMK`}
            </button>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          {topUpHistory?.map((t: any) => (
            <div key={t.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-green-600">+{Number(t.amount).toLocaleString()} MMK</p>
                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {walletOptions.find((w) => w.id === t.paymentMethod?.split('_')[0])?.name || 'Manual'}
                </span>
                {t.status && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    t.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {t.status}
                  </span>
                )}
              </div>
            </div>
          ))}
          {(!topUpHistory || topUpHistory.length === 0) && (
            <div className="text-center py-12 text-gray-500">No top-up history yet</div>
          )}
        </div>
      )}

      {/* Vehicles */}
      {account?.rfidTags?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mt-4 md:mt-6">
          <h2 className="font-bold mb-3">Registered Vehicles</h2>
          <div className="space-y-2">
            {account.rfidTags.map((tag: any) => (
              <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{tag.vehicle?.plateNumber}</p>
                  <p className="text-xs text-gray-500">{tag.vehicle?.year} {tag.vehicle?.make}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${tag.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
