import { db, collections } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface DashboardMetrics {
  totalTokens: number;
  verifiedTokens: number;
  availableGifts: number;
  totalWinners: number;
  pendingClaims: number;
  claimedGifts: number;
  demoTestsRun: number;
}

export class DashboardService {
  /**
   * Calculates live dashboard metrics directly from Firestore collections
   */
  static async getLiveMetrics(): Promise<DashboardMetrics> {
    try {
      const [tokensSnap, prizesSnap, winnersSnap, claimsSnap] = await Promise.all([
        getDocs(collection(db, collections.TOKENS)),
        getDocs(collection(db, collections.PRIZES)),
        getDocs(collection(db, collections.WINNERS)),
        getDocs(collection(db, collections.CLAIMS))
      ]);

      const tokens = tokensSnap.docs.map(d => d.data()).filter(t => !t.isTest);
      const prizes = prizesSnap.docs.map(d => d.data());
      // Filter out demo/test records to protect production statistics
      const allWinners = winnersSnap.docs.map(d => d.data());
      const winners = allWinners.filter(w => !w.isTest);
      const claims = claimsSnap.docs.map(d => d.data()).filter(c => !c.isTest);
      const demoTestsRun = allWinners.filter(w => w.isTest).length;

      const totalTokens = tokens.length;
      const verifiedTokens = tokens.filter(t => t.status === 'VERIFIED' || t.status === 'USED' || t.status === 'CLAIMED').length;

      let availableGifts = 0;
      prizes.forEach(p => {
        availableGifts += (p.availableQuantity ?? p.remainingStock ?? p.quantity ?? 0);
      });

      const totalWinners = winners.length;
      const pendingClaims = claims.filter(c => (c.claimStatus === 'PENDING' || c.status === 'PENDING')).length;
      const claimedGifts = claims.filter(c => (c.claimStatus === 'CLAIMED' || c.status === 'CLAIMED')).length;

      return {
        totalTokens,
        verifiedTokens,
        availableGifts,
        totalWinners,
        pendingClaims,
        claimedGifts,
        demoTestsRun
      };
    } catch (err) {
      console.warn('DashboardService getLiveMetrics fallback:', err);
      return {
        totalTokens: 0,
        verifiedTokens: 0,
        availableGifts: 0,
        totalWinners: 0,
        pendingClaims: 0,
        claimedGifts: 0,
        demoTestsRun: 0
      };
    }
  }
}

export default DashboardService;
