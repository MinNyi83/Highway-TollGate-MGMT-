import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

let toastId = 0;

export function showToast(type: Toast['type'], message: string) {
  const event = new CustomEvent('toast', { detail: { id: `toast-${++toastId}`, type, message } });
  window.dispatchEvent(event);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const toast = (e as CustomEvent).detail as Toast;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    warning: <AlertTriangle size={18} className="text-yellow-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/50',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700/50',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/50',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-3 rounded-lg border shadow-lg ${bgColors[toast.type]} animate-slide-in`}
        >
          {icons[toast.type]}
          <p className="text-sm flex-1 text-slate-800 dark:text-slate-200">{toast.message}</p>
          <button onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
