import React from 'react';
import { ShieldCheck, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

interface ClaimStatusCardProps {
  prizesRevealed: number;
  claimsPending: number;
  giftsCollected: number;
}

export const ClaimStatusCard: React.FC<ClaimStatusCardProps> = ({
  prizesRevealed,
  claimsPending,
  giftsCollected
}) => {
  const collectionRate = prizesRevealed > 0 ? Math.round((giftsCollected / prizesRevealed) * 100) : 0;

  return (
    <div className="bg-[#17052E]/90 border border-[#FFD700]/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none relative overflow-hidden backdrop-blur-sm">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white tracking-wide">
              Claim Status
            </h3>
            <p className="text-[11px] text-[#A0A0A0]">
              Prize reveal to customer collection fulfillment rate.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
          {collectionRate}% Collected
        </span>
      </div>

      {/* 3 Pipeline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Prizes Revealed
            </span>
          </div>
          <span className="text-2xl font-black text-white block">
            {prizesRevealed.toLocaleString()}
          </span>
          <p className="text-[10px] text-[#A0A0A0] font-sans">
            Total mystery boxes unlocked
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D021A]/80 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Claims Pending
            </span>
          </div>
          <span className="text-2xl font-black text-amber-300 block">
            {claimsPending.toLocaleString()}
          </span>
          <p className="text-[10px] text-[#A0A0A0] font-sans">
            Awaiting verification at counter
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0D021A]/80 border border-emerald-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Gifts Collected
            </span>
          </div>
          <span className="text-2xl font-black text-emerald-400 block">
            {giftsCollected.toLocaleString()}
          </span>
          <p className="text-[10px] text-[#A0A0A0] font-sans">
            Handed over & validated by staff
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimStatusCard;
