import React from 'react';
import { cn } from '../../../utilities/cn';

export type PrizeStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

interface PrizeStatusBadgeProps {
  status: PrizeStatus;
  className?: string;
}

export const PrizeStatusBadge: React.FC<PrizeStatusBadgeProps> = ({ status, className }) => {
  const styles = {
    ACTIVE: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
    INACTIVE: 'bg-[#1D0636] border-gray-700 text-gray-400',
    OUT_OF_STOCK: 'bg-rose-950/80 border-rose-500/40 text-rose-400',
  };

  const dots = {
    ACTIVE: '🟢',
    INACTIVE: '⚪',
    OUT_OF_STOCK: '🔴',
  };

  const labels = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    OUT_OF_STOCK: 'Out of Stock',
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

export default PrizeStatusBadge;
