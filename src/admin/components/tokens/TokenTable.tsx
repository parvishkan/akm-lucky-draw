import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Ban, ShieldCheck, Trophy, ExternalLink } from 'lucide-react';
import StatusBadge, { TokenStatus } from './StatusBadge';

export interface TokenItem {
  id: string;
  tokenCode: string;
  status: TokenStatus;
  createdDate: string;
  verifiedDate?: string;
  prizeTitle?: string;
  winnerId?: string;
  claimId?: string;
  claimStatus?: string;
  claimedDate?: string;
}

interface TokenTableProps {
  tokens: TokenItem[];
  selectedTokenIds: string[];
  onSelectToken: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (token: TokenItem) => void;
  onToggleBlock: (token: TokenItem) => void;
}

export const TokenTable: React.FC<TokenTableProps> = ({
  tokens,
  selectedTokenIds,
  onSelectToken,
  onSelectAll,
  onViewDetails,
  onToggleBlock
}) => {
  const isAllSelected = tokens.length > 0 && selectedTokenIds.length === tokens.length;

  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass select-none">
      
      {/* 1. DESKTOP / TABLET DATA TABLE VIEW (Hidden on Mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-[#FFD700]/40 bg-[#0D021A] text-[#FFD700] focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-bold">Token Code</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold">Created</th>
              <th className="py-3.5 px-4 font-bold">Verified</th>
              <th className="py-3.5 px-4 font-bold">Prize Allocated</th>
              <th className="py-3.5 px-4 font-bold">Claim Status</th>
              <th className="py-3.5 px-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10">
            {tokens.map((item) => {
              const isSelected = selectedTokenIds.includes(item.id);
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#0D021A]/60 transition-colors ${isSelected ? 'bg-[#FFD700]/10' : ''}`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToken(item.id)}
                      className="w-4 h-4 rounded border-[#FFD700]/40 bg-[#0D021A] text-[#FFD700] focus:ring-0 cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white tracking-wider">
                    {item.tokenCode}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                    {item.createdDate}
                  </td>

                  <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                    {item.verifiedDate || '—'}
                  </td>

                  <td className="py-3 px-4 text-white font-medium">
                    {item.prizeTitle || '—'}
                  </td>

                  <td className="py-3 px-4">
                    {item.claimStatus ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                        item.claimStatus === 'FULFILLED'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.claimStatus}
                      </span>
                    ) : (
                      <span className="text-[#A0A0A0] font-mono">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Token Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {item.status === 'BLOCKED' ? (
                        <button
                          onClick={() => onToggleBlock(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Unblock</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleBlock(item)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE CARD LIST VIEW (Shown on Mobile screens) */}
      <div className="md:hidden divide-y divide-[#FFD700]/15">
        {tokens.map((item) => {
          const isSelected = selectedTokenIds.includes(item.id);
          return (
            <div key={item.id} className="p-4 space-y-3 bg-[#0D021A]/80 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectToken(item.id)}
                    className="w-4 h-4 rounded border-[#FFD700]/40 bg-[#0D021A] text-[#FFD700] focus:ring-0"
                  />
                  <span className="font-mono text-sm font-bold text-white">{item.tokenCode}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#A0A0A0] pt-1">
                <div>Created: <span className="text-white">{item.createdDate}</span></div>
                <div>Verified: <span className="text-white">{item.verifiedDate || '—'}</span></div>
                {item.prizeTitle && <div className="col-span-2 text-white font-bold">Prize: {item.prizeTitle}</div>}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FFD700]/10">
                <button
                  onClick={() => onViewDetails(item)}
                  className="px-3 py-1.5 rounded-lg bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TokenTable;
