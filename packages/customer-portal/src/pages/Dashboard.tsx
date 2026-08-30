import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, Car, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, ChevronRight, Clock, TrendingUp, QrCode, AlertCircle, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { StatSkeleton, CardSkeleton } from '../components/Skeleton';
import DigitalPassModal from '../components/DigitalPassModal';
import RoutePlannerModal from '../components/RoutePlannerModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showPassModal, setShowPassModal] = useState(false);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: async () => {
      const response = await api.get('/customer/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No data</div>;

  const stats = [
    { label: 'Balance', value: `${data.balance}`, icon: Wallet, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', prefix: 'K' },
    { label: 'Vehicles', value: data.vehicleCount, icon: Car, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    { label: 'Trips', value: data.eventCount, icon: Activity, gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400' },
    { label: 'Violations', value: data.violationCount, icon: AlertTriangle, gradient: 'from-rose-500 to-red-600', bg: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
  ];

  const recentEvents = data.recentEvents || [];
  const totalSpent = recentEvents.reduce((sum: number, e: any) => sum + (e.transaction?.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Here's your toll summary</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          {data.user?.name?.charAt(0) || 'U'}
        </div>
      </div>

      {/* Balance Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-lg shadow-blue-500/25">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">Available Balance</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold">{data.balance}</span>
            <span className="text-blue-200 text-sm font-medium">MMK</span>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight size={12} />
              </div>
              <span className="text-xs text-blue-100">{data.eventCount} trips</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp size={12} />
              </div>
              <span className="text-xs text-blue-100">K{totalSpent} spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Balance Warning Banner */}
      {Number(data.balance) < 3000 && (
        <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-500">Low Toll Balance Warning</p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">Balance below K3,000. Top up to avoid barrier delays.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/account')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            Top Up Now
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.text} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.prefix || ''}{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions (5-Column Grid) */}
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => setShowPassModal(true)}
          className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-blue-500/30 dark:border-blue-500/40 flex flex-col items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/20 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <QrCode size={16} />
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Pass</span>
        </button>
        <button
          onClick={() => setShowRoutePlanner(true)}
          className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-indigo-500/30 dark:border-indigo-500/40 flex flex-col items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Map size={16} />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Plan</span>
        </button>
        <button
          onClick={() => navigate('/account')}
          className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
            <Wallet size={16} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Top Up</span>
        </button>
        <button
          onClick={() => navigate('/my-vehicles')}
          className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
            <Car size={16} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Vehicles</span>
        </button>
        <button
          onClick={() => navigate('/toll-history')}
          className="bg-white dark:bg-gray-800 rounded-xl p-2.5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white">
            <Clock size={16} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">History</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Recent Trips</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{recentEvents.length} transactions</p>
          </div>
          <button
            onClick={() => navigate('/toll-history')}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-0.5 hover:text-blue-700"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {recentEvents.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <Activity size={24} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No trips yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {recentEvents.slice(0, 5).map((event: any, idx: number) => (
              <div
                key={event.id}
                onClick={() => navigate(`/toll-history?event=${event.id}`)}
                className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-750 active:bg-gray-100 dark:active:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  event.status === 'COMPLETED'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : event.status === 'ENTRY'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {event.status === 'COMPLETED' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{event.vehicle?.plateNumber}</p>
                    {event.laneNumber && (
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-medium">{event.laneNumber}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {event.plaza?.name || event.plaza?.gateCode || 'Toll Plaza'}
                    {event.direction && ` · ${event.direction}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Toll Pass (Virtual RFID QR) Modal */}
      <DigitalPassModal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        user={data.user}
        balance={Number(data.balance) || 0}
      />

      {/* Expressway Trip & Toll Calculator Modal */}
      <RoutePlannerModal
        isOpen={showRoutePlanner}
        onClose={() => setShowRoutePlanner(false)}
      />
    </div>
  );
}
