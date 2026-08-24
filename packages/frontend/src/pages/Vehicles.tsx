import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  vehicleClass: string;
  status: string;
  rfidTags: Array<{ id: string; tagUid: string; status: string }>;
}

export default function Vehicles() {
  const [search, setSearch] = useState('');
  
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles', search],
    queryFn: async () => {
      const response = await api.get('/vehicles');
      return response.data;
    },
  });

  const filteredVehicles = vehicles?.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by plate, make, or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plate Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Make</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Model</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">RFID Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredVehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/vehicles/${vehicle.id}`} className="text-blue-600 hover:underline">
                    {vehicle.plateNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{vehicle.make}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {vehicle.vehicleClass}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-3">{vehicle.rfidTags?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVehicles?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No vehicles found</div>
        )}
      </div>
    </div>
  );
}
