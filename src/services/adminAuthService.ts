import { auth, db, collections } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  inMemoryPersistence,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { DeviceSessionService, MASTER_OWNER_UID, MASTER_OWNER_EMAIL } from './deviceSessionService';
import { ActivityLogger } from './activityLogger';

export interface AdminProfile {
  uid: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
}

export class AdminAuthService {
  /**
   * Tracks whether the admin has actively logged in during this in-memory page lifetime.
   * Resets to false upon page reload / refresh to mandate credentials re-entry.
   */
  private static isSessionAuthenticated = false;
  private static isLoginInProgress = false;

  /**
   * Returns whether the admin was authenticated within this active page lifetime.
   */
  static isCurrentSessionAuthenticated(): boolean {
    return this.isSessionAuthenticated;
  }

  /**
   * Returns whether an interactive credential login handshake is actively in progress.
   */
  static isAuthenticating(): boolean {
    return this.isLoginInProgress;
  }

  /**
   * Purges any persisted Firebase Auth session (from browser storage or prior session)
   * and enforces strict in-memory persistence.
   */
  static async purgePersistedAuth(): Promise<void> {
    this.isSessionAuthenticated = false;
    try {
      await setPersistence(auth, inMemoryPersistence);
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('Purge persisted auth notice:', err);
    }
  }

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
    this.isLoginInProgress = true;
    try {
      // Enforce in-memory session persistence so credentials and tokens are strictly non-persisted on refresh
      try {
        await setPersistence(auth, inMemoryPersistence);
      } catch (persistErr) {
        console.warn('Set inMemoryPersistence warning:', persistErr);
      }

      const res = await signInWithEmailAndPassword(auth, email, password);

      // Step 3: Immediately mark current in-memory session as authenticated so App.tsx auth listener does not reject the session
      this.isSessionAuthenticated = true;

      const authCheck = await this.verifyAdminAuthorization(res.user);

      if (!authCheck.isAuthorized || !authCheck.profile) {
        this.isSessionAuthenticated = false;
        await signOut(auth);
        return {
          success: false,
          error: 'Access Denied: Your account is authenticated but does not possess active administrative privileges.'
        };
      }

      // Register or verify device session
      try {
        const { sessionRecord, isMaster } = await DeviceSessionService.registerCurrentSession(authCheck.profile);

        const isMasterOwner = isMaster || authCheck.profile.uid === MASTER_OWNER_UID || authCheck.profile.email.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase() || authCheck.profile.role === 'OWNER';
        const displayName = isMasterOwner ? 'Parvish Kan' : (authCheck.profile.email.split('@')[0]);

        await ActivityLogger.log(
          'LOGIN',
          'Admin Login',
          displayName,
          {
            actorUid: res.user.uid,
            actorEmail: authCheck.profile.email,
            targetDeviceId: sessionRecord.maskedDeviceId,
            module: 'Authentication / Security',
            status: 'SUCCESS',
            details: `${displayName} logged in from ${sessionRecord.deviceInfo.deviceName} (${sessionRecord.deviceInfo.os} • ${sessionRecord.deviceInfo.browser})`
          }
        );
      } catch (sessionErr: any) {
        this.isSessionAuthenticated = false;
        await signOut(auth);
        return {
          success: false,
          error: sessionErr?.message || 'Access Denied: Session revoked or device blocked.'
        };
      }

      return { success: true, user: res.user, profile: authCheck.profile };
    } catch (err: any) {
      this.isSessionAuthenticated = false;
      console.warn('Firebase Auth failure for Admin console:', err?.code || 'auth-error');

      const errorCode = err?.code || '';
      let userFriendlyError = 'Invalid email or password. Please check your credentials and try again.';

      if (errorCode === 'auth/too-many-requests') {
        userFriendlyError = 'Too many failed login attempts. Please wait a few moments and try again.';
      } else if (errorCode === 'auth/network-request-failed') {
        userFriendlyError = 'Network connection error. Please verify your internet connection and try again.';
      } else if (errorCode === 'auth/user-disabled') {
        userFriendlyError = 'This administrator account has been disabled. Please contact the system owner.';
      }

      return {
        success: false,
        error: userFriendlyError
      };
    } finally {
      this.isLoginInProgress = false;
    }
  }

  static async logout(): Promise<void> {
    try {
      this.isSessionAuthenticated = false;
      const user = auth.currentUser;
      if (user) {
        const isMasterOwner = user.uid === MASTER_OWNER_UID || user.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase();
        const displayName = isMasterOwner ? 'Parvish Kan' : (user.email?.split('@')[0] || 'Admin');

        await ActivityLogger.log(
          'LOGOUT',
          'Admin Logout',
          displayName,
          {
            actorUid: user.uid,
            actorEmail: user.email || undefined,
            module: 'Authentication / Security',
            status: 'SUCCESS',
            details: `${displayName} logged out of Admin Console`
          }
        );
      }
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
