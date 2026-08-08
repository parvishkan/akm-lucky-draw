import React from 'react';
import { ShieldAlert, AlertOctagon } from 'lucide-react';

interface EmergencyControlsProps {
  accessEnabled: boolean;
  onEmergencyDisable: () => void;
}

export const EmergencyControls: React.FC<EmergencyControlsProps> = ({
  accessEnabled,
  onEmergencyDisable
}) => {
  return (
    <div className="bg-[#1D0636]/90 border border-rose-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 text-left select-none font-sans">
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Emergency Controls</h3>
            <p className="text-[11px] text-[#A0A0A0]">Kill-switch for immediate traffic suspension during rush emergencies.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-500/30 uppercase">
          PROTECTED
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#0D021A] border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="font-bold text-xs text-white block">Emergency Kill-Switch</span>
          <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
            Immediately disables all customer entry attempts across all mall QR codes.
          </p>
        </div>

        <button
          onClick={onEmergencyDisable}
          disabled={!accessEnabled}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer ${
            accessEnabled
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Emergency Disable</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyControls;
