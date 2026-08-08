import React from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Users } from 'lucide-react';

interface CustomerAccessControlProps {
  accessEnabled: boolean;
  onToggleAccess: () => void;
}

export const CustomerAccessControl: React.FC<CustomerAccessControlProps> = ({
  accessEnabled,
  onToggleAccess
}) => {
  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 text-left select-none font-sans">
      
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Customer Access Gate</h3>
            <p className="text-[11px] text-[#A0A0A0]">Control mobile web application participation.</p>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
          accessEnabled
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-400'
        }`}>
          {accessEnabled ? '🟢 Enabled' : '🔴 Disabled'}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="font-bold text-xs text-white block">Customer Participation Toggle</span>
          <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
            When turned OFF, customer landing page will display: <em>"AKM Lucky Draw is currently unavailable."</em>
          </p>
        </div>

        <button
          onClick={onToggleAccess}
          className={`p-2 rounded-2xl transition-all cursor-pointer ${
            accessEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          {accessEnabled ? (
            <ToggleRight className="w-10 h-10 text-emerald-400" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-gray-500" />
          )}
        </button>
      </div>

    </div>
  );
};

export default CustomerAccessControl;
