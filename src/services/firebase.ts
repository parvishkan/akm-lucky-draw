import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { firebaseConfig } from '../config/firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export class collections {
  static readonly TOKENS = 'tokens';
  static readonly PRIZES = 'prizes';
  static readonly WINNERS = 'winners';
  static readonly CLAIMS = 'claims';
  static readonly ACTIVITY_LOGS = 'activityLogs';
  static readonly SETTINGS = 'settings';
  static readonly ADMINS = 'admins';
  static readonly CAMPAIGNS = 'campaigns';
  static readonly TIME_SLOTS = 'timeSlots';
  static readonly TEST_TOKENS = 'testTokens';
  static readonly ADMIN_SESSIONS = 'adminSessions';
}

export default app;
