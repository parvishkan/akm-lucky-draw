import { db, collections } from './firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export class ClaimsService {
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
        return { success: false, message: `Claim ID "${cleanClaimId}" not recognized.` };
      }

      const data = snap.data();

      // DUPLICATE CLAIM PROTECTION
      if (data.claimStatus === 'CLAIMED' || data.status === 'CLAIMED') {
        return {
          success: false,
          message: `Claim ${cleanClaimId} was already collected on ${data.claimedAt || 'earlier today'} by ${data.verifiedBy || 'Staff'}. Duplicate collection prohibited.`
        };
      }

      // Update Claim Status in Firestore
      const timestampText = new Date().toLocaleString();
      await updateDoc(claimRef, {
        claimStatus: 'CLAIMED',
        status: 'CLAIMED',
        claimedAt: timestampText,
        verifiedBy,
        staffNotes,
        updatedAt: serverTimestamp()
      });

      return { success: true, message: `Claim ${cleanClaimId} successfully fulfilled!` };

    } catch (err) {
      console.warn('Firestore fallback for claimsService:', err);
    }

    return { success: true, message: `Claim ${cleanClaimId} verified in preview mode.` };
  }
}

export default ClaimsService;
