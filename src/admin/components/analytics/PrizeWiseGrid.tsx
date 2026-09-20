import React from 'react';
import { Gift, Award } from 'lucide-react';
import { PrizeDistributionItem } from '../../../services/realtimeAnalyticsService';
import { getPrizeImageCandidates, getPrizeDefinition } from '../../../utils/prizeImages';

interface PrizeWiseGridProps {
  prizes: PrizeDistributionItem[];
}

export const PrizeWiseGrid: React.FC<PrizeWiseGridProps> = ({ prizes }) => {
  return (
    <div className="bg-[#17052E]/90 border border-[#FFD700]/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none relative overflow-hidden backdrop-blur-sm">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white tracking-wide">
              Prize-Wise Inventory
            </h3>
            <p className="text-[11px] text-[#A0A0A0]">
              Real-time inventory levels for all 10 production gifts.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#0D021A] px-3 py-1 rounded-full border border-[#FFD700]/30">
          {prizes.length} Active Gifts
        </span>
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        {prizes.map((p) => {
          const total = p.totalQuantity || 100;
          const remaining = p.availableQuantity !== undefined ? p.availableQuantity : total;
          const revealed = p.revealedQuantity !== undefined ? p.revealedQuantity : Math.max(0, total - remaining);
          const pct = total > 0 ? Math.min(100, Math.round((revealed / total) * 100)) : 0;

          // Prize thumbnail
          const candidates = getPrizeImageCandidates(p);
          const def = getPrizeDefinition(p.name);
          const imgSrc = p.imageUrl || p.image || candidates[0] || def?.primaryPath || '';

          return (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-[#0D021A]/90 border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all space-y-2.5"
            >
              <div className="flex items-center gap-3">
                {/* Image / Icon container */}
                <div className="w-10 h-10 rounded-xl bg-[#1D0636] border border-[#FFD700]/25 flex items-center justify-center shrink-0 overflow-hidden p-1">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback on error
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Gift className="w-5 h-5 text-[#FFD700]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-white text-xs truncate">
                      {p.name}
                    </span>
                    <span className="text-[#FFD700] font-bold text-[11px] shrink-0 ml-2">
                      {revealed} / {total} Revealed
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                    {remaining} Remaining
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[#1D0636] rounded-full overflow-hidden p-[1px] border border-[#FFD700]/15">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrizeWiseGrid;
