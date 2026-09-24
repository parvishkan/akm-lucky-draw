import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Ticket, Gift, Star, Clock, User, ShieldCheck } from 'lucide-react';
import { WinnerItem } from './WinnerTable';
import ClaimStatusBadge from './ClaimStatusBadge';
import PrizeProductVisual from '../../../components/PrizeProductVisual';

interface WinnerDetailsPanelProps {
  winner: WinnerItem | null;
  onClose: () => void;
}

const formatDisplayDate = (val: any, fallback = 'Today'): string => {
  if (!val) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') {
    try {
      return val.toDate().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return fallback;
    }
  }
  if (typeof val.seconds === 'number') {
    try {
      return new Date(val.seconds * 1000).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return fallback;
    }
  }
  return String(val);
};

export const WinnerDetailsPanel: React.FC<WinnerDetailsPanelProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  const formattedWonAt = formatDisplayDate(winner.wonAt, 'Today');
  const formattedClaimedAt = winner.claimedAt ? formatDisplayDate(winner.claimedAt, '') : undefined;

  const activityLogs = [
    { title: 'Lucky Draw Box Selection', time: formattedWonAt, desc: `Customer opened box and won ${winner.prizeName}.` },
    { title: 'Claim Pass Generated', time: formattedWonAt, desc: `Unique Claim ID ${winner.claimId} generated for Help Desk verification.` },
    ...(formattedClaimedAt ? [{ title: 'Prize Handover Completed', time: formattedClaimedAt, desc: `Verified & fulfilled at counter by ${winner.verifiedBy || 'Authorized Staff'}.` }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm select-none font-sans">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md h-full bg-[#1D0636] border-l border-[#FFD700]/30 shadow-2xl overflow-y-auto p-6 space-y-6 text-left"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Winner Specification</h3>
              <p className="text-[11px] text-[#A0A0A0]">Complete winner record & claim audit.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Winner Hero Card */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/40 space-y-3 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest block">Winner ID</span>
            <span className="font-mono text-xl font-black text-[#FFD700] block">{winner.id}</span>
          </div>

          <div className="pt-1 flex justify-center gap-2">
            <ClaimStatusBadge status={winner.claimStatus} />
            {winner.isHighValue && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D021A] bg-[#FFD700] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Star className="w-3 h-3 fill-[#0D021A]" />
                <span>HIGH VALUE</span>
              </span>
            )}
          </div>
        </div>

        {/* Prize Specification Card */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 space-y-2">
          <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
            Allocated Gift Details
          </span>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <PrizeProductVisual prize={{ name: winner.prizeName, image: winner.prizeImage }} size="sm" alt={winner.prizeName} />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{winner.prizeName}</span>
              <span className="text-[11px] text-[#A0A0A0] font-mono block">{winner.prizeCategory}</span>
            </div>
          </div>
        </div>

        {/* Audit Details Grid */}
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex justify-between">
            <span className="text-[#A0A0A0]">Token Code:</span>
            <span className="text-white font-bold">{winner.tokenCode}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex justify-between">
            <span className="text-[#A0A0A0]">Claim ID:</span>
            <span className="text-[#FFD700] font-bold">{winner.claimId}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex justify-between">
            <span className="text-[#A0A0A0]">Won Timestamp:</span>
            <span className="text-white">{formattedWonAt}</span>
          </div>
          {winner.claimedAt && (
            <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex justify-between">
              <span className="text-[#A0A0A0]">Claimed Timestamp:</span>
              <span className="text-emerald-400 font-bold">{formattedClaimedAt}</span>
            </div>
          )}
          {winner.verifiedBy && (
            <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex justify-between">
              <span className="text-[#A0A0A0]">Verified By Staff:</span>
              <span className="text-white font-bold">{winner.verifiedBy}</span>
            </div>
          )}
        </div>

        {/* Staff Notes */}
        {winner.staffNotes && (
          <div className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">Staff Counter Notes</span>
            <p className="text-xs text-white leading-relaxed">{winner.staffNotes}</p>
          </div>
        )}

        {/* Chronological Activity Stream */}
        <div className="space-y-3 text-xs pt-1">
          <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Activity History Stream</span>
          </h4>

          <div className="space-y-3">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{log.title}</span>
                  <span className="text-[9px] font-mono text-[#D4AF37]">{log.time}</span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-relaxed">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default WinnerDetailsPanel;
