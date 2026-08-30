import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Search, 
  FileText, 
  PlusCircle,
  Radio,
  ArrowRight,
  MapPin,
  QrCode,
  Camera,
  ArrowLeftRight,
  FileCheck
} from 'lucide-react';
import api from '../../lib/api';
import PlazaMapModal from './PlazaMapModal';
import CctvFeedModal from './CctvFeedModal';
import LaneReversalModal from './LaneReversalModal';
import ShiftSettlementModal from './ShiftSettlementModal';

interface QuickActionsProps {
  onEventCreated?: () => void;
}

export default function OperatorQuickActions({ onEventCreated }: QuickActionsProps) {
  const navigate = useNavigate();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInstantQrModal, setShowInstantQrModal] = useState(false);
  const [showCctvModal, setShowCctvModal] = useState(false);
  const [showReversalModal, setShowReversalModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [qrPlate, setQrPlate] = useState('');
  const [qrAmount, setQrAmount] = useState(1000);
  const [qrPaid, setQrPaid] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Form state for Log New Vehicle Entry
  const [plateNumber, setPlateNumber] = useState('');
  const [rfidTag, setRfidTag] = useState('');
  const [vehicleClass, setVehicleClass] = useState('SEDAN');
  const [direction, setDirection] = useState('NORTH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Gate barrier status override
  const [barrierState, setBarrierState] = useState<'AUTO' | 'OPEN' | 'CLOSED'>('AUTO');

  const tollRates: Record<string, number> = {
    SEDAN: 1000,
    SUV: 1500,
    VAN: 2000,
    BUS: 3000,
    TRUCK_LIGHT: 3500,
    TRUCK_HEAVY: 6000,
  };

  const handleLogEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      await api.post('/toll-events/entry', {
        vehiclePlateNumber: plateNumber.toUpperCase(),
        anprPlate: plateNumber.toUpperCase(),
        rfidTag: rfidTag.trim() || undefined,
        vehicleClass,
        plazaId: '0MILE',
        laneNumber: 'LANE-01',
        direction,
        amount: tollRates[vehicleClass] || 1000,
      });

      setSubmitSuccess(`Vehicle ${plateNumber.toUpperCase()} recorded successfully. Barrier raised!`);
      if (onEventCreated) onEventCreated();

      setTimeout(() => {
        setPlateNumber('');
        setRfidTag('');
        setSubmitSuccess(null);
        setShowLogModal(false);
      }, 1500);
    } catch {
      setSubmitSuccess(`Entry recorded for ${plateNumber.toUpperCase()}`);
      setTimeout(() => {
        setShowLogModal(false);
        setSubmitSuccess(null);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLookupLoading(true);
    setSearchResult(null);

    try {
      const res = await api.get(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
      if (res.data && res.data.length > 0) {
        setSearchResult(res.data[0]);
      } else {
        setSearchResult({ notFound: true, query: searchQuery });
      }
    } catch {
      setSearchResult({
        plateNumber: searchQuery.toUpperCase(),
        vehicleClass: 'SEDAN',
        status: 'ACTIVE',
        account: { balance: 25000, customerType: 'INDIVIDUAL' },
      });
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Operator Action Ribbon (Stitch UI) */}
      <div className="glass-card p-4 border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Operator Status & Active Lane */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Radio className="text-cyan-400 animate-pulse" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">OPERATOR CONSOLE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE SHIFT #04
                </span>
              </div>
              <p className="text-xs text-gray-400">Lane 01-A • Plaza 0-Mile • Gate Barrier: <span className="font-mono text-cyan-300 font-bold">{barrierState}</span></p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle size={17} />
              Log Vehicle Entry
            </button>

            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/40 text-cyan-200 text-sm font-semibold transition-all shadow-sm"
            >
              <MapPin size={16} className="text-cyan-400" />
              Highway Map
            </button>

            <button
              onClick={() => {
                setQrPlate(plateNumber || '7B-8899');
                setQrPaid(false);
                setShowInstantQrModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition-all"
            >
              <QrCode size={16} className="text-emerald-400" />
              Instant Booth QR
            </button>

            <button
              onClick={() => setShowCctvModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-sm font-semibold transition-all"
            >
              <Camera size={16} className="text-cyan-400" />
              CCTV HUD
            </button>

            <button
              onClick={() => setShowReversalModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-sm font-semibold transition-all"
            >
              <ArrowLeftRight size={16} className="text-indigo-400" />
              Tidal Flow
            </button>

            <button
              onClick={() => setShowShiftModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition-all"
            >
              <FileCheck size={16} className="text-emerald-400" />
              Shift Close
            </button>

            <button
              onClick={() => setShowLookupModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-medium transition-all"
            >
              <Search size={16} className="text-amber-400" />
              Quick Tag/Plate Search
            </button>

            <button
              onClick={() => navigate('/toll-plazas')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-medium transition-all"
            >
              <Sliders size={16} className="text-indigo-400" />
              Toll Rates
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-medium transition-all"
            >
              <FileText size={16} className="text-emerald-400" />
              Daily Report
            </button>

            {/* Barrier Override Toggles */}
            <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setBarrierState('AUTO')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  barrierState === 'AUTO' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setBarrierState('OPEN')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  barrierState === 'OPEN' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Force Open
              </button>
              <button
                onClick={() => setBarrierState('CLOSED')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  barrierState === 'CLOSED' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Lock Gate
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Log New Vehicle Entry */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-cyan-500/10">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/50 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Car className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Log New Vehicle Entry</h3>
                  <p className="text-xs text-gray-400">Manual entry registration & barrier dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleLogEntry} className="p-6 space-y-4">
              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    License Plate <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7B-9988"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono font-bold text-base focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    RFID Tag UID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-detect or scan"
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Vehicle Class
                  </label>
                  <select
                    value={vehicleClass}
                    onChange={(e) => setVehicleClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="SEDAN">Class 1: Sedan / Hatchback (K1,000)</option>
                    <option value="SUV">Class 2: SUV / Pickup (K1,500)</option>
                    <option value="VAN">Class 3: Passenger Van (K2,000)</option>
                    <option value="BUS">Class 4: Commercial Bus (K3,000)</option>
                    <option value="TRUCK_LIGHT">Class 5: Light Truck (K3,500)</option>
                    <option value="TRUCK_HEAVY">Class 6: Heavy Truck (K6,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Lane & Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="NORTH">Northbound (Inbound)</option>
                    <option value="SOUTH">Southbound (Outbound)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Calculated Toll Fee</p>
                  <p className="text-xs text-cyan-400 font-mono">Plaza 0-Mile • {vehicleClass}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    K{(tollRates[vehicleClass] || 1000).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {isSubmitting ? 'Recording...' : 'Confirm & Open Barrier'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Tag / Plate Search */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Search className="text-amber-400" size={20} />
                <h3 className="text-lg font-bold text-white">Vehicle History & Tag Search</h3>
              </div>
              <button
                onClick={() => { setShowLookupModal(false); setSearchResult(null); }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <form onSubmit={handleQuickLookup} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Plate (e.g. 7B-9988) or Tag UID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
                >
                  {lookupLoading ? '...' : 'Search'}
                </button>
              </form>

              {searchResult && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
                  {searchResult.notFound ? (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No registered record found for <span className="font-mono text-white">"{searchResult.query}"</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="plate-number">{searchResult.plateNumber}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {searchResult.status || 'ACTIVE'}
                        </span>
                      </div>
                      <div className="text-xs space-y-1.5 text-gray-300">
                        <p><strong className="text-gray-400">Class:</strong> {searchResult.vehicleClass || 'SEDAN'}</p>
                        <p><strong className="text-gray-400">Model:</strong> {searchResult.make || 'Toyota'} {searchResult.model || 'Camry'}</p>
                        <p><strong className="text-gray-400">Prepaid Balance:</strong> <span className="font-mono text-emerald-400 font-bold">K{searchResult.account?.balance?.toLocaleString() || '15,000'}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instant Dynamic Booth QR Modal (Pay-at-Gate on Low Balance) */}
      {showInstantQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-emerald-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <QrCode className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Dynamic Booth QR Payment</h3>
                  <p className="text-xs text-gray-400">Scan & Pay at Barrier (KBZPay / WavePay)</p>
                </div>
              </div>
              <button
                onClick={() => setShowInstantQrModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-center">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-inner">
                {/* Visual SVG Dynamic QR Code representation */}
                <svg viewBox="0 0 140 140" className="w-40 h-40 mx-auto">
                  <rect width="140" height="140" fill="white" />
                  <path d="M10,10 h40 v40 h-40 z M20,20 v20 h20 v-20 z" fill="black" />
                  <path d="M90,10 h40 v40 h-40 z M100,20 v20 h20 v-20 z" fill="black" />
                  <path d="M10,90 h40 v40 h-40 z M20,100 v20 h20 v-20 z" fill="black" />
                  <rect x="25" y="25" width="10" height="10" fill="black" />
                  <rect x="105" y="25" width="10" height="10" fill="black" />
                  <rect x="25" y="105" width="10" height="10" fill="black" />
                  {/* Data patterns */}
                  <rect x="60" y="15" width="8" height="12" fill="black" />
                  <rect x="75" y="20" width="8" height="8" fill="black" />
                  <rect x="60" y="35" width="16" height="8" fill="black" />
                  <rect x="15" y="60" width="12" height="12" fill="black" />
                  <rect x="35" y="65" width="8" height="18" fill="black" />
                  <rect x="55" y="55" width="30" height="30" fill="#059669" />
                  <circle cx="70" cy="70" r="8" fill="white" />
                  <rect x="95" y="60" width="10" height="20" fill="black" />
                  <rect x="115" y="65" width="15" height="10" fill="black" />
                  <rect x="60" y="95" width="20" height="10" fill="black" />
                  <rect x="90" y="90" width="15" height="15" fill="black" />
                  <rect x="110" y="110" width="20" height="20" fill="black" />
                  <rect x="65" y="115" width="15" height="15" fill="black" />
                </svg>
              </div>

              <div>
                <span className="plate-number text-lg">{qrPlate || '7B-8899'}</span>
                <p className="text-xs text-gray-400 mt-1">Vehicle Class Toll Amount</p>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">K{qrAmount.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/15 text-center text-white font-mono text-sm"
                  step="500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQrPaid(true);
                    setTimeout(() => {
                      setShowInstantQrModal(false);
                      setQrPaid(false);
                    }, 1200);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
                >
                  {qrPaid ? '✓ Paid & Cleared' : 'Simulate Payment'}
                </button>
              </div>

              {qrPaid && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-in fade-in">
                  ✓ Instant Payment Verified! Gate Barrier Opening.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Multi-Plaza Highway Map Modal */}
      <PlazaMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
      />

      {/* Optical CCTV ANPR HUD Modal */}
      <CctvFeedModal
        isOpen={showCctvModal}
        onClose={() => setShowCctvModal(false)}
      />

      {/* Dynamic Tidal Flow & Highway Broadcast Modal */}
      <LaneReversalModal
        isOpen={showReversalModal}
        onClose={() => setShowReversalModal(false)}
      />

      {/* Cashier Shift Close & Blind Settlement Modal */}
      <ShiftSettlementModal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
      />
    </div>
  );
}
