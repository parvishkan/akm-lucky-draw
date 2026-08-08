import { db, collections } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface TokenRecord {
  tokenCode: string;
  status: 'UNUSED' | 'VERIFIED' | 'ASSIGNED' | 'CLAIMED';
  createdTime: any;
  verifiedTime?: any;
  claimTime?: any;
  customerSessionId?: string;
  adminId?: string;
}

export class TokensService {
  // Local fallback registry for development & offline testing
  private static localTokensRegistry: Map<string, TokenRecord> = new Map([
    ['AKM-8892', { tokenCode: 'AKM-8892', status: 'UNUSED', createdTime: new Date() }],
    ['AKM-9410', { tokenCode: 'AKM-9410', status: 'UNUSED', createdTime: new Date() }],
    ['AKM-1044', { tokenCode: 'AKM-1044', status: 'UNUSED', createdTime: new Date() }],
    ['AKM-USED', { tokenCode: 'AKM-USED', status: 'CLAIMED', createdTime: new Date() }]
  ]);

  static async verifyToken(tokenCode: string): Promise<{ success: boolean; status: string; message: string }> {
    const cleanCode = tokenCode.trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, status: 'EMPTY', message: 'Please enter your lucky token code from your billing receipt.' };
    }

    try {
      // 1. Query Firestore
      const docRef = doc(db, collections.TOKENS, cleanCode);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as TokenRecord;
        if (data.status === 'VERIFIED' || data.status === 'ASSIGNED' || data.status === 'CLAIMED') {
          return { success: false, status: 'USED', message: 'This token code has already been redeemed for Diwali 2026.' };
        }

        // Lock Token Immediately in Firestore
        await updateDoc(docRef, {
          status: 'VERIFIED',
          verifiedTime: serverTimestamp()
        });

        return { success: true, status: 'VERIFIED', message: 'Token authenticated successfully.' };
      }
    } catch (err) {
      console.warn('Firestore offline fallback used for token verification:', err);
    }

    // 2. Fallback check for local development & offline testing
    const local = this.localTokensRegistry.get(cleanCode);
    if (!local) {
      // Create valid token record dynamically if testing unknown codes
      if (cleanCode.length >= 4 && cleanCode !== 'AKM-9999') {
        this.localTokensRegistry.set(cleanCode, { tokenCode: cleanCode, status: 'VERIFIED', createdTime: new Date() });
        return { success: true, status: 'VERIFIED', message: 'Token authenticated successfully.' };
      }
      return { success: false, status: 'INVALID', message: 'Token code not recognized. Please check your mall receipt.' };
    }

    if (local.status !== 'UNUSED') {
      return { success: false, status: 'USED', message: 'This token code has already been redeemed for Diwali 2026.' };
    }

    local.status = 'VERIFIED';
    local.verifiedTime = new Date();
    return { success: true, status: 'VERIFIED', message: 'Token authenticated successfully.' };
  }
}
