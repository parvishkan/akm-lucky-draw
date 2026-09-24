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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db, auth } = initFirebaseAdmin();

    // Verify Owner authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing Authorization header.' });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    const decodedToken = await auth.verifyIdToken(idToken);
    const isOwner = decodedToken.uid === MASTER_OWNER_UID || decodedToken.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase();

    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: Only the Master Owner can run the account cleanup utility.' });
    }

    // GET: Generate diagnostic audit report
    if (req.method === 'GET') {
      const authUsersResult = await auth.listUsers(100);
      const adminsSnap = await db.collection('admins').get();

      const adminDocsMap = new Map<string, any>();
      adminsSnap.forEach((doc) => {
        adminDocsMap.set(doc.id, doc.data());
      });

      const report: any[] = [];

      // Check all Firebase Auth users
      for (const u of authUsersResult.users) {
        const adminDoc = adminDocsMap.get(u.uid);
        const isMaster = u.uid === MASTER_OWNER_UID || u.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase();

        let classification = 'STAFF_ACCOUNT';
        if (isMaster) {
          classification = 'PROTECTED_MASTER_OWNER';
        } else if (u.email?.includes('test') || u.email?.includes('demo') || u.email?.includes('example.com')) {
          classification = 'TEST_ACCOUNT';
        }

        report.push({
          uid: u.uid,
          email: u.email,
          role: adminDoc?.role || 'NONE',
          adminRegistryStatus: adminDoc ? adminDoc.status || 'ACTIVE' : 'NOT_IN_REGISTRY',
          classification,
          isProtectedMaster: isMaster,
          canDelete: !isMaster && classification === 'TEST_ACCOUNT'
        });

        // Mark as inspected
        adminDocsMap.delete(u.uid);
      }

      // Check orphaned Firestore admin docs that have no corresponding Auth user
      for (const [orphanUid, data] of adminDocsMap.entries()) {
        report.push({
          uid: orphanUid,
          email: data.email || 'unknown',
          role: data.role || 'UNKNOWN',
          adminRegistryStatus: data.status || 'ORPHANED',
          classification: 'ORPHANED_DEMO_DOC',
          isProtectedMaster: orphanUid === MASTER_OWNER_UID,
          canDelete: orphanUid !== MASTER_OWNER_UID
        });
      }

      return res.status(200).json({
        success: true,
        report,
        summary: {
          totalScanned: report.length,
          masterOwnerFound: report.some((r) => r.isProtectedMaster),
          deletableCandidates: report.filter((r) => r.canDelete).length
        }
      });
    }

    // POST: Execute cleanup on explicitly approved UIDs
    if (req.method === 'POST') {
      const { approvedUids } = req.body || {};

      if (!Array.isArray(approvedUids) || approvedUids.length === 0) {
        return res.status(400).json({ error: 'approvedUids must be a non-empty array of account UIDs to clean.' });
      }

      // SECURITY: Ensure Master Owner UID is never in approvedUids
      if (approvedUids.includes(MASTER_OWNER_UID)) {
        return res.status(403).json({ error: 'CRITICAL SECURITY: Master Owner account cannot be deleted or cleaned.' });
      }

      const results: any[] = [];

      for (const uid of approvedUids) {
        if (uid === MASTER_OWNER_UID) continue;

        try {
          // 1. Remove/deactivate Auth user if exists
          try {
            await auth.deleteUser(uid);
          } catch (authErr: any) {
            if (authErr.code !== 'auth/user-not-found') {
              console.warn(`Notice deleting Auth user ${uid}:`, authErr);
            }
          }

          // 2. Remove /admins/{uid} doc
          await db.collection('admins').doc(uid).delete();

          // 3. Remove associated /adminSessions for this UID
          const sessionsSnap = await db.collection('adminSessions').where('uid', '==', uid).get();
          const batch = db.batch();
          sessionsSnap.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();

          results.push({ uid, status: 'CLEANED_SUCCESSFULLY' });
        } catch (itemErr: any) {
          results.push({ uid, status: 'FAILED', error: itemErr?.message });
        }
      }

      // Record audit log
      await db.collection('activityLogs').add({
        type: 'ADMIN_REMOVED',
        title: `Cleaned ${approvedUids.length} demo/orphaned accounts`,
        user: decodedToken.email || 'Master Owner',
        actorUid: decodedToken.uid,
        status: 'SUCCESS',
        module: 'Security Maintenance',
        details: `Cleaned accounts: ${approvedUids.join(', ')}`,
        timestamp: FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        success: true,
        cleanedCount: results.filter((r) => r.status === 'CLEANED_SUCCESSFULLY').length,
        results
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err: any) {
    console.error('Error in /api/admin-cleanup:', err);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
