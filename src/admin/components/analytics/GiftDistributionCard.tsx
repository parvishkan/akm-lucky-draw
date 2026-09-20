import React from 'react';
import { Gift, Sparkles, Clock, CheckCircle2, PackageCheck } from 'lucide-react';

interface GiftDistributionCardProps {
  totalGifts: number;
  prizesRevealed: number;
  pendingClaims: number;
  giftsCollected: number;
  giftsRemaining: number;
  progressPct: number;
}

export const GiftDistributionCard: React.FC<GiftDistributionCardProps> = ({
  totalGifts,
  prizesRevealed,
  pendingClaims,
  giftsCollected,
  giftsRemaining,
  progressPct
}) => {
  return (
    <div className="bg-[#17052E]/90 border border-[#FFD700]/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none relative overflow-hidden backdrop-blur-sm">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white tracking-wide">
              Gift Distribution
            </h3>
            <p className="text-[11px] text-[#A0A0A0]">
              Overall physical gift inventory campaign progress.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-black text-[#0D021A] bg-gradient-to-r from-[#FFD700] to-[#FFE169] px-3 py-1 rounded-full shadow-gold-glow">
          {progressPct}% REVEALED
        </span>
      </div>

      {/* Progress Bar (Prizes Revealed / Total Gifts) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-bold">
            {prizesRevealed.toLocaleString()} / {totalGifts.toLocaleString()} Prizes Revealed
          </span>
          <span className="text-[#FFD700] font-bold">
            {progressPct}%
          </span>
        </div>

        <div className="h-3 w-full bg-[#0D021A] rounded-full overflow-hidden p-0.5 border border-[#FFD700]/25">
          <div
            style={{ width: `${Math.min(100, Math.max(progressPct, 0))}%` }}
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#FFE169] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(255,215,0,0.7)]"
          />
        </div>
      </div>

      {/* 5 Summary Counters (Total Gifts, Prizes Revealed, Pending Claims, Gifts Collected, Gifts Remaining) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 pt-1">
        {/* 1. Total Gifts */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/15 space-y-1">
          <div className="flex items-center gap-1 text-[#A0A0A0]">
            <Gift className="w-3 h-3" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold block truncate">
              Total Gifts
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-white block">
            {totalGifts.toLocaleString()}
          </span>
        </div>

        {/* 2. Prizes Revealed */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/30 space-y-1">
          <div className="flex items-center gap-1 text-[#FFD700]">
            <Sparkles className="w-3 h-3" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold block truncate">
              Prizes Revealed
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-[#FFD700] block">
            {prizesRevealed.toLocaleString()}
          </span>
        </div>

        {/* 3. Pending Claims */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0D021A]/80 border border-amber-500/30 space-y-1">
          <div className="flex items-center gap-1 text-amber-400">
            <Clock className="w-3 h-3" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold block truncate">
              Pending Claims
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-amber-300 block">
            {pendingClaims.toLocaleString()}
          </span>
        </div>

        {/* 4. Gifts Collected */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0D021A]/80 border border-emerald-500/30 space-y-1">
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold block truncate">
              Gifts Collected
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-emerald-400 block">
            {giftsCollected.toLocaleString()}
          </span>
        </div>

        {/* 5. Gifts Remaining */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/20 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 text-[#D4AF37]">
            <PackageCheck className="w-3 h-3" />
            <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold block truncate">
              Gifts Remaining
            </span>
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-white block">
            {giftsRemaining.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GiftDistributionCard;
