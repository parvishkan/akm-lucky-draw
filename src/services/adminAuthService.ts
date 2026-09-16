import { auth, db, collections } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { DeviceSessionService } from './deviceSessionService';
import { ActivityLogger } from './activityLogger';

export interface AdminProfile {
  uid: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
}

export class AdminAuthService {
  /**
   * Verifies if an authenticated user's UID exists in the /admins/{uid} collection
   * and has an ACTIVE status.
   */
  static async verifyAdminAuthorization(user: User): Promise<{ isAuthorized: boolean; profile?: AdminProfile }> {
    try {
      const docRef = doc(db, collections.ADMINS, user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() as AdminProfile;
        if (data.status === 'ACTIVE') {
          return { isAuthorized: true, profile: data };
        }
      }
    } catch (err) {
      console.warn('Admin authorization doc lookup warning:', err);
    }

    return { isAuthorized: false };
  }

  /**
   * Performs Firebase Auth login followed by strict Admin Authorization and Device Registration check.
   */
  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; profile?: AdminProfile; error?: string }> {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const authCheck = await this.verifyAdminAuthorization(res.user);

      if (!authCheck.isAuthorized || !authCheck.profile) {
        await signOut(auth);
        return {
          success: false,
          error: 'Access Denied: Your account is authenticated but does not possess active administrative privileges.'
        };
      }

      // Register or verify device session
      try {
        const { sessionRecord, isMaster } = await DeviceSessionService.registerCurrentSession(authCheck.profile);
        
        await ActivityLogger.log(
          'LOGIN',
          `Admin logged in (${authCheck.profile.email}) [${sessionRecord.deviceInfo.deviceName}]`,
          authCheck.profile.email,
          {
            actorUid: res.user.uid,
            targetDeviceId: sessionRecord.deviceId,
            module: 'Authentication',
            details: isMaster ? 'Master Owner Device authenticated' : 'Staff device session authenticated'
          }
        );
      } catch (sessionErr: any) {
        await signOut(auth);
        return {
          success: false,
          error: sessionErr?.message || 'Access Denied: Session revoked or device blocked.'
        };
      }

      return { success: true, user: res.user, profile: authCheck.profile };
    } catch (err: any) {
      console.warn('Firebase Auth failure for Admin console:', err?.message || err);
      return {
        success: false,
        error: err?.message || 'Authentication failed. Please check your admin credentials.'
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase Auth logout error:', err);
    }
  }

  static onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export default AdminAuthService;
