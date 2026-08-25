import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Upload, Trash2, Edit, CheckCircle, AlertTriangle, Radio } from 'lucide-react';
import api from '../lib/api';
import { showToast } from '../components/Toast';

const vehicleClasses = [
  { value: 'MOTORCYCLE', label: 'Motorcycle', icon: '🏍️' },
  { value: 'SEDAN', label: 'Sedan', icon: '🚗' },
  { value: 'SUV', label: 'SUV', icon: '🚙' },
  { value: 'TRUCK', label: 'Truck', icon: '🚛' },
  { value: 'BUS', label: 'Bus', icon: '🚌' },
];

export default function MyVehicles() {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [form, setForm] = useState({
    plateNumber: '', make: '', model: '', year: '', color: '', vehicleClass: 'SEDAN',
  });
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => {
      const res = await api.get('/customer/my-vehicles');
      return res.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (vehiclePhoto) formData.append('vehiclePhoto', vehiclePhoto);
      const res = await api.post('/customer/register-vehicle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      showToast('success', data.message || 'Vehicle registered');
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      setShowForm(false);
      setForm({ plateNumber: '', make: '', model: '', year: '', color: '', vehicleClass: 'SEDAN' });
      setVehiclePhoto(null);
      setPhotoPreview(null);
    },
    onError: (error: any) => {
      showToast('error', error.response?.data?.error || 'Registration failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      await api.delete(`/customer/my-vehicles/${vehicleId}`);
    },
    onSuccess: () => {
      showToast('success', 'Vehicle deleted');
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVehiclePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!form.plateNumber || !form.make || !form.model || !form.year) {
      showToast('error', 'Please fill required fields');
      return;
    }
    registerMutation.mutate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">My Vehicles</h1>
        <button
          onClick={() => { setShowForm(true); setEditingVehicle(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          Register
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="font-bold mb-4">{editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</h2>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Photo</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-gray-50 overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={20} className="mx-auto text-gray-400" />
                      <span className="text-xs text-gray-400">Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              <p className="text-xs text-gray-500">JPEG, PNG, WEBP. Max 10MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input
                value={form.plateNumber}
                onChange={(e) => setForm({ ...form, plateNumber: e.target.value })}
                placeholder="1A-12345"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="Toyota"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Corolla"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2024"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="White"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Class *</label>
              <select
                value={form.vehicleClass}
                onChange={(e) => setForm({ ...form, vehicleClass: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vehicleClasses.map((vc) => (
                  <option key={vc.value} value={vc.value}>{vc.icon} {vc.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={registerMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {registerMutation.isPending ? 'Registering...' : 'Register Vehicle'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingVehicle(null); }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vehicle List */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-3">
          {vehicles?.map((v: any) => (
            <div key={v.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start gap-4">
                {v.vehiclePhoto ? (
                  <img src={`/uploads/${v.vehiclePhoto}`} alt={v.plateNumber} className="w-20 h-20 rounded-lg object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Car size={32} className="text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{v.plateNumber}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      v.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{v.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{v.year} {v.make} {v.model} {v.color && `- ${v.color}`}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{v._count?.tollEvents || v.eventCount || 0} trips</span>
                    <span>{v._count?.violations || v.violationCount || 0} violations</span>
                  </div>
                  {v.rfidTag && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
                      <Radio size={14} className="text-blue-600" />
                      <span className="text-xs font-mono text-blue-800">{v.rfidTag.tagUid}</span>
                      <span className={`text-xs ${v.rfidTag.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                        {v.rfidTag.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => deleteMutation.mutate(v.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!vehicles || vehicles.length === 0) && !showForm && (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No vehicles registered</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 hover:underline"
              >
                Register your first vehicle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
