import React from 'react';
import { Prize } from '../data/prizes';

export interface IntroAnimationProps {
  onComplete: () => void;
}

export interface TokenVerificationData {
  tokenCode: string;
  mobileNumber?: string;
  customerName?: string;
  verifiedAt?: string;
  isValid?: boolean;
  status?: string;
  slotId?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gold' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export interface HeaderProps {
  logoUrl?: string;
  mallName?: string;
  badgeText?: string;
  className?: string;
}

export interface HeroProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  badgeText?: string;
  className?: string;
}

export interface LandingPageProps {
  onStartClick?: () => void;
  onStart?: () => void;
}

export interface TokenVerificationProps {
  onVerify?: (data: TokenVerificationData) => void;
  onSuccess: (data: TokenVerificationData) => void;
  onBack?: () => void;
}

export interface VerificationSuccessProps {
  data: TokenVerificationData;
  onProceed: () => void;
}

export interface MysteryRevealProps {
  tokenData: TokenVerificationData;
  onPrizeRevealed: (prize: Prize) => void;
}

export interface PrizeCertificateProps {
  tokenData: TokenVerificationData;
  prize: Prize;
  onReset: () => void;
}

export interface CampaignData {
  id?: string;
  campaignId?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  dailyLimit?: number;
  slotDurationMinutes?: number;
  cooldownMinutes?: number;
  status: 'LIVE' | 'PAUSED' | 'ENDED';
  customerAccess: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface TimeSlotData {
  id?: string;
  slotId: string;
  campaignId: string;
  dayNumber: number;
  date: string;
  slotStart: any;  // Firestore Timestamp or Date
  giftUnlock: any; // Firestore Timestamp or Date
  slotEnd: any;    // Firestore Timestamp or Date
  tokenLimit: number;
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED';
  prizesAllocated?: number;
  createdAt?: any;
  updatedAt?: any;
}
