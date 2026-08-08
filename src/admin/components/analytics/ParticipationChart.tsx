import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';

export const ParticipationChart: React.FC = () => {
  // Demo daily trend points
  const points = [
    { day: '01 Oct', value: 120 },
    { day: '02 Oct', value: 240 },
    { day: '03 Oct', value: 380 },
    { day: '04 Oct', value: 310 },
    { day: '05 Oct', value: 520 },
    { day: '06 Oct', value: 680 },
    { day: '07 Oct', value: 940 },
    { day: '08 Oct', value: 1248 },
  ];

  const maxVal = 1400;

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Customer Participation Trend</h3>
            <p className="text-[11px] text-[#A0A0A0]">Daily Lucky Draw entry volume over campaign duration.</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#0D021A] px-3 py-1 rounded-full border border-[#FFD700]/30">
          +48% GROWTH SPIKE
        </span>
      </div>

      {/* SVG Trend Line & Bar Area Representation */}
      <div className="h-48 w-full flex items-end justify-between gap-2 pt-4 px-2">
        {points.map((pt, idx) => {
          const heightPct = Math.round((pt.value / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
                {pt.value}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className="w-full max-w-[28px] bg-gradient-to-t from-[#FFD700]/30 via-[#FFD700] to-[#FFFFFF] rounded-t-xl group-hover:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all"
              />
              <span className="text-[10px] font-mono text-[#A0A0A0]">{pt.day}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ParticipationChart;
