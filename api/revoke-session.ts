import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const MASTER_OWNER_UID = 'PXvOs3LHpoaowbgmfqrg2BT15uA2';
const MASTER_OWNER_EMAIL = 'farvishedits@gmail.com';

function initFirebaseAdmin() {
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
      initializeApp({ projectId });
    }
  }
  return {
    db: getFirestore(),
    auth: getAuth()
  };
}

const ALLOWED_ORIGINS = new Set([
  'https://akm-lucky-draw.vercel.app',
  'https://draw.anukrishnamall.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string;
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { db, auth } = initFirebaseAdmin();

    // 1. Verify Caller ID Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    const decodedToken = await auth.verifyIdToken(idToken);
    const callerUid = decodedToken.uid;
    const callerEmail = decodedToken.email || 'unknown';

    // 2. Authorize Caller: Must be the MASTER OWNER
    const callerDoc = await db.collection('admins').doc(callerUid).get();
    const callerRole = callerDoc.data()?.role;
    const isOwner = callerUid === MASTER_OWNER_UID || callerEmail.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase() || callerRole === 'OWNER';

    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: Only the Master Owner is authorized to revoke administrative sessions.' });
    }

    // 3. Parse Request
    const { sessionId, targetUid, targetDeviceId, reason } = req.body || {};
    if (!sessionId || !targetUid) {
      return res.status(400).json({ error: 'Missing required parameters: sessionId and targetUid are required.' });
    }

    // 4. CRITICAL MASTER DEVICE IMMUNITY CHECK
    const sessionDocRef = db.collection('adminSessions').doc(sessionId);
    const sessionSnap = await sessionDocRef.get();

    const isTargetMasterSession = sessionSnap.exists && sessionSnap.data()?.isMasterDevice === true;
    const isTargetMasterUser = targetUid === MASTER_OWNER_UID || (sessionSnap.exists && sessionSnap.data()?.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase());

    if (isTargetMasterSession || isTargetMasterUser) {
      // Log critical security violation attempt
      await db.collection('activityLogs').add({
        type: 'MASTER_DEVICE_PROTECTION_ATTEMPT',
        title: 'CRITICAL: Blocked attempt to revoke Master Owner Device',
        user: callerEmail,
        actorUid: callerUid,
        targetUid,
        targetDeviceId: targetDeviceId || null,
        status: 'WARNING',
        module: 'Device & Session Management',
        details: 'Server-side protection blocked an attempt to revoke the Master Owner Device.',
        timestamp: FieldValue.serverTimestamp()
      });

      return res.status(403).json({
        error: 'CRITICAL SECURITY: The Master Owner Device is permanently protected and cannot be revoked, deactivated, or deleted.'
      });
    }

    // 5. Update Session Status to REVOKED
    await sessionDocRef.set({
      status: 'REVOKED',
      revokedAt: FieldValue.serverTimestamp(),
      revokedBy: callerEmail,
      revocationReason: reason || 'Session terminated by Master Owner'
    }, { merge: true });

    // 6. Invalidate Firebase Auth Refresh Tokens for the target user
    try {
      await auth.revokeRefreshTokens(targetUid);
    } catch (revokeErr) {
      console.warn('Notice: Could not revoke refresh tokens on Auth user:', revokeErr);
    }

    // 7. Record Security Audit Log
    const callerName = (callerUid === MASTER_OWNER_UID || callerEmail.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase()) ? 'Parvish Kan' : callerEmail;
    await db.collection('activityLogs').add({
      type: 'SESSION_REVOKED',
      title: 'Admin Session Revoked',
      user: callerName,
      actorUid: callerUid,
      actorEmail: callerEmail,
      targetUid,
      targetDeviceId: targetDeviceId || null,
      status: 'SUCCESS',
      module: 'Authentication / Security',
      details: reason || 'Session terminated by Parvish Kan (Digital Marketing)',
      timestamp: FieldValue.serverTimestamp()
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      message: 'Session revoked successfully. Device tokens invalidated.'
    });

  } catch (err: any) {
    console.error('Error in /api/revoke-session:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: err?.message || 'Internal Server Error while revoking session.'
    });
  }
}
