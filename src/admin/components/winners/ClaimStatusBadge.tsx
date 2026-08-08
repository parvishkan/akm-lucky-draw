import React from 'react';
import { cn } from '../../../utilities/cn';

export type ClaimStatus = 'PENDING' | 'CLAIMED' | 'REJECTED' | 'CANCELLED';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status, className }) => {
  const styles = {
    PENDING: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
    CLAIMED: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    REJECTED: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
    CANCELLED: 'bg-[#1D0636] border-gray-700 text-gray-400',
  };

  const dots = {
    PENDING: '🟡',
    CLAIMED: '🟢',
    REJECTED: '🔴',
    CANCELLED: '⚪',
  };

  const labels = {
    PENDING: 'Pending',
    CLAIMED: 'Claimed',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider',
        styles[status],
        className
      )}
    >
      <span>{dots[status]}</span>
      <span>{labels[status]}</span>
    </span>
  );
};

export default ClaimStatusBadge;
