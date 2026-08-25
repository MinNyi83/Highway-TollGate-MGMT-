import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Shield } from 'lucide-react';

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditLog() {
  const { data: logs, isLoading } = useQuery<AuditEntry[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const response = await api.get('/audit-logs');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold">Audit Log</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Timestamp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Entity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs?.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-mono">{log.userId?.slice(0, 8)}...</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{log.action}</span>
                </td>
                <td className="px-4 py-3 text-sm">{log.entity}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{log.ipAddress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!logs || logs.length === 0) && (
          <div className="p-8 text-center text-gray-500">No audit entries</div>
        )}
      </div>
    </div>
  );
}
