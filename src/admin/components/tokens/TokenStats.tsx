import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle2, Trophy, Ban, Layers } from 'lucide-react';

interface TokenStatsProps {
  total: number;
  unused: number;
  verified: number;
  claimed: number;
  blocked: number;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  total,
  unused,
  verified,
  claimed,
  blocked
}) => {
  const unusedPct = total > 0 ? Math.round((unused / total) * 100) : 0;
  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  const claimedPct = total > 0 ? Math.round((claimed / total) * 100) : 0;
  const blockedPct = total > 0 ? Math.round((blocked / total) * 100) : 0;

  const statCards = [
    { title: 'Total Tokens', count: total, color: 'border-[#FFD700]/30', textColor: 'text-white', icon: Layers },
    { title: 'Unused', count: unused, color: 'border-gray-700', textColor: 'text-gray-300', icon: Ticket },
    { title: 'Verified', count: verified, color: 'border-[#FFD700]/40', textColor: 'text-[#FFD700]', icon: CheckCircle2 },
    { title: 'Claimed', count: claimed, color: 'border-emerald-500/40', textColor: 'text-emerald-400', icon: Trophy },
    { title: 'Blocked', count: blocked, color: 'border-rose-500/40', textColor: 'text-rose-400', icon: Ban },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-[#1D0636]/80 border ${card.color} rounded-2xl p-4 shadow-glass flex flex-col justify-between space-y-2 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${card.textColor}`}>
                {card.count.toLocaleString()}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Visual Distribution Bar Chart */}
      <div className="bg-[#1D0636]/80 border border-[#FFD700]/20 rounded-2xl p-4 space-y-2.5 shadow-glass">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider">Token Distribution Ratio</span>
          <span className="text-[#A0A0A0] font-mono text-[11px]">100% Campaign Pool</span>
        </div>

        {/* Multi-Segment Stacked Progress Bar */}
        <div className="h-3 w-full bg-[#0D021A] rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-[#FFD700]/15">
          <div style={{ width: `${unusedPct}%` }} className="bg-gray-600 rounded-l-full transition-all duration-500" title={`Unused: ${unusedPct}%`} />
          <div style={{ width: `${verifiedPct}%` }} className="bg-[#FFD700] transition-all duration-500" title={`Verified: ${verifiedPct}%`} />
          <div style={{ width: `${claimedPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Claimed: ${claimedPct}%`} />
          <div style={{ width: `${blockedPct}%` }} className="bg-rose-500 rounded-r-full transition-all duration-500" title={`Blocked: ${blockedPct}%`} />
        </div>

        {/* Legend Row */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] pt-1 flex-wrap gap-2">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-600 inline-block" /> Unused ({unusedPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] inline-block" /> Verified ({verifiedPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Claimed ({claimedPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Blocked ({blockedPct}%)</span>
        </div>
      </div>
    </div>
  );
};

export default TokenStats;
