import { db, collections } from './firebase';
import { doc, getDoc, getDocs, collection, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Prize, Prizes } from '../data/prizes';

export interface PrizeDocument extends Prize {
  quantity: number;
  remainingStock: number;
  enabled: boolean;
  priority: number;
  displayOrder: number;
}

export class PrizesService {
  private static localPrizes: PrizeDocument[] = Prizes.getAllPrizes().map((p, idx) => ({
    ...p,
    quantity: 100,
    remainingStock: 50 + idx * 10,
    enabled: true,
    priority: idx + 1,
    displayOrder: idx + 1
  }));

  static async getActivePrizes(): Promise<PrizeDocument[]> {
    try {
      const q = query(collection(db, collections.PRIZES), where('enabled', '==', true));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PrizeDocument));
      }
    } catch (err) {
      console.warn('Firestore offline fallback for active prizes:', err);
    }
    return this.localPrizes.filter(p => p.enabled && p.remainingStock > 0);
  }

  static async addPrize(prizeData: Omit<PrizeDocument, 'id'>): Promise<string> {
    try {
      const ref = await addDoc(collection(db, collections.PRIZES), {
        ...prizeData,
        createdTime: serverTimestamp()
      });
      return ref.id;
    } catch (err) {
      console.warn('Firestore offline fallback for addPrize:', err);
      const newId = `prize-local-${Date.now()}`;
      this.localPrizes.push({ id: newId, ...prizeData });
      return newId;
    }
  }

  static async updatePrizeStock(prizeId: string, decrementBy: number = 1): Promise<void> {
    try {
      const docRef = doc(db, collections.PRIZES, prizeId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const current = snap.data().remainingStock || 0;
        await updateDoc(docRef, {
          remainingStock: Math.max(0, current - decrementBy)
        });
        return;
      }
    } catch (err) {
      console.warn('Firestore offline fallback for updatePrizeStock:', err);
    }

    const local = this.localPrizes.find(p => p.id === prizeId);
    if (local) {
      local.remainingStock = Math.max(0, local.remainingStock - decrementBy);
    }
  }
}
