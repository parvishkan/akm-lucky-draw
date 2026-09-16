import { Prize } from '../data/prizes';

export interface WinnerRecord {
  id?: string;
  winnerId: string;
  tokenId: string;
  tokenCode: string;
  prizeId: string;
  prizeName: string;
  prizeValue?: string;
  claimId: string;
  claimStatus: 'PENDING' | 'CLAIMED' | 'FULFILLED';
  wonAt: string;
  timestamp: any;
  campaignId: string;
}

export class AllocationEngine {
  /**
   * Calls the Vercel Serverless API /api/reveal-prize to perform trusted server-side blind prize allocation.
   * Sends ONLY { tokenCode }. Does NOT send any prize ID, prize selection, or inventory quantities.
   */
  static async allocatePrize(tokenCode: string): Promise<{ prize: Prize; claimId: string }> {
    const cleanCode = tokenCode.trim().toUpperCase();

    try {
      // Execute POST request to Vercel Serverless API endpoint /api/reveal-prize
      const response = await fetch('/api/reveal-prize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tokenCode: cleanCode })
      });

      const data = await response.json();

      if (response.ok && data && data.success) {
        const p = data.prize;
        const prizeObject: Prize = {
          id: p.id || 'prize-revealed',
          title: p.title || 'Diwali Reward',
          category: p.category || 'Regular Gift',
          value: p.value || '₹2,500',
          description: p.description || '',
          voucherCode: data.claimId,
          iconName: 'gift',
          badgeColor: 'from-amber-400 to-yellow-600',
          image: p.image || p.imageUrl || null,
          imageUrl: p.imageUrl || p.image || null
        };

        return { prize: prizeObject, claimId: data.claimId };
      } else {
        const errorMsg = data?.error || data?.message || 'Server prize allocation failed.';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Server prize allocation error:', err?.message || err);
      throw new Error(err?.message || 'Server prize allocation failed. Please try again.');
    }
  }
}

export default AllocationEngine;
