import React from 'react';
import { Flame, Calendar, ShieldCheck, Play, Pause, Square } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/appConfig';

export type CampaignState = 'LIVE' | 'PAUSED' | 'ENDED';

interface CampaignStatusProps {
  status: CampaignState;
  customerAccess: boolean;
  onPauseClick: () => void;
  onResumeClick: () => void;
  onEndClick: () => void;
}

export const CampaignStatus: React.FC<CampaignStatusProps> = ({
  status,
  customerAccess,
  onPauseClick,
  onResumeClick,
  onEndClick
}) => {
  const statusBadge = {
    LIVE: { label: '🟢 LIVE', color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    PAUSED: { label: '🟡 PAUSED', color: 'bg-amber-950/80 border-amber-500/40 text-amber-300' },
    ENDED: { label: '🔴 ENDED', color: 'bg-rose-950/80 border-rose-500/40 text-rose-300' },
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none relative overflow-hidden font-sans">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Campaign Status & Controls</h3>
            <p className="text-[11px] text-[#A0A0A0]">Realtime campaign lifecycle state management.</p>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${statusBadge[status].color}`}>
          {statusBadge[status].label}
        </span>
      </div>

      {/* Grid Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
          <span className="text-[9px] text-[#A0A0A0] uppercase block">Campaign Name</span>
          <span className="text-[#FFD700] font-bold text-sm block">{APP_CONFIG.brand.appName}</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
          <span className="text-[9px] text-[#A0A0A0] uppercase block">Customer Access</span>
          <span className={`font-bold block ${customerAccess ? 'text-emerald-400' : 'text-rose-400'}`}>
            {customerAccess ? '🟢 ENABLED' : '🔴 DISABLED'}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
          <span className="text-[9px] text-[#A0A0A0] uppercase block">Start Date</span>
          <span className="text-white font-bold block">01 October 2026</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
          <span className="text-[9px] text-[#A0A0A0] uppercase block">End Date</span>
          <span className="text-white font-bold block">15 November 2026</span>
        </div>
      </div>

      {/* Status Controls Row */}
      <div className="pt-2 border-t border-[#FFD700]/15 flex items-center gap-3 flex-wrap">
        {status === 'LIVE' && (
          <>
            <button
              onClick={onPauseClick}
              className="px-4 py-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:bg-amber-900/50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4 text-amber-400" />
              <span>Pause Campaign</span>
            </button>

            <button
              onClick={onEndClick}
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4 text-rose-400" />
              <span>End Campaign</span>
            </button>
          </>
        )}

        {status === 'PAUSED' && (
          <>
            <button
              onClick={onResumeClick}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Resume Campaign</span>
            </button>

            <button
              onClick={onEndClick}
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900/50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4 text-rose-400" />
              <span>End Campaign</span>
            </button>
          </>
        )}

        {status === 'ENDED' && (
          <div className="px-4 py-2 rounded-xl bg-[#0D021A] border border-gray-700 text-[#A0A0A0] text-xs font-mono font-bold">
            🔴 Campaign Concluded & Locked
          </div>
        )}
      </div>

    </div>
  );
};

export default CampaignStatus;
