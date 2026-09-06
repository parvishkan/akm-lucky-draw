import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Lock, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Prize } from '../data/prizes';
import { AllocationEngine } from '../services/allocationEngine';
import { CampaignService, TimeSlotData } from '../services/campaignService';

interface MysteryBoxExperienceProps {
  tokenCode: string;
  slotId?: string;
  onBoxSelected: (boxId: number, prize: Prize, claimId: string) => void;
}

export const MysteryBoxExperience: React.FC<MysteryBoxExperienceProps> = ({
  tokenCode,
  slotId = 'slot-day1-morning',
  onBoxSelected
}) => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Time Slot State
  const [timeSlot, setTimeSlot] = useState<TimeSlotData | null>(null);
  const [slotStatus, setSlotStatus] = useState<'LOADING' | 'BEFORE_START' | 'LOCKED_WAITING' | 'UNLOCKED' | 'EXPIRED'>('LOADING');
  const [unlockTimeStr, setUnlockTimeStr] = useState<string>('09:30 AM');
  const [timeRemainingStr, setTimeRemainingStr] = useState<string>('00:00:00');

  // Load Time Slot Configuration & Evaluate Time Gating State
  useEffect(() => {
    async function loadSlot() {
      try {
        const slots = await CampaignService.getTimeSlots('akm-diwali-2026');
        const currentSlot = slots.find(s => s.slotId === slotId || s.id === slotId) || slots[0];

        if (currentSlot) {
          setTimeSlot(currentSlot);
          evaluateSlotTime(currentSlot);
        } else {
          setSlotStatus('UNLOCKED');
        }
      } catch (err) {
        setSlotStatus('UNLOCKED');
      }
    }

    loadSlot();
    const interval = setInterval(() => {
      if (timeSlot) evaluateSlotTime(timeSlot);
    }, 1000);

    return () => clearInterval(interval);
  }, [slotId, timeSlot?.slotId]);

  const evaluateSlotTime = (slot: TimeSlotData) => {
    const now = Date.now();
    
    // Parse timestamps (Firestore Timestamp or ISO string or Date)
    const getMillis = (val: any) => {
      if (!val) return null;
      if (val.toDate) return val.toDate().getTime();
      if (val.seconds) return val.seconds * 1000;
      return new Date(val).getTime();
    };

    const startMillis = getMillis(slot.slotStart);
    const unlockMillis = getMillis(slot.giftUnlock);
    const endMillis = getMillis(slot.slotEnd);

    if (unlockMillis) {
      setUnlockTimeStr(new Date(unlockMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    }

    if (startMillis && now < startMillis) {
      setSlotStatus('BEFORE_START');
      return;
    }

    if (unlockMillis && now < unlockMillis) {
      setSlotStatus('LOCKED_WAITING');
      const diff = Math.max(0, unlockMillis - now);
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setTimeRemainingStr(`${hours}:${minutes}:${seconds}`);
      return;
    }

    if (endMillis && now > endMillis) {
      setSlotStatus('EXPIRED');
      return;
    }

    setSlotStatus('UNLOCKED');
  };

  // 10 Floating Golden Dust Particles
  const dustParticles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: (i * 22) % 85 + 7,
    y: (i * 31) % 80 + 10,
    duration: 5 + (i % 4) * 1.5,
    delay: (i % 3) * 0.7
  }));

  const handleBoxClick = async (boxId: number) => {
    if (slotStatus === 'LOCKED_WAITING' || slotStatus === 'BEFORE_START' || slotStatus === 'EXPIRED') return;
    if (selectedBox !== null || isLocking) return;

    setSelectedBox(boxId);
    setIsLocking(true);
    setErrorMessage('');

    try {
      // Execute trusted server-side allocation (sends ONLY tokenCode)
      const allocation = await AllocationEngine.allocatePrize(tokenCode);

      setTimeout(() => {
        onBoxSelected(boxId, allocation.prize, allocation.claimId);
      }, 1400);
    } catch (err: any) {
      setIsLocking(false);
      setSelectedBox(null);
      setErrorMessage(err?.message || 'Server allocation error. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 text-center select-none space-y-6">
      
      {/* 1. Header & Instruction */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-akm-gold-royal/15 border border-akm-gold-royal/40 text-akm-gold-light text-xs font-semibold uppercase tracking-widest shadow-gold-glow">
          {slotStatus === 'LOCKED_WAITING' ? (
            <>
              <Lock className="w-3.5 h-3.5 text-akm-gold-royal" />
              <span>Token Verified ✓</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal" />
              <span>Diwali Festival Reward</span>
            </>
          )}
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold-metallic">
          {slotStatus === 'LOCKED_WAITING'
            ? 'Your Gift Is Locked'
            : slotStatus === 'UNLOCKED'
            ? 'Choose Your Mystery Box'
            : slotStatus === 'EXPIRED'
            ? 'Time Slot Closed'
            : 'Token Authenticated'}
        </h2>

        <p className="text-xs text-gray-300 font-sans max-w-xs mx-auto leading-relaxed">
          {slotStatus === 'LOCKED_WAITING'
            ? `Your token is verified! Gift unlocks at ${unlockTimeStr}.`
            : slotStatus === 'UNLOCKED'
            ? 'Tap any of the 3 luxury gift boxes below to unveil your exclusive reward.'
            : slotStatus === 'EXPIRED'
            ? 'This time slot has concluded. Please check with Help Desk Counter.'
            : 'Evaluating time slot parameters...'}
        </p>
      </motion.div>

      {/* Floating Golden Dust Particles Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {dustParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-15, 15, -15]
            }}
            transition={{
              repeat: Infinity,
              duration: p.duration,
              delay: p.delay,
              ease: "easeInOut"
            }}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute w-1.5 h-1.5 rounded-full bg-akm-gold-royal/70 blur-[0.5px]"
          />
        ))}
      </div>

      {/* BEFORE UNLOCK: Live Countdown Display Badge */}
      {slotStatus === 'LOCKED_WAITING' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-3xl bg-[#0F061A]/95 border-2 border-akm-gold-royal/60 shadow-[0_0_35px_rgba(255,215,0,0.3)] space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-akm-gold-royal text-xs font-extrabold uppercase tracking-widest">
            <Clock className="w-4 h-4 text-akm-gold-royal animate-pulse" />
            <span>Unlocks In</span>
          </div>

          <div className="font-mono text-3xl font-black text-white tracking-widest drop-shadow-md">
            {timeRemainingStr}
          </div>

          <p className="text-[10px] text-gray-400">
            Unlocks automatically at {unlockTimeStr}. Stay on this screen!
          </p>
        </motion.div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. 3 Luxury Mystery Boxes Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10 pt-2">
        {[1, 2, 3].map((boxId, index) => {
          const isThisSelected = selectedBox === boxId;
          const isOtherSelected = selectedBox !== null && selectedBox !== boxId;
          const isLockedState = slotStatus === 'LOCKED_WAITING' || slotStatus === 'BEFORE_START' || slotStatus === 'EXPIRED';

          return (
            <motion.div
              key={boxId}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={isThisSelected ? {
                scale: 1.05,
                y: -8,
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.85)'
              } : isOtherSelected || isLockedState ? {
                opacity: isLockedState ? 0.6 : 0.35,
                scale: 0.95,
                y: 0
              } : {
                opacity: 1,
                y: [-4, 4, -4],
                scale: 1
              }}
              transition={isThisSelected ? {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              } : {
                delay: 0.1 + index * 0.15,
                duration: 0.7,
                type: "spring",
                stiffness: 220,
                damping: 18
              }}
              onClick={() => handleBoxClick(boxId)}
              className={`relative rounded-3xl p-4 sm:p-5 border flex flex-col items-center justify-between transition-all duration-300 ${
                isLockedState
                  ? 'bg-[#0F061A]/60 border-gray-600/40 cursor-not-allowed'
                  : isThisSelected
                  ? 'bg-gradient-to-b from-akm-purple-light via-akm-purple-base to-akm-purple-deepest border-akm-gold-royal shadow-[0_0_45px_#FFD700] cursor-pointer'
                  : 'bg-[#0F061A]/90 border-akm-gold-royal/40 hover:border-akm-gold-royal hover:shadow-gold-glow backdrop-blur-md cursor-pointer'
              }`}
            >
              {/* Box Header Badge */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-akm-gold-light uppercase tracking-wider font-mono">
                  Box #{boxId}
                </span>
                {isLockedState || isThisSelected ? (
                  <Lock className="w-3.5 h-3.5 text-akm-gold-royal" />
                ) : (
                  <Sparkles className="w-3 h-3 text-akm-gold-royal/60" />
                )}
              </div>

              {/* 3D Luxury Box Visual Container */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center">
                
                {/* Ambient Soft Floating Glow Behind Box */}
                <div className={`absolute inset-0 rounded-full blur-xl pointer-events-none transition-opacity ${
                  isThisSelected ? 'bg-akm-gold-royal/50 opacity-100' : 'bg-akm-gold-royal/20 opacity-60'
                }`} />

                {/* Box Lid Animation */}
                <motion.div
                  animate={isThisSelected ? {
                    rotate: [-3, 3, -3, 3, 0],
                    y: [-2, 2, -2, 2, 0]
                  } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 shadow-2xl flex items-center justify-center ${
                    isLockedState 
                      ? 'bg-gradient-to-b from-gray-500 to-gray-800' 
                      : 'bg-gradient-to-b from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze'
                  }`}>
                    <div className="w-full h-full rounded-2xl bg-[#07020E] p-2 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Gold Ribbon Accent */}
                      <div className="absolute inset-y-0 w-3 bg-gradient-to-b from-amber-200 via-akm-gold-royal to-amber-400 opacity-90" />
                      <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-amber-200 via-akm-gold-royal to-amber-400 opacity-90" />
                      {isLockedState ? (
                        <Lock className="w-7 h-7 text-gray-400 relative z-10" />
                      ) : (
                        <Gift className="w-8 h-8 text-akm-gold-light relative z-10 drop-shadow-md" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Box Footer Button Label */}
              <span className={`text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isLockedState
                  ? 'text-gray-400'
                  : isThisSelected
                  ? 'text-akm-gold-royal font-extrabold'
                  : 'text-gray-300 group-hover:text-akm-gold-light'
              }`}>
                {isLockedState ? 'Locked' : isThisSelected ? 'Unlocking...' : 'Tap To Open'}
              </span>

            </motion.div>
          );
        })}
      </div>

      {/* Status Footer */}
      <AnimatePresence>
        {selectedBox !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-2xl bg-akm-purple-light/40 border border-akm-gold-royal/50 text-akm-gold-light text-xs font-semibold flex items-center justify-center gap-2 shadow-gold-glow"
          >
            <Sparkles className="w-4 h-4 text-akm-gold-royal animate-spin" />
            <span>Executing trusted server reveal for Box #{selectedBox}...</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MysteryBoxExperience;
