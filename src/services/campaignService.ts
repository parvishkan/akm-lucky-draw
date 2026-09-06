import { db, collections } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  collection,
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { CampaignData, TimeSlotData } from '../types';

export type { CampaignData, TimeSlotData };

export const ACTIVE_CAMPAIGN_ID = 'akm-diwali-2026';

const DEFAULT_CAMPAIGN: CampaignData = {
  id: ACTIVE_CAMPAIGN_ID,
  campaignId: ACTIVE_CAMPAIGN_ID,
  name: 'AKM LUCKY DRAW',
  description: 'Diwali Season Grand Shopping Lucky Draw',
  startDate: '2026-10-01',
  endDate: '2026-10-04', // 4-Day Campaign Scope
  startTime: '09:00',
  endTime: '22:00',
  timezone: 'Asia/Kolkata',
  dailyLimit: 100,
  slotDurationMinutes: 60,
  cooldownMinutes: 15,
  status: 'LIVE',
  customerAccess: true
};

export class CampaignService {
  private static activeState: CampaignData = { ...DEFAULT_CAMPAIGN };

  /**
   * Get main campaign state from /campaigns/akm-diwali-2026
   */
  static async getCampaignState(campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<CampaignData> {
    try {
      const docRef = doc(db, collections.CAMPAIGNS, campaignId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        this.activeState = { 
          id: snap.id, 
          campaignId: data.campaignId || snap.id,
          name: data.name || 'AKM LUCKY DRAW',
          description: data.description || '',
          startDate: data.startDate || '2026-10-01',
          endDate: data.endDate || '2026-10-04',
          startTime: data.startTime || '09:00',
          endTime: data.endTime || '22:00',
          timezone: data.timezone || 'Asia/Kolkata',
          dailyLimit: data.dailyLimit ?? 100,
          slotDurationMinutes: data.slotDurationMinutes ?? 60,
          cooldownMinutes: data.cooldownMinutes ?? 15,
          status: data.status || 'LIVE',
          customerAccess: data.customerAccess ?? true
        };
        return this.activeState;
      } else {
        // Initialize active campaign in Firestore
        await setDoc(docRef, { ...DEFAULT_CAMPAIGN, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
        return { ...DEFAULT_CAMPAIGN };
      }
    } catch (err) {
      console.warn('Firestore fallback used for campaign state:', err);
    }
    return this.activeState;
  }

  /**
   * Update active campaign state in /campaigns/akm-diwali-2026 and legacy settings
   */
  static async updateCampaignState(updates: Partial<CampaignData>, campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    this.activeState = { ...this.activeState, ...updates };
    try {
      const docRef = doc(db, collections.CAMPAIGNS, campaignId);
      await setDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Mirror to settings for backward compatibility
      try {
        const settingsRef = doc(db, collections.SETTINGS, 'campaignState');
        await setDoc(settingsRef, {
          ...this.activeState,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (_) {}
    } catch (err) {
      console.warn('Firestore error for updateCampaignState:', err);
      throw err;
    }
  }

  /**
   * Subscribe to real-time updates for active campaign state from /campaigns/akm-diwali-2026
   */
  static subscribeToCampaignState(callback: (state: CampaignData) => void, campaignId: string = ACTIVE_CAMPAIGN_ID): () => void {
    try {
      const docRef = doc(db, collections.CAMPAIGNS, campaignId);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const stateData: CampaignData = {
            id: docSnap.id,
            campaignId: data.campaignId || docSnap.id,
            name: data.name || 'AKM LUCKY DRAW',
            description: data.description || '',
            startDate: data.startDate || '2026-10-01',
            endDate: data.endDate || '2026-10-04',
            startTime: data.startTime || '09:00',
            endTime: data.endTime || '22:00',
            timezone: data.timezone || 'Asia/Kolkata',
            dailyLimit: data.dailyLimit ?? 100,
            slotDurationMinutes: data.slotDurationMinutes ?? 60,
            cooldownMinutes: data.cooldownMinutes ?? 15,
            status: data.status || 'LIVE',
            customerAccess: data.customerAccess ?? true
          };
          this.activeState = stateData;
          callback(stateData);
        } else {
          callback(this.activeState);
        }
      }, (error) => {
        console.warn('Campaign subscription error:', error);
        callback(this.activeState);
      });
    } catch (err) {
      callback(this.activeState);
      return () => {};
    }
  }

  /**
   * Pause the campaign
   */
  static async pauseCampaign(campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    await this.updateCampaignState({ status: 'PAUSED', customerAccess: false }, campaignId);
  }

  /**
   * Resume the campaign
   */
  static async resumeCampaign(campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    await this.updateCampaignState({ status: 'LIVE', customerAccess: true }, campaignId);
  }

  /**
   * End the campaign
   */
  static async endCampaign(campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    await this.updateCampaignState({ status: 'ENDED', customerAccess: false }, campaignId);
  }

  /**
   * Set or toggle customer access (Emergency Kill Switch)
   */
  static async setCustomerAccess(enabled: boolean, campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    await this.updateCampaignState({ customerAccess: enabled }, campaignId);
  }

  /**
   * Save full campaign settings
   */
  static async saveCampaignSettings(settings: Record<string, any>, campaignId: string = ACTIVE_CAMPAIGN_ID): Promise<void> {
    await this.updateCampaignState(settings, campaignId);
  }

  /**
   * Get specific campaign document from /campaigns/{campaignId}
   */
  static async getCampaign(campaignId: string): Promise<CampaignData | null> {
    try {
      const docRef = doc(db, collections.CAMPAIGNS, campaignId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return { id: snap.id, campaignId: snap.id, ...data } as CampaignData;
      }
    } catch (err) {
      console.warn('Firestore getCampaign error:', err);
    }
    return null;
  }

  /**
   * Get all campaigns from /campaigns for multi-campaign season switching
   */
  static async getAllCampaigns(): Promise<CampaignData[]> {
    try {
      const snap = await getDocs(collection(db, collections.CAMPAIGNS));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, campaignId: d.id, ...d.data() } as CampaignData));
      }
    } catch (err) {
      console.warn('Firestore getAllCampaigns error:', err);
    }
    return [DEFAULT_CAMPAIGN];
  }

  /**
   * Create or update a campaign document in /campaigns/{campaignId}
   */
  static async createCampaign(campaign: Partial<CampaignData>): Promise<string> {
    const cid = campaign.campaignId || `campaign-${Date.now()}`;
    const docRef = doc(db, collections.CAMPAIGNS, cid);
    const payload: CampaignData = {
      campaignId: cid,
      name: campaign.name || 'AKM Seasonal Lucky Draw',
      description: campaign.description || '',
      startDate: campaign.startDate || '2026-10-01',
      endDate: campaign.endDate || '2026-10-04',
      status: campaign.status || 'LIVE',
      customerAccess: campaign.customerAccess ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, payload, { merge: true });
    return cid;
  }

  /**
   * Fetch all Time Slots for a given campaign from /campaigns/{campaignId}/timeSlots
   */
  static async getTimeSlots(campaignId: string): Promise<TimeSlotData[]> {
    try {
      const slotsRef = collection(db, collections.CAMPAIGNS, campaignId, collections.TIME_SLOTS);
      const snap = await getDocs(slotsRef);
      if (!snap.empty) {
        return snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            slotId: data.slotId || d.id,
            campaignId: data.campaignId || campaignId,
            dayNumber: data.dayNumber || 1,
            date: data.date || '2026-10-01',
            slotStart: data.slotStart,
            giftUnlock: data.giftUnlock,
            slotEnd: data.slotEnd,
            tokenLimit: data.tokenLimit || 100,
            status: data.status || 'UPCOMING',
            prizesAllocated: data.prizesAllocated || 0
          } as TimeSlotData;
        });
      }
    } catch (err) {
      console.warn('Firestore getTimeSlots error:', err);
    }
    return [];
  }

  /**
   * Create a new Time Slot document under /campaigns/{campaignId}/timeSlots/{slotId}
   * Stores timestamps using Firestore Timestamp for server time independence.
   */
  static async createTimeSlot(campaignId: string, slotData: Partial<TimeSlotData>): Promise<string> {
    const slotId = slotData.slotId || `slot-day${slotData.dayNumber || 1}-${Date.now()}`;
    const slotRef = doc(db, collections.CAMPAIGNS, campaignId, collections.TIME_SLOTS, slotId);

    const payload: TimeSlotData = {
      slotId,
      campaignId,
      dayNumber: slotData.dayNumber || 1,
      date: slotData.date || '2026-10-01',
      slotStart: slotData.slotStart ? Timestamp.fromDate(new Date(slotData.slotStart)) : serverTimestamp(),
      giftUnlock: slotData.giftUnlock ? Timestamp.fromDate(new Date(slotData.giftUnlock)) : serverTimestamp(),
      slotEnd: slotData.slotEnd ? Timestamp.fromDate(new Date(slotData.slotEnd)) : serverTimestamp(),
      tokenLimit: slotData.tokenLimit || 100,
      status: slotData.status || 'UPCOMING',
      prizesAllocated: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(slotRef, payload);
    return slotId;
  }

  /**
   * Update an existing Time Slot document
   */
  static async updateTimeSlot(campaignId: string, slotId: string, updates: Partial<TimeSlotData>): Promise<void> {
    const slotRef = doc(db, collections.CAMPAIGNS, campaignId, collections.TIME_SLOTS, slotId);
    await updateDoc(slotRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete a Time Slot document from Firestore
   */
  static async deleteTimeSlot(campaignId: string, slotId: string): Promise<void> {
    const slotRef = doc(db, collections.CAMPAIGNS, campaignId, collections.TIME_SLOTS, slotId);
    await deleteDoc(slotRef);
  }

  /**
   * Toggle or update Time Slot status (UPCOMING | ACTIVE | ENDED)
   */
  static async toggleTimeSlotStatus(
    campaignId: string,
    slotId: string,
    newStatus: 'UPCOMING' | 'ACTIVE' | 'ENDED'
  ): Promise<void> {
    const slotRef = doc(db, collections.CAMPAIGNS, campaignId, collections.TIME_SLOTS, slotId);
    await updateDoc(slotRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  }
}

export default CampaignService;
