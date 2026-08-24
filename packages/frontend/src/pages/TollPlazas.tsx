import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus } from 'lucide-react';

interface TollPlaza {
  id: string;
  name: string;
  locationLat: number;
  locationLng: number;
  lanes: number;
  status: string;
  tollRates: Array<{ id: string; vehicleClass: string; rateAmount: number }>;
}

export default function TollPlazas() {
  const { data: plazas, isLoading } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas'],
    queryFn: async () => {
      const response = await api.get('/toll-plazas');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toll Plazas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Add Plaza
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plazas?.map((plaza) => (
          <div key={plaza.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <Link to={`/toll-plazas/${plaza.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                {plaza.name}
              </Link>
              <span className={`px-2 py-1 text-xs rounded-full ${
                plaza.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plaza.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              Location: {plaza.locationLat}, {plaza.locationLng}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Lanes: {plaza.lanes}
            </p>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rates</h4>
              {plaza.tollRates?.length > 0 ? (
                <div className="space-y-1">
                  {plaza.tollRates.map((rate) => (
                    <div key={rate.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{rate.vehicleClass}</span>
                      <span className="font-medium">${rate.rateAmount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No rates configured</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {plazas?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No toll plazas found
        </div>
      )}
    </div>
  );
}
