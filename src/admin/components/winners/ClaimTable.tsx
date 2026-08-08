import React from 'react';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { WinnerItem } from './WinnerTable';
import ClaimStatusBadge from './ClaimStatusBadge';

interface ClaimTableProps {
  claims: WinnerItem[];
  onVerifyClaim: (claim: WinnerItem) => void;
}

export const ClaimTable: React.FC<ClaimTableProps> = ({ claims, onVerifyClaim }) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass select-none">
      
      {/* DESKTOP DATA TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-bold">Claim ID</th>
              <th className="py-3.5 px-4 font-bold">Winner ID</th>
              <th className="py-3.5 px-4 font-bold">Receipt Token</th>
              <th className="py-3.5 px-4 font-bold">Prize Title</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold">Created</th>
              <th className="py-3.5 px-4 font-bold">Claimed At</th>
              <th className="py-3.5 px-4 font-bold">Verified By</th>
              <th className="py-3.5 px-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10">
            {claims.map((item) => (
              <tr key={item.claimId} className="hover:bg-[#0D021A]/60 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#FFD700]">
                  {item.claimId}
                </td>

                <td className="py-3 px-4 font-mono font-bold text-white">
                  {item.id}
                </td>

                <td className="py-3 px-4 font-mono text-[#D4AF37]">
                  {item.tokenCode}
                </td>

                <td className="py-3 px-4 text-white font-medium">
                  <div className="flex items-center gap-1.5">
                    <span>{item.prizeName}</span>
                    {item.isHighValue && <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <ClaimStatusBadge status={item.claimStatus} />
                </td>

                <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                  {item.wonAt}
                </td>

                <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                  {item.claimedAt || '—'}
                </td>

                <td className="py-3 px-4 text-white font-mono text-[11px]">
                  {item.verifiedBy || '—'}
                </td>

                <td className="py-3 px-4 text-right">
                  {item.claimStatus === 'CLAIMED' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold font-mono uppercase opacity-80 cursor-not-allowed">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>✓ Already Claimed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerifyClaim(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-[11px] uppercase tracking-wider hover:shadow-gold-glow transition-all cursor-pointer"
                    >
                      Verify Claim
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="md:hidden divide-y divide-[#FFD700]/15">
        {claims.map((item) => (
          <div key={item.claimId} className="p-4 space-y-3 bg-[#0D021A]/80 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#FFD700]">{item.claimId}</span>
              <ClaimStatusBadge status={item.claimStatus} />
            </div>

            <div className="space-y-1">
              <div className="font-bold text-xs text-white flex items-center gap-1">
                <span>{item.prizeName}</span>
                {item.isHighValue && <Star className="w-3 h-3 fill-[#FFD700]" />}
              </div>
              <div className="text-[11px] font-mono text-[#A0A0A0]">
                Winner: <strong className="text-white">{item.id}</strong> • Token: <strong className="text-[#D4AF37]">{item.tokenCode}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#FFD700]/10 flex justify-end">
              {item.claimStatus === 'CLAIMED' ? (
                <span className="text-[11px] font-mono text-emerald-400 font-bold">✓ Already Claimed</span>
              ) : (
                <button
                  onClick={() => onVerifyClaim(item)}
                  className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase"
                >
                  Verify Claim
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ClaimTable;
