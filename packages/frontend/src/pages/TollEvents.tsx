import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import api from '../lib/api';

interface TollEvent {
  id: string;
  vehicle: { plateNumber: string; make: string; model: string };
  plaza: { name: string };
  entryTime: string;
  exitTime: string | null;
  status: string;
  anprPlate: string | null;
}

export default function TollEvents() {
  const [events, setEvents] = useState<TollEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const { data: initialEvents, isLoading } = useQuery<TollEvent[]>({
    queryKey: ['toll-events'],
    queryFn: async () => {
      const response = await api.get('/toll-events');
      return response.data;
    },
  });

  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  useEffect(() => {
    const socket = io(window.location.origin, {
      path: '/socket.io',
    });

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('toll-event', (event: TollEvent) => {
      setEvents((prev) => [event, ...prev.slice(0, 99)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toll Events</h1>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-500">{connected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Entry Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Exit Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ANPR</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{event.vehicle?.plateNumber}</div>
                    <div className="text-sm text-gray-500">{event.vehicle?.make} {event.vehicle?.model}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{event.plaza?.name}</td>
                <td className="px-4 py-3">{new Date(event.entryTime).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {event.exitTime ? new Date(event.exitTime).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    event.status === 'ENTRY' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {event.anprPlate || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <div className="p-8 text-center text-gray-500">No events yet</div>
        )}
      </div>
    </div>
  );
}
