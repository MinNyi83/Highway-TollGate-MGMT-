import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Plus } from 'lucide-react';
import api from '../lib/api';

export default function Account() {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpResult, setTopUpResult] = useState<{ balance: number; message: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ['customer-account'],
    queryFn: async () => {
      const response = await api.get('/customer/account');
      return response.data;
    },
  });

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await api.post('/customer/topup', { amount });
      return response.data;
    },
    onSuccess: (data) => {
      setTopUpResult(data);
      setTopUpAmount('');
      queryClient.invalidateQueries({ queryKey: ['customer-account'] });
      queryClient.invalidateQueries({ queryKey: ['customer-dashboard'] });
    },
  });

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      topUpMutation.mutate(amount);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Wallet className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold">${account?.balance || 0}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Account ID: {account?.id?.slice(0, 8)}...</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Top Up Balance</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              min="1"
              step="0.01"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTopUp}
              disabled={!topUpAmount || topUpMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={18} />
              {topUpMutation.isPending ? 'Processing...' : 'Top Up'}
            </button>
          </div>

          {topUpResult && (
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
              {topUpResult.message} | New balance: ${topUpResult.balance}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setTopUpAmount(amount.toString())}
                className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </div>

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
