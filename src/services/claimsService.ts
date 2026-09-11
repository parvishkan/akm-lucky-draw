import { db, collections } from './firebase';
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

export interface ClaimItem {
  id?: string;
  claimId: string;
  tokenId: string;
  tokenCode: string;
  winnerId: string;
  prizeId: string;
  prizeName: string;
  prizeValue?: string;
  claimStatus: 'PENDING' | 'CLAIMED' | 'FULFILLED';
  createdAt: string;
  claimedAt?: string | null;
  verifiedBy?: string;
  staffNotes?: string;
  isTest?: boolean;
}

export class ClaimsService {
  /**
   * Fetch all claim records from Firestore /claims collection
   */
  static async getAllClaims(): Promise<ClaimItem[]> {
    try {
      const snapshot = await getDocs(collection(db, collections.CLAIMS));
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            claimId: data.claimId || d.id,
            tokenId: data.tokenId || data.tokenCode || 'AKM-TOKEN',
            tokenCode: data.tokenCode || data.tokenId || 'AKM-TOKEN',
            winnerId: data.winnerId || 'WIN-000000',
            prizeId: data.prizeId || 'prize-1',
            prizeName: data.prizeName || 'Diwali Gift',
            prizeValue: data.prizeValue || '₹5,000',
            claimStatus: data.claimStatus || data.status || 'PENDING',
            createdAt: data.createdAt || 'Today',
            claimedAt: data.claimedAt,
            verifiedBy: data.verifiedBy,
            staffNotes: data.staffNotes,
            isTest: data.isTest || false
          } as ClaimItem;
        });
      }
    } catch (err) {
      console.warn('Firestore getAllClaims error:', err);
    }
    return [];
  }

  /**
   * Fulfill a pending claim at mall counter (requires Admin authorization)
   */
  static async verifyAndFulfillClaim(
    claimId: string,
    verifiedBy: string = 'Senior Mall Admin',
    staffNotes: string = ''
  ): Promise<{ success: boolean; message: string }> {
    const cleanClaimId = claimId.trim().toUpperCase();

    try {
      const claimRef = doc(db, collections.CLAIMS, cleanClaimId);
      const snap = await getDoc(claimRef);

      if (!snap.exists()) {
        return { success: false, message: `Claim ID "${cleanClaimId}" not found.` };
      }

      const data = snap.data();

      // DUPLICATE CLAIM PROTECTION
      if (data.claimStatus === 'CLAIMED' || data.status === 'CLAIMED') {
        return {
          success: false,
          message: `Claim ${cleanClaimId} was already collected on ${data.claimedAt || 'earlier'} by ${data.verifiedBy || 'Staff'}. Duplicate collection prohibited.`
        };
      }

      const timestampText = new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      // Update Claim Status in Firestore
      await updateDoc(claimRef, {
        claimStatus: 'CLAIMED',
        status: 'CLAIMED',
        claimedAt: timestampText,
        verifiedBy,
        staffNotes,
        updatedAt: serverTimestamp()
      });

      // Also update winner document status if winnerId exists
      if (data.winnerId) {
        try {
          const winnerRef = doc(db, collections.WINNERS, data.winnerId);
          const winnerSnap = await getDoc(winnerRef);
          if (winnerSnap.exists()) {
            await updateDoc(winnerRef, {
              claimStatus: 'CLAIMED',
              claimedAt: timestampText
            });
          }
        } catch (err) {
          console.warn('Winner status update sync warning:', err);
        }
      }

      return { success: true, message: `Claim ${cleanClaimId} successfully fulfilled!` };

    } catch (err: any) {
      console.warn('Firestore error for verifyAndFulfillClaim:', err);
      return { success: false, message: err?.message || 'Failed to update claim status.' };
    }
  }
}

export default ClaimsService;
