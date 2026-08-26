import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import api from '../lib/api';
import { Search, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Camera, AlertTriangle, Clock, MapPin, Hash } from 'lucide-react';

interface TollEvent {
  id: string;
  vehicle: { plateNumber: string; make: string; model: string; color?: string; vehicleClass: string; vehiclePhoto?: string };
  plaza: { name: string; gateCode?: string; mileMarker?: number };
  rfidTag?: { tagUid: string };
  transaction?: { amount: number; status: string; paymentMethod?: string };
  violation?: { violationType: string; fineAmount: number; status: string };
  photos?: Array<{ photoType: string; photoUrl: string }>;
  laneNumber?: string;
  direction?: string;
  amount?: number;
  entryTime: string;
  exitTime: string | null;
  anprPlate: string | null;
  status: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  ENTRY: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  VIOLATION: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function TollEvents() {
  const [events, setEvents] = useState<TollEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: initialEvents, isLoading } = useQuery<TollEvent[]>({
    queryKey: ['toll-events'],
    queryFn: async () => {
      const response = await api.get('/toll-events');
      return response.data;
    },
  });

  useEffect(() => { if (initialEvents) setEvents(initialEvents); }, [initialEvents]);

  useEffect(() => {
    const socket = io(window.location.origin, { path: '/socket.io' });
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('toll-event', (event: TollEvent) => setEvents((prev) => [event, ...prev.slice(0, 99)]));
    return () => { socket.disconnect(); };
  }, []);

  const getPhotoUrl = (filename?: string) => {
    if (!filename) return null;
    return `${api.defaults.baseURL}/uploads/${filename}`;
  };

  const parsePhotos = (photoStr?: string): string[] => {
    if (!photoStr) return [];
    try { return JSON.parse(photoStr); } catch { return [photoStr]; }
  };

  const filtered = events.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchSearch = search === '' ||
      e.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      e.plaza?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.anprPlate?.toLowerCase().includes(search.toLowerCase()) ||
      e.laneNumber?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: events.length,
    completed: events.filter((e) => e.status === 'COMPLETED').length,
    entry: events.filter((e) => e.status === 'ENTRY').length,
    revenue: events.reduce((sum, e) => sum + (Number(e.transaction?.amount || e.amount || 0)), 0),
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toll Events</h1>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-500">{connected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.entry}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-purple-600">{stats.revenue.toLocaleString()} MMK</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search plate, plaza, lane, ANPR..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2">
          {['ALL', 'COMPLETED', 'ENTRY'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {s === 'ALL' ? 'All' : s === 'COMPLETED' ? 'Completed' : 'In Progress'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((event) => {
          const isExpanded = expandedId === event.id;
          const sc = STATUS_CONFIG[event.status] || STATUS_CONFIG.COMPLETED;
          const vehiclePhotos = parsePhotos(event.vehicle?.vehiclePhoto);
          const tollAmount = Number(event.transaction?.amount || event.amount || 0);
          const isMatch = event.anprPlate && event.vehicle?.plateNumber && event.anprPlate.toUpperCase() === event.vehicle.plateNumber.toUpperCase();

          return (
            <div key={event.id} className={`bg-white rounded-lg shadow border-l-4 ${sc.border} overflow-hidden`}>
              <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedId(isExpanded ? null : event.id)}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {vehiclePhotos[0] ? (
                      <img src={getPhotoUrl(vehiclePhotos[0])!} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-bold">
                        {event.vehicle?.plateNumber?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{event.vehicle?.plateNumber}</span>
                      {event.anprPlate && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isMatch ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          ANPR: {event.anprPlate} {isMatch ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{event.vehicle?.make} {event.vehicle?.model}</span>
                      {event.vehicle?.color && <span className="text-gray-400">| {event.vehicle.color}</span>}
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.plaza?.gateCode || event.plaza?.name}</span>
                      {event.laneNumber && <span className="flex items-center gap-1"><Hash size={12} /> Lane {event.laneNumber}</span>}
                      {event.direction && (
                        <span className={`flex items-center gap-1 ${event.direction === 'UP' ? 'text-blue-500' : 'text-orange-500'}`}>
                          {event.direction === 'UP' ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {event.direction}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-lg">{tollAmount.toLocaleString()} MMK</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>{event.status}</span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p className="flex items-center gap-1 justify-end"><Clock size={12} /> {new Date(event.entryTime).toLocaleTimeString()}</p>
                      {event.exitTime && <p>{new Date(event.exitTime).toLocaleTimeString()}</p>}
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Vehicle</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">Plate:</span> <span className="font-mono font-medium">{event.vehicle?.plateNumber}</span></p>
                        <p><span className="text-gray-500">Make:</span> {event.vehicle?.make}</p>
                        <p><span className="text-gray-500">Model:</span> {event.vehicle?.model}</p>
                        <p><span className="text-gray-500">Color:</span> {event.vehicle?.color || 'N/A'}</p>
                        <p><span className="text-gray-500">Class:</span> {event.vehicle?.vehicleClass}</p>
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
                      <h4 className="font-medium text-sm text-gray-700">Toll Info</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">Plaza:</span> {event.plaza?.name}</p>
                        <p><span className="text-gray-500">Gate Code:</span> <span className="font-mono">{event.plaza?.gateCode || 'N/A'}</span></p>
                        <p><span className="text-gray-500">Mile:</span> {event.plaza?.mileMarker ?? 'N/A'}</p>
                        <p><span className="text-gray-500">Lane:</span> <span className="font-mono">{event.laneNumber || 'N/A'}</span></p>
                        <p><span className="text-gray-500">Direction:</span> {event.direction || 'N/A'}</p>
                        <p><span className="text-gray-500">Entry:</span> {new Date(event.entryTime).toLocaleString()}</p>
                        <p><span className="text-gray-500">Exit:</span> {event.exitTime ? new Date(event.exitTime).toLocaleString() : 'Still in transit'}</p>
                        {event.entryTime && event.exitTime && (
                          <p><span className="text-gray-500">Duration:</span> {Math.round((new Date(event.exitTime).getTime() - new Date(event.entryTime).getTime()) / 60000)} min</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Payment & Verification</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="text-gray-500">Amount:</span> <span className="font-bold">{tollAmount.toLocaleString()} MMK</span></p>
                        {event.rfidTag && (
                          <p><span className="text-gray-500">RFID:</span> <span className="font-mono text-xs">{event.rfidTag.tagUid}</span></p>
                        )}
                        {event.transaction && (
                          <>
                            <p><span className="text-gray-500">Payment:</span> {event.transaction.status}</p>
                            {event.transaction.paymentMethod && <p><span className="text-gray-500">Method:</span> {event.transaction.paymentMethod}</p>}
                          </>
                        )}
                        {event.violation && (
                          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                            <p className="flex items-center gap-1 text-red-700 font-medium"><AlertTriangle size={12} /> Violation</p>
                            <p className="text-red-600 text-xs">{event.violation.violationType} - {event.violation.fineAmount} MMK</p>
                            <p className="text-red-500 text-xs">Status: {event.violation.status}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">ANPR Snapshot</h4>
                        {event.photos?.filter((p) => p.photoType === 'ENTRY' || p.photoType === 'EXIT').length ? (
                          <div className="flex gap-1">
                            {event.photos.filter((p) => p.photoType === 'ENTRY' || p.photoType === 'EXIT').map((p, i) => (
                              <div key={i} className="relative">
                                <img src={getPhotoUrl(p.photoUrl)!} alt="" className="w-20 h-14 rounded object-cover" />
                                <span className="absolute bottom-0 left-0 bg-black/60 text-white text-[9px] px-1 rounded-tr">{p.photoType}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Camera size={14} />
                            <span>No ANPR snapshots</span>
                          </div>
                        )}
                      </div>
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
          <Camera size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No toll events found</p>
        </div>
      )}
    </div>
  );
}
