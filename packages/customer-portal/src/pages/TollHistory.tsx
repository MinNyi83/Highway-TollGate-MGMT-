import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Search, Filter, X, ChevronDown, MapPin, Clock, Car, CreditCard, Hash, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function TollHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['customer-toll-events'],
    queryFn: async () => {
      const response = await api.get('/customer/toll-events');
      return response.data;
    },
  });

  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = !search ||
      event.vehicle?.plateNumber?.toLowerCase().includes(search.toLowerCase()) ||
      event.plaza?.name?.toLowerCase().includes(search.toLowerCase()) ||
      event.plaza?.gateCode?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Open detail if URL has event param
  const eventIdParam = searchParams.get('event');
  if (eventIdParam && events && !selectedEvent) {
    const found = events.find((e: any) => e.id === eventIdParam);
    if (found) setSelectedEvent(found);
  }

  const totalSpent = filteredEvents.reduce((sum: number, e: any) => sum + (e.transaction?.amount || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredEvents.length} records · K{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search plate, gate, plaza..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { value: 'all', label: 'All' },
          { value: 'COMPLETED', label: 'Completed' },
          { value: 'ENTRY', label: 'Entry' },
          { value: 'EXIT', label: 'Exit' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === f.value
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Car size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No transactions found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEvents.map((event: any) => (
            <div
              key={event.id}
              onClick={() => { setSelectedEvent(event); setSearchParams({ event: event.id }); }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  event.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-600'
                    : event.status === 'ENTRY'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {event.status === 'COMPLETED' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[15px] text-gray-900">{event.vehicle?.plateNumber}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      event.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      event.status === 'ENTRY' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={11} className="text-gray-400" />
                    <p className="text-xs text-gray-500 truncate">
                      {event.plaza?.gateCode || event.plaza?.name}
                      {event.laneNumber && ` · ${event.laneNumber}`}
                      {event.direction && ` · ${event.direction}`}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[15px] text-gray-900">{event.transaction?.amount || 0}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(event.entryTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Sheet Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedEvent(null); setSearchParams({}); }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-in">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Status Badge */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => { setSelectedEvent(null); setSearchParams({}); }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Vehicle Photo Placeholder */}
            <div className="mx-6 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-44 flex items-center justify-center">
              {selectedEvent.vehicle?.vehiclePhoto ? (
                <img src={selectedEvent.vehicle.vehiclePhoto} alt="Vehicle" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Car size={40} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">ANPR Capture</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="px-6 pb-8 space-y-1">
              <DetailRow
                icon={<Hash size={14} />}
                label="Transaction ID"
                value={selectedEvent.id.slice(0, 8) + '...' + selectedEvent.id.slice(-3)}
              />
              <DetailRow
                icon={<Car size={14} />}
                label="License No"
                value={selectedEvent.vehicle?.plateNumber || 'N/A'}
                highlight
              />
              <DetailRow
                icon={<CreditCard size={14} />}
                label="Toll Fare"
                value={`${selectedEvent.transaction?.amount || 0} MMK`}
                highlight
              />
              <DetailRow
                icon={<Car size={14} />}
                label="Vehicle Type"
                value={selectedEvent.vehicle?.vehicleClass || 'N/A'}
              />
              <DetailRow
                icon={<MapPin size={14} />}
                label="Gate Code"
                value={selectedEvent.plaza?.gateCode || selectedEvent.plaza?.name || 'N/A'}
              />
              <DetailRow
                icon={<ArrowRight size={14} />}
                label="Lane No"
                value={selectedEvent.laneNumber || 'N/A'}
              />
              <DetailRow
                icon={<ArrowDownRight size={14} />}
                label="Direction"
                value={selectedEvent.direction || 'DOWN'}
              />
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedEvent.status === 'COMPLETED' ? 'bg-emerald-500' :
                      selectedEvent.status === 'ENTRY' ? 'bg-amber-500' :
                      'bg-gray-400'
                    }`} />
                  </div>
                  <span className="text-sm">Status</span>
                </div>
                <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                  selectedEvent.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                  selectedEvent.status === 'ENTRY' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {selectedEvent.status}
                </span>
              </div>
              <DetailRow
                icon={<Clock size={14} />}
                label="Time"
                value={new Date(selectedEvent.entryTime).toLocaleString('en-US', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value, highlight = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm ${highlight ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
        {value}
      </span>
    </div>
  );
}
