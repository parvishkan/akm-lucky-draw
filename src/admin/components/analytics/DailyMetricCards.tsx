import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, CheckCircle2, Trophy, Clock } from 'lucide-react';

interface DailyMetricCardsProps {
  qrScans: number;
  tokensVerified: number;
  prizesRevealed: number;
  pendingClaims: number;
}

export const DailyMetricCards: React.FC<DailyMetricCardsProps> = ({
  qrScans,
  tokensVerified,
  prizesRevealed,
  pendingClaims
}) => {
  const cards = [
    {
      title: 'QR Scans',
      count: qrScans,
      subtitle: 'Customer entries on date',
      icon: QrCode,
      color: 'border-[#FFD700]/30',
      valueColor: 'text-white'
    },
    {
      title: 'Tokens Verified',
      count: tokensVerified,
      subtitle: 'Receipt tokens validated',
      icon: CheckCircle2,
      color: 'border-[#FFD700]/30',
      valueColor: 'text-[#FFD700]'
    },
    {
      title: 'Prizes Revealed',
      count: prizesRevealed,
      subtitle: 'Revealed winners on date',
      icon: Trophy,
      color: 'border-emerald-500/40',
      valueColor: 'text-emerald-400'
    },
    {
      title: 'Pending Claims',
      count: pendingClaims,
      subtitle: 'Awaiting counter collection',
      icon: Clock,
      color: 'border-amber-500/40',
      valueColor: 'text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 select-none text-left">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`bg-[#17052E]/90 border ${card.color} rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-3 relative overflow-hidden backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-[#D4AF37] uppercase tracking-wider font-mono">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#0D021A] border border-[#FFD700]/25 flex items-center justify-center text-[#FFD700] shadow-inner">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${card.valueColor}`}>
                {card.count.toLocaleString()}
              </span>
              <p className="text-[10px] text-[#A0A0A0] font-sans mt-0.5 truncate">
                {card.subtitle}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DailyMetricCards;
