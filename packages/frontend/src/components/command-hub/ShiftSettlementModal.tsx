import { useState } from 'react';
import { FileCheck, XCircle, Calculator, CheckCircle2, QrCode } from 'lucide-react';

interface ShiftSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShiftSettlementModal({ isOpen, onClose }: ShiftSettlementModalProps) {
  const cashierName = 'Kyaw Zin Min (ID #8821)';
  const laneCode = 'LANE-01A (0-Mile)';
  const [enteredCash, setEnteredCash] = useState<number>(385000);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  const systemCashExpected = 385000;
  const systemRfidPrepaid = 1450000;
  const systemMmqrElectronic = 210000;
  const systemTotalRevenue = systemCashExpected + systemRfidPrepaid + systemMmqrElectronic;

  const cashDiscrepancy = enteredCash - systemCashExpected;

  if (!isOpen) return null;

  const handleSettle = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculated(true);
  };

  const handleConfirmShiftClose = () => {
    setIsSettled(true);
    setTimeout(() => {
      onClose();
      setIsSettled(false);
      setIsCalculated(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <FileCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cashier Shift Close & Blind Settlement</h3>
              <p className="text-xs text-gray-400">Shift #04 • Cash Drawer Reconciliation & e-Tax Statement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Shift Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400">Cashier on Duty</p>
              <p className="font-semibold text-white mt-0.5">{cashierName}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400">Toll Booth Lane</p>
              <p className="font-semibold text-white mt-0.5">{laneCode}</p>
            </div>
          </div>

          {!isCalculated ? (
            <form onSubmit={handleSettle} className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Calculator size={14} /> Physical Cash Drawer Count (Blind Input)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-sm text-gray-400">K</span>
                  <input
                    type="number"
                    value={enteredCash}
                    onChange={(e) => setEnteredCash(Number(e.target.value))}
                    placeholder="Enter physical cash in drawer..."
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-emerald-400 font-mono font-bold text-base focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Count physical bills and coin rolls without looking at system telemetry.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25"
              >
                Perform Blind Reconciliation
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {/* Reconciliation Breakdown */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>RFID Prepaid Auto-Deductions:</span>
                  <span className="font-mono font-bold text-cyan-300">K{systemRfidPrepaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Booth Dynamic MMQR Collections:</span>
                  <span className="font-mono font-bold text-indigo-300">K{systemMmqrElectronic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>System Expected Cash:</span>
                  <span className="font-mono font-bold text-white">K{systemCashExpected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-300 pt-2 border-t border-white/10 font-bold">
                  <span>Total Shift Revenue:</span>
                  <span className="font-mono text-emerald-400 text-sm">K{systemTotalRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Variance Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                cashDiscrepancy === 0
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div>
                  <p className="text-xs text-gray-400">Physical Cash Variance</p>
                  <p className={`text-lg font-bold font-mono ${cashDiscrepancy === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {cashDiscrepancy === 0 ? 'K0 (100% BALANCED)' : `K${cashDiscrepancy > 0 ? '+' : ''}${cashDiscrepancy.toLocaleString()}`}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
              </div>

              {/* e-Tax Verification QR */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-gray-300">
                <QrCode size={28} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">e-Tax Invoice Batch #YGN-2026-0830-4</p>
                  <p className="text-[11px] text-gray-400">Cryptographically signed by Myanmar IRD Toll Protocol</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCalculated(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs"
                >
                  Recount
                </button>
                <button
                  onClick={handleConfirmShiftClose}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  {isSettled ? '✓ Shift Closed & Signed' : 'Sign & Close Shift'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
