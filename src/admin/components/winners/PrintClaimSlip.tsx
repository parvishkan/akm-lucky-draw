import React from 'react';
import { Printer, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { WinnerItem } from './WinnerTable';
import { APP_CONFIG } from '../../../constants/appConfig';

interface PrintClaimSlipProps {
  claim: WinnerItem | null;
  onClose: () => void;
}

export const PrintClaimSlip: React.FC<PrintClaimSlipProps> = ({ claim, onClose }) => {
  if (!claim) return null;

  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="bg-[#1D0636] border-2 border-[#FFD700]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-left space-y-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Slip Container */}
        <div id="printable-claim-slip" className="bg-white text-black p-6 rounded-2xl space-y-4 font-mono border-2 border-black">
          <div className="text-center border-b-2 border-black pb-3 space-y-0.5">
            <h2 className="font-heading text-lg font-black tracking-wider uppercase">
              {APP_CONFIG.brand.mallName}
            </h2>
            <p className="text-[11px] font-bold tracking-widest uppercase">AKM LUCKY DRAW • OFFICIAL CLAIM RECEIPT</p>
            <p className="text-[9px] text-gray-600">Issued at Help Desk Counter #1</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Claim ID:</span>
              <strong className="font-extrabold">{claim.claimId}</strong>
            </div>
            <div className="flex justify-between">
              <span>Winner ID:</span>
              <strong>{claim.id}</strong>
            </div>
            <div className="flex justify-between">
              <span>Receipt Token:</span>
              <strong>{claim.tokenCode}</strong>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-400 pt-2">
              <span>Prize Title:</span>
              <strong className="text-sm font-extrabold">{claim.prizeName}</strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-emerald-700 uppercase">✓ FULFILLED & CLAIMED</strong>
            </div>
            <div className="flex justify-between">
              <span>Claimed Timestamp:</span>
              <span>{claim.claimedAt || '08 Aug 2026, 11:48 AM'}</span>
            </div>
            <div className="flex justify-between">
              <span>Verified By Staff:</span>
              <span>{claim.verifiedBy || 'Senior Mall Admin'}</span>
            </div>
          </div>

          {claim.staffNotes && (
            <div className="pt-2 border-t border-dashed border-gray-400 text-[10px]">
              <span className="font-bold block">Counter Note:</span>
              <p className="italic text-gray-700">{claim.staffNotes}</p>
            </div>
          )}

          <div className="pt-6 flex items-center justify-between text-[9px] text-gray-500 border-t border-black">
            <span>Customer Signature: __________________</span>
            <span>Staff Seal: [ AKM VERIFIED ]</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
          >
            Close
          </button>

          <button
            onClick={handlePrintTrigger}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0D021A]" />
            <span>🖨 Print Claim Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrintClaimSlip;
