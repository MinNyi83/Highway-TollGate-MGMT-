import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, ChevronDown, ChevronUp, AlertTriangle, Clock, MapPin, Hash, ArrowUp, ArrowDown, CheckCircle, XCircle, Ban, FileText, Shield } from 'lucide-react';

interface Violation {
  id: string;
  violationType: string;
  status: string;
  fineAmount: number;
  dueDate: string;
  createdAt: string;
  vehicle: { plateNumber: string; make: string; model: string; color?: string; vehicleClass: string; vehiclePhoto?: string };
  event: {
    plaza?: { name: string; gateCode?: string; mileMarker?: number };
    rfidTag?: { tagUid: string };
    photos?: Array<{ photoType: string; photoUrl: string }>;
    laneNumber?: string;
    direction?: string;
    entryTime: string;
    exitTime?: string;
    anprPlate?: string;
  };
}

const VIOLATION_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; label: string; desc: string }> = {
  NO_RFID: { icon: Ban, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'No RFID', desc: 'Vehicle passed without RFID tag' },
  INSUFFICIENT_BALANCE: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Insufficient Balance', desc: 'Account had insufficient balance' },
  RFID_ANPR_MISMATCH: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'RFID/ANPR Mismatch', desc: 'RFID tag and ANPR plate do not match' },
  UNREGISTERED_VEHICLE: { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Unregistered Vehicle', desc: 'Vehicle not registered in system' },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  PROCESSING: { color: 'text-blue-700', bg: 'bg-blue-100', icon: FileText },
  PAID: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  ESCALATED: { color: 'text-red-700', bg: 'bg-red-100', icon: AlertTriangle },
  DISMISSED: { color: 'text-gray-700', bg: 'bg-gray-100', icon: Ban },
  RESOLVED: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
};

export default function Violations() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['violations'] }),
  });

  const getPhotoUrl = (filename?: string) => {
    if (!filename) return null;
    return `${api.defaults.baseURL}/uploads/${filename}`;
  };

  const parsePhotos = (photoStr?: string): string[] => {
    if (!photoStr) return [];
    try { return JSON.parse(photoStr); } catch { return [photoStr]; }
  };

  const filtered = violations?.filter((v) => {
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchType = typeFilter === 'ALL' || v.violationType === typeFilter;
    const matchSearch = search === '' ||
      v.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle?.make?.toLowerCase().includes(search.toLowerCase()) ||
      v.event?.plaza?.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  }) || [];

  const stats = {
    total: violations?.length || 0,
    pending: violations?.filter((v) => v.status === 'PENDING').length || 0,
    escalated: violations?.filter((v) => v.status === 'ESCALATED').length || 0,
    paid: violations?.filter((v) => v.status === 'PAID' || v.status === 'RESOLVED').length || 0,
    totalFines: violations?.reduce((sum, v) => sum + Number(v.fineAmount), 0) || 0,
    unpaidFines: violations?.filter((v) => v.status !== 'PAID' && v.status !== 'RESOLVED' && v.status !== 'DISMISSED').reduce((sum, v) => sum + Number(v.fineAmount), 0) || 0,
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Violations</h1>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Escalated</p>
          <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Fines</p>
          <p className="text-2xl font-bold text-orange-600">{stats.totalFines.toLocaleString()} <span className="text-sm font-normal">MMK</span></p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Unpaid</p>
          <p className="text-2xl font-bold text-red-600">{stats.unpaidFines.toLocaleString()} <span className="text-sm font-normal">MMK</span></p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search plate, plaza, violation ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Types</option>
          {Object.entries(VIOLATION_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Status</option>
          {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isExpanded = expandedId === v.id;
          const vc = VIOLATION_CONFIG[v.violationType] || VIOLATION_CONFIG.NO_RFID;
          const sc = STATUS_CONFIG[v.status] || STATUS_CONFIG.PENDING;
          const StatusIcon = sc.icon;
          const ViolationIcon = vc.icon;
          const vehiclePhotos = v.vehicle?.vehiclePhoto ? parsePhotos(v.vehicle.vehiclePhoto) : [];
          const overdue = isOverdue(v.dueDate);
          const event = v.event;
          const isMatch = event?.anprPlate && v.vehicle?.plateNumber && event.anprPlate.toUpperCase() === v.vehicle.plateNumber.toUpperCase();

          return (
            <div key={v.id} className={`bg-white rounded-lg shadow border-l-4 ${vc.border} overflow-hidden`}>
              <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${vc.bg}`}>
                    <ViolationIcon size={20} className={vc.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{v.vehicle?.plateNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${vc.bg} ${vc.color}`}>{vc.label}</span>
                      {overdue && v.status !== 'PAID' && v.status !== 'RESOLVED' && v.status !== 'DISMISSED' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Overdue</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{v.vehicle?.make} {v.vehicle?.model}</span>
                      {event?.plaza && <span className="flex items-center gap-1"><MapPin size={12} /> {event.plaza.gateCode || event.plaza.name}</span>}
                      {event?.laneNumber && <span className="flex items-center gap-1"><Hash size={12} /> Lane {event.laneNumber}</span>}
                      {event?.direction && (
                        <span className={`flex items-center gap-1 ${event.direction === 'UP' ? 'text-blue-500' : 'text-orange-500'}`}>
                          {event.direction === 'UP' ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {event.direction}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-600">{Number(v.fineAmount).toLocaleString()} MMK</p>
                      <p className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        Due: {new Date(v.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <StatusIcon size={14} className={sc.color} />
                      <span className={`text-xs px-2 py-1 rounded-full ${sc.bg} ${sc.color}`}>{v.status}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Violation</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{v.id}</span></p>
                        <p><span className="text-gray-500">Type:</span> <span className={`px-2 py-0.5 text-xs rounded-full ${vc.bg} ${vc.color}`}>{vc.label}</span></p>
                        <p><span className="text-gray-500">Description:</span> {vc.desc}</p>
                        <p><span className="text-gray-500">Fine:</span> <span className="font-bold text-red-600">{Number(v.fineAmount).toLocaleString()} MMK</span></p>
                        <p><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 text-xs rounded-full ${sc.bg} ${sc.color}`}>{v.status}</span></p>
                        <p><span className="text-gray-500">Due Date:</span> <span className={overdue ? 'text-red-500 font-medium' : ''}>{new Date(v.dueDate).toLocaleDateString()}</span></p>
                        <p><span className="text-gray-500">Created:</span> {new Date(v.createdAt).toLocaleString()}</p>
                      </div>
                      {(v.status === 'PENDING' || v.status === 'PROCESSING') && (
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          {v.status === 'PENDING' && (
                            <>
                              <button onClick={() => updateStatus.mutate({ id: v.id, status: 'PROCESSING' })}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Process</button>
                              <button onClick={() => updateStatus.mutate({ id: v.id, status: 'ESCALATED' })}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Escalate</button>
                              <button onClick={() => updateStatus.mutate({ id: v.id, status: 'DISMISSED' })}
                                className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500">Dismiss</button>
                            </>
                          )}
                          {v.status === 'PROCESSING' && (
                            <>
                              <button onClick={() => updateStatus.mutate({ id: v.id, status: 'PAID' })}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Mark Paid</button>
                              <button onClick={() => updateStatus.mutate({ id: v.id, status: 'ESCALATED' })}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Escalate</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Vehicle</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">Plate:</span> <span className="font-mono font-medium">{v.vehicle?.plateNumber}</span></p>
                        <p><span className="text-gray-500">Make:</span> {v.vehicle?.make}</p>
                        <p><span className="text-gray-500">Model:</span> {v.vehicle?.model}</p>
                        <p><span className="text-gray-500">Color:</span> {v.vehicle?.color || 'N/A'}</p>
                        <p><span className="text-gray-500">Class:</span> {v.vehicle?.vehicleClass}</p>
                        {vehiclePhotos.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {vehiclePhotos.map((p, i) => (
                              <img key={i} src={getPhotoUrl(p)!} alt="" className="w-16 h-12 rounded object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Toll Event</h4>
                      <div className="text-sm space-y-1">
                        {event?.plaza && (
                          <>
                            <p><span className="text-gray-500">Plaza:</span> {event.plaza.name}</p>
                            <p><span className="text-gray-500">Gate Code:</span> <span className="font-mono">{event.plaza.gateCode || 'N/A'}</span></p>
                            <p><span className="text-gray-500">Mile:</span> {event.plaza.mileMarker ?? 'N/A'}</p>
                          </>
                        )}
                        <p><span className="text-gray-500">Lane:</span> <span className="font-mono">{event?.laneNumber || 'N/A'}</span></p>
                        <p><span className="text-gray-500">Direction:</span> {event?.direction || 'N/A'}</p>
                        <p><span className="text-gray-500">Entry:</span> {event?.entryTime ? new Date(event.entryTime).toLocaleString() : 'N/A'}</p>
                        {event?.exitTime && <p><span className="text-gray-500">Exit:</span> {new Date(event.exitTime).toLocaleString()}</p>}
                        {event?.anprPlate && (
                          <p><span className="text-gray-500">ANPR:</span> <span className={`font-mono ${isMatch ? 'text-green-600' : 'text-red-600'}`}>{event.anprPlate} {isMatch ? '✓' : '✗'}</span></p>
                        )}
                        {event?.rfidTag && (
                          <p><span className="text-gray-500">RFID:</span> <span className="font-mono text-xs">{event.rfidTag.tagUid}</span></p>
                        )}
                      </div>

                      {event?.photos && event.photos.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">ANPR Snapshots</p>
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
          <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No violations found</p>
        </div>
      )}
    </div>
  );
}
