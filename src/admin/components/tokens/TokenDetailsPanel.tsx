import React from 'react';
import { motion } from 'framer-motion';
import { X, Ticket, Trophy, Clock, ShieldCheck, User, QrCode, Building2 } from 'lucide-react';
import { TokenItem } from './TokenTable';
import StatusBadge from './StatusBadge';

interface TokenDetailsPanelProps {
  token: TokenItem | null;
  onClose: () => void;
}

export const TokenDetailsPanel: React.FC<TokenDetailsPanelProps> = ({ token, onClose }) => {
  if (!token) return null;

  const activityLogs = [
    { title: 'Token Generated & Issued', time: token.createdDate, desc: 'Batch #2026-08 generated for Anu Krishna Mall billing counters.' },
    ...(token.verifiedDate ? [{ title: 'Token Verified via Web App', time: token.verifiedDate, desc: 'Customer scanned QR and authenticated receipt token.' }] : []),
    ...(token.prizeTitle ? [{ title: 'Prize Allocated by Engine', time: token.verifiedDate || '10:35 AM', desc: `Allocated reward: ${token.prizeTitle}` }] : []),
    ...(token.claimedDate ? [{ title: 'Claim Fulfilled at Help Desk', time: token.claimedDate, desc: `Physical gift handed over for Claim ID ${token.claimId}` }] : []),
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
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Token Specification</h3>
              <p className="text-[11px] text-[#A0A0A0]">Complete lifecycle & redemption metadata.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Token Code Hero Card */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/40 space-y-2 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />
          <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest block">
            Official Receipt Code
          </span>
          <span className="font-mono text-2xl font-black text-[#FFD700] tracking-widest block">
            {token.tokenCode}
          </span>
          <div className="pt-1 flex justify-center">
            <StatusBadge status={token.status} />
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px]">
            Technical Parameters
          </h4>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
              <span className="text-[9px] text-[#A0A0A0] uppercase block">Created Timestamp</span>
              <span className="text-white font-bold block">{token.createdDate}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
              <span className="text-[9px] text-[#A0A0A0] uppercase block">Verified Timestamp</span>
              <span className="text-[#FFD700] font-bold block">{token.verifiedDate || 'Not Verified'}</span>
            </div>
          </div>
        </div>

        {/* Prize & Winner Data */}
        {token.prizeTitle && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px]">
              Reward Allocation & Winner
            </h4>

            <div className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-mono">Allocated Gift</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">Verified Prize</span>
              </div>
              <span className="font-bold text-white text-sm block">{token.prizeTitle}</span>

              {token.claimId && (
                <div className="pt-2 border-t border-[#FFD700]/15 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A0A0A0]">Claim ID:</span>
                  <span className="text-[#FFD700] font-bold">{token.claimId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chronological Activity History */}
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

export default TokenDetailsPanel;
