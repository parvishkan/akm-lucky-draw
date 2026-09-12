import React from 'react';
import { Eye, Star, Trophy } from 'lucide-react';
import ClaimStatusBadge, { ClaimStatus } from './ClaimStatusBadge';

export interface WinnerItem {
  id: string; // e.g. WIN-000428
  tokenCode: string; // e.g. AKM-DW-26-X8K4P
  prizeName: string; // e.g. iPhone 16 Pro Max
  prizeCategory: string;
  prizeImage: string;
  isHighValue: boolean;
  wonAt: string; // e.g. 08 Aug 2026, 11:32 AM
  claimStatus: ClaimStatus;
  claimId: string; // e.g. CLM-8F42K
  claimedAt?: string;
  verifiedBy?: string;
  staffNotes?: string;
  isTest?: boolean;
}

interface WinnerTableProps {
  winners: WinnerItem[];
  onViewDetails: (winner: WinnerItem) => void;
}

const formatDisplayDate = (val: any): string => {
  if (!val) return 'Today';
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
      return 'Today';
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
      return 'Today';
    }
  }
  return String(val);
};

export const WinnerTable: React.FC<WinnerTableProps> = ({ winners, onViewDetails }) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass select-none">
      
      {/* DESKTOP / TABLET DATA TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-bold">Winner ID</th>
              <th className="py-3.5 px-4 font-bold">Receipt Token</th>
              <th className="py-3.5 px-4 font-bold">Prize Awarded</th>
              <th className="py-3.5 px-4 font-bold">Won At</th>
              <th className="py-3.5 px-4 font-bold">Claim Status</th>
              <th className="py-3.5 px-4 font-bold">Claim ID</th>
              <th className="py-3.5 px-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10">
            {winners.map((item) => (
              <tr key={item.id} className="hover:bg-[#0D021A]/60 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{item.id}</span>
                  {item.isTest && (
                    <span className="px-2 py-0.5 rounded-full bg-fuchsia-950/90 border border-fuchsia-500/50 text-fuchsia-300 font-bold text-[10px] uppercase tracking-wider">
                      🧪 TEST
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 font-mono font-bold text-[#FFD700]">
                  {item.tokenCode}
                </td>

                <td className="py-3 px-4 text-white font-medium">
                  <div className="flex items-center gap-1.5">
                    <span>{item.prizeName}</span>
                    {item.isHighValue && (
                      <span title="High Value Prize">
                        <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                  {typeof item.wonAt === 'string' ? item.wonAt : formatDisplayDate(item.wonAt)}
                </td>

                <td className="py-3 px-4">
                  <ClaimStatusBadge status={item.claimStatus} />
                </td>

                <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                  {item.claimId}
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onViewDetails(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 text-[11px] font-semibold transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="md:hidden divide-y divide-[#FFD700]/15">
        {winners.map((item) => (
          <div key={item.id} className="p-4 space-y-3 bg-[#0D021A]/80 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#FFD700]" />
                <span>{item.id}</span>
                {item.isTest && (
                  <span className="px-1.5 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-500/50 text-fuchsia-300 font-bold text-[9px] uppercase tracking-wider">
                    🧪 TEST
                  </span>
                )}
              </span>
              <ClaimStatusBadge status={item.claimStatus} />
            </div>

            <div className="space-y-1">
              <div className="font-bold text-xs text-[#FFD700] flex items-center gap-1">
                <span>{item.prizeName}</span>
                {item.isHighValue && <Star className="w-3 h-3 fill-[#FFD700]" />}
              </div>
              <div className="text-[11px] font-mono text-[#A0A0A0]">
                Token: <strong className="text-white">{item.tokenCode}</strong> • Claim: <strong className="text-[#D4AF37]">{item.claimId}</strong>
              </div>
              <div className="text-[10px] font-mono text-[#A0A0A0]">
                Won At: {typeof item.wonAt === 'string' ? item.wonAt : formatDisplayDate(item.wonAt)}
              </div>
            </div>

            <div className="pt-2 border-t border-[#FFD700]/10 flex justify-end">
              <button
                onClick={() => onViewDetails(item)}
                className="px-3 py-1.5 rounded-lg bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Winner Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WinnerTable;
