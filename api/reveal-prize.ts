import type { VercelRequest, VercelResponse } from '@vercel/node';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK cleanly on server using environment variables
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'akm-lucky-draw';
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (clientEmail && privateKey) {
    const certFn = ((admin as any).credential && (admin as any).credential.cert) ? (admin as any).credential.cert : (admin as any).cert;
    admin.initializeApp({
      credential: certFn({
        projectId,
        clientEmail,
        privateKey
      })
    });
  } else {
    // Default application credentials / environment fallback
    admin.initializeApp({
      projectId
    });
  }
}

const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Method Check
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. POST required.' });
  }

  try {
    const { tokenCode: rawCode } = req.body || {};
    const tokenCode = rawCode ? String(rawCode).trim().toUpperCase() : '';

    if (!tokenCode) {
      return res.status(400).json({ success: false, error: 'Token code is required.' });
    }

    const allocationResult = await db.runTransaction(async (transaction) => {
      // 1. Fetch token doc from /tokens/{tokenCode}
      const tokenRef = db.collection('tokens').doc(tokenCode);
      const tokenSnap = await transaction.get(tokenRef);

      if (!tokenSnap.exists) {
        throw { code: 404, message: 'Token code not recognized.' };
      }

      const tokenData = tokenSnap.data() || {};

      if (tokenData.status === 'BLOCKED') {
        throw { code: 403, message: 'This token code has been deactivated.' };
      }

      if (tokenData.status === 'VERIFIED' || tokenData.status === 'USED' || tokenData.status === 'CLAIMED') {
        throw { code: 409, message: 'This token code has already been redeemed.' };
      }

      // 2. Fetch Campaign state from /campaigns/{campaignId}
      const campaignId = tokenData.campaignId || 'akm-diwali-2026';
      const campaignRef = db.collection('campaigns').doc(campaignId);
      const campaignSnap = await transaction.get(campaignRef);

      if (!campaignSnap.exists) {
        throw { code: 412, message: 'Campaign configuration not found.' };
      }

      const campaignData = campaignSnap.data() || {};
      if (campaignData.status !== 'LIVE' || !campaignData.customerAccess) {
        throw { code: 503, message: 'Lucky Draw campaign is currently unavailable.' };
      }

      // 3. Fetch Time Slot doc and perform trusted server-time validation
      const slotId = tokenData.slotId || 'slot-day1-morning';
      const slotRef = db.collection('campaigns').doc(campaignId).collection('timeSlots').doc(slotId);
      const slotSnap = await transaction.get(slotRef);

      const nowMillis = Date.now(); // Trusted Server Time

      if (slotSnap.exists) {
        const slotData = slotSnap.data() || {};

        // Check giftUnlock
        if (slotData.giftUnlock) {
          const unlockMillis = slotData.giftUnlock.toDate ? slotData.giftUnlock.toDate().getTime() : new Date(slotData.giftUnlock).getTime();
          if (nowMillis < unlockMillis) {
            const unlockTimeStr = new Date(unlockMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            throw { code: 412, message: `Gift is locked! Unlock time is ${unlockTimeStr}. Please wait.` };
          }
        }

        // Check slotEnd
        if (slotData.slotEnd) {
          const endMillis = slotData.slotEnd.toDate ? slotData.slotEnd.toDate().getTime() : new Date(slotData.slotEnd).getTime();
          if (nowMillis > endMillis) {
            throw { code: 410, message: 'This time slot has expired.' };
          }
        }
      }

      // 4. TRUSTED SERVER-SIDE BLIND PRIZE ALLOCATION (Zero Client Parameters)
      const prizesSnap = await db.collection('prizes').where('status', '==', 'ACTIVE').get();
      const eligiblePrizes = prizesSnap.docs
        .map(d => ({ id: d.id, ref: d.ref, ...d.data() }))
        .filter((p: any) => (p.availableQuantity ?? p.remainingQuantity ?? p.remainingStock ?? 0) > 0);

      if (eligiblePrizes.length === 0) {
        throw { code: 507, message: 'No active prizes currently available in inventory.' };
      }

      // Server-side selection from available inventory
      const selectedPrize: any = eligiblePrizes[Math.floor(Math.random() * eligiblePrizes.length)];
      const selectedPrizeRef = db.collection('prizes').doc(selectedPrize.id);

      // 5. ATOMIC WRITES
      const nowTimestamp = admin.firestore.FieldValue.serverTimestamp();
      const winnerId = `WIN-${Math.floor(100000 + Math.random() * 900000)}`;
      const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`;

      // A. Lock Token status to VERIFIED
      transaction.update(tokenRef, {
        status: 'VERIFIED',
        verifiedAt: nowTimestamp,
        winnerId,
        claimId
      });

      // B. Decrement Prize inventory authoritatively
      const currentQty = selectedPrize.availableQuantity ?? selectedPrize.remainingQuantity ?? 10;
      transaction.update(selectedPrizeRef, {
        availableQuantity: Math.max(0, currentQty - 1),
        remainingQuantity: Math.max(0, currentQty - 1)
      });

      // C. Create Winner record in /winners/{winnerId}
      const winnerRef = db.collection('winners').doc(winnerId);
      transaction.set(winnerRef, {
        winnerId,
        tokenId: tokenCode,
        tokenCode,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name || selectedPrize.title || 'Diwali Reward',
        prizeCategory: selectedPrize.category || 'Regular Gift',
        prizeValue: selectedPrize.value || '₹2,500',
        claimId,
        claimStatus: 'PENDING',
        wonAt: nowTimestamp
      });

      // D. Create Claim Pass record in /claims/{claimId}
      const claimRef = db.collection('claims').doc(claimId);
      transaction.set(claimRef, {
        claimId,
        winnerId,
        tokenId: tokenCode,
        tokenCode,
        prizeId: selectedPrize.id,
        prizeName: selectedPrize.name || selectedPrize.title || 'Diwali Reward',
        prizeValue: selectedPrize.value || '₹2,500',
        claimStatus: 'PENDING',
        createdAt: nowTimestamp
      });

      return {
        success: true,
        claimId,
        winnerId,
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

    return res.status(200).json(allocationResult);

  } catch (err: any) {
    const statusCode = err?.code || 500;
    const message = err?.message || err?.error || 'Server prize allocation error.';
    return res.status(statusCode).json({ success: false, error: message });
  }
}
