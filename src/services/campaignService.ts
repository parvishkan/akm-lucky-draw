import { db, collections } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface CampaignData {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'LIVE' | 'PAUSED' | 'ENDED';
  customerAccess: boolean;
  updatedAt?: any;
}

const DEFAULT_CAMPAIGN: CampaignData = {
  id: 'akm-diwali-2026',
  name: 'AKM LUCKY DRAW',
  description: 'Diwali Season Grand Shopping Lucky Draw',
  startDate: '2026-10-01',
  endDate: '2026-11-15',
  status: 'LIVE',
  customerAccess: true
};

export class CampaignService {
  private static activeState: CampaignData = { ...DEFAULT_CAMPAIGN };

  static async getCampaignState(): Promise<CampaignData> {
    try {
      const docRef = doc(db, collections.SETTINGS, 'campaignState');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        this.activeState = { id: snap.id, ...snap.data() } as CampaignData;
        return this.activeState;
      }
    } catch (err) {
      console.warn('Firestore fallback used for campaign state:', err);
    }
    return this.activeState;
  }

  static async updateCampaignState(updates: Partial<CampaignData>): Promise<void> {
    this.activeState = { ...this.activeState, ...updates };
    try {
      const docRef = doc(db, collections.SETTINGS, 'campaignState');
      await setDoc(docRef, {
        ...this.activeState,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore fallback for updateCampaignState:', err);
    }
  }

  static subscribeToCampaignState(callback: (state: CampaignData) => void): () => void {
    try {
      const docRef = doc(db, collections.SETTINGS, 'campaignState');
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as CampaignData;
          this.activeState = data;
          callback(data);
        } else {
          callback(this.activeState);
        }
      }, (error) => {
        console.warn('Campaign subscription fallback:', error);
        callback(this.activeState);
      });
    } catch (err) {
      callback(this.activeState);
      return () => {};
    }
  }
}

export default CampaignService;
