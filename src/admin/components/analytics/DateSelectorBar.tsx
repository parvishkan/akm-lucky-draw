import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { formatPillDate, toDateKey } from '../../../services/realtimeAnalyticsService';

interface DateSelectorBarProps {
  selectedDate: string; // YYYY-MM-DD
  availableDates: string[]; // array of YYYY-MM-DD
  displayDate: string; // e.g. "20 SEPTEMBER 2026"
  dayOfWeek: string; // e.g. "Sunday"
  onSelectDate: (dateKey: string) => void;
}

export const DateSelectorBar: React.FC<DateSelectorBarProps> = ({
  selectedDate,
  availableDates,
  displayDate,
  dayOfWeek,
  onSelectDate
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const todayKey = toDateKey(new Date());
  const isTodaySelected = selectedDate === todayKey;

  // Center the selected date in the horizontal scroll view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  const handlePrev = () => {
    const idx = availableDates.indexOf(selectedDate);
    if (idx > 0) {
      onSelectDate(availableDates[idx - 1]);
    } else if (idx === -1 && availableDates.length > 0) {
      onSelectDate(availableDates[0]);
    } else {
      // Shift date backward 1 day
      const [y, m, d] = selectedDate.split('-').map(Number);
      const prev = new Date(y, m - 1, d - 1);
      onSelectDate(toDateKey(prev));
    }
  };

  const handleNext = () => {
    const idx = availableDates.indexOf(selectedDate);
    if (idx >= 0 && idx < availableDates.length - 1) {
      onSelectDate(availableDates[idx + 1]);
    } else {
      // Shift date forward 1 day
      const [y, m, d] = selectedDate.split('-').map(Number);
      const next = new Date(y, m - 1, d + 1);
      onSelectDate(toDateKey(next));
    }
  };

  const handleTodayClick = () => {
    onSelectDate(todayKey);
  };

  return (
    <div className="bg-[#120324]/90 border border-[#FFD700]/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 select-none relative overflow-hidden backdrop-blur-md">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Row 1: Header + Today button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1D0636] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest font-mono">
                Campaign Date Focus
              </span>
              {isTodaySelected && (
                <span className="px-2 py-0.5 rounded-full bg-[#FFD700]/20 border border-[#FFD700]/40 text-[#FFD700] text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Live Today
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              {displayDate}
            </h2>
            <p className="text-xs font-semibold text-[#A0A0A0]">
              {dayOfWeek} • Anu Krishna Mall Lucky Draw
            </p>
          </div>
        </div>

        {/* TODAY Shortcut Button */}
        <button
          onClick={handleTodayClick}
          className={`px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            isTodaySelected
              ? 'bg-[#FFD700] text-[#0D021A] font-black shadow-gold-glow'
              : 'bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Today</span>
        </button>
      </div>

      {/* Row 2: Digital Wellbeing horizontal date carousel */}
      <div className="flex items-center gap-2 pt-1">
        {/* Prev Day Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous day"
          className="w-9 h-9 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 hover:border-[#FFD700] text-[#FFD700] flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Date Pills */}
        <div
          ref={scrollContainerRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {availableDates.map((dateKey) => {
            const isSelected = dateKey === selectedDate;
            const isToday = dateKey === todayKey;
            const label = formatPillDate(dateKey);

            return (
              <button
                key={dateKey}
                data-active={isSelected ? 'true' : 'false'}
                onClick={() => onSelectDate(dateKey)}
                className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer flex flex-col items-center gap-0.5 min-w-[76px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FFD700] via-[#FFE169] to-[#FFD700] text-[#0D021A] font-black shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105'
                    : 'bg-[#1D0636]/80 border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white hover:border-[#FFD700]/50 hover:bg-[#1D0636]'
                }`}
              >
                <span className="tracking-wider">{label}</span>
                {isToday && (
                  <span
                    className={`text-[8px] uppercase tracking-widest font-sans font-extrabold ${
                      isSelected ? 'text-[#0D021A]' : 'text-[#FFD700]'
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Next Day Button */}
        <button
          onClick={handleNext}
          aria-label="Next day"
          className="w-9 h-9 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 hover:border-[#FFD700] text-[#FFD700] flex items-center justify-center transition-colors shrink-0 cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DateSelectorBar;
