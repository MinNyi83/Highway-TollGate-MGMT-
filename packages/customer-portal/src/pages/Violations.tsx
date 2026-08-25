import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function Violations() {
  const { data: violations, isLoading } = useQuery({
    queryKey: ['customer-violations'],
    queryFn: async () => {
      const response = await api.get('/customer/violations');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Violations</h1>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fine</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {violations?.map((v: any) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(v.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">{v.vehicle?.plateNumber}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{v.violationType}</span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">${v.fineAmount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    v.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    v.status === 'ESCALATED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {violations?.map((v: any) => (
          <div key={v.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold">{v.vehicle?.plateNumber}</p>
                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{v.violationType}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${v.fineAmount}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  v.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  v.status === 'ESCALATED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {v.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{new Date(v.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {(!violations || violations.length === 0) && (
        <div className="text-center py-12 text-gray-500">No violations - all clear!</div>
      )}
    </div>
  );
}
