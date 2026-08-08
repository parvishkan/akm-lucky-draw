import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Gift, User, ShieldCheck } from 'lucide-react';
import { WinnerItem } from './WinnerTable';
import HighValueWarning from './HighValueWarning';

interface ClaimConfirmationModalProps {
  claim: WinnerItem | null;
  staffNotesText: string;
  onClose: () => void;
  onConfirmCollection: (claim: WinnerItem) => void;
}

export const ClaimConfirmationModal: React.FC<ClaimConfirmationModalProps> = ({
  claim,
  staffNotesText,
  onClose,
  onConfirmCollection
}) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1D0636] border-2 border-[#FFD700]/50 rounded-3xl p-6 max-w-md w-full text-center space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />

        <div className="w-14 h-14 mx-auto rounded-full bg-[#0D021A] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <Gift className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-heading text-lg font-bold text-white">
            Confirm Prize Collection?
          </h3>
          <p className="text-xs text-[#A0A0A0]">
            Are you sure this prize has been physically handed to the customer at the Help Desk counter?
          </p>
        </div>

        {/* High Value Warning if applicable */}
        {claim.isHighValue && <HighValueWarning />}

        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 text-left space-y-2 font-mono text-xs">
          <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
            <span className="text-[#A0A0A0]">Winner ID:</span>
            <span className="text-white font-bold">{claim.id}</span>
          </div>
          <div className="flex justify-between border-b border-[#FFD700]/10 pb-1.5">
            <span className="text-[#A0A0A0]">Prize Title:</span>
            <span className="text-[#FFD700] font-bold">{claim.prizeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A0A0A0]">Claim ID:</span>
            <span className="text-[#D4AF37] font-bold">{claim.claimId}</span>
          </div>
          {staffNotesText && (
            <div className="pt-2 border-t border-[#FFD700]/10 text-[11px] font-sans">
              <span className="text-[#A0A0A0] block text-[10px] uppercase font-bold">Counter Note:</span>
              <span className="text-white italic">{staffNotesText}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirmCollection(claim)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Collection</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ClaimConfirmationModal;
