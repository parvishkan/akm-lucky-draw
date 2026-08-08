import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config/firebaseConfig';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export class collections {
  static readonly TOKENS = 'tokens';
  static readonly PRIZES = 'prizes';
  static readonly WINNERS = 'winners';
  static readonly CLAIMS = 'claims';
  static readonly ACTIVITY_LOGS = 'activityLogs';
  static readonly SETTINGS = 'settings';
  static readonly ADMINS = 'admins';
}

export default app;
