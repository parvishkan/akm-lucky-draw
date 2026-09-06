import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface RevealPrizeRequest {
  tokenCode: string;
}

export interface RevealPrizeResponse {
  success: boolean;
  claimId: string;
  winnerId: string;
  prize: {
    id: string;
    title: string;
    category: string;
    value: string;
    description: string;
    image: string;
  };
}

/**
 * Trusted Server-Side Blind Prize Allocation Callable Cloud Function
 * Evaluates token validity, time slot unlock timestamps, picks an available prize
 * from inventory server-side, and commits atomic transaction (token update + prize stock decrement + winner/claim creation).
 */
export const revealPrize = functions.https.onCall(
  async (data: RevealPrizeRequest, context: functions.https.CallableContext): Promise<RevealPrizeResponse> => {
    const tokenCode = data?.tokenCode ? String(data.tokenCode).trim().toUpperCase() : '';

    if (!tokenCode) {
      throw new functions.https.HttpsError('invalid-argument', 'Token code is required.');
    }

    return await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      // 1. Fetch token document from /tokens/{tokenCode}
      const tokenRef = db.collection('tokens').doc(tokenCode);
      const tokenSnap = await transaction.get(tokenRef);

      if (!tokenSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Token code not recognized.');
      }

      const tokenData = tokenSnap.data() || {};

      if (tokenData.status === 'BLOCKED') {
        throw new functions.https.HttpsError('permission-denied', 'This token code has been deactivated.');
      }

      if (tokenData.status === 'VERIFIED' || tokenData.status === 'USED' || tokenData.status === 'CLAIMED') {
        throw new functions.https.HttpsError('already-exists', 'This token code has already been redeemed.');
      }

      // 2. Fetch Campaign state from /campaigns/{campaignId}
      const campaignId = tokenData.campaignId || 'akm-diwali-2026';
      const campaignRef = db.collection('campaigns').doc(campaignId);
      const campaignSnap = await transaction.get(campaignRef);

      if (!campaignSnap.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'Campaign configuration not found.');
      }

      const campaignData = campaignSnap.data() || {};
      if (campaignData.status !== 'LIVE' || !campaignData.customerAccess) {
        throw new functions.https.HttpsError('unavailable', 'Lucky Draw campaign is currently unavailable.');
      }

      // 3. Fetch Time Slot doc and perform trusted server-time validation
      const slotId = tokenData.slotId || 'slot-day1-morning';
      const slotRef = db.collection('campaigns').doc(campaignId).collection('timeSlots').doc(slotId);
      const slotSnap = await transaction.get(slotRef);

      const nowMillis = Date.now(); // Trusted Google Cloud Server Time

      if (slotSnap.exists) {
        const slotData = slotSnap.data() || {};

        // Server time check for giftUnlock
        if (slotData.giftUnlock) {
          const unlockMillis = slotData.giftUnlock.toDate ? slotData.giftUnlock.toDate().getTime() : new Date(slotData.giftUnlock).getTime();
          if (nowMillis < unlockMillis) {
            const unlockTimeStr = new Date(unlockMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            throw new functions.https.HttpsError(
              'failed-precondition',
              `Gift is locked! Unlock time is ${unlockTimeStr}. Please wait.`
            );
          }
        }

        // Server time check for slotEnd
        if (slotData.slotEnd) {
          const endMillis = slotData.slotEnd.toDate ? slotData.slotEnd.toDate().getTime() : new Date(slotData.slotEnd).getTime();
          if (nowMillis > endMillis) {
            throw new functions.https.HttpsError('deadline-exceeded', 'This time slot has expired.');
          }
        }
      }

      // 4. TRUSTED SERVER-SIDE PRIZE ALLOCATION (Zero Client Control)
      // Query active prizes from /prizes with availableQuantity > 0
      const prizesSnap = await db.collection('prizes').where('status', '==', 'ACTIVE').get();
      const eligiblePrizes = prizesSnap.docs
        .map((d: admin.firestore.QueryDocumentSnapshot) => ({ id: d.id, ref: d.ref, ...d.data() }))
        .filter((p: any) => (p.availableQuantity ?? p.remainingQuantity ?? p.remainingStock ?? 0) > 0);

      if (eligiblePrizes.length === 0) {
        throw new functions.https.HttpsError('resource-exhausted', 'No active prizes currently available in inventory.');
      }

      // Server-controlled selection based on available inventory
      const selectedPrize: any = eligiblePrizes[Math.floor(Math.random() * eligiblePrizes.length)];
      const selectedPrizeRef = db.collection('prizes').doc(selectedPrize.id);

      // 5. ATOMIC WRITES (Token update + Prize stock decrement + Winner creation + Claim creation)
      const nowTimestamp = admin.firestore.FieldValue.serverTimestamp();
      const winnerId = `WIN-${Math.floor(100000 + Math.random() * 900000)}`;
      const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`;

      // A. Lock token status to VERIFIED
      transaction.update(tokenRef, {
        status: 'VERIFIED',
        verifiedAt: nowTimestamp,
        winnerId: winnerId,
        claimId: claimId
      });

      // B. Decrement Prize inventory authoritatively on server
      const currentQty = selectedPrize.availableQuantity ?? selectedPrize.remainingQuantity ?? 10;
      transaction.update(selectedPrizeRef, {
        availableQuantity: Math.max(0, currentQty - 1),
        remainingQuantity: Math.max(0, currentQty - 1)
      });

      // C. Create Winner record in /winners/{winnerId}
      const winnerRef = db.collection('winners').doc(winnerId);
      transaction.set(winnerRef, {
        winnerId: winnerId,
        tokenId: tokenCode,
        tokenCode: tokenCode,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name || selectedPrize.title || 'Diwali Reward',
        prizeCategory: selectedPrize.category || 'Regular Gift',
        prizeValue: selectedPrize.value || '₹2,500',
        claimId: claimId,
        claimStatus: 'PENDING',
        wonAt: nowTimestamp
      });

      // D. Create Claim Pass record in /claims/{claimId}
      const claimRef = db.collection('claims').doc(claimId);
      transaction.set(claimRef, {
        claimId: claimId,
        winnerId: winnerId,
        tokenId: tokenCode,
        tokenCode: tokenCode,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name || selectedPrize.title || 'Diwali Reward',
        prizeValue: selectedPrize.value || '₹2,500',
        claimStatus: 'PENDING',
        createdAt: nowTimestamp
      });

      // 6. Return allocation result to client
      return {
        success: true,
        claimId: claimId,
        winnerId: winnerId,
        prize: {
          id: selectedPrize.id,
          title: selectedPrize.name || selectedPrize.title || 'Diwali Reward',
          category: selectedPrize.category || 'Regular Gift',
          value: selectedPrize.value || '₹2,500',
          description: selectedPrize.description || '',
          image: selectedPrize.image || '/akm-logo.png'
        }
      };
    });
  }
);
