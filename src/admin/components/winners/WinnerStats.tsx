import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckSquare, Sparkles, Star } from 'lucide-react';

interface WinnerStatsProps {
  total: number;
  today: number;
  pending: number;
  claimed: number;
  highValue: number;
}

export const WinnerStats: React.FC<WinnerStatsProps> = ({
  total,
  today,
  pending,
  claimed,
  highValue
}) => {
  const cards = [
    { title: 'Total Winners', count: total, color: 'border-[#FFD700]/30', textColor: 'text-white', icon: Trophy },
    { title: "Today's Winners", count: today, color: 'border-[#FFD700]/30', textColor: 'text-[#FFD700]', icon: Clock },
    { title: 'Pending Claims', count: pending, color: 'border-amber-500/40', textColor: 'text-amber-400', icon: Sparkles },
    { title: 'Completed Claims', count: claimed, color: 'border-emerald-500/40', textColor: 'text-emerald-400', icon: CheckSquare },
    { title: 'High Value Winners', count: highValue, color: 'border-[#FFD700]/50', textColor: 'text-[#FFD700]', icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 select-none">
      {cards.map((card, idx) => {
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
  );
};

export default WinnerStats;
