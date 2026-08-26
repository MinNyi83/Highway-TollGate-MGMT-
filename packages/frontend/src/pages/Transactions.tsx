import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, ChevronDown, ChevronUp, ArrowDown, ArrowUp, CreditCard, Clock, MapPin, Hash, AlertTriangle, CheckCircle, XCircle, Receipt } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  paymentMethod?: string;
  description?: string;
  createdAt: string;
  event?: {
    vehicle?: { plateNumber: string; make: string; model: string; color?: string; vehicleClass: string; vehiclePhoto?: string };
    plaza?: { name: string; gateCode?: string; mileMarker?: number };
    rfidTag?: { tagUid: string };
    violation?: { violationType: string; fineAmount: number; status: string };
    photos?: Array<{ photoType: string; photoUrl: string }>;
    laneNumber?: string;
    direction?: string;
    entryTime: string;
    exitTime?: string;
    anprPlate?: string;
  };
  account?: {
    id: string;
    balance: number;
    user?: { name: string; email: string };
  };
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  DEBIT: { icon: ArrowDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Debit' },
  CREDIT: { icon: ArrowUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Credit' },
  TOPUP: { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Top-up' },
  REFUND: { icon: ArrowUp, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Refund' },
  FINE: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Fine' },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  COMPLETED: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  PENDING: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  FAILED: { color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  CANCELLED: { color: 'text-gray-700', bg: 'bg-gray-100', icon: XCircle },
};

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions');
      return response.data;
    },
  });

  const getPhotoUrl = (filename?: string) => {
    if (!filename) return null;
    return `${api.defaults.baseURL}/uploads/${filename}`;
  };

  const parsePhotos = (photoStr?: string): string[] => {
    if (!photoStr) return [];
    try { return JSON.parse(photoStr); } catch { return [photoStr]; }
  };

  const filtered = transactions?.filter((t) => {
    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchSearch = search === '' ||
      t.event?.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      t.event?.plaza?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.account?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  }) || [];

  const stats = {
    total: transactions?.length || 0,
    completed: transactions?.filter((t) => t.status === 'COMPLETED').length || 0,
    pending: transactions?.filter((t) => t.status === 'PENDING').length || 0,
    totalRevenue: transactions?.filter((t) => t.type === 'DEBIT' && t.status === 'COMPLETED').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    totalTopups: transactions?.filter((t) => t.type === 'CREDIT' && t.status === 'COMPLETED').reduce((sum, t) => sum + Number(t.amount), 0) || 0,
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Toll Revenue</p>
          <p className="text-2xl font-bold text-purple-600">{stats.totalRevenue.toLocaleString()} <span className="text-sm font-normal">MMK</span></p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Top-ups</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalTopups.toLocaleString()} <span className="text-sm font-normal">MMK</span></p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search plate, plaza, account, txn ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Types</option>
          {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((txn) => {
          const isExpanded = expandedId === txn.id;
          const tc = TYPE_CONFIG[txn.type] || TYPE_CONFIG.DEBIT;
          const sc = STATUS_CONFIG[txn.status] || STATUS_CONFIG.COMPLETED;
          const StatusIcon = sc.icon;
          const TypeIcon = tc.icon;
          const vehiclePhotos = txn.event?.vehicle?.vehiclePhoto ? parsePhotos(txn.event.vehicle.vehiclePhoto) : [];
          const event = txn.event;
          const isMatch = event?.anprPlate && event?.vehicle?.plateNumber && event.anprPlate.toUpperCase() === event.vehicle.plateNumber.toUpperCase();

          return (
            <div key={txn.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(isExpanded ? null : txn.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tc.bg}`}>
                    <TypeIcon size={20} className={tc.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{txn.id.slice(0, 8)}...</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${tc.bg} ${tc.color}`}>{tc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      {event?.vehicle && (
                        <span className="font-medium">{event.vehicle.plateNumber}</span>
                      )}
                      {event?.plaza && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <MapPin size={12} /> {event.plaza.gateCode || event.plaza.name}
                        </span>
                      )}
                      {event?.laneNumber && (
                        <span className="flex items-center gap-1 text-gray-400"><Hash size={12} /> Lane {event.laneNumber}</span>
                      )}
                      {txn.account?.user && (
                        <span className="text-gray-400">Account: {txn.account.user.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${txn.type === 'CREDIT' || txn.type === 'REFUND' ? 'text-green-600' : txn.type === 'FINE' ? 'text-orange-600' : 'text-red-600'}`}>
                        {txn.type === 'CREDIT' || txn.type === 'REFUND' ? '+' : '-'}{Number(txn.amount).toLocaleString()} MMK
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <StatusIcon size={12} className={sc.color} />
                        <span className={`text-xs ${sc.color}`}>{txn.status}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p className="flex items-center gap-1 justify-end"><Clock size={12} /> {new Date(txn.createdAt).toLocaleDateString()}</p>
                      <p>{new Date(txn.createdAt).toLocaleTimeString()}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Transaction</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{txn.id}</span></p>
                        <p><span className="text-gray-500">Type:</span> <span className={`px-2 py-0.5 text-xs rounded-full ${tc.bg} ${tc.color}`}>{tc.label}</span></p>
                        <p><span className="text-gray-500">Amount:</span> <span className="font-bold">{Number(txn.amount).toLocaleString()} MMK</span></p>
                        <p><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 text-xs rounded-full ${sc.bg} ${sc.color}`}>{txn.status}</span></p>
                        {txn.paymentMethod && <p><span className="text-gray-500">Method:</span> {txn.paymentMethod}</p>}
                        {txn.description && <p><span className="text-gray-500">Note:</span> {txn.description}</p>}
                        <p><span className="text-gray-500">Created:</span> {new Date(txn.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Account</h4>
                      <div className="text-sm space-y-1">
                        {txn.account?.user && (
                          <>
                            <p><span className="text-gray-500">Name:</span> {txn.account.user.name}</p>
                            <p><span className="text-gray-500">Email:</span> {txn.account.user.email}</p>
                          </>
                        )}
                        {txn.account && (
                          <p><span className="text-gray-500">Balance:</span> <span className="font-bold">{Number(txn.account.balance).toLocaleString()} MMK</span></p>
                        )}
                        {event && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium text-xs text-gray-700 mb-1">Toll Event</p>
                            <p><span className="text-gray-500">Vehicle:</span> {event.vehicle?.plateNumber}</p>
                            <p><span className="text-gray-500">Plaza:</span> {event.plaza?.name} ({event.plaza?.gateCode})</p>
                            <p><span className="text-gray-500">Lane:</span> {event.laneNumber} | {event.direction}</p>
                            <p><span className="text-gray-500">Entry:</span> {new Date(event.entryTime).toLocaleString()}</p>
                            {event.exitTime && <p><span className="text-gray-500">Exit:</span> {new Date(event.exitTime).toLocaleString()}</p>}
                            {event.rfidTag && <p><span className="text-gray-500">RFID:</span> <span className="font-mono text-xs">{event.rfidTag.tagUid}</span></p>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {event?.vehicle && (
                        <>
                          <h4 className="font-medium text-sm text-gray-700">Vehicle</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="text-gray-500">Plate:</span> <span className="font-mono font-medium">{event.vehicle.plateNumber}</span></p>
                            <p><span className="text-gray-500">Make/Model:</span> {event.vehicle.make} {event.vehicle.model}</p>
                            <p><span className="text-gray-500">Color:</span> {event.vehicle.color || 'N/A'}</p>
                            <p><span className="text-gray-500">Class:</span> {event.vehicle.vehicleClass}</p>
                            {event.anprPlate && (
                              <p><span className="text-gray-500">ANPR:</span> <span className={`font-mono ${isMatch ? 'text-green-600' : 'text-red-600'}`}>{event.anprPlate} {isMatch ? '✓' : '✗'}</span></p>
                            )}
                            {vehiclePhotos.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {vehiclePhotos.map((p, i) => (
                                  <img key={i} src={getPhotoUrl(p)!} alt="" className="w-16 h-12 rounded object-cover" />
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {event?.violation && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                          <p className="flex items-center gap-1 text-red-700 font-medium text-xs"><AlertTriangle size={12} /> Violation</p>
                          <p className="text-red-600 text-xs">{event.violation.violationType} - {event.violation.fineAmount} MMK</p>
                          <p className="text-red-500 text-xs">Status: {event.violation.status}</p>
                        </div>
                      )}

                      {event?.photos && event.photos.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-medium text-xs text-gray-700 mb-1">ANPR Snapshots</h4>
                          <div className="flex gap-1">
                            {event.photos.map((p, i) => (
                              <div key={i} className="relative">
                                <img src={getPhotoUrl(p.photoUrl)!} alt="" className="w-16 h-12 rounded object-cover" />
                                <span className="absolute bottom-0 left-0 bg-black/60 text-white text-[8px] px-1 rounded-tr">{p.photoType}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <Receipt size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No transactions found</p>
        </div>
      )}
    </div>
  );
}
