import React from 'react';
import { Star, Trophy, CheckSquare } from 'lucide-react';

export const HighValuePrizeStats: React.FC = () => {
  const highValuePrizes = [
    { name: 'iPhone 16 Pro Max', total: 3, won: 1, remaining: 2, claimed: 1 },
    { name: 'Grand Gold Coin (24K 1g)', total: 20, won: 15, remaining: 5, claimed: 12 },
    { name: '₹10,000 Diamond Voucher', total: 15, won: 8, remaining: 7, claimed: 6 },
  ];

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />

      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2 text-[#FFD700] font-black text-sm uppercase tracking-wider">
          <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
          <span>⭐ High Value Prize Activity</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
          PROTECTED INVENTORY
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highValuePrizes.map((p, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/30 space-y-3 font-mono">
            <div className="space-y-0.5">
              <span className="font-bold text-white text-xs block font-sans">{p.name}</span>
              <span className="text-[10px] text-[#FFD700] block">High Value Tier</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#FFD700]/15">
              <div>Total: <strong className="text-white">{p.total}</strong></div>
              <div>Won: <strong className="text-[#FFD700]">{p.won}</strong></div>
              <div>Remaining: <strong className="text-emerald-400">{p.remaining}</strong></div>
              <div>Claimed: <strong className="text-emerald-300">{p.claimed}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighValuePrizeStats;
