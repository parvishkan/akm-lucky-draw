import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import {
  RealtimeAnalyticsService,
  RealtimeAnalyticsState,
  toDateKey,
  formatHeaderDate,
  getDayOfWeek
} from '../../services/realtimeAnalyticsService';
import DateSelectorBar from '../components/analytics/DateSelectorBar';
import DailyMetricCards from '../components/analytics/DailyMetricCards';
import GiftDistributionCard from '../components/analytics/GiftDistributionCard';
import PrizeWiseGrid from '../components/analytics/PrizeWiseGrid';
import DailyActivitySection from '../components/analytics/DailyActivitySection';
import ClaimStatusCard from '../components/analytics/ClaimStatusCard';
import ReportExport from '../components/analytics/ReportExport';

export const AnalyticsPage: React.FC = () => {
  const initialTodayKey = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(initialTodayKey);

  const [state, setState] = useState<RealtimeAnalyticsState>({
    selectedDate: initialTodayKey,
    availableDates: [initialTodayKey],
    dailyData: {
      dateKey: initialTodayKey,
      displayDate: formatHeaderDate(initialTodayKey),
      dayOfWeek: getDayOfWeek(initialTodayKey),
      qrScans: 0,
      tokensVerified: 0,
      prizesRevealed: 0,
      pendingClaims: 0,
      collectedGifts: 0,
      totalActivityCount: 0,
      hourlyActivity: []
    },
    campaignGifts: {
      totalGifts: 1000,
      prizesRevealed: 0,
      pendingClaims: 0,
      giftsCollected: 0,
      giftsRemaining: 1000,
      progressPct: 0
    },
    prizesDistribution: [],
    claimStatus: {
      prizesRevealed: 0,
      claimsPending: 0,
      giftsCollected: 0
    },
    isLoading: true
  });

  // Real-time listener on Firestore collections
  useEffect(() => {
    const unsubscribe = RealtimeAnalyticsService.subscribe(
      selectedDate,
      (updatedState) => {
        setState(updatedState);
      },
      (err) => {
        console.warn('RealtimeAnalytics subscription warning:', err);
      }
    );

    return () => unsubscribe();
  }, [selectedDate]);

  return (
    <div className="space-y-6 sm:space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A] pb-12">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Campaign Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
            Daily Performance Dashboard
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Real-time participant entry metrics, physical gift distribution progress, and daily redemption counter activity.
          </p>
        </div>

        {/* Real-time Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D0636] border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Firestore Sync</span>
          </div>
        </div>
      </div>

      {/* 2. Digital Wellbeing Horizontal Date Selector */}
      <DateSelectorBar
        selectedDate={selectedDate}
        availableDates={state.availableDates}
        displayDate={state.dailyData.displayDate}
        dayOfWeek={state.dailyData.dayOfWeek}
        onSelectDate={(newDate) => setSelectedDate(newDate)}
      />

      {/* Loading Overlay State for initial mount */}
      {state.isLoading && state.prizesDistribution.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          <span className="text-xs font-mono font-bold text-[#A0A0A0]">
            Connecting to Real-Time Campaign Data...
          </span>
        </div>
      ) : (
        <>
          {/* 3. Top Daily Summary Cards (QR Scans, Tokens Verified, Prizes Revealed, Pending Claims) */}
          <DailyMetricCards
            qrScans={state.dailyData.qrScans}
            tokensVerified={state.dailyData.tokensVerified}
            prizesRevealed={state.dailyData.prizesRevealed}
            pendingClaims={state.dailyData.pendingClaims}
          />

          {/* 4. Responsive 2-Column Section (Desktop) / Vertical Stack (Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Left Column: Daily Activity & Claim Status Pipeline */}
            <div className="lg:col-span-6 space-y-6">
              <DailyActivitySection data={state.dailyData} />
              <ClaimStatusCard
                prizesRevealed={state.claimStatus.prizesRevealed}
                claimsPending={state.claimStatus.claimsPending}
                giftsCollected={state.claimStatus.giftsCollected}
              />
            </div>

            {/* Right Column: Gift Distribution Summary & 10 Real Production Prizes */}
            <div className="lg:col-span-6 space-y-6">
              <GiftDistributionCard
                totalGifts={state.campaignGifts.totalGifts}
                prizesRevealed={state.campaignGifts.prizesRevealed}
                pendingClaims={state.campaignGifts.pendingClaims}
                giftsCollected={state.campaignGifts.giftsCollected}
                giftsRemaining={state.campaignGifts.giftsRemaining}
                progressPct={state.campaignGifts.progressPct}
              />
              <PrizeWiseGrid prizes={state.prizesDistribution} />
            </div>

          </div>

          {/* 5. Executive Report Exports */}
          <div className="pt-2">
            <ReportExport />
          </div>
        </>
      )}

    </div>
  );
};

export default AnalyticsPage;
