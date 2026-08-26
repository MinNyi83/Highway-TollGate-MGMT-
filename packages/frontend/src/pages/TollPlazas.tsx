import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, X } from 'lucide-react';

interface TollPlaza {
  id: string;
  name: string;
  gateCode: string | null;
  locationLat: number;
  locationLng: number;
  mileMarker: number | null;
  lanes: number;
  status: string;
  tollRates: Array<{ id: string; vehicleClass: string; rateAmount: number }>;
}

interface PlazaForm {
  name: string;
  gateCode: string;
  locationLat: string;
  locationLng: string;
  mileMarker: string;
  lanes: string;
}

const emptyForm: PlazaForm = { name: '', gateCode: '', locationLat: '', locationLng: '', mileMarker: '', lanes: '4' };

export default function TollPlazas() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PlazaForm>(emptyForm);
  const [error, setError] = useState('');

  const { data: plazas, isLoading } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas'],
    queryFn: async () => {
      const response = await api.get('/toll-plazas');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlazaForm) => {
      return api.post('/toll-plazas', {
        name: data.name,
        gateCode: data.gateCode || undefined,
        locationLat: parseFloat(data.locationLat),
        locationLng: parseFloat(data.locationLng),
        mileMarker: data.mileMarker ? parseInt(data.mileMarker) : undefined,
        lanes: parseInt(data.lanes) || 4,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      setShowModal(false);
      setForm(emptyForm);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create plaza');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.locationLat || !form.locationLng) { setError('Location coordinates are required'); return; }
    createMutation.mutate(form);
  };

  const handleChange = (field: keyof PlazaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toll Plazas</h1>
        <button
          onClick={() => { setForm(emptyForm); setError(''); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
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
            {plaza.gateCode && (
              <p className="text-sm font-mono text-gray-700 mb-1">Gate: {plaza.gateCode}</p>
            )}
            <p className="text-gray-500 text-sm mb-1">
              Location: {plaza.locationLat}, {plaza.locationLng}
            </p>
            {plaza.mileMarker && (
              <p className="text-gray-500 text-sm mb-1">Mile Marker: {plaza.mileMarker}</p>
            )}
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
                      <span className="font-medium">{rate.rateAmount} MMK</span>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add Toll Plaza</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Yangon Toll Gate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                <input
                  type="text"
                  value={form.gateCode}
                  onChange={(e) => handleChange('gateCode', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 3JUNC"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={form.locationLat}
                    onChange={(e) => handleChange('locationLat', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16.8661"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    value={form.locationLng}
                    onChange={(e) => handleChange('locationLng', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="96.1951"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mile Marker</label>
                  <input
                    type="number"
                    value={form.mileMarker}
                    onChange={(e) => handleChange('mileMarker', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lanes</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.lanes}
                    onChange={(e) => handleChange('lanes', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Plaza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
