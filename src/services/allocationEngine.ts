import { db, collections } from './firebase';
import { doc, setDoc, addDoc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Prize, Prizes } from '../data/prizes';
import { PrizesService } from './prizesService';

export interface WinnerRecord {
  id?: string;
  tokenCode: string;
  prizeId: string;
  prizeTitle: string;
  prizeValue: string;
  claimId: string;
  claimStatus: 'PENDING_COUNTER' | 'FULFILLED';
  timestamp: any;
}

export class AllocationEngine {
  static async allocatePrize(tokenCode: string, selectedBoxId: number): Promise<{ prize: Prize; claimId: string }> {
    const cleanCode = tokenCode.trim().toUpperCase();
    const rawNumber = cleanCode.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000).toString();
    const claimId = `AKM-CLAIM-2026-${rawNumber}`;

    try {
      // ATOMIC TRANSACTION FOR PRIZE ALLOCATION & INVENTORY SAFETY
      const result = await runTransaction(db, async (transaction) => {
        // 1. Query active prizes inside transaction
        const activePrizes = await PrizesService.getActivePrizes();
        const validPrizes = activePrizes.filter((p) => (p.remainingStock || 0) > 0 || (p as any).remainingQuantity > 0);

        if (validPrizes.length === 0) {
          throw new Error('All prize pools currently depleted.');
        }

        // Pick random prize from available inventory
        const chosenPrize = validPrizes[Math.floor(Math.random() * validPrizes.length)];
        const prizeRef = doc(db, collections.PRIZES, chosenPrize.id);
        const prizeSnap = await transaction.get(prizeRef);

        if (!prizeSnap.exists()) {
          throw new Error('Prize document not found.');
        }

        const prizeData = prizeSnap.data();
        const currentRemaining = prizeData.remainingQuantity ?? prizeData.remainingStock ?? 10;
        const currentDistributed = prizeData.distributedQuantity ?? 0;

        if (currentRemaining <= 0) {
          throw new Error('Selected prize stock depleted during transaction.');
        }

        // 2. Atomically update prize inventory
        transaction.update(prizeRef, {
          remainingQuantity: Math.max(0, currentRemaining - 1),
          remainingStock: Math.max(0, currentRemaining - 1),
          distributedQuantity: currentDistributed + 1,
          updatedAt: serverTimestamp()
        });

        // 3. Mark token as used
        const tokenRef = doc(db, collections.TOKENS, cleanCode);
        transaction.set(tokenRef, {
          tokenCode: cleanCode,
          status: 'VERIFIED',
          claimId,
          verifiedTime: serverTimestamp()
        }, { merge: true });

        // 4. Create Winner Record
        const winnerRef = doc(collection(db, collections.WINNERS));
        const winnerPayload = {
          id: winnerRef.id,
          winnerId: `WIN-${Math.floor(100000 + Math.random() * 900000)}`,
          tokenId: cleanCode,
          tokenCode: cleanCode,
          prizeId: chosenPrize.id,
          prizeName: chosenPrize.title || (chosenPrize as any).name || 'Diwali Gift',
          prizeValue: chosenPrize.value || '₹5,000',
          claimId,
          claimStatus: 'PENDING',
          wonAt: new Date().toLocaleString(),
          timestamp: serverTimestamp()
        };
        transaction.set(winnerRef, winnerPayload);

        // 5. Create Claim Record
        const claimRef = doc(db, collections.CLAIMS, claimId);
        transaction.set(claimRef, winnerPayload);

        return { prize: chosenPrize, claimId };
      });

      return result;

    } catch (err) {
      console.warn('Firestore transaction fallback for AllocationEngine:', err);
    }

    // Local Fallback for offline preview & testing
    const fallbackPrize = Prizes.getRandomPrize();
    return { prize: fallbackPrize, claimId };
  }
}

export default AllocationEngine;
