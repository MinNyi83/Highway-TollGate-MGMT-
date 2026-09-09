import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, User, Clock, FileText } from 'lucide-react';
import api from '../api/client';
import { useLanguage } from '../i18n';

export default function AuditLog() {
  const { language } = useLanguage();
  const t = (key: string) => key;

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await api.get('/financial/audit-logs');
      return res.data;
    },
  });

  const getActionColor = (action: string) => {
    if (action.includes('APPROVE')) return 'text-green-600 bg-green-50';
    if (action.includes('REJECT')) return 'text-red-600 bg-red-50';
    if (action.includes('SUBMIT')) return 'text-blue-600 bg-blue-50';
    if (action.includes('CONFIRM')) return 'text-purple-600 bg-purple-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Trail</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Financial action history and compliance log</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading audit logs...</div>
        ) : !logs?.length ? (
          <div className="p-8 text-center text-slate-500">No audit logs recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Action</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Entity</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Performed By</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Details</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">IP Address</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <span className="font-medium">{log.entityType}</span>
                      {log.entityId && <span className="text-slate-400 ml-1">#{log.entityId.slice(0, 8)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <User className="w-3 h-3" />
                        {log.performedBy || 'system'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{log.ipAddress || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
