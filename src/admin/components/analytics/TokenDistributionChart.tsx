import React from 'react';
import { Ticket } from 'lucide-react';

export const TokenDistributionChart: React.FC = () => {
  const segments = [
    { label: 'Unused', count: 3420, pct: 26.6, color: 'bg-gray-600' },
    { label: 'Verified', count: 7598, pct: 59.2, color: 'bg-[#FFD700]' },
    { label: 'Claimed', count: 1732, pct: 13.5, color: 'bg-emerald-500' },
    { label: 'Blocked', count: 90, pct: 0.7, color: 'bg-rose-500' },
  ];

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Token Distribution Ratio</h3>
            <p className="text-[11px] text-[#A0A0A0]">Complete breakdown of generated token statuses.</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#FFD700]">12,840 Total</span>
      </div>

      {/* Multi-Segment Stacked Donut Bar */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-[#0D021A] rounded-full overflow-hidden flex gap-1 p-0.5 border border-[#FFD700]/20">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              style={{ width: `${seg.pct}%` }}
              className={`${seg.color} h-full transition-all duration-500`}
              title={`${seg.label}: ${seg.pct}% (${seg.count.toLocaleString()})`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          {segments.map((seg, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/15 space-y-1">
              <span className="text-[10px] text-[#A0A0A0] uppercase block">{seg.label}</span>
              <span className="font-bold text-white block">{seg.count.toLocaleString()}</span>
              <span className="text-[10px] text-[#FFD700] font-bold block">{seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TokenDistributionChart;
