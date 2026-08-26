import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, X, Pencil, Trash2, Eye, MapPin, Cpu } from 'lucide-react';

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
  deviceStatuses?: Array<{ id: string; deviceType: string; status: string }>;
}

interface PlazaForm {
  name: string;
  gateCode: string;
  locationLat: string;
  locationLng: string;
  mileMarker: string;
  lanes: string;
  status: string;
}

const emptyForm: PlazaForm = { name: '', gateCode: '', locationLat: '', locationLng: '', mileMarker: '', lanes: '4', status: 'ACTIVE' };

export default function TollPlazas() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<TollPlaza | null>(null);
  const [form, setForm] = useState<PlazaForm>(emptyForm);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      closeModal();
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to create plaza'),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlazaForm & { id: string }) => {
      return api.put(`/toll-plazas/${data.id}`, {
        name: data.name,
        gateCode: data.gateCode || undefined,
        locationLat: parseFloat(data.locationLat),
        locationLng: parseFloat(data.locationLng),
        mileMarker: data.mileMarker ? parseInt(data.mileMarker) : undefined,
        lanes: parseInt(data.lanes) || 4,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      closeModal();
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to update plaza'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/toll-plazas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      setDeleteConfirm(null);
    },
  });

  const openCreate = () => {
    setEditingPlaza(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (plaza: TollPlaza) => {
    setEditingPlaza(plaza);
    setForm({
      name: plaza.name,
      gateCode: plaza.gateCode || '',
      locationLat: String(plaza.locationLat),
      locationLng: String(plaza.locationLng),
      mileMarker: plaza.mileMarker != null ? String(plaza.mileMarker) : '',
      lanes: String(plaza.lanes),
      status: plaza.status,
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlaza(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.locationLat || !form.locationLng) { setError('Location coordinates are required'); return; }
    if (editingPlaza) {
      updateMutation.mutate({ ...form, id: editingPlaza.id });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (field: keyof PlazaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Toll Plazas</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Add Plaza
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plazas?.map((plaza) => {
          const devices = plaza.deviceStatuses || [];
          const online = devices.filter((d) => d.status === 'ONLINE').length;
          const offline = devices.filter((d) => d.status === 'OFFLINE' || d.status === 'ERROR').length;

          return (
            <div key={plaza.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-3">
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
              <p className="text-gray-500 text-sm flex items-center gap-1 mb-1">
                <MapPin size={14} /> {plaza.locationLat}, {plaza.locationLng}
              </p>
              {plaza.mileMarker != null && (
                <p className="text-gray-500 text-sm mb-1">Mile {plaza.mileMarker}</p>
              )}
              <p className="text-gray-500 text-sm mb-3">Lanes: {plaza.lanes}</p>

              {devices.length > 0 && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                  <Cpu size={14} />
                  <span className="text-green-600">{online} online</span>
                  {offline > 0 && <span className="text-red-600 ml-1">{offline} offline</span>}
                </p>
              )}

              {plaza.tollRates?.length > 0 && (
                <div className="border-t pt-3 mb-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">RATES</h4>
                  <div className="space-y-1">
                    {plaza.tollRates.map((rate) => (
                      <div key={rate.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{rate.vehicleClass}</span>
                        <span className="font-medium">{Number(rate.rateAmount)} MMK</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 border-t pt-3">
                <Link to={`/toll-plazas/${plaza.id}`} className="flex-1 text-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md flex items-center justify-center gap-1">
                  <Eye size={14} /> View
                </Link>
                <button onClick={() => openEdit(plaza)} className="flex-1 text-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md flex items-center justify-center gap-1">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(plaza.id)} className="flex-1 text-center text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-md flex items-center justify-center gap-1">
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              {deleteConfirm === plaza.id && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700 mb-2">Delete "{plaza.name}"? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-sm border border-gray-300 rounded-md py-1 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => deleteMutation.mutate(plaza.id)} disabled={deleteMutation.isPending} className="flex-1 text-sm bg-red-600 text-white rounded-md py-1 hover:bg-red-700 disabled:opacity-50">
                      {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {plazas?.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No toll plazas found</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">{editingPlaza ? 'Edit Toll Plaza' : 'Add Toll Plaza'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Yangon Toll Gate" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gate Code</label>
                <input type="text" value={form.gateCode} onChange={(e) => handleChange('gateCode', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 3JUNC" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                  <input type="number" step="any" value={form.locationLat} onChange={(e) => handleChange('locationLat', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="16.8661" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                  <input type="number" step="any" value={form.locationLng} onChange={(e) => handleChange('locationLng', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="96.1951" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mile Marker</label>
                  <input type="number" value={form.mileMarker} onChange={(e) => handleChange('mileMarker', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lanes</label>
                  <input type="number" min="1" max="20" value={form.lanes} onChange={(e) => handleChange('lanes', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {editingPlaza
                    ? (updateMutation.isPending ? 'Saving...' : 'Save Changes')
                    : (createMutation.isPending ? 'Creating...' : 'Create Plaza')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
