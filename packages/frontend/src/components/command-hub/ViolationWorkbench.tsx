import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Check, X, Search, Camera, FileText } from 'lucide-react';
import api from '../../lib/api';

interface Violation {
  id: string;
  type: string;
  plateNumber: string;
  vehicleClass: string;
  ownerName?: string;
  plazaName: string;
  laneNumber: number;
  capturedAt: string;
  imageUrl?: string;
  ocrResult?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISPUTED';
  amount: number;
}

export default function ViolationWorkbench() {
  const queryClient = useQueryClient();
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [filter, setFilter] = useState('ALL');

  const { data: violations } = useQuery({
    queryKey: ['violations-workbench'],
    queryFn: async () => {
      const res = await api.get('/violations');
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/violations/${id}`, { status: 'APPROVED' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations-workbench'] });
      setSelectedViolation(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/violations/${id}`, { status: 'REJECTED' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations-workbench'] });
      setSelectedViolation(null);
    },
  });

  const filteredViolations = violations?.filter((v: Violation) => {
    if (filter === 'ALL') return true;
    return v.status === filter;
  }) || [];

  const pendingCount = violations?.filter((v: Violation) => v.status === 'PENDING').length || 0;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Violation Workbench</h2>
          {pendingCount > 0 && (
            <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-medium">
              {pendingCount} pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Violation List */}
        <div className="w-1/3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredViolations.map((violation: Violation) => (
            <div
              key={violation.id}
              onClick={() => setSelectedViolation(violation)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedViolation?.id === violation.id
                  ? 'bg-brand-600/20 border border-brand-500/50'
                  : 'bg-white/5 border border-transparent hover:bg-white/8'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="plate-number text-xs">{violation.plateNumber}</span>
                <span className={`text-xs font-medium ${
                  violation.status === 'PENDING' ? 'text-amber-400' :
                  violation.status === 'APPROVED' ? 'text-emerald-400' :
                  'text-crimson-400'
                }`}>
                  {violation.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{violation.type}</span>
                <span>•</span>
                <span>{violation.plazaName}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(violation.capturedAt).toLocaleString()}
              </p>
            </div>
          ))}

          {filteredViolations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Check size={24} className="mx-auto mb-2 text-emerald-400" />
              <p className="text-sm">No violations to review</p>
            </div>
          )}
        </div>

        {/* Split Screen Comparison */}
        <div className="flex-1">
          {selectedViolation ? (
            <div className="flex gap-4 h-[600px]">
              {/* Left: ANPR Capture */}
              <div className="flex-1 bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                  <Camera size={14} className="text-cyan-400" />
                  <span className="text-sm font-medium text-white">ANPR Capture</span>
                </div>
                <div className="p-4">
                  {selectedViolation.imageUrl ? (
                    <img
                      src={selectedViolation.imageUrl}
                      alt="ANPR capture"
                      className="w-full h-auto rounded-lg border border-white/10"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <Camera size={48} className="opacity-30" />
                    </div>
                  )}
                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">OCR Result</p>
                    <p className="plate-number text-lg">{selectedViolation.plateNumber}</p>
                  </div>
                </div>
              </div>

              {/* Right: Vehicle Details */}
              <div className="flex-1 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                  <FileText size={14} className="text-brand-400" />
                  <span className="text-sm font-medium text-white">Vehicle Details</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Plate Number</p>
                    <p className="plate-number">{selectedViolation.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Vehicle Class</p>
                    <p className="text-sm text-white">{selectedViolation.vehicleClass}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Owner</p>
                    <p className="text-sm text-white">{selectedViolation.ownerName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Violation Type</p>
                    <p className="text-sm text-amber-400">{selectedViolation.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-sm text-emerald-400">K{selectedViolation.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-sm text-white">
                      {selectedViolation.plazaName} • Lane {selectedViolation.laneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Captured At</p>
                    <p className="text-sm text-white">
                      {new Date(selectedViolation.capturedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-gray-500 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <AlertTriangle size={48} className="mx-auto mb-3 opacity-30" />
                <p>Select a violation to review</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {selectedViolation && selectedViolation.status === 'PENDING' && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => approveMutation.mutate(selectedViolation.id)}
                disabled={approveMutation.isPending}
                className="btn-success flex-1 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Approve Violation
              </button>
              <button
                onClick={() => rejectMutation.mutate(selectedViolation.id)}
                disabled={rejectMutation.isPending}
                className="btn-danger flex-1 flex items-center justify-center gap-2"
              >
                <X size={16} />
                Reject Violation
              </button>
              <button className="btn-ghost flex-1 flex items-center justify-center gap-2">
                <Search size={16} />
                Request More Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
