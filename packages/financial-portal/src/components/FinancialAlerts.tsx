import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import api from '../api/client';
import { useState } from 'react';

const icons: Record<string, any> = {
  danger: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
};

const colors: Record<string, string> = {
  danger: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  warning: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
};

export default function FinancialAlerts() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const { data: alerts } = useQuery({
    queryKey: ['financial-alerts'],
    queryFn: async () => {
      const res = await api.get('/financial/alerts');
      return res.data;
    },
    refetchInterval: 300000,
  });

  const visible = (alerts || []).filter((_: any, i: number) => !dismissed.has(i));

  if (!visible.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Alerts</h3>
      {visible.map((alert: any, i: number) => {
        const realIndex = alerts.indexOf(alert);
        const Icon = icons[alert.level] || Info;
        return (
          <div key={realIndex} className={`flex items-start gap-3 p-4 rounded-xl border ${colors[alert.level]}`}>
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              {alert.metric !== undefined && (
                <p className="text-xs mt-1 opacity-75">
                  Current: {typeof alert.metric === 'number' ? alert.metric.toLocaleString() : alert.metric}
                  {alert.baseline !== undefined && ` | Baseline: ${alert.baseline.toLocaleString()}`}
                </p>
              )}
            </div>
            <button onClick={() => setDismissed(new Set([...dismissed, realIndex]))} className="p-1 hover:opacity-50">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
