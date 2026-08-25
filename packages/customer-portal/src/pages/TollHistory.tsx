import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function TollHistory() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['customer-toll-events'],
    queryFn: async () => {
      const response = await api.get('/customer/toll-events');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Toll History</h1>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Violation</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events?.map((event: any) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(event.entryTime).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{event.vehicle?.plateNumber}</td>
                <td className="px-4 py-3 text-sm">{event.plaza?.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">${event.transaction?.amount || 0}</td>
                <td className="px-4 py-3">
                  {event.violation ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      {event.violation.violationType}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!events || events.length === 0) && (
          <div className="p-8 text-center text-gray-500">No toll events yet</div>
        )}
      </div>
    </div>
  );
}
