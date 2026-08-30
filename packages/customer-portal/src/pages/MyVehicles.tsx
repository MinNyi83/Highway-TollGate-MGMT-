import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, Plus, Upload, Trash2, AlertTriangle, Radio, Image, X, Sparkles, Camera } from 'lucide-react';
import api from '../lib/api';
import { showToast } from '../components/Toast';
import OcrScannerModal, { ExtractedVehicleData } from '../components/OcrScannerModal';

const vehicleClasses = [
  { value: 'MOTORCYCLE', label: 'Motorcycle', icon: '🏍️' },
  { value: 'SEDAN', label: 'Sedan', icon: '🚗' },
  { value: 'SUV', label: 'SUV', icon: '🚙' },
  { value: 'TRUCK', label: 'Truck', icon: '🚛' },
  { value: 'BUS', label: 'Bus', icon: '🚌' },
];

const vehicleMakes: Record<string, string[]> = {
  'Toyota': ['Corolla', 'Camry', 'Vitz', 'Yaris', 'Prius', 'Land Cruiser', 'Rush', 'Avanza', 'Innova', 'Hilux', 'Fortuner', 'Raize'],
  'Honda': ['Civic', 'City', 'Fit', 'Jazz', 'CR-V', 'HR-V', 'BR-V', 'WR-V', 'Accord', 'Brio'],
  'Nissan': ['Sunny', 'Tiida', 'Note', 'Serena', 'X-Trail', 'Juke', 'Kicks', 'Navara', 'Patrol'],
  'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-8', 'BT-50'],
  'Hyundai': ['Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Stargazer'],
  'Kia': ['Morning', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Carnival', 'Sonet'],
  'Suzuki': ['Alto', 'Swift', 'Celerio', 'Wagon R', 'Jimny', 'Ertiga', 'Vitara', 'S-Presso'],
  'Mitsubishi': ['Mirage', 'Attrage', 'Xpander', 'Outlander', 'Triton', 'Pajero Sport'],
  'Ford': ['Ranger', 'Everest', 'EcoSport', 'Explorer'],
  'Chevrolet': ['Spark', 'Cruze', 'Trailblazer', 'Colorado'],
  'MG': ['ZS', 'HS', '3', '5', 'EP', 'Marvel R'],
  'BYD': ['Atto 3', 'Dolphin', 'Seal', 'Tang', 'Song Plus'],
  'Wuling': ['Almaz', 'Cortez', 'Confero', 'Air EV', 'Bingo'],
  'Perodua': ['Myvi', 'Axia', 'Bezza', 'Ativa', 'Alza'],
  'Proton': ['Saga', 'Persona', 'Iriz', 'X50', 'X70', 'X90'],
};

const vehicleColors = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown',
  'Gold', 'Beige', 'Orange', 'Yellow', 'Navy', 'Maroon', 'Purple',
  'Pearl White', 'Metallic Gray', 'Champagne', 'Bronze', 'Cream',
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function MyVehicles() {
  const [showForm, setShowForm] = useState(false);
  const [showOcrScanner, setShowOcrScanner] = useState(false);
  const [form, setForm] = useState({
    plateNumber: '', make: '', model: '', year: currentYear.toString(), color: '', vehicleClass: 'SEDAN',
  });
  const [vehiclePhotos, setVehiclePhotos] = useState<(File | null)[]>([null, null]);
  const [wheelTaxCards, setWheelTaxCards] = useState<(File | null)[]>([null, null]);
  const [vehiclePreviews, setVehiclePreviews] = useState<(string | null)[]>([null, null]);
  const [taxPreviews, setTaxPreviews] = useState<(string | null)[]>([null, null]);
  const queryClient = useQueryClient();

  const handleOcrApply = (data: ExtractedVehicleData, file?: File) => {
    setForm({
      plateNumber: data.plateNumber,
      make: data.make,
      model: data.model,
      year: data.year.toString(),
      color: data.color || 'Gray',
      vehicleClass: data.vehicleClass || 'SEDAN',
    });

    if (file) {
      const newCards = [...wheelTaxCards];
      newCards[0] = file;
      setWheelTaxCards(newCards);

      const newPreviews = [...taxPreviews];
      newPreviews[0] = URL.createObjectURL(file);
      setTaxPreviews(newPreviews);
    }

    setShowForm(true);
    showToast('success', `✨ Auto-filled: ${data.make} ${data.model} (${data.plateNumber})`);
  };

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
      vehiclePhotos.forEach((f) => { if (f) formData.append('vehiclePhoto', f); });
      wheelTaxCards.forEach((f) => { if (f) formData.append('wheelTaxCard', f); });
      const res = await api.post('/customer/register-vehicle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      showToast('success', data.message || 'Vehicle registered');
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      setShowForm(false);
      resetForm();
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

  const resetForm = () => {
    setForm({ plateNumber: '', make: '', model: '', year: currentYear.toString(), color: '', vehicleClass: 'SEDAN' });
    setVehiclePhotos([null, null]);
    setWheelTaxCards([null, null]);
    setVehiclePreviews([null, null]);
    setTaxPreviews([null, null]);
  };

  const handleFileChange = (file: File | null, type: 'vehicle' | 'tax', index: number) => {
    if (type === 'vehicle') {
      const newPhotos = [...vehiclePhotos];
      newPhotos[index] = file;
      setVehiclePhotos(newPhotos);
      const newPreviews = [...vehiclePreviews];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { const p = [...vehiclePreviews]; p[index] = e.target?.result as string; setVehiclePreviews(p); };
        reader.readAsDataURL(file);
      } else {
        newPreviews[index] = null;
        setVehiclePreviews(newPreviews);
      }
    } else {
      const newCards = [...wheelTaxCards];
      newCards[index] = file;
      setWheelTaxCards(newCards);
      const newPreviews = [...taxPreviews];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { const p = [...taxPreviews]; p[index] = e.target?.result as string; setTaxPreviews(p); };
        reader.readAsDataURL(file);
      } else {
        newPreviews[index] = null;
        setTaxPreviews(newPreviews);
      }
    }
  };

  const handleSubmit = () => {
    if (!form.plateNumber || !form.make || !form.model || !form.year) {
      showToast('error', 'Please fill required fields');
      return;
    }
    registerMutation.mutate();
  };

  const availableModels = form.make ? (vehicleMakes[form.make] || []) : [];

  const parsePhotos = (photoStr?: string): string[] => {
    if (!photoStr) return [];
    try { return JSON.parse(photoStr); } catch { return [photoStr]; }
  };

  const PhotoUpload = ({ label, previews, onChange, type }: { label: string; previews: (string | null)[]; onChange: (file: File | null, type: 'vehicle' | 'tax', index: number) => void; type: 'vehicle' | 'tax' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <label key={i} className="flex flex-col items-center justify-center border-2 border-dashed dark:border-gray-600 rounded-lg p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 min-h-[100px]">
            {previews[i] ? (
              <img src={previews[i]!} alt="" className="w-full h-20 object-cover rounded" />
            ) : (
              <>
                <Upload className="text-gray-400 dark:text-gray-500 mb-1" size={18} />
                <span className="text-xs text-gray-400">Photo {i + 1}</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null, type, i)} />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold dark:text-white">My Vehicles</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOcrScanner(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-md shadow-cyan-500/20 transition"
          >
            <Sparkles size={16} className="text-cyan-200" />
            <span>Scan Wheel Tax (AI)</span>
          </button>
          <button
            onClick={() => { setShowForm(true); resetForm(); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-medium"
          >
            <Plus size={16} />
            Register Manual
          </button>
        </div>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6 border dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 pb-3 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="font-bold dark:text-white">Register New Vehicle</h2>
              <button
                onClick={() => setShowOcrScanner(true)}
                className="text-xs bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700 px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:bg-cyan-100 transition"
              >
                <Sparkles size={13} />
                <span>Auto-Fill from RTAD Card</span>
              </button>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plate Number *</label>
              <input
                value={form.plateNumber}
                onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. 1A-12345"
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Make *</label>
              <select
                value={form.make}
                onChange={(e) => { setForm({ ...form, make: e.target.value, model: '' }); }}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Make</option>
                {Object.keys(vehicleMakes).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model *</label>
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                disabled={!form.make}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-600"
              >
                <option value="">{form.make ? 'Select Model' : 'Select Make first'}</option>
                {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Color</option>
                {vehicleColors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Class *</label>
              <select
                value={form.vehicleClass}
                onChange={(e) => setForm({ ...form, vehicleClass: e.target.value })}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vehicleClasses.map((vc) => (
                  <option key={vc.value} value={vc.value}>{vc.icon} {vc.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t dark:border-gray-700 mt-4 pt-4 space-y-4">
            <PhotoUpload label="Vehicle Photos (up to 2)" previews={vehiclePreviews} onChange={handleFileChange} type="vehicle" />
            <PhotoUpload label="Wheel Tax Card Photos (up to 2)" previews={taxPreviews} onChange={handleFileChange} type="tax" />
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
              onClick={() => { setShowForm(false); resetForm(); }}
              className="px-4 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vehicle List */}
      {isLoading ? (
        <div className="text-center py-8 dark:text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {vehicles?.map((v: any) => {
            const photos = parsePhotos(v.vehiclePhoto);
            return (
              <div key={v.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-start gap-4">
                  {photos.length > 0 ? (
                    <div className="flex gap-1">
                      {photos.map((p, i) => (
                        <img key={i} src={`/uploads/${p}`} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      ))}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Car size={28} className="text-gray-300 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg dark:text-white">{v.plateNumber}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          v.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700' :
                          v.approvalStatus === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700'
                        }`}>
                          {v.approvalStatus === 'PENDING' ? '⏳ Pending' :
                           v.approvalStatus === 'REJECTED' ? '✗ Rejected' : '✓ Approved'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{v.year} {v.make} {v.model} {v.color && `- ${v.color}`}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{v._count?.tollEvents || v.eventCount || 0} trips</span>
                      <span>{v._count?.violations || v.violationCount || 0} violations</span>
                    </div>
                    {v.rfidTag && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <Radio size={14} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-mono text-blue-800 dark:text-blue-300">{v.rfidTag.tagUid}</span>
                        <span className={`text-xs ${v.rfidTag.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {v.rfidTag.status}
                        </span>
                      </div>
                    )}
                    {v.approvalStatus === 'PENDING' && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <AlertTriangle size={14} className="text-yellow-600 dark:text-yellow-400" />
                        <span className="text-xs text-yellow-700 dark:text-yellow-300">Pending admin approval. You will be notified once reviewed.</span>
                      </div>
                    )}
                    {v.approvalStatus === 'REJECTED' && v.rejectedReason && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                        <AlertTriangle size={14} className="text-red-600 dark:text-red-400" />
                        <span className="text-xs text-red-700 dark:text-red-300">Rejected: {v.rejectedReason}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete vehicle ${v.plateNumber}?`)) deleteMutation.mutate(v.id);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {(!vehicles || vehicles.length === 0) && !showForm && (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No vehicles registered</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Register your first vehicle
              </button>
            </div>
          )}
        </div>
      )}

      {/* RTAD Document OCR Scanner Modal */}
      <OcrScannerModal
        isOpen={showOcrScanner}
        onClose={() => setShowOcrScanner(false)}
        onApply={handleOcrApply}
      />
    </div>
  );
}
