import React from 'react';
import { cn } from '../../../utilities/cn';

export type TokenStatus = 'UNUSED' | 'VERIFIED' | 'CLAIMED' | 'BLOCKED';

interface StatusBadgeProps {
  status: TokenStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    UNUSED: 'bg-gray-800/80 border-gray-700 text-gray-300',
    VERIFIED: 'bg-[#FFD700]/15 border-[#FFD700]/40 text-[#FFD700]',
    CLAIMED: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    BLOCKED: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
  };

  const labels = {
    UNUSED: 'Unused',
    VERIFIED: 'Verified',
    CLAIMED: 'Claimed',
    BLOCKED: 'Blocked',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
