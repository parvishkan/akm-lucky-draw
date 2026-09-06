import { db, collections } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { CampaignService } from './campaignService';

export interface TokenRecord {
  id?: string;
  tokenId: string;
  tokenCode: string;
  campaignId: string;
  slotId?: string;
  status: 'AVAILABLE' | 'UNUSED' | 'VERIFIED' | 'USED' | 'CLAIMED' | 'BLOCKED';
  assignedPrizeId?: string;
  assignedPrizeName?: string;
  createdAt: any;
  createdDate?: string;
  verifiedAt?: any;
  verifiedDate?: string;
  winnerId?: string;
  claimId?: string;
  claimStatus?: string;
  prizeTitle?: string;
  claimedDate?: string;
}

export class TokensService {
  /**
   * Fetch all tokens from Firestore /tokens collection
   */
  static async getAllTokens(): Promise<TokenRecord[]> {
    try {
      const snapshot = await getDocs(collection(db, collections.TOKENS));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            tokenId: data.tokenId || d.id,
            tokenCode: data.tokenCode || data.tokenId || d.id,
            campaignId: data.campaignId || 'akm-diwali-2026',
            slotId: data.slotId || 'slot-day1-morning',
            status: data.status || 'AVAILABLE',
            assignedPrizeId: data.assignedPrizeId,
            assignedPrizeName: data.assignedPrizeName || data.prizeTitle,
            prizeTitle: data.assignedPrizeName || data.prizeTitle,
            createdAt: data.createdAt,
            createdDate: data.createdDate || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-GB') : 'Today'),
            verifiedAt: data.verifiedAt,
            verifiedDate: data.verifiedDate,
            winnerId: data.winnerId,
            claimId: data.claimId,
            claimStatus: data.claimStatus,
            claimedDate: data.claimedDate
          } as TokenRecord;
        });
      }
    } catch (err) {
      console.warn('Firestore getAllTokens warning:', err);
    }
    return [];
  }

  /**
   * Verify token eligibility for customer Lucky Draw flow
   */
  static async verifyToken(tokenCode: string): Promise<{ success: boolean; status: string; message: string; tokenData?: TokenRecord }> {
    const cleanCode = tokenCode.trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, status: 'EMPTY', message: 'Please enter your lucky token code from your billing receipt.' };
    }

    try {
      const docRef = doc(db, collections.TOKENS, cleanCode);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as TokenRecord;
        const currentStatus = data.status;

        if (currentStatus === 'BLOCKED') {
          return { success: false, status: 'BLOCKED', message: 'This token code has been deactivated by mall management.' };
        }

        if (currentStatus === 'VERIFIED' || currentStatus === 'USED' || currentStatus === 'CLAIMED') {
          return { success: false, status: 'USED', message: 'This token code has already been redeemed.' };
        }

        return { 
          success: true, 
          status: 'AVAILABLE', 
          message: 'Token authenticated successfully.',
          tokenData: { ...data, id: snapshot.id }
        };
      } else {
        return { success: false, status: 'INVALID', message: 'Token code not recognized. Please check your mall receipt.' };
      }
    } catch (err) {
      console.warn('Firestore token verification error:', err);
      return { success: false, status: 'ERROR', message: 'Unable to connect to verification server. Please try again.' };
    }
  }

  /**
   * Step 2 Blind Token Generation for a specific Campaign Time Slot
   * Generates unassigned tokens with NO prize fields attached prior to customer reveal.
   * Strictly enforces slot.tokenLimit.
   */
  static async generateBatchForSlot(
    campaignId: string,
    slotId: string,
    count: number,
    prefix: string = 'AKM-D1S1-',
    length: number = 5
  ): Promise<{ success: boolean; createdCount: number; message: string }> {
    try {
      if (!campaignId || !slotId) {
        throw new Error('Campaign ID and Time Slot ID are required for token batch generation.');
      }

      // 1. Fetch Time Slot to check tokenLimit constraint
      const timeSlots = await CampaignService.getTimeSlots(campaignId);
      const slot = timeSlots.find(s => s.slotId === slotId || s.id === slotId);
      const tokenLimit = slot?.tokenLimit || 100;

      // 2. Count existing tokens created for this time slot
      const q = query(collection(db, collections.TOKENS), where('slotId', '==', slotId));
      const existingSnap = await getDocs(q);
      const existingCount = existingSnap.size;

      if (existingCount >= tokenLimit) {
        return {
          success: false,
          createdCount: 0,
          message: `Token limit of ${tokenLimit} reached for this time slot (${existingCount}/${tokenLimit} tokens exist).`
        };
      }

      const availableCapacity = tokenLimit - existingCount;
      const countToGenerate = Math.min(count, availableCapacity);

      if (countToGenerate <= 0) {
        return {
          success: false,
          createdCount: 0,
          message: `No additional tokens can be generated. Time slot capacity is full (${existingCount}/${tokenLimit}).`
        };
      }

      // 3. Generate collision-resistant unique tokens (excluding confusing characters O/0, I/1, S/5)
      const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
      const batch = writeBatch(db);
      let createdCount = 0;

      for (let i = 0; i < countToGenerate; i++) {
        let rand = '';
        for (let j = 0; j < length; j++) {
          rand += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const tokenCode = `${prefix}${rand}`;

        // CRITICAL SECURITY REQUIREMENT:
        // Do NOT attach assignedPrizeId, assignedPrizeName, or prizeTitle to the new token!
        const tokenRef = doc(db, collections.TOKENS, tokenCode);
        const tokenPayload: TokenRecord = {
          tokenId: tokenCode,
          tokenCode: tokenCode,
          campaignId: campaignId,
          slotId: slotId,
          status: 'AVAILABLE',
          createdAt: serverTimestamp(),
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        batch.set(tokenRef, tokenPayload);
        createdCount++;
      }

      await batch.commit();

      return {
        success: true,
        createdCount,
        message: `Successfully generated ${createdCount} blind tokens for slot ${slotId} (${existingCount + createdCount}/${tokenLimit} capacity).`
      };
    } catch (err: any) {
      console.error('Failed to generate token batch in Firestore:', err);
      return {
        success: false,
        createdCount: 0,
        message: err?.message || 'Token generation error.'
      };
    }
  }

  /**
   * Backward-compatible token generation fallback
   */
  static async generateBatch(count: number, prefix: string = 'AKM-D26-', length: number = 6): Promise<number> {
    const res = await this.generateBatchForSlot('akm-diwali-2026', 'slot-day1-morning', count, prefix, length);
    return res.createdCount;
  }

  /**
   * Toggle block status for a token in Firestore
   */
  static async toggleBlockStatus(tokenCode: string, currentStatus: string): Promise<void> {
    const newStatus = currentStatus === 'BLOCKED' ? 'AVAILABLE' : 'BLOCKED';
    const docRef = doc(db, collections.TOKENS, tokenCode);
    await updateDoc(docRef, { status: newStatus });
  }

  /**
   * Delete token from Firestore
   */
  static async deleteToken(tokenCode: string): Promise<void> {
    const docRef = doc(db, collections.TOKENS, tokenCode);
    await deleteDoc(docRef);
  }

  /**
   * Bulk block/unblock tokens in Firestore using writeBatch
   */
  static async bulkBlockTokens(tokenCodes: string[], block: boolean = true): Promise<number> {
    if (!tokenCodes || tokenCodes.length === 0) return 0;
    
    const BATCH_SIZE = 500;
    let updatedCount = 0;
    const newStatus = block ? 'BLOCKED' : 'AVAILABLE';

    for (let i = 0; i < tokenCodes.length; i += BATCH_SIZE) {
      const chunk = tokenCodes.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const code of chunk) {
        const docRef = doc(db, collections.TOKENS, code);
        batch.update(docRef, { 
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
      updatedCount += chunk.length;
    }

    return updatedCount;
  }

  /**
   * Bulk delete tokens from Firestore using writeBatch
   */
  static async bulkDeleteTokens(tokenCodes: string[]): Promise<number> {
    if (!tokenCodes || tokenCodes.length === 0) return 0;

    const BATCH_SIZE = 500;
    let deletedCount = 0;

    for (let i = 0; i < tokenCodes.length; i += BATCH_SIZE) {
      const chunk = tokenCodes.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const code of chunk) {
        const docRef = doc(db, collections.TOKENS, code);
        batch.delete(docRef);
      }

      await batch.commit();
      deletedCount += chunk.length;
    }

    return deletedCount;
  }
}

export default TokensService;
