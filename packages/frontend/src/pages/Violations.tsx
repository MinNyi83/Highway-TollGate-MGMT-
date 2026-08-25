import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

interface Violation {
  id: string;
  violationType: string;
  status: string;
  fineAmount: number;
  dueDate: string;
  createdAt: string;
  vehicle: { plateNumber: string; make: string; model: string };
  event: { plaza: { name: string }; entryTime: string };
}

export default function Violations() {
  const queryClient = useQueryClient();
  
  const { data: violations, isLoading } = useQuery<Violation[]>({
    queryKey: ['violations'],
    queryFn: async () => {
      const response = await api.get('/violations');
      return response.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/violations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations'] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Violations</h1>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fine</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {violations?.map((violation) => (
              <tr key={violation.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{violation.vehicle?.plateNumber}</div>
                    <div className="text-sm text-gray-500">{violation.vehicle?.make} {violation.vehicle?.model}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                    {violation.violationType}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">${violation.fineAmount}</td>
                <td className="px-4 py-3">{new Date(violation.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    violation.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    violation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    violation.status === 'ESCALATED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {violation.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {violation.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus.mutate({ id: violation.id, status: 'PROCESSING' })}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Process
                      </button>
                      <button
                        onClick={() => updateStatus.mutate({ id: violation.id, status: 'ESCALATED' })}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Escalate
                      </button>
                    </div>
                  )}
                  {violation.status === 'PROCESSING' && (
                    <button
                      onClick={() => updateStatus.mutate({ id: violation.id, status: 'PAID' })}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {violations?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No violations found</div>
        )}
      </div>
    </div>
  );
}
