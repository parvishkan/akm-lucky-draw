import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { randomBytes } from 'crypto';

// Initialize Firebase Admin SDK cleanly on server using environment variables
function getDb() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'akm-lucky-draw';
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
    } else {
      // Default application credentials / environment fallback
      initializeApp({
        projectId
      });
    }
  }
  return getFirestore();
}

// Approved CORS Origins whitelist
const ALLOWED_ORIGINS = new Set([
  'https://akm-lucky-draw.vercel.app',
  'https://draw.anukrishnamall.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]);

// In-memory failed attempt rate limiter for warm serverless instances
const failedAttemptsMap = new Map<string, { count: number; resetTime: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (req.headers['x-real-ip'] as string) || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = failedAttemptsMap.get(ip);
  if (!entry || now > entry.resetTime) {
    return true;
  }
  return entry.count < MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttemptsMap.get(ip);
  if (!entry || now > entry.resetTime) {
    failedAttemptsMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

type IdPrefix = 'WIN' | 'CLM' | 'TEST-WIN' | 'TEST-CLM';

function generateCryptoId(prefix: IdPrefix): string {
  const timeHex = Date.now().toString(36).toUpperCase();
  const randomHex = randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timeHex}-${randomHex}`;
}

// Strict token pattern: AKMSPA + 3 alphanumeric characters, or TEST token for demo
const TOKEN_REGEX = /^(AKMSPA[A-Z0-9]{3}|TEST-[A-Z0-9-]{5,20})$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const clientIp = getClientIp(req);

  // 1. CORS Validation
  const origin = req.headers.origin;
  if (origin) {
    if (ALLOWED_ORIGINS.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    } else {
      // Reject unauthorized cross-origin requests
      return res.status(403).json({ success: false, error: 'Access forbidden: unauthorized origin.' });
    }
  } else {
    // Same-origin or server-to-server request
    res.setHeader('Access-Control-Allow-Origin', 'https://akm-lucky-draw.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. HTTP Method Handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed. POST required.' });
  }

  // 3. Abuse Prevention / Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many verification attempts. Please wait 1 minute before trying again.'
    });
  }

  try {
    const db = getDb();
    const { tokenCode: rawCode } = req.body || {};
    const tokenCode = rawCode ? String(rawCode).trim().toUpperCase() : '';

    // 4. Input Validation
    if (!tokenCode || !TOKEN_REGEX.test(tokenCode)) {
      recordFailedAttempt(clientIp);
      return res.status(400).json({
        success: false,
        error: 'Invalid token format. Please check your billing receipt.'
      });
    }

    // 5. TEST / DEMO MODE ISOLATED HANDLER
    // Zero impact on production: NEVER touches /tokens or /prizes collections
    const isTestToken = tokenCode.startsWith('TEST-');
    if (isTestToken) {
      const testAllocation = await db.runTransaction(async (transaction) => {
        const testTokenRef = db.collection('testTokens').doc(tokenCode);
        const testSnap = await transaction.get(testTokenRef);

        if (!testSnap.exists) {
          throw { code: 404, message: 'Test token not found. Please verify the code.' };
        }

        const testData = testSnap.data() || {};
        if (testData.status !== 'AVAILABLE' || testData.status === 'REDEEMED' || testData.status === 'CLAIMED' || testData.status === 'USED') {
          throw { code: 409, message: 'This test token code has already been redeemed.' };
        }

        // Demo Prize Pool (Completely separate from real production prizes)
        interface DemoPrize {
          id: string;
          title: string;
          category: string;
          value: string;
          description: string;
          image?: string | null;
          imageUrl?: string | null;
        }

        const DEMO_PRIZES: DemoPrize[] = [
          { id: 'demo-smart-tv', title: 'Demo Smart TV', category: 'Demo Electronics', value: '₹45,000', description: 'Demonstration 55-inch 4K Smart TV' },
          { id: 'demo-furniture', title: 'Demo Furniture', category: 'Demo Home', value: '₹25,000', description: 'Demonstration Luxury Recliner' },
          { id: 'demo-gift-hamper', title: 'Demo Gift Hamper', category: 'Demo Festive Treats', value: '₹5,000', description: 'Demonstration Festive Hamper' },
          { id: 'demo-bt-speaker', title: 'Demo Bluetooth Speaker', category: 'Demo Audio', value: '₹3,500', description: 'Demonstration Portable Speaker' },
          { id: 'demo-special-gift', title: 'Demo Special Gift', category: 'Demo Surprise', value: '₹10,000', description: 'Demonstration Mall Special Gift' }
        ];

        const selectedPrize = DEMO_PRIZES[Math.floor(Math.random() * DEMO_PRIZES.length)];

        // Generate and verify collision-free test IDs
        let winnerId = generateCryptoId('TEST-WIN');
        let winnerRef = db.collection('winners').doc(winnerId);
        let winnerSnap = await transaction.get(winnerRef);
        while (winnerSnap.exists) {
          winnerId = generateCryptoId('TEST-WIN');
          winnerRef = db.collection('winners').doc(winnerId);
          winnerSnap = await transaction.get(winnerRef);
        }

        let claimId = generateCryptoId('TEST-CLM');
        let claimRef = db.collection('claims').doc(claimId);
        let claimSnap = await transaction.get(claimRef);
        while (claimSnap.exists) {
          claimId = generateCryptoId('TEST-CLM');
          claimRef = db.collection('claims').doc(claimId);
          claimSnap = await transaction.get(claimRef);
        }

        const nowTimestamp = FieldValue.serverTimestamp();

        // A. Mark test token CLAIMED
        transaction.update(testTokenRef, {
          status: 'CLAIMED',
          claimedAt: nowTimestamp,
          redeemedAt: nowTimestamp,
          winnerId,
          claimId,
          prizeTitle: selectedPrize.title
        });

        // B. Record Test Winner
        transaction.set(winnerRef, {
          winnerId,
          tokenId: tokenCode,
          tokenCode,
          prizeId: selectedPrize.id,
          prizeName: selectedPrize.title,
          prizeCategory: selectedPrize.category,
          prizeValue: selectedPrize.value,
          claimId,
          claimStatus: 'PENDING',
          wonAt: nowTimestamp,
          isTest: true
        });

        // C. Record Test Claim
        transaction.set(claimRef, {
          claimId,
          winnerId,
          tokenId: tokenCode,
          tokenCode,
          prizeId: selectedPrize.id,
          prizeName: selectedPrize.title,
          prizeValue: selectedPrize.value,
          claimStatus: 'PENDING',
          createdAt: nowTimestamp,
          isTest: true
        });

        // D. Log Demo Activity
        const logRef = db.collection('activityLogs').doc();
        transaction.set(logRef, {
          id: logRef.id,
          type: 'NEW_WINNER',
          title: `🧪 [TEST] Demo Prize "${selectedPrize.title}" Won`,
          user: tokenCode,
          timestamp: nowTimestamp,
          isTest: true,
          details: {
            winnerId,
            claimId,
            tokenCode,
            isTest: true
          }
        });

        return {
          success: true,
          isTest: true,
          claimId,
          winnerId,
          prize: {
            id: selectedPrize.id,
            title: selectedPrize.title,
            category: selectedPrize.category,
            value: selectedPrize.value,
            description: selectedPrize.description,
            image: (selectedPrize.image && selectedPrize.image !== '/akm-logo.png') ? selectedPrize.image : ((selectedPrize.imageUrl && selectedPrize.imageUrl !== '/akm-logo.png') ? selectedPrize.imageUrl : null)
          }
        };
      });

      return res.status(200).json(testAllocation);
    }

    // 6. PRODUCTION LUCKY DRAW ALLOCATION TRANSACTION
    const allocationResult = await db.runTransaction(async (transaction) => {
      // ALL READS MUST OCCUR BEFORE ANY WRITES IN FIRESTORE TRANSACTIONS

      // 1. Fetch token doc from /tokens/{tokenCode}
      const tokenRef = db.collection('tokens').doc(tokenCode);
      const tokenSnap = await transaction.get(tokenRef);

      if (!tokenSnap.exists) {
        throw { code: 404, message: 'Token code not recognized. Please check your billing receipt.' };
      }

      const tokenData = tokenSnap.data() || {};

      if (tokenData.status === 'BLOCKED') {
        throw { code: 403, message: 'This token code has been deactivated.' };
      }

      if (tokenData.status === 'VERIFIED' || tokenData.status === 'USED' || tokenData.status === 'CLAIMED' || tokenData.status === 'REDEEMED') {
        throw { code: 409, message: 'This token code has already been redeemed.' };
      }

      if (tokenData.status !== 'AVAILABLE') {
        throw { code: 409, message: 'This token code is not available for redemption.' };
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

      // 4. TRANSACTION-LOCKED PRIZE SELECTION (Solves Concurrency Overselling)
      // Step A: Fetch active prizes candidate list
      const prizesSnap = await db.collection('prizes').where('status', '==', 'ACTIVE').get();
      if (prizesSnap.empty) {
        throw { code: 507, message: 'No active prizes currently available in inventory.' };
      }

      // Step B: Filter and randomize candidate pool
      const candidateDocs = prizesSnap.docs
        .filter((d) => {
          const data = d.data();
          const qty = Number(data.availableQuantity ?? data.remainingQuantity ?? 0);
          return qty > 0;
        })
        .sort(() => Math.random() - 0.5);

      if (candidateDocs.length === 0) {
        throw { code: 507, message: 'No active prizes currently available in inventory.' };
      }

      // Step C: Lock prize inside transaction using transaction.get()
      let selectedPrizeDoc: FirebaseFirestore.DocumentSnapshot | null = null;
      let selectedPrizeRef: FirebaseFirestore.DocumentReference | null = null;
      let freshAvailableQty = 0;

      for (const candidate of candidateDocs) {
        const pRef = db.collection('prizes').doc(candidate.id);
        const pSnap = await transaction.get(pRef);
        if (pSnap.exists) {
          const pData = pSnap.data() || {};
          const qty = Number(pData.availableQuantity ?? pData.remainingQuantity ?? 0);
          if (pData.status === 'ACTIVE' && qty > 0) {
            selectedPrizeDoc = pSnap;
            selectedPrizeRef = pRef;
            freshAvailableQty = qty;
            break;
          }
        }
      }

      if (!selectedPrizeDoc || !selectedPrizeRef || freshAvailableQty <= 0) {
        throw { code: 507, message: 'All eligible prizes are currently exhausted.' };
      }

      const selectedPrizeData = selectedPrizeDoc.data() || {};

      // 5. Generate and Verify Collision-Free Winner & Claim IDs (Transaction Read Phase)
      let winnerId = generateCryptoId('WIN');
      let winnerRef = db.collection('winners').doc(winnerId);
      let winnerSnap = await transaction.get(winnerRef);
      while (winnerSnap.exists) {
        winnerId = generateCryptoId('WIN');
        winnerRef = db.collection('winners').doc(winnerId);
        winnerSnap = await transaction.get(winnerRef);
      }

      let claimId = generateCryptoId('CLM');
      let claimRef = db.collection('claims').doc(claimId);
      let claimSnap = await transaction.get(claimRef);
      while (claimSnap.exists) {
        claimId = generateCryptoId('CLM');
        claimRef = db.collection('claims').doc(claimId);
        claimSnap = await transaction.get(claimRef);
      }

      // 6. ATOMIC WRITES (Strictly after all transaction reads have succeeded)
      const nowTimestamp = FieldValue.serverTimestamp();
      const decrementedQty = Math.max(0, freshAvailableQty - 1);

      // A. Lock Token status to CLAIMED (prevents reuse)
      transaction.update(tokenRef, {
        status: 'CLAIMED',
        claimedAt: nowTimestamp,
        verifiedAt: nowTimestamp,
        winnerId,
        claimId
      });

      // B. Authoritatively decrement Prize inventory with transactional guarantee
      transaction.update(selectedPrizeRef, {
        availableQuantity: decrementedQty,
        remainingQuantity: decrementedQty,
        remainingStock: decrementedQty,
        ...(decrementedQty === 0 ? { status: 'OUT_OF_STOCK' } : {}),
        updatedAt: nowTimestamp
      });

      const prizeImg = (selectedPrizeData.image && selectedPrizeData.image !== '/akm-logo.png')
        ? selectedPrizeData.image
        : ((selectedPrizeData.imageUrl && selectedPrizeData.imageUrl !== '/akm-logo.png') ? selectedPrizeData.imageUrl : null);

      // C. Create Winner record in /winners/{winnerId}
      transaction.set(winnerRef, {
        winnerId,
        tokenId: tokenCode,
        tokenCode,
        prizeId: selectedPrizeDoc.id,
        prizeName: selectedPrizeData.name || selectedPrizeData.title || 'Diwali Reward',
        prizeCategory: selectedPrizeData.category || 'Regular Gift',
        prizeValue: selectedPrizeData.value || '₹2,500',
        prizeImage: prizeImg,
        claimId,
        claimStatus: 'PENDING',
        wonAt: nowTimestamp,
        isTest: false
      });

      // D. Create Claim Pass record in /claims/{claimId}
      transaction.set(claimRef, {
        claimId,
        winnerId,
        tokenId: tokenCode,
        tokenCode,
        prizeId: selectedPrizeDoc.id,
        prizeName: selectedPrizeData.name || selectedPrizeData.title || 'Diwali Reward',
        prizeValue: selectedPrizeData.value || '₹2,500',
        prizeImage: prizeImg,
        claimStatus: 'PENDING',
        createdAt: nowTimestamp,
        isTest: false
      });

      // E. Audit log entry in /activityLogs
      const activityLogRef = db.collection('activityLogs').doc();
      transaction.set(activityLogRef, {
        id: activityLogRef.id,
        type: 'NEW_WINNER',
        title: `Prize "${selectedPrizeData.name || selectedPrizeData.title || 'Diwali Reward'}" Awarded`,
        user: tokenCode,
        timestamp: nowTimestamp,
        isTest: false,
        details: {
          winnerId,
          claimId,
          tokenCode,
          prizeId: selectedPrizeDoc.id,
          isTest: false
        }
      });

      return {
        success: true,
        claimId,
        winnerId,
        prize: {
          id: selectedPrizeDoc.id,
          title: selectedPrizeData.name || selectedPrizeData.title || 'Diwali Reward',
          category: selectedPrizeData.category || 'Regular Gift',
          value: selectedPrizeData.value || '₹2,500',
          description: selectedPrizeData.description || '',
          image: (selectedPrizeData.image && selectedPrizeData.image !== '/akm-logo.png') ? selectedPrizeData.image : ((selectedPrizeData.imageUrl && selectedPrizeData.imageUrl !== '/akm-logo.png') ? selectedPrizeData.imageUrl : null)
        }
      };
    });

    return res.status(200).json(allocationResult);

  } catch (err: any) {
    recordFailedAttempt(clientIp);
    const statusCode = err?.code || 500;
    const message = err?.message || err?.error || 'Server prize allocation error.';
    return res.status(statusCode).json({ success: false, error: message });
  }
}
