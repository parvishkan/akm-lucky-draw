import { db, collections } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export type ActivityLogType =
  | 'LOGIN'
  | 'NEW_DEVICE'
  | 'SESSION_REVOKED'
  | 'STAFF_DISABLED'
  | 'STAFF_ENABLED'
  | 'ROLE_CHANGED'
  | 'ADMIN_CREATED'
  | 'ADMIN_REMOVED'
  | 'FAILED_ADMIN_ACCESS'
  | 'MASTER_DEVICE_PROTECTION_ATTEMPT'
  | 'TOKEN_VERIFIED'
  | 'PRIZE_CLAIMED'
  | 'NEW_WINNER'
  | 'GIFT_ADDED'
  | 'ADMIN_LOGIN';

export interface ActivityLog {
  type: ActivityLogType;
  title: string;
  user: string;
  timestamp?: any;
  actorUid?: string;
  actorEmail?: string;
  targetUid?: string;
  targetDeviceId?: string;
  status?: 'SUCCESS' | 'FAILED' | 'WARNING';
  module?: string;
  details?: string;
}

export class ActivityLogger {
  static async log(
    type: ActivityLogType,
    title: string,
    user: string,
    extra?: Partial<Omit<ActivityLog, 'type' | 'title' | 'user'>>
  ): Promise<void> {
    try {
      await addDoc(collection(db, collections.ACTIVITY_LOGS), {
        type,
        title,
        user,
        status: extra?.status || 'SUCCESS',
        module: extra?.module || 'Security',
        actorUid: extra?.actorUid || null,
        actorEmail: extra?.actorEmail || user,
        targetUid: extra?.targetUid || null,
        targetDeviceId: extra?.targetDeviceId || null,
        details: extra?.details || title,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore offline fallback for activityLogger:', err);
    }
  }
}
