import React, { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { DashboardService, DashboardMetrics } from '../../../services/dashboardService';
import { RealtimeAnalyticsService, toDateKey } from '../../../services/realtimeAnalyticsService';

export const QRUsageStats: React.FC = () => {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalTokens: 1000,
    verifiedTokens: 0,
    availableGifts: 1000,
    totalWinners: 0,
    pendingClaims: 0,
    claimedGifts: 0,
    demoTestsRun: 0,
  });
  const [todayQrScans, setTodayQrScans] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    // Subscribe to live token metrics (/tokens, /prizes, /winners, /claims)
    const unsubDashboard = DashboardService.subscribeToLiveMetrics(
      (metrics) => {
        if (isMounted) {
          setDashboardMetrics(metrics);
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn('[QRUsageStats] Dashboard live metrics subscription error:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    );

    // Subscribe to realtime analytics for today's QR activity
    const todayKey = toDateKey(new Date());
    const unsubAnalytics = RealtimeAnalyticsService.subscribe(
      todayKey,
      (analyticsState) => {
        if (isMounted) {
          setTodayQrScans(analyticsState.dailyData?.qrScans || 0);
        }
      },
      (err) => {
        console.warn('[QRUsageStats] Realtime analytics subscription error:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubDashboard();
      unsubAnalytics();
    };
  }, []);

  // Pre-launch baseline: no persisted total-scan or failed-scan collection exists in Firestore
  const totalScans = 0;
  const failedScans = 0;

  const stats = [
    {
      title: 'Total QR Scans',
      value: isLoading ? '...' : totalScans.toLocaleString(),
      change: hasError ? 'Sync error' : 'Pre-launch baseline',
      icon: QrCode,
      color: 'border-[#FFD700]/30',
      textColor: 'text-white',
    },
    {
      title: "Today's Scans",
      value: isLoading ? '...' : todayQrScans.toLocaleString(),
      change: hasError ? 'Sync error' : (todayQrScans > 0 ? `${todayQrScans.toLocaleString()} scans today` : 'Awaiting official launch'),
      icon: Clock,
      color: 'border-[#FFD700]/30',
      textColor: 'text-[#FFD700]',
    },
    {
      title: 'Verified Tokens',
      value: isLoading ? '...' : dashboardMetrics.verifiedTokens.toLocaleString(),
      change: hasError ? 'Sync error' : (dashboardMetrics.totalTokens > 0
        ? `${dashboardMetrics.verifiedTokens.toLocaleString()} of ${dashboardMetrics.totalTokens.toLocaleString()} tokens`
        : '0 of 1,000 tokens'),
      icon: CheckCircle2,
      color: 'border-emerald-500/40',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Failed Scans',
      value: isLoading ? '...' : failedScans.toLocaleString(),
      change: hasError ? 'Sync error' : '0 invalid attempts',
      icon: XCircle,
      color: 'border-rose-500/40',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none text-left">
      {stats.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`bg-[#1D0636]/80 border ${card.color} rounded-2xl p-4 shadow-glass flex flex-col justify-between space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-7 h-7 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD700]/60" />
                ) : hasError ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            <div>
              <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${card.textColor}`}>
                {card.value}
              </span>
              <span className="text-[10px] text-[#A0A0A0] block mt-0.5">{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QRUsageStats;
