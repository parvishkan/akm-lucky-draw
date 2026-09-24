import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Printer, Sparkles, X } from 'lucide-react';
import { WinnerItem } from './WinnerTable';

interface ClaimSuccessProps {
  claim: WinnerItem;
  onPrintSlip: () => void;
  onClose: () => void;
}

export const ClaimSuccess: React.FC<ClaimSuccessProps> = ({
  claim,
  onPrintSlip,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="p-6 rounded-3xl bg-[#1D0636] border-2 border-emerald-500/50 space-y-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative select-none font-sans"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20"
      >
        <X className="w-4 h-4" />
      </button>

      {/* SVG Animated Checkmark Circle */}
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <CheckCircle2 className="w-9 h-9" />
        </motion.div>
      </div>

      <div className="space-y-1">
        <h3 className="font-heading text-xl font-extrabold text-emerald-400">
          ✓ Prize Successfully Claimed
        </h3>
        <p className="text-xs text-[#A0A0A0]">
          The prize handover has been authenticated and logged in the staff registry.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0D021A] border border-emerald-500/30 text-left space-y-2 font-mono text-xs max-w-sm mx-auto">
        <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
          <span className="text-[#A0A0A0]">Claim ID:</span>
          <strong className="text-[#FFD700]">{claim.claimId}</strong>
        </div>
        <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
          <span className="text-[#A0A0A0]">Winner ID:</span>
          <strong className="text-white">{claim.id}</strong>
        </div>
        <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
          <span className="text-[#A0A0A0]">Prize Title:</span>
          <strong className="text-emerald-300">{claim.prizeName}</strong>
        </div>
        <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
          <span className="text-[#A0A0A0]">Claimed Time:</span>
          <span className="text-white">{claim.claimedAt || 'Recently'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#A0A0A0]">Verified By:</span>
          <span className="text-[#D4AF37] font-bold">{claim.verifiedBy || 'Authorized Staff'}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onPrintSlip}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#0D021A]" />
          <span>🖨 Print Claim Slip</span>
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
        >
          Done
        </button>
      </div>
    </motion.div>
  );
};

export default ClaimSuccess;
