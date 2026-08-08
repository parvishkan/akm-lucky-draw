import { db, collections } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export interface ActivityLog {
  type: 'TOKEN_VERIFIED' | 'PRIZE_CLAIMED' | 'NEW_WINNER' | 'GIFT_ADDED' | 'ADMIN_LOGIN';
  title: string;
  user: string;
  timestamp?: any;
}

export class ActivityLogger {
  static async log(type: ActivityLog['type'], title: string, user: string): Promise<void> {
    try {
      await addDoc(collection(db, collections.ACTIVITY_LOGS), {
        type,
        title,
        user,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore offline fallback for activityLogger:', err);
    }
  }
}
