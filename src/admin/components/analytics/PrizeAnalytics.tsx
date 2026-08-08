import React from 'react';
import { Gift } from 'lucide-react';

export const PrizeAnalytics: React.FC = () => {
  const prizes = [
    { name: 'iPhone 16 Pro Max', total: 3, distributed: 1, remaining: 2 },
    { name: 'Grand Gold Coin (24K)', total: 20, distributed: 8, remaining: 12 },
    { name: 'Smart Watch Series 10', total: 10, distributed: 6, remaining: 4 },
    { name: 'Diwali Shopping Voucher', total: 200, distributed: 72, remaining: 128 },
    { name: 'Brass Peacock Diya', total: 200, distributed: 84, remaining: 116 },
  ];

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Prize Inventory Analytics</h3>
            <p className="text-[11px] text-[#A0A0A0]">Distribution velocity per reward item.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {prizes.map((p, idx) => {
          const pct = Math.round((p.distributed / p.total) * 100);
          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{p.name}</span>
                <span className="text-[#FFD700] font-bold text-[11px]">
                  {p.distributed} / {p.total} Distributed ({pct}%)
                </span>
              </div>

              <div className="h-2 w-full bg-[#1D0636] rounded-full overflow-hidden flex border border-[#FFD700]/15">
                <div style={{ width: `${pct}%` }} className="bg-[#FFD700] h-full" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#A0A0A0]">
                <span>Total Stock: <strong className="text-white">{p.total}</strong></span>
                <span>Remaining: <strong className="text-emerald-400">{p.remaining}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PrizeAnalytics;
