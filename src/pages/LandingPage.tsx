import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Button from '../components/Button';
import CustomerEntryTransition from '../components/CustomerEntryTransition';
import TokenVerificationScreen from '../components/TokenVerificationScreen';
import MysteryBoxExperience from '../components/MysteryBoxExperience';
import LuxuryBoxOpeningCinematic from '../components/LuxuryBoxOpeningCinematic';
import PrizeRevealExperience from '../components/PrizeRevealExperience';
import PrizeClaimExperience from '../components/PrizeClaimExperience';
import { LandingPageProps, TokenVerificationData } from '../types';
import { Prize } from '../data/prizes';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

import CampaignService, { CampaignData } from '../services/campaignService';

export const LandingPage: React.FC<LandingPageProps> = ({ onStartClick }) => {
  const [viewState, setViewState] = useState<'HERO' | 'ENTRY_TRANSITION' | 'VERIFY_SCREEN' | 'MYSTERY_BOX' | 'BOX_OPENING_CINEMATIC' | 'PRIZE_REVEAL' | 'PRIZE_CLAIM' | 'FINAL_CLAIM_PAUSE'>('HERO');
  const [verifiedTokenData, setVerifiedTokenData] = useState<TokenVerificationData | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [campaignState, setCampaignState] = useState<CampaignData>({
    name: 'AKM LUCKY DRAW',
    description: '',
    startDate: '',
    endDate: '',
    status: 'LIVE',
    customerAccess: true
  });

  React.useEffect(() => {
    const unsubscribe = CampaignService.subscribeToCampaignState((state) => {
      setCampaignState(state);
    });
    return () => unsubscribe();
  }, []);

  const isUnavailable = !campaignState.customerAccess || campaignState.status !== 'LIVE';

  // 12 Slow Floating Golden Micro-Particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (i * 19) % 90 + 5,
    y: (i * 29) % 85 + 8,
    duration: 7 + (i % 5) * 1.5,
    delay: (i % 3) * 0.8
  }));

  // 6 Ambient Sparkle Emitters
  const sparkles = [
    { id: 1, top: '15%', left: '12%', delay: 0.5 },
    { id: 2, top: '22%', right: '14%', delay: 1.2 },
    { id: 3, top: '48%', left: '8%', delay: 1.8 },
    { id: 4, top: '55%', right: '10%', delay: 0.8 },
    { id: 5, top: '78%', left: '16%', delay: 2.2 },
    { id: 6, top: '82%', right: '18%', delay: 1.5 },
  ];

  const handleStart = () => {
    setIsZooming(true);
    setTimeout(() => {
      setViewState('ENTRY_TRANSITION');
      setIsZooming(false);
      if (onStartClick) {
        onStartClick();
      }
    }, 400);
  };

  const handleTransitionComplete = () => {
    setViewState('VERIFY_SCREEN');
  };

  const handleVerificationSuccess = (data: TokenVerificationData) => {
    setVerifiedTokenData(data);
    setViewState('MYSTERY_BOX');
  };

  const handleBoxSelected = (boxId: number, prize: Prize, claimId: string) => {
    setSelectedBoxId(boxId);
    setWonPrize(prize);
    setViewState('BOX_OPENING_CINEMATIC');
  };

  const handleOpeningComplete = () => {
    setViewState('PRIZE_REVEAL');
  };

  const handleClaimClick = () => {
    setViewState('PRIZE_CLAIM');
  };

  const handleClaimConfirmed = () => {
    setViewState('FINAL_CLAIM_PAUSE');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        scale: isZooming ? 1.03 : 1
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen w-full flex flex-col justify-between items-center bg-luxury-static overflow-hidden selection:bg-akm-gold-royal selection:text-akm-purple-deepest"
    >
      {/* 1. Soft Ambient Golden Glow in Background */}
      <div className="fixed inset-0 spotlight-radial pointer-events-none z-0" />

      {/* 2. Slow Floating Golden Micro-Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [-12, 12, -12]
            }}
            transition={{
              repeat: Infinity,
              duration: p.duration,
              delay: p.delay,
              ease: "easeInOut"
            }}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute w-1 h-1 rounded-full bg-akm-gold-light/70 blur-[0.5px]"
          />
        ))}
      </div>

      {/* 3. Tiny Ambient Sparkle Emitters */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              delay: s.delay,
              ease: "easeInOut"
            }}
            style={{ top: s.top, left: s.left, right: s.right }}
            className="absolute text-akm-gold-royal/40"
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        ))}
      </div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-akm-gold-royal/20 rounded-tl-md pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-akm-gold-royal/20 rounded-tr-md pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-akm-gold-royal/20 rounded-bl-md pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-akm-gold-royal/20 rounded-br-md pointer-events-none" />

      {/* Campaign Access Gate Unavailability Overlay */}
      {isUnavailable ? (
        <div className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-center items-center px-6 py-12 z-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-akm-purple-deepest border-2 border-akm-gold-royal/40 flex items-center justify-center text-akm-gold-royal shadow-gold-glow">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-akm-gold-royal uppercase tracking-widest block">
              {campaignState.name}
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">
              AKM Lucky Draw is currently unavailable.
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
              {campaignState.status === 'PAUSED'
                ? 'The Lucky Draw campaign is temporarily paused. Please check back shortly or visit Help Desk Counter #1.'
                : campaignState.status === 'ENDED'
                ? 'The Diwali Lucky Draw campaign has concluded. Thank you for shopping at Anu Krishna Mall!'
                : 'Customer participation is currently paused. Please check back later.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-akm-purple-deepest border border-akm-gold-royal/20 text-[10px] font-mono text-akm-gold-light">
            Status: {campaignState.status} • Access: {campaignState.customerAccess ? 'Enabled' : 'Disabled'}
          </div>
        </div>
      ) : (
        /* Main Viewport Container */
        <AnimatePresence mode="wait">
        
        {/* VIEW 1: Landing Hero View */}
        {viewState === 'HERO' && (
          <motion.div
            key="hero-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full max-w-md mx-auto flex flex-col justify-between items-center px-4 py-6 sm:px-6 z-10"
          >
            <div className="h-2" />
            
            {/* Logo ➔ Mall Name ➔ Title ➔ Tagline */}
            <Hero />

            {/* CHECK YOUR LUCK Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xs mx-auto pb-6"
            >
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={handleStart}
              >
                ✨ Check Your Luck
              </Button>
            </motion.div>

          </motion.div>
        )}

        {/* VIEW 2: Customer Entry Transition */}
        {viewState === 'ENTRY_TRANSITION' && (
          <CustomerEntryTransition key="entry-transition" onComplete={handleTransitionComplete} />
        )}

        {/* VIEW 3: Token Verification Screen */}
        {viewState === 'VERIFY_SCREEN' && (
          <motion.div
            key="verify-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full flex flex-col justify-center items-center"
          >
            <TokenVerificationScreen onSuccess={handleVerificationSuccess} />
          </motion.div>
        )}

        {/* VIEW 4: Mystery Box Selection Screen */}
        {viewState === 'MYSTERY_BOX' && verifiedTokenData && (
          <motion.div
            key="mystery-box-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen w-full flex flex-col justify-center items-center"
          >
            <MysteryBoxExperience
              tokenCode={verifiedTokenData.tokenCode}
              onBoxSelected={handleBoxSelected}
            />
          </motion.div>
        )}

        {/* VIEW 5: Luxury Box Opening Cinematic */}
        {viewState === 'BOX_OPENING_CINEMATIC' && selectedBoxId && (
          <LuxuryBoxOpeningCinematic
            key="opening-cinematic"
            boxId={selectedBoxId}
            onOpeningComplete={handleOpeningComplete}
          />
        )}

        {/* VIEW 6: Premium Prize Reveal Screen */}
        {viewState === 'PRIZE_REVEAL' && selectedBoxId && (
          <motion.div
            key="prize-reveal-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen w-full flex flex-col justify-center items-center"
          >
            <PrizeRevealExperience
              boxId={selectedBoxId}
              onClaimClick={handleClaimClick}
            />
          </motion.div>
        )}

        {/* VIEW 7: Prize Claim Screen */}
        {viewState === 'PRIZE_CLAIM' && verifiedTokenData && wonPrize && (
          <motion.div
            key="prize-claim-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen w-full flex flex-col justify-center items-center"
          >
            <PrizeClaimExperience
              tokenData={verifiedTokenData}
              prize={wonPrize}
              onClaimConfirmed={handleClaimConfirmed}
            />
          </motion.div>
        )}

        {/* VIEW 8: Final Claim Pause State */}
        {viewState === 'FINAL_CLAIM_PAUSE' && verifiedTokenData && wonPrize && (
          <motion.div
            key="final-claim-pause-view"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <div className="glass-surface rounded-3xl p-6 text-center max-w-xs space-y-4 border border-emerald-400/70 shadow-[0_0_50px_rgba(52,211,153,0.3)]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(52,211,153,0.4)]"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </motion.div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Ready For Redemption</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-gold-metallic">
                  Show Screen at Counter
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-akm-purple-deepest/90 border border-akm-gold-royal/30 text-left space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-medium">
                  Verified Gift Claim ID
                </span>
                <span className="font-mono text-base font-bold text-akm-gold-royal tracking-wider block">
                  AKM-CLAIM-2026-8892
                </span>
              </div>

              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Customer is ready to present screen at Anu Krishna Mall Help Desk to collect reward!
              </p>

              <button
                onClick={() => setViewState('PRIZE_CLAIM')}
                className="mt-2 text-xs text-akm-gold-royal font-bold uppercase tracking-wider underline block mx-auto cursor-pointer"
              >
                Back to Claim Screen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </motion.div>
  );
};

export default LandingPage;
