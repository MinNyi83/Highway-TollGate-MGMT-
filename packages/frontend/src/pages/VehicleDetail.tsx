import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Car } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';

interface VehicleDetail {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vehicleClass: string;
  status: string;
  vehiclePhoto?: string;
  wheelTaxCard?: string;
  rfidTags: { id: string; tagUid: string; status: string; account: { id: string; balance: number } }[];
  tollEvents: {
    id: string;
    entryTime: string;
    exitTime?: string;
    status: string;
    anprPlate?: string;
    plaza: { name: string };
    transaction?: { amount: number; status: string };
    violation?: { violationType: string; fineAmount: number; status: string };
  }[];
  violations: { id: string; violationType: string; fineAmount: number; status: string; createdAt: string }[];
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'events' | 'violations' | 'rfid'>('events');

  const { data: vehicle, isLoading } = useQuery<VehicleDetail>({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-8 text-gray-500">Vehicle not found</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Car className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{vehicle.plateNumber}</h1>
              <p className="text-gray-500">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {vehicle.status}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
          <div><span className="text-gray-500">Class:</span> {vehicle.vehicleClass}</div>
          <div><span className="text-gray-500">Color:</span> {vehicle.color || 'N/A'}</div>
          <div><span className="text-gray-500">RFID Tags:</span> {vehicle.rfidTags?.length || 0}</div>
          <div><span className="text-gray-500">Total Events:</span> {vehicle.tollEvents?.length || 0}</div>
        </div>
      </div>

      {(vehicle.vehiclePhoto || vehicle.wheelTaxCard) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Documents</h2>
          <div className="grid grid-cols-2 gap-6">
            {vehicle.vehiclePhoto && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Vehicle Photo</p>
                <img
                  src={`${api.defaults.baseURL}/uploads/${vehicle.vehiclePhoto}`}
                  alt="Vehicle"
                  className="w-full max-w-sm rounded-lg border"
                />
              </div>
            )}
            {vehicle.wheelTaxCard && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Wheel Tax Card</p>
                <img
                  src={`${api.defaults.baseURL}/uploads/${vehicle.wheelTaxCard}`}
                  alt="Wheel Tax Card"
                  className="w-full max-w-sm rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-4 border-b">
        {(['events', 'violations', 'rfid'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 font-medium capitalize ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'events' ? 'Toll Events' : tab === 'violations' ? 'Violations' : 'RFID Tags'}
          </button>
        ))}
      </div>

      {activeTab === 'events' && (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plaza</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Violation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vehicle.tollEvents?.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(event.entryTime).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{event.plaza?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">${event.transaction?.amount || 0}</td>
                  <td className="px-4 py-3">
                    {event.violation ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        {event.violation.violationType}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!vehicle.tollEvents || vehicle.tollEvents.length === 0) && (
            <div className="p-8 text-center text-gray-500">No toll events</div>
          )}
        </div>
      )}

      {activeTab === 'violations' && (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Fine</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vehicle.violations?.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{v.violationType}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">${v.fineAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      v.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!vehicle.violations || vehicle.violations.length === 0) && (
            <div className="p-8 text-center text-gray-500">No violations</div>
          )}
        </div>
      )}

      {activeTab === 'rfid' && (
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tag UID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Account Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vehicle.rfidTags?.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{tag.tagUid}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tag.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tag.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">${tag.account?.balance || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!vehicle.rfidTags || vehicle.rfidTags.length === 0) && (
            <div className="p-8 text-center text-gray-500">No RFID tags</div>
          )}
        </div>
      )}
    </div>
  );
}
