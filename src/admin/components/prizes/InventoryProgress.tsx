import React from 'react';

interface InventoryProgressProps {
  total: number;
  distributed: number;
  remaining: number;
}

export const InventoryProgress: React.FC<InventoryProgressProps> = ({
  total,
  distributed,
  remaining
}) => {
  const percentage = total > 0 ? Math.min(100, Math.round((distributed / total) * 100)) : 0;
  const remainingPct = 100 - percentage;

  return (
    <div className="space-y-1.5 w-full select-none text-left font-mono">
      <div className="flex items-center justify-between text-[11px] text-[#A0A0A0]">
        <span>Stock Progress</span>
        <span className="text-[#FFD700] font-bold">{remaining} Remaining ({remainingPct}%)</span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="h-2 w-full bg-[#0D021A] rounded-full overflow-hidden flex border border-[#FFD700]/20">
        <div
          style={{ width: `${percentage}%` }}
          className="bg-[#FFD700] h-full transition-all duration-500"
          title={`Distributed: ${distributed} (${percentage}%)`}
        />
        <div
          style={{ width: `${remainingPct}%` }}
          className="bg-emerald-500 h-full transition-all duration-500"
          title={`Remaining: ${remaining} (${remainingPct}%)`}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#A0A0A0] pt-0.5">
        <span>Total: <strong className="text-white">{total}</strong></span>
        <span>Distributed: <strong className="text-[#FFD700]">{distributed}</strong></span>
      </div>
    </div>
  );
};

export default InventoryProgress;
