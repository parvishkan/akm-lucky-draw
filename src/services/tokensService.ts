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
  onSnapshot,
  serverTimestamp,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { CampaignService } from './campaignService';
import { PrizesService } from './prizesService';

export interface TokenRecord {
  id?: string;
  tokenId: string;
  tokenCode: string;
  campaignId: string;
  slotId?: string;
  status: 'AVAILABLE' | 'UNUSED' | 'VERIFIED' | 'USED' | 'CLAIMED' | 'BLOCKED' | 'REDEEMED';
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
  isTest?: boolean;
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
   * Subscribe to live tokens from Firestore /tokens collection
   */
  static subscribeToTokens(
    onUpdate: (tokens: TokenRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    const colRef = collection(db, collections.TOKENS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: TokenRecord[] = snapshot.docs.map((d) => {
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
          onUpdate(items);
        } else {
          onUpdate([]);
        }
      },
      (err) => {
        console.warn('Firestore tokens onSnapshot error:', err);
        if (onError) onError(err);
      }
    );
  }

  /**
   * Verify token eligibility for customer Lucky Draw flow
   */
  static async verifyToken(tokenCode: string): Promise<{ success: boolean; status: string; message: string; tokenData?: TokenRecord }> {
    const cleanCode = tokenCode.trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, status: 'EMPTY', message: 'Please enter your lucky token code from your billing receipt.' };
    }

    // Isolated Client Verification for Test Tokens
    if (cleanCode.startsWith('TEST-')) {
      try {
        const testDocRef = doc(db, collections.TEST_TOKENS, cleanCode);
        const testSnap = await getDoc(testDocRef);

        if (testSnap.exists()) {
          const testData = testSnap.data() as TokenRecord;
          const currentStatus = testData.status;

          if (currentStatus === 'REDEEMED' || currentStatus === 'VERIFIED' || currentStatus === 'USED' || currentStatus === 'CLAIMED') {
            return { success: false, status: 'USED', message: 'This test token code has already been redeemed.' };
          }

          return {
            success: true,
            status: 'AVAILABLE',
            message: 'Test token verified successfully (Demo Mode).',
            tokenData: { ...testData, id: testSnap.id, isTest: true }
          };
        } else {
          return { success: false, status: 'INVALID', message: 'Test token code not recognized.' };
        }
      } catch (err) {
        console.warn('Test token verification error:', err);
        return { success: false, status: 'ERROR', message: 'Unable to connect to verification server.' };
      }
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
   * Strictly enforces both Prize Inventory Safety Gate and slot.tokenLimit.
   * Chunks writes into Firestore batches of <= 500 documents.
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

      if (!count || count <= 0) {
        return {
          success: false,
          createdCount: 0,
          message: 'Token count must be greater than zero.'
        };
      }

      // 1. PRIZE INVENTORY SAFETY GATE (Atomic Pre-Check)
      // Check available active gifts before touching or creating any token records
      const availableGifts = await PrizesService.getTotalAvailableGifts(campaignId);

      if (availableGifts === 0) {
        return {
          success: false,
          createdCount: 0,
          message: 'Cannot generate tokens: No active gifts are currently available for this campaign.'
        };
      }

      if (count > availableGifts) {
        const shortage = count - availableGifts;
        return {
          success: false,
          createdCount: 0,
          message: `Cannot generate tokens: Requested ${count} tokens exceeds available gift inventory (${availableGifts} available, shortage of ${shortage}).`
        };
      }

      // 2. Fetch Time Slot to check tokenLimit constraint
      const timeSlots = await CampaignService.getTimeSlots(campaignId);
      const slot = timeSlots.find(s => s.slotId === slotId || s.id === slotId);
      const tokenLimit = slot?.tokenLimit || 100;

      // 3. Count existing tokens created for this time slot
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
      if (count > availableCapacity) {
        return {
          success: false,
          createdCount: 0,
          message: `Requested ${count} tokens exceeds available slot capacity (${availableCapacity} remaining for this time slot).`
        };
      }

      // 4. Generate collision-resistant unique tokens (excluding confusing characters O/0, I/1, S/5)
      const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
      const BATCH_SIZE = 500;
      let createdCount = 0;
      const generatedCodes = new Set<string>();
      const tokensToCreate: TokenRecord[] = [];

      for (let i = 0; i < count; i++) {
        let tokenCode = '';
        let attempts = 0;
        do {
          let rand = '';
          for (let j = 0; j < length; j++) {
            rand += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          tokenCode = `${prefix}${rand}`;
          attempts++;
        } while (generatedCodes.has(tokenCode) && attempts < 100);

        generatedCodes.add(tokenCode);

        // CRITICAL SECURITY REQUIREMENT:
        // Do NOT attach assignedPrizeId, assignedPrizeName, or prizeTitle to the new token!
        tokensToCreate.push({
          tokenId: tokenCode,
          tokenCode: tokenCode,
          campaignId: campaignId,
          slotId: slotId,
          status: 'AVAILABLE',
          createdAt: serverTimestamp(),
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });
      }

      // 5. Commit in Firestore batches of <= 500 documents
      for (let i = 0; i < tokensToCreate.length; i += BATCH_SIZE) {
        const chunk = tokensToCreate.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);
        for (const token of chunk) {
          const tokenRef = doc(db, collections.TOKENS, token.tokenCode);
          batch.set(tokenRef, token);
        }
        await batch.commit();
        createdCount += chunk.length;
      }

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

  /**
   * Demo / Test Mode: Generate isolated test tokens into /testTokens collection
   * Never touches production campaign tokens or slot limits.
   */
  static async generateTestTokens(count: 1 | 5 | 10 = 5): Promise<{ success: boolean; tokens: string[]; message: string }> {
    try {
      const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
      const batch = writeBatch(db);
      const generatedCodes: string[] = [];

      for (let i = 0; i < count; i++) {
        // Cryptographically secure random generation
        const randArray = new Uint8Array(5);
        if (typeof window !== 'undefined' && window.crypto) {
          window.crypto.getRandomValues(randArray);
        } else {
          for (let j = 0; j < 5; j++) randArray[j] = Math.floor(Math.random() * 256);
        }

        let randStr = '';
        for (let j = 0; j < 5; j++) {
          randStr += chars[randArray[j] % chars.length];
        }

        const tokenCode = `TEST-AKM-${randStr}`;
        generatedCodes.push(tokenCode);

        const testDocRef = doc(db, collections.TEST_TOKENS, tokenCode);
        batch.set(testDocRef, {
          tokenId: tokenCode,
          tokenCode,
          status: 'AVAILABLE',
          isTest: true,
          createdAt: serverTimestamp(),
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        });
      }

      await batch.commit();

      return {
        success: true,
        tokens: generatedCodes,
        message: `Successfully generated ${count} test token(s) for client demonstration.`
      };
    } catch (err: any) {
      console.error('Failed to generate test tokens:', err);
      return {
        success: false,
        tokens: [],
        message: err?.message || 'Failed to generate test tokens in Firestore.'
      };
    }
  }

  /**
   * Fetch all test tokens from /testTokens
   */
  static async getTestTokens(): Promise<TokenRecord[]> {
    try {
      const snapshot = await getDocs(collection(db, collections.TEST_TOKENS));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            tokenId: data.tokenId || d.id,
            tokenCode: data.tokenCode || data.tokenId || d.id,
            campaignId: 'DEMO-MODE',
            slotId: 'demo-slot',
            status: data.status || 'AVAILABLE',
            assignedPrizeName: data.prizeTitle || 'Demo Prize (Reveals on Unlock)',
            prizeTitle: data.prizeTitle || 'Demo Prize (Reveals on Unlock)',
            createdAt: data.createdAt,
            createdDate: data.createdDate || 'Today',
            verifiedAt: data.redeemedAt,
            winnerId: data.winnerId,
            claimId: data.claimId,
            claimStatus: data.claimStatus,
            isTest: true
          } as TokenRecord;
        });
      }
    } catch (err) {
      console.warn('Firestore getTestTokens error:', err);
    }
    return [];
  }

  /**
   * Subscribe to live test tokens from /testTokens
   */
  static subscribeToTestTokens(
    onUpdate: (tokens: TokenRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    const colRef = collection(db, collections.TEST_TOKENS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: TokenRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              tokenId: data.tokenId || d.id,
              tokenCode: data.tokenCode || data.tokenId || d.id,
              campaignId: 'DEMO-MODE',
              slotId: 'demo-slot',
              status: data.status || 'AVAILABLE',
              assignedPrizeName: data.prizeTitle || 'Demo Prize (Reveals on Unlock)',
              prizeTitle: data.prizeTitle || 'Demo Prize (Reveals on Unlock)',
              createdAt: data.createdAt,
              createdDate: data.createdDate || 'Today',
              verifiedAt: data.redeemedAt,
              winnerId: data.winnerId,
              claimId: data.claimId,
              claimStatus: data.claimStatus,
              isTest: true
            } as TokenRecord;
          });
          onUpdate(items);
        } else {
          onUpdate([]);
        }
      },
      (err) => {
        console.warn('Firestore testTokens onSnapshot error:', err);
        if (onError) onError(err);
      }
    );
  }

  /**
   * Admin-Only: Clear all test data (testTokens, and test records in winners, claims, activityLogs)
   * GUARANTEE: NEVER deletes production tokens, production prizes, or real campaign data.
   */
  static async clearAllTestData(): Promise<{ success: boolean; deletedCount: number; message: string }> {
    try {
      let totalDeleted = 0;

      // 1. Delete all /testTokens
      const testTokensSnap = await getDocs(collection(db, collections.TEST_TOKENS));
      if (!testTokensSnap.empty) {
        const batch1 = writeBatch(db);
        testTokensSnap.docs.forEach((d) => {
          batch1.delete(d.ref);
          totalDeleted++;
        });
        await batch1.commit();
      }

      // 2. Delete test records from /winners where isTest == true
      const testWinnersQ = query(collection(db, collections.WINNERS), where('isTest', '==', true));
      const testWinnersSnap = await getDocs(testWinnersQ);
      if (!testWinnersSnap.empty) {
        const batch2 = writeBatch(db);
        testWinnersSnap.docs.forEach((d) => {
          batch2.delete(d.ref);
          totalDeleted++;
        });
        await batch2.commit();
      }

      // 3. Delete test records from /claims where isTest == true
      const testClaimsQ = query(collection(db, collections.CLAIMS), where('isTest', '==', true));
      const testClaimsSnap = await getDocs(testClaimsQ);
      if (!testClaimsSnap.empty) {
        const batch3 = writeBatch(db);
        testClaimsSnap.docs.forEach((d) => {
          batch3.delete(d.ref);
          totalDeleted++;
        });
        await batch3.commit();
      }

      // 4. Delete test records from /activityLogs where isTest == true
      const testLogsQ = query(collection(db, collections.ACTIVITY_LOGS), where('isTest', '==', true));
      const testLogsSnap = await getDocs(testLogsQ);
      if (!testLogsSnap.empty) {
        const batch4 = writeBatch(db);
        testLogsSnap.docs.forEach((d) => {
          batch4.delete(d.ref);
          totalDeleted++;
        });
        await batch4.commit();
      }

      return {
        success: true,
        deletedCount: totalDeleted,
        message: `Successfully cleared ${totalDeleted} test/demo records. Production data remains 100% untouched.`
      };
    } catch (err: any) {
      console.error('Failed to clear test data:', err);
      return {
        success: false,
        deletedCount: 0,
        message: err?.message || 'Failed to clear test data from Firestore.'
      };
    }
  }
}

export default TokensService;
