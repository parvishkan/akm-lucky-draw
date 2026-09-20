import React from 'react';
import { Activity, QrCode, CheckCircle2, Trophy, Clock, PackageCheck, Info } from 'lucide-react';
import { DailyAnalyticsData } from '../../../services/realtimeAnalyticsService';

interface DailyActivitySectionProps {
  data: DailyAnalyticsData;
}

export const DailyActivitySection: React.FC<DailyActivitySectionProps> = ({ data }) => {
  const hasActivity = data.totalActivityCount > 0;

  // Filter hourly items that actually have events
  const activeHours = data.hourlyActivity.filter((h) => h.totalEvents > 0);
  const maxHourlyCount = Math.max(1, ...data.hourlyActivity.map((h) => h.totalEvents));

  const metrics = [
    { label: 'QR Scans', count: data.qrScans, icon: QrCode, color: 'text-white' },
    { label: 'Token Verifications', count: data.tokensVerified, icon: CheckCircle2, color: 'text-[#FFD700]' },
    { label: 'Prizes Revealed', count: data.prizesRevealed, icon: Trophy, color: 'text-emerald-400' },
    { label: 'Pending Claims', count: data.pendingClaims, icon: Clock, color: 'text-amber-400' },
    { label: 'Collected Gifts', count: data.collectedGifts, icon: PackageCheck, color: 'text-teal-300' }
  ];

  return (
    <div className="bg-[#17052E]/90 border border-[#FFD700]/30 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none relative overflow-hidden backdrop-blur-sm">
      {/* Top subtle golden shimmer line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white tracking-wide">
              Daily Activity
            </h3>
            <p className="text-[11px] text-[#A0A0A0]">
              Operational flow breakdown for {data.displayDate}.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#0D021A] px-3 py-1 rounded-full border border-[#FFD700]/25">
          {data.dayOfWeek}
        </span>
      </div>

      {/* Empty State when no activity on selected date */}
      {!hasActivity ? (
        <div className="py-10 px-4 text-center rounded-2xl bg-[#0D021A]/60 border border-[#FFD700]/15 flex flex-col items-center justify-center space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] mb-1">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-sm font-sans">
            No activity recorded for this date.
          </h4>
          <p className="text-xs text-[#A0A0A0] max-w-sm font-sans">
            Customer entries, token verifications, and prize reveals for this day will automatically appear here once activity occurs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Real Metric Rows */}
          <div className="space-y-2">
            {metrics.map((m, idx) => {
              const IconComp = m.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/15"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1D0636] border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-white font-sans">
                      {m.label}
                    </span>
                  </div>
                  <span className={`text-base font-black font-mono ${m.color}`}>
                    {m.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Real Firestore-derived Hourly Activity (Only shown if activity exists) */}
          {activeHours.length > 0 && (
            <div className="pt-3 border-t border-[#FFD700]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                  Hourly Distribution
                </span>
                <span className="text-[10px] text-[#A0A0A0] font-mono">
                  {data.totalActivityCount} Events Total
                </span>
              </div>

              <div className="h-32 w-full flex items-end justify-between gap-1.5 pt-2 px-1">
                {data.hourlyActivity.map((h, i) => {
                  const heightPct = h.totalEvents > 0 ? Math.max(12, Math.round((h.totalEvents / maxHourlyCount) * 100)) : 4;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[9px] font-mono font-bold text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
                        {h.totalEvents > 0 ? h.totalEvents : ''}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[18px] rounded-t-md transition-all ${
                          h.totalEvents > 0
                            ? 'bg-gradient-to-t from-[#D4AF37] via-[#FFD700] to-[#FFE169] group-hover:shadow-[0_0_10px_rgba(255,215,0,0.8)]'
                            : 'bg-gray-800/40'
                        }`}
                      />
                      <span className="text-[8px] font-mono text-[#A0A0A0] truncate max-w-full">
                        {h.hour24 % 3 === 0 ? h.hourLabel.replace(' ', '') : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyActivitySection;
