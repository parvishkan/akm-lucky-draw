import React from 'react';
import { Star, ShieldAlert } from 'lucide-react';

export const HighValueWarning: React.FC = () => {
  return (
    <div className="p-3.5 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/50 space-y-1 text-left select-none">
      <div className="flex items-center gap-2 text-[#FFD700] font-black text-xs uppercase tracking-wider">
        <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
        <span>⭐ HIGH VALUE PRIZE HANDOVER</span>
      </div>
      <p className="text-[11px] text-[#FFFFFF] leading-relaxed">
        Please verify the customer's identity, receipt token, and Claim ID carefully before handing over this high-value prize.
      </p>
    </div>
  );
};

export default HighValueWarning;
