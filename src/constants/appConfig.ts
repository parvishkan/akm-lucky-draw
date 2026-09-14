/**
 * Centralized Production Campaign Base URL
 * Master source of truth for QR generation, download, print, and customer routing.
 */
export const CAMPAIGN_BASE_URL = 'https://draw.anukrishnamall.in';

export const APP_CONFIG = {
  brand: {
    mallName: 'Anu Krishna Mall',
    appName: 'AKM LUCKY DRAW',
    tagline: 'Shop • Scan • Win',
    season: 'Diwali Festival 2026',
    logoPath: '/akm-logo.png',
    productionUrl: CAMPAIGN_BASE_URL,
    campaignBaseUrl: CAMPAIGN_BASE_URL
  },
  animation: {
    introDuration: 3.5,
    morphDuration: 1.5,
    cameraZoomDuration: 1.2
  },
  security: {
    tokenPrefix: 'AKM-',
    claimPrefix: 'AKM-CLAIM-2026-'
  }
};
