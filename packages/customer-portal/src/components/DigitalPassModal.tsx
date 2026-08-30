import { useState } from 'react';
import { QrCode, XCircle, ShieldCheck, RefreshCw, Car } from 'lucide-react';

interface DigitalPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  balance: number;
}

export default function DigitalPassModal({ isOpen, onClose, user, balance }: DigitalPassModalProps) {
  const [tokenTime, setTokenTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const refreshPass = () => {
    setTokenTime(Date.now());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const virtualRfidUid = `VRFID-${user?.id?.slice(0, 8).toUpperCase() || '7890ABCD'}-${tokenTime.toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 border border-blue-500/30 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Digital Toll Pass</h3>
              <p className="text-[10px] text-blue-100">Virtual RFID Windshield Fallback</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <XCircle size={20} />
          </button>
        </div>

        {/* Pass Content */}
        <div className="p-6 flex flex-col items-center space-y-4 text-center">
          {/* Driver details badge */}
          <div className="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">ACCOUNT HOLDER</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{user?.name || 'Authorized Driver'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">PREPAID BALANCE</p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">K{balance?.toLocaleString() || '0'}</p>
            </div>
          </div>

          {/* High-Contrast Dynamic QR */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-md">
            <svg viewBox="0 0 140 140" className="w-44 h-44 mx-auto">
              <rect width="140" height="140" fill="white" />
              <path d="M10,10 h40 v40 h-40 z M20,20 v20 h20 v-20 z" fill="black" />
              <path d="M90,10 h40 v40 h-40 z M100,20 v20 h20 v-20 z" fill="black" />
              <path d="M10,90 h40 v40 h-40 z M20,100 v20 h20 v-20 z" fill="black" />
              <rect x="25" y="25" width="10" height="10" fill="black" />
              <rect x="105" y="25" width="10" height="10" fill="black" />
              <rect x="25" y="105" width="10" height="10" fill="black" />
              {/* Dynamic QR data dots */}
              <rect x="60" y="15" width="8" height="12" fill="black" />
              <rect x="75" y="20" width="8" height="8" fill="black" />
              <rect x="60" y="35" width="16" height="8" fill="black" />
              <rect x="15" y="60" width="12" height="12" fill="black" />
              <rect x="35" y="65" width="8" height="18" fill="black" />
              <rect x="55" y="55" width="30" height="30" fill="#2563eb" />
              <circle cx="70" cy="70" r="8" fill="white" />
              <rect x="95" y="60" width="10" height="20" fill="black" />
              <rect x="115" y="65" width="15" height="10" fill="black" />
              <rect x="60" y="95" width="20" height="10" fill="black" />
              <rect x="90" y="90" width="15" height="15" fill="black" />
              <rect x="110" y="110" width="20" height="20" fill="black" />
              <rect x="65" y="115" width="15" height="15" fill="black" />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {virtualRfidUid}
            </span>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Hold phone screen to optical scanner at Lane Barrier
            </p>
          </div>

          <div className="w-full flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck size={14} /> Auto-rotates for security
            </span>
            <button
              onClick={refreshPass}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              <RefreshCw size={12} className={copied ? 'animate-spin' : ''} />
              {copied ? 'Refreshed' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
