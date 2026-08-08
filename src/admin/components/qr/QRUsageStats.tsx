import React from 'react';
import { QrCode, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const QRUsageStats: React.FC = () => {
  const stats = [
    { title: 'Total QR Scans', value: '2,482', change: '+24% this week', icon: QrCode, color: 'border-[#FFD700]/30', textColor: 'text-white' },
    { title: "Today's Scans", value: '684', change: 'Diwali Rush Peak', icon: Clock, color: 'border-[#FFD700]/30', textColor: 'text-[#FFD700]' },
    { title: 'Verified Tokens', value: '521', change: '76.1% conversion', icon: CheckCircle2, color: 'border-emerald-500/40', textColor: 'text-emerald-400' },
    { title: 'Failed Scans', value: '163', change: 'Invalid entry attempts', icon: XCircle, color: 'border-rose-500/40', textColor: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none text-left">
      {stats.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`bg-[#1D0636]/80 border ${card.color} rounded-2xl p-4 shadow-glass flex flex-col justify-between space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${card.textColor}`}>
                {card.value}
              </span>
              <span className="text-[10px] text-[#A0A0A0] block mt-0.5">{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QRUsageStats;
