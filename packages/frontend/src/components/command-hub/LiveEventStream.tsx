import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Radio, Camera, CreditCard, AlertTriangle, ChevronRight } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import api from '../../lib/api';

interface LiveEvent {
  id: string;
  type: 'RFID_PASS' | 'ANPR_CAPTURE' | 'PAYMENT' | 'VIOLATION' | 'GATE_FORCED';
  plateNumber: string;
  vehicleClass: string;
  plazaName: string;
  laneNumber: number;
  amount?: number;
  timestamp: string;
  imageUrl?: string;
}

export default function LiveEventStream() {
  const { socket, isConnected } = useSocket();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);

  const { data: initialEvents } = useQuery({
    queryKey: ['live-events'],
    queryFn: async () => {
      const res = await api.get('/toll-events');
      return res.data;
    },
  });

  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents.slice(0, 20));
    }
  }, [initialEvents]);

  useEffect(() => {
    if (!socket) return;

    const handleNewEvent = (event: LiveEvent) => {
      setEvents(prev => [event, ...prev].slice(0, 20));
    };

    socket.on('new-toll-event', handleNewEvent);

    return () => {
      socket.off('new-toll-event', handleNewEvent);
    };
  }, [socket]);

  const getEventTag = (type: string) => {
    switch (type) {
      case 'RFID_PASS':
        return (
          <span className="event-tag event-tag-rfid flex items-center gap-1">
            <Radio size={10} />
            RFID PASSED
          </span>
        );
      case 'ANPR_CAPTURE':
        return (
          <span className="event-tag event-tag-anpr flex items-center gap-1">
            <Camera size={10} />
            ANPR CAPTURE
          </span>
        );
      case 'PAYMENT':
        return (
          <span className="event-tag event-tag-payment flex items-center gap-1">
            <CreditCard size={10} />
            PAYMENT
          </span>
        );
      case 'VIOLATION':
      case 'GATE_FORCED':
        return (
          <span className="event-tag event-tag-violation flex items-center gap-1">
            <AlertTriangle size={10} />
            VIOLATION
          </span>
        );
      default:
        return (
          <span className="event-tag bg-gray-500/20 text-gray-400">
            {type}
          </span>
        );
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'RFID_PASS': return <Radio size={14} className="text-cyan-400" />;
      case 'ANPR_CAPTURE': return <Camera size={14} className="text-brand-400" />;
      case 'PAYMENT': return <CreditCard size={14} className="text-emerald-400" />;
      case 'VIOLATION':
      case 'GATE_FORCED': return <AlertTriangle size={14} className="text-crimson-400" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Live Event Stream</h2>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {events.map((event, idx) => (
          <div
            key={event.id || idx}
            onClick={() => setSelectedEvent(event)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              idx === 0
                ? 'bg-white/10 border border-white/20 animate-slide-up'
                : 'bg-white/5 hover:bg-white/8 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                event.type === 'VIOLATION' || event.type === 'GATE_FORCED'
                  ? 'bg-crimson-500/20'
                  : 'bg-white/10'
              }`}>
                {getEventIcon(event.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="plate-number text-xs">{event.plateNumber}</span>
                  {getEventTag(event.type)}
                </div>
                <p className="text-xs text-gray-400">
                  {event.plazaName} • Lane {event.laneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {event.amount && (
                <span className="telemetry-value text-sm text-emerald-400">
                  K{event.amount.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              <ChevronRight size={14} className="text-gray-500" />
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events yet</p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="plate-number">{selectedEvent.plateNumber}</span>
                {getEventTag(selectedEvent.type)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Plaza</p>
                  <p className="text-sm text-white">{selectedEvent.plazaName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Lane</p>
                  <p className="text-sm text-white">{selectedEvent.laneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Vehicle Class</p>
                  <p className="text-sm text-white">{selectedEvent.vehicleClass}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount</p>
                  <p className="text-sm text-emerald-400">
                    {selectedEvent.amount ? `K${selectedEvent.amount.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Timestamp</p>
                <p className="text-sm text-white">
                  {new Date(selectedEvent.timestamp).toLocaleString()}
                </p>
              </div>

              {selectedEvent.imageUrl && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">ANPR Capture</p>
                  <img
                    src={selectedEvent.imageUrl}
                    alt="ANPR capture"
                    className="w-full rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {selectedEvent.type === 'VIOLATION' && (
                <>
                  <button className="btn-success flex-1">Approve</button>
                  <button className="btn-danger flex-1">Reject</button>
                </>
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="btn-ghost flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
