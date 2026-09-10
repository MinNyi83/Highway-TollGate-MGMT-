import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Failed to load data', onRetry }: ErrorStateProps) {
  return (
    <div className="glass-card p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Error</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
