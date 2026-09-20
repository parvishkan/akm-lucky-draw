import { db, collections } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export interface PrizeDistributionItem {
  id: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  revealedQuantity: number; // totalQuantity - availableQuantity
  imageUrl?: string | null;
  image?: string | null;
}

export interface HourlyActivityItem {
  hourLabel: string; // e.g. "10 AM", "02 PM"
  hour24: number;
  qrScans: number;
  tokenVerifications: number;
  prizesRevealed: number;
  totalEvents: number;
}

export interface DailyAnalyticsData {
  dateKey: string; // YYYY-MM-DD
  displayDate: string; // e.g. "20 SEPTEMBER 2026"
  dayOfWeek: string; // e.g. "Sunday"
  qrScans: number;
  tokensVerified: number;
  prizesRevealed: number; // real /winners records created on date
  pendingClaims: number; // real /claims created on date where claimStatus === "PENDING"
  collectedGifts: number; // real /claims collected on date where claimStatus === "CLAIMED"
  totalActivityCount: number;
  hourlyActivity: HourlyActivityItem[];
}

export interface RealtimeAnalyticsState {
  selectedDate: string; // YYYY-MM-DD
  availableDates: string[]; // List of selectable date keys
  dailyData: DailyAnalyticsData;
  campaignGifts: {
    totalGifts: number; // SUM(totalQuantity) from /prizes
    prizesRevealed: number; // COUNT(!isTest) from /winners
    pendingClaims: number; // COUNT(claimStatus === "PENDING") from /claims
    giftsCollected: number; // COUNT(claimStatus === "CLAIMED") from /claims
    giftsRemaining: number; // SUM(availableQuantity) from /prizes
    progressPct: number; // (prizesRevealed / totalGifts) * 100
  };
  prizesDistribution: PrizeDistributionItem[];
  claimStatus: {
    prizesRevealed: number;
    claimsPending: number;
    giftsCollected: number;
  };
  isLoading: boolean;
}

/**
 * Normalizes any timestamp representation into a JavaScript Date
 */
export function parseTimestampToDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === 'function') return val.toDate();
  if (typeof val.seconds === 'number') return new Date(val.seconds * 1000);
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

/**
 * Formats a Date to YYYY-MM-DD in local time
 */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Formats a Date key (YYYY-MM-DD) to a short pill label: "20 SEP"
 */
export function formatPillDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
}

/**
 * Formats a Date key (YYYY-MM-DD) to header title: "20 SEPTEMBER 2026"
 */
export function formatHeaderDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
}

/**
 * Gets day of week for a Date key: "Sunday"
 */
export function getDayOfWeek(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-GB', { weekday: 'long' });
}

export class RealtimeAnalyticsService {
  /**
   * Generates a list of date keys centered around today and encompassing campaign dates
   */
  static generateDefaultDates(todayKey: string, recordedDateKeys: Set<string>): string[] {
    const datesSet = new Set<string>();

    // Add all dates that have recorded activity
    recordedDateKeys.forEach(k => datesSet.add(k));

    // Ensure a continuous window around today (-3 to +3 days)
    const [ty, tm, td] = todayKey.split('-').map(Number);
    const today = new Date(ty, tm - 1, td);

    for (let offset = -3; offset <= 3; offset++) {
      const target = new Date(today);
      target.setDate(today.getDate() + offset);
      datesSet.add(toDateKey(target));
    }

    return Array.from(datesSet).sort();
  }

  /**
   * Subscribes in real-time to all production Firestore collections
   * and aggregates data dynamically with strict revealed vs collected semantics.
   */
  static subscribe(
    selectedDateKey: string,
    onUpdate: (state: RealtimeAnalyticsState) => void,
    onError?: (err: Error) => void
  ): () => void {
    let prizesDocs: any[] = [];
    let winnersDocs: any[] = [];
    let claimsDocs: any[] = [];
    let tokensDocs: any[] = [];
    let activityLogsDocs: any[] = [];

    const recalculateAndEmit = () => {
      const todayKey = toDateKey(new Date());
      const activeDateKey = selectedDateKey || todayKey;

      // 1. Process Prizes (SUM totalQuantity, SUM availableQuantity)
      let totalGifts = 0;
      let giftsRemaining = 0;

      const prizesDistribution: PrizeDistributionItem[] = prizesDocs
        .filter(p => p.status !== 'INACTIVE')
        .map(p => {
          const total = Number(p.totalQuantity || 100);
          const avail = Number(p.availableQuantity !== undefined ? p.availableQuantity : total);
          const revealed = Math.max(0, total - avail);

          totalGifts += total;
          giftsRemaining += avail;

          return {
            id: p.id || p.prizeId || p.name,
            name: p.name || p.title || 'Diwali Gift',
            totalQuantity: total,
            availableQuantity: avail,
            revealedQuantity: revealed,
            imageUrl: p.imageUrl || null,
            image: p.image || null
          };
        });

      // 2. Production records (strictly filter !isTest)
      const prodWinners = winnersDocs.filter(w => !w.isTest);
      const prodClaims = claimsDocs.filter(c => !c.isTest);
      const prodTokens = tokensDocs.filter(t => !t.isTest);

      // Campaign-wide counts
      const campaignPrizesRevealed = prodWinners.length;
      const campaignPendingClaims = prodClaims.filter(c => c.claimStatus === 'PENDING' || c.status === 'PENDING').length;
      const campaignGiftsCollected = prodClaims.filter(c => c.claimStatus === 'CLAIMED' || c.status === 'CLAIMED').length;

      // Inventory Progress = (Prizes Revealed / Total Gifts) * 100
      const progressPct = totalGifts > 0 ? Number(((campaignPrizesRevealed / totalGifts) * 100).toFixed(1)) : 0;

      // 3. Collect all dates with activity
      const recordedDates = new Set<string>();

      prodWinners.forEach(w => {
        const d = parseTimestampToDate(w.createdAt || w.wonAt);
        if (d) recordedDates.add(toDateKey(d));
      });

      prodClaims.forEach(c => {
        const d = parseTimestampToDate(c.createdAt || c.claimedAt);
        if (d) recordedDates.add(toDateKey(d));
      });

      activityLogsDocs.forEach(l => {
        const d = parseTimestampToDate(l.timestamp);
        if (d) recordedDates.add(toDateKey(d));
      });

      const availableDates = this.generateDefaultDates(todayKey, recordedDates);

      // 4. Compute Metrics for Selected Date
      let dailyQrScans = 0;
      let dailyTokensVerified = 0;
      let dailyPrizesRevealed = 0;
      let dailyPendingClaims = 0;
      let dailyCollectedGifts = 0;

      // Hourly buckets (0 to 23)
      const hourlyMap: { [hour: number]: { qrScans: number; tokenVerifications: number; prizesRevealed: number } } = {};
      for (let h = 0; h < 24; h++) {
        hourlyMap[h] = { qrScans: 0, tokenVerifications: 0, prizesRevealed: 0 };
      }

      // Tally Winners for Selected Date
      prodWinners.forEach(w => {
        const d = parseTimestampToDate(w.createdAt || w.wonAt);
        if (d && toDateKey(d) === activeDateKey) {
          dailyPrizesRevealed++;
          const hour = d.getHours();
          if (hourlyMap[hour]) hourlyMap[hour].prizesRevealed++;
        }
      });

      // Tally Claims for Selected Date
      prodClaims.forEach(c => {
        const createdDate = parseTimestampToDate(c.createdAt);
        if (createdDate && toDateKey(createdDate) === activeDateKey) {
          if (c.claimStatus === 'PENDING' || c.status === 'PENDING') {
            dailyPendingClaims++;
          }
        }
        const claimedDate = parseTimestampToDate(c.claimedAt || c.updatedAt);
        if (claimedDate && toDateKey(claimedDate) === activeDateKey && (c.claimStatus === 'CLAIMED' || c.status === 'CLAIMED')) {
          dailyCollectedGifts++;
        }
      });

      // Tally Activity Logs for Selected Date
      activityLogsDocs.forEach(l => {
        const d = parseTimestampToDate(l.timestamp);
        if (d && toDateKey(d) === activeDateKey) {
          const hour = d.getHours();
          if (l.type === 'QR_SCAN') {
            dailyQrScans++;
            if (hourlyMap[hour]) hourlyMap[hour].qrScans++;
          } else if (l.type === 'TOKEN_VERIFIED') {
            dailyTokensVerified++;
            if (hourlyMap[hour]) hourlyMap[hour].tokenVerifications++;
          }
        }
      });

      // Also check tokens marked as claimed/verified on that date if activity log is missing
      let tokensVerifiedFallback = 0;
      prodTokens.forEach(t => {
        if (t.status === 'VERIFIED' || t.status === 'CLAIMED' || t.status === 'USED') {
          const d = parseTimestampToDate(t.claimedAt || t.verifiedAt || t.createdAt);
          if (d && toDateKey(d) === activeDateKey) {
            tokensVerifiedFallback++;
          }
        }
      });
      dailyTokensVerified = Math.max(dailyTokensVerified, tokensVerifiedFallback);

      // Hourly breakdown items (8 AM to 10 PM)
      const hourlyActivity: HourlyActivityItem[] = [];
      for (let h = 8; h <= 22; h++) {
        const item = hourlyMap[h];
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const hourLabel = `${String(displayH).padStart(2, '0')} ${period}`;
        const totalEvents = item.qrScans + item.tokenVerifications + item.prizesRevealed;
        hourlyActivity.push({
          hourLabel,
          hour24: h,
          qrScans: item.qrScans,
          tokenVerifications: item.tokenVerifications,
          prizesRevealed: item.prizesRevealed,
          totalEvents
        });
      }

      const totalActivityCount = dailyQrScans + dailyTokensVerified + dailyPrizesRevealed + dailyPendingClaims + dailyCollectedGifts;

      onUpdate({
        selectedDate: activeDateKey,
        availableDates,
        dailyData: {
          dateKey: activeDateKey,
          displayDate: formatHeaderDate(activeDateKey),
          dayOfWeek: getDayOfWeek(activeDateKey),
          qrScans: dailyQrScans,
          tokensVerified: dailyTokensVerified,
          prizesRevealed: dailyPrizesRevealed,
          pendingClaims: dailyPendingClaims,
          collectedGifts: dailyCollectedGifts,
          totalActivityCount,
          hourlyActivity
        },
        campaignGifts: {
          totalGifts: totalGifts || 1000,
          prizesRevealed: campaignPrizesRevealed,
          pendingClaims: campaignPendingClaims,
          giftsCollected: campaignGiftsCollected,
          giftsRemaining: giftsRemaining || 1000,
          progressPct
        },
        prizesDistribution,
        claimStatus: {
          prizesRevealed: campaignPrizesRevealed,
          claimsPending: campaignPendingClaims,
          giftsCollected: campaignGiftsCollected
        },
        isLoading: false
      });
    };

    // Subscriptions
    const unsubPrizes = onSnapshot(
      collection(db, collections.PRIZES),
      (snap) => {
        prizesDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        recalculateAndEmit();
      },
      (err) => onError?.(err)
    );

    const unsubWinners = onSnapshot(
      collection(db, collections.WINNERS),
      (snap) => {
        winnersDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        recalculateAndEmit();
      },
      (err) => onError?.(err)
    );

    const unsubClaims = onSnapshot(
      collection(db, collections.CLAIMS),
      (snap) => {
        claimsDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        recalculateAndEmit();
      },
      (err) => onError?.(err)
    );

    const unsubTokens = onSnapshot(
      collection(db, collections.TOKENS),
      (snap) => {
        tokensDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        recalculateAndEmit();
      },
      (err) => onError?.(err)
    );

    const unsubLogs = onSnapshot(
      collection(db, collections.ACTIVITY_LOGS),
      (snap) => {
        activityLogsDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        recalculateAndEmit();
      },
      (err) => onError?.(err)
    );

    return () => {
      unsubPrizes();
      unsubWinners();
      unsubClaims();
      unsubTokens();
      unsubLogs();
    };
  }
}
