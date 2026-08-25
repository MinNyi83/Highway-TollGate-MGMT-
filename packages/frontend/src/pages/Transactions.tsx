import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
  event: {
    vehicle: { plateNumber: string };
    plaza: { name: string };
  };
  account: {
    id: string;
    user: { name: string };
  };
}

export default function Transactions() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions?.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{new Date(transaction.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{transaction.event?.vehicle?.plateNumber}</td>
                <td className="px-4 py-3">{transaction.event?.plaza?.name}</td>
                <td className="px-4 py-3 font-medium">${transaction.amount}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No transactions found</div>
        )}
      </div>
    </div>
  );
}
