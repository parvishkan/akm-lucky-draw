import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, Moon } from 'lucide-react';

export const HourlyActivityChart: React.FC = () => {
  const hourlyData = [
    { hour: '10 AM', count: 140 },
    { hour: '12 PM', count: 380 },
    { hour: '2 PM', count: 520 },
    { hour: '4 PM', count: 860 },
    { hour: '6 PM', count: 1248, isPeak: true },
    { hour: '8 PM', count: 980 },
  ];

  const maxCount = 1400;

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Participation by Hour (Diwali Crowd)</h3>
            <p className="text-[11px] text-[#A0A0A0]">Hourly breakdown showing shopping peak traffic hours.</p>
          </div>
        </div>
      </div>

      {/* Peak & Lowest Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-[#FFD700]" />
              <span>🔥 Peak Participation</span>
            </span>
            <span className="font-bold text-white block">6:00 PM – 8:00 PM</span>
          </div>
          <span className="font-mono text-base font-extrabold text-[#FFD700]">1,248 Entry Scans</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-[#A0A0A0]" />
              <span>Lowest Traffic Period</span>
            </span>
            <span className="font-bold text-white block">10:00 AM – 11:00 AM</span>
          </div>
          <span className="font-mono text-base font-bold text-[#A0A0A0]">140 Entry Scans</span>
        </div>
      </div>

      {/* Hourly Bar Chart */}
      <div className="h-40 w-full flex items-end justify-between gap-3 pt-3 px-2">
        {hourlyData.map((item, idx) => {
          const heightPct = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-[#FFD700]">
                {item.count}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                className={`w-full rounded-t-xl transition-all ${
                  item.isPeak
                    ? 'bg-gradient-to-t from-[#FFD700] via-[#FFD700] to-white shadow-[0_0_20px_rgba(255,215,0,0.8)]'
                    : 'bg-[#0D021A] border border-[#FFD700]/30 group-hover:border-[#FFD700]'
                }`}
              />
              <span className="text-[10px] font-mono text-[#A0A0A0]">{item.hour}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default HourlyActivityChart;
