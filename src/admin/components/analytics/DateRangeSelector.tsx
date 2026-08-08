import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedRange,
  onRangeChange
}) => {
  const ranges = [
    { id: 'TODAY', label: 'Today' },
    { id: 'YESTERDAY', label: 'Yesterday' },
    { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
    { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
    { id: 'CAMPAIGN', label: 'Campaign Period' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap select-none text-left">
      <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider pr-2">
        <Calendar className="w-4 h-4 text-[#FFD700]" />
        <span>Timeframe:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap bg-[#1D0636] p-1 rounded-2xl border border-[#FFD700]/25">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => onRangeChange(r.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedRange === r.id
                ? 'bg-[#FFD700] text-[#0D021A] font-extrabold shadow-gold-glow'
                : 'text-[#A0A0A0] hover:text-white hover:bg-[#0D021A]'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRangeSelector;
