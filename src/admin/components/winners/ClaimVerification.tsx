import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, Star, AlertCircle, X, Gift } from 'lucide-react';
import { WinnerItem } from './WinnerTable';
import HighValueWarning from './HighValueWarning';
import ClaimStatusBadge from './ClaimStatusBadge';

interface ClaimVerificationProps {
  isOpen: boolean;
  initialClaim?: WinnerItem | null;
  allClaims: WinnerItem[];
  onClose: () => void;
  onInitiateCollection: (claim: WinnerItem, notes: string) => void;
}

export const ClaimVerification: React.FC<ClaimVerificationProps> = ({
  isOpen,
  initialClaim,
  allClaims,
  onClose,
  onInitiateCollection
}) => {
  const [claimInput, setClaimInput] = useState('');
  const [matchedClaim, setMatchedClaim] = useState<WinnerItem | null>(null);
  const [staffNotesText, setStaffNotesText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialClaim) {
      setClaimInput(initialClaim.claimId);
      setMatchedClaim(initialClaim);
      setErrorMsg('');
    } else {
      setClaimInput('');
      setMatchedClaim(null);
      setErrorMsg('');
    }
  }, [initialClaim, isOpen]);

  if (!isOpen) return null;

  const handleLookupClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput.trim()) return;

    const found = allClaims.find(
      (c) => c.claimId.toUpperCase() === claimInput.trim().toUpperCase()
    );

    if (found) {
      setMatchedClaim(found);
      setErrorMsg('');
    } else {
      setMatchedClaim(null);
      setErrorMsg(`No claim found matching ID "${claimInput.trim()}". Please check counter receipt.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-lg bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6 text-left my-8"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Prize Claim Verification</h3>
              <p className="text-[11px] text-[#A0A0A0]">Lookup Claim ID and authenticate counter handover.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claim ID Search Input */}
        <form onSubmit={handleLookupClaim} className="space-y-3">
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            Enter Customer Claim ID
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value.toUpperCase())}
                placeholder="e.g. CLM-8F42K"
                className="w-full pl-10 pr-4 py-3 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-sm font-bold uppercase focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase shrink-0 hover:bg-[#D4AF37] transition-colors cursor-pointer"
            >
              VERIFY CLAIM
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </p>
          )}
        </form>

        {/* Verification Results Display */}
        {matchedClaim && (
          <div className="space-y-4 pt-2">
            
            {/* Status Banner: DUPLICATE PROTECTION CHECK */}
            {matchedClaim.claimStatus === 'CLAIMED' ? (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 space-y-1.5 text-center">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Already Claimed</span>
                </div>
                <p className="text-xs text-white">
                  This prize was already collected on <strong className="text-[#FFD700]">{matchedClaim.claimedAt || 'Recently'}</strong> and verified by <strong className="text-[#FFD700]">{matchedClaim.verifiedBy || 'Authorized Staff'}</strong>.
                </p>
                <span className="text-[10px] text-emerald-300 font-mono block pt-1">
                  DUPLICATE CLAIM PROTECTION ACTIVE — HANDOVER DISABLED
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ Claim Verified & Valid</span>
                  </span>
                  <ClaimStatusBadge status={matchedClaim.claimStatus} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-[#FFD700]/15">
                  <div>Winner ID: <strong className="text-white block">{matchedClaim.id}</strong></div>
                  <div>Token Code: <strong className="text-[#FFD700] block">{matchedClaim.tokenCode}</strong></div>
                  <div className="col-span-2 text-white font-bold text-sm pt-1">
                    Prize: {matchedClaim.prizeName}
                  </div>
                </div>
              </div>
            )}

            {/* High Value Warning if applicable */}
            {matchedClaim.isHighValue && matchedClaim.claimStatus === 'PENDING' && (
              <HighValueWarning />
            )}

            {/* Staff Notes Input */}
            {matchedClaim.claimStatus === 'PENDING' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                  Staff Counter Notes (Optional)
                </label>
                <input
                  type="text"
                  value={staffNotesText}
                  onChange={(e) => setStaffNotesText(e.target.value)}
                  placeholder="e.g. Customer verified with receipt bill #9410"
                  className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFD700]/15">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
              >
                Close
              </button>

              {matchedClaim.claimStatus === 'PENDING' && (
                <button
                  type="button"
                  onClick={() => onInitiateCollection(matchedClaim, staffNotesText)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-xs tracking-widest uppercase shadow-lg cursor-pointer"
                >
                  [ MARK AS CLAIMED ]
                </button>
              )}
            </div>

          </div>
        )}

      </motion.div>
    </div>
  );
};

export default ClaimVerification;
