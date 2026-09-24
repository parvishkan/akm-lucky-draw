import { db, collections, auth } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, collection, serverTimestamp } from 'firebase/firestore';
import { AdminProfile } from './adminAuthService';

export const MASTER_OWNER_UID = 'PXvOs3LHpoaowbgmfqrg2BT15uA2';
export const MASTER_OWNER_EMAIL = 'farvishedits@gmail.com';

export interface DeviceInfo {
  deviceName: string;
  browser: string;
  os: string;
  platform: 'Desktop' | 'Mobile' | 'Tablet';
  userAgent: string;
}

export interface AdminSessionRecord {
  sessionId: string;
  deviceId: string;
  maskedDeviceId: string;
  uid: string;
  email: string;
  displayName: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';
  isMasterDevice: boolean;
  deviceInfo: DeviceInfo;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: any;
  lastActiveAt: any;
  revokedAt?: any;
  revokedBy?: string;
  revocationReason?: string;
  ip?: string;
}

export class DeviceSessionService {
  private static readonly DEVICE_ID_KEY = 'akm_device_id';
  private static readonly DEVICE_NAME_KEY = 'akm_device_name';

  /**
   * Retrieves or creates a cryptographically unique persistent device ID for this browser.
   */
  static getOrCreateDeviceId(): string {
    try {
      let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
      if (!deviceId) {
        const uuid = typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : 'dev-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
        deviceId = `DEV-${uuid}`;
        localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
      }
      return deviceId;
    } catch {
      // Fallback for strict browser privacy modes
      return `DEV-TEMP-${Date.now()}`;
    }
  }

  /**
   * Masks the device ID for secure display (e.g., DEV-***-7F3A).
   */
  static maskDeviceId(deviceId: string): string {
    if (!deviceId) return 'DEV-***-UNKNOWN';
    const parts = deviceId.split('-');
    const lastPart = parts[parts.length - 1] || '0000';
    return `DEV-***-${lastPart.substring(Math.max(0, lastPart.length - 4)).toUpperCase()}`;
  }

  /**
   * Parses safe client environment telemetry without collecting sensitive data.
   */
  static getDeviceInfo(isMasterOwner: boolean): DeviceInfo {
    const ua = navigator.userAgent || '';
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Browser detection
    if (ua.includes('Edg/')) {
      browser = 'Microsoft Edge';
    } else if (ua.includes('Chrome/')) {
      browser = 'Chrome';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
      browser = 'Safari';
    } else if (ua.includes('Firefox/')) {
      browser = 'Firefox';
    }

    // OS detection
    if (ua.includes('Windows')) {
      os = 'Windows PC';
    } else if (ua.includes('Macintosh') || ua.includes('Mac OS')) {
      os = 'macOS';
    } else if (ua.includes('Android')) {
      os = 'Android';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      os = 'iOS Device';
    } else if (ua.includes('Linux')) {
      os = 'Linux';
    }

    const isMobile = /Android|iPhone|iPad|Mobile/i.test(ua);
    const platform: DeviceInfo['platform'] = isMobile ? 'Mobile' : 'Desktop';

    let customName = '';
    try {
      customName = localStorage.getItem(this.DEVICE_NAME_KEY) || '';
    } catch {
      customName = '';
    }

    let deviceName = customName;
    if (!deviceName) {
      if (isMasterOwner) {
        deviceName = `${os} (Primary Device)`;
      } else {
        deviceName = `${os} (${browser})`;
      }
    }

    return {
      deviceName,
      browser,
      os,
      platform,
      userAgent: ua.substring(0, 180)
    };
  }

  /**
   * Registers or updates the active session in Firestore `/adminSessions`.
   */
  static async registerCurrentSession(profile: AdminProfile): Promise<{ sessionRecord: AdminSessionRecord; isMaster: boolean }> {
    const deviceId = this.getOrCreateDeviceId();
    const maskedDeviceId = this.maskDeviceId(deviceId);

    // Master Owner validation: Authenticated user must have Owner UID or Owner email
    const isMaster = (profile.uid === MASTER_OWNER_UID || profile.email.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase()) && profile.role === 'OWNER';
    const deviceInfo = this.getDeviceInfo(isMaster);

    const docId = `${profile.uid}_${deviceId}`;
    const docRef = doc(db, collections.ADMIN_SESSIONS, docId);

    // Check if an existing session record already exists
    let existingData: any = null;
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        existingData = snap.data();
      }
    } catch (err) {
      console.warn('Session lookup notice:', err);
    }

    // If an existing staff session was revoked, do NOT auto-unrevoke!
    if (existingData && existingData.status === 'REVOKED' && !isMaster) {
      throw new Error('This device session has been revoked by the Master Owner. Access denied.');
    }

    const record: AdminSessionRecord = {
      sessionId: docId,
      deviceId,
      maskedDeviceId,
      uid: profile.uid,
      email: isMaster ? 'parvish@anukrishnamall.com' : profile.email,
      displayName: isMaster ? 'Parvish Kan' : profile.email.split('@')[0],
      role: profile.role,
      isMasterDevice: isMaster,
      deviceInfo,
      status: 'ACTIVE',
      createdAt: existingData?.createdAt || serverTimestamp(),
      lastActiveAt: serverTimestamp()
    };

    try {
      await setDoc(docRef, record, { merge: true });
    } catch (err) {
      console.warn('Could not register session in Firestore (offline/rules):', err);
    }

    return { sessionRecord: record, isMaster };
  }

  /**
   * Heartbeat to update lastActiveAt for the current session.
   */
  static async sendHeartbeat(uid: string): Promise<void> {
    try {
      const deviceId = this.getOrCreateDeviceId();
      const docRef = doc(db, collections.ADMIN_SESSIONS, `${uid}_${deviceId}`);
      await setDoc(docRef, { lastActiveAt: serverTimestamp() }, { merge: true });
    } catch {
      // Non-blocking heartbeat failure
    }
  }

  /**
   * Listens in real-time to the current device's session. If revoked by Owner, triggers callback.
   */
  static listenToCurrentSession(
    uid: string,
    onRevoked: () => void
  ): () => void {
    const deviceId = this.getOrCreateDeviceId();
    const docRef = doc(db, collections.ADMIN_SESSIONS, `${uid}_${deviceId}`);

    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as AdminSessionRecord;
        if (data.status === 'REVOKED') {
          onRevoked();
        }
      }
    }, (err) => {
      console.warn('Session listener warning:', err);
    });
  }

  /**
   * Listens to all sessions in real-time (for Master Owner / Admin dashboard).
   */
  static listenToAllSessions(
    callback: (sessions: AdminSessionRecord[]) => void
  ): () => void {
    const colRef = collection(db, collections.ADMIN_SESSIONS);

    return onSnapshot(colRef, (snap) => {
      const sessions: AdminSessionRecord[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const isMaster = !!data.isMasterDevice || data.uid === MASTER_OWNER_UID || data.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase();
        const displayName = isMaster ? 'Parvish Kan' : (data.displayName || data.email?.split('@')[0] || 'Admin');
        const displayEmail = isMaster ? 'parvish@anukrishnamall.com' : (data.email || 'admin@anukrishnamall.com').replace(/[\[\n]/g, '');

        sessions.push({
          sessionId: d.id,
          deviceId: data.deviceId || d.id,
          maskedDeviceId: data.maskedDeviceId || this.maskDeviceId(data.deviceId || d.id),
          uid: data.uid,
          email: displayEmail,
          displayName,
          role: data.role || (isMaster ? 'OWNER' : 'STAFF'),
          isMasterDevice: isMaster,
          deviceInfo: data.deviceInfo || {
            deviceName: 'Unknown Device',
            browser: 'Browser',
            os: 'OS',
            platform: 'Desktop',
            userAgent: ''
          },
          status: data.status || 'ACTIVE',
          createdAt: data.createdAt,
          lastActiveAt: data.lastActiveAt,
          revokedAt: data.revokedAt,
          revokedBy: data.revokedBy,
          revocationReason: data.revocationReason
        });
      });

      // Sort: Master device first, then newest active
      sessions.sort((a, b) => {
        if (a.isMasterDevice) return -1;
        if (b.isMasterDevice) return 1;
        return 0;
      });

      callback(sessions);
    }, (err) => {
      console.warn('Error listening to all sessions:', err);
      callback([]);
    });
  }

  /**
   * Remote revocation of another device's session via secure serverless API.
   */
  static async revokeSession(
    sessionId: string,
    targetUid: string,
    targetDeviceId: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'You must be logged in to revoke a session.' };
    }

    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/revoke-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          sessionId,
          targetUid,
          targetDeviceId,
          reason: reason || 'Session terminated by Parvish Kan (Digital Marketing)'
        })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = { error: 'Invalid JSON response from server' };
        }
      } else {
        const text = await res.text();
        data = { error: text || `Server returned error (${res.status})` };
      }

      if (!res.ok) {
        return { success: false, message: data.error || data.message || `Failed to revoke session (${res.status}).` };
      }

      return { success: true, message: data.message || 'Session revoked successfully.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Network error while revoking session.' };
    }
  }
}

export default DeviceSessionService;
