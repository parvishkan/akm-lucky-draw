import { ActivityLogger } from './activityLogger';

export interface AnalyticsEvent {
  eventName: 'QR_SCAN' | 'TOKEN_VERIFIED' | 'MYSTERY_BOX_SELECT' | 'PRIZE_REVEALED' | 'CLAIM_COMPLETED';
  payload?: Record<string, any>;
  deviceType?: string;
  timestamp?: string;
}

export class AnalyticsService {
  private static detectDeviceType(): string {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'Android Phone';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
    return 'Desktop / Tablet';
  }

  static trackEvent(eventName: AnalyticsEvent['eventName'], payload: Record<string, any> = {}): void {
    const deviceType = this.detectDeviceType();
    const timestamp = new Date().toISOString();

    console.log(`[AKM Analytics] Tracked ${eventName}:`, { ...payload, deviceType, timestamp });

    if (eventName === 'TOKEN_VERIFIED') {
      ActivityLogger.log('TOKEN_VERIFIED', `Token Verified on ${deviceType}`, payload.tokenCode || 'Guest');
    }
  }
}
