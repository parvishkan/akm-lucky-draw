import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Lock } from 'lucide-react';
import { Prizes, Prize } from '../data/prizes';
import { AllocationEngine } from '../services/allocationEngine';

interface MysteryBoxExperienceProps {
  tokenCode: string;
  onBoxSelected: (boxId: number, prize: Prize, claimId: string) => void;
}

export const MysteryBoxExperience: React.FC<MysteryBoxExperienceProps> = ({
  tokenCode,
  onBoxSelected
}) => {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);

  // 10 Floating Golden Dust Particles
  const dustParticles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: (i * 22) % 85 + 7,
    y: (i * 31) % 80 + 10,
    duration: 5 + (i % 4) * 1.5,
    delay: (i % 3) * 0.7
  }));

  const handleBoxClick = async (boxId: number) => {
    if (selectedBox !== null || isLocking) return;

    setSelectedBox(boxId);
    setIsLocking(true);

    try {
      // Allocate Prize backend allocation engine
      const allocation = await AllocationEngine.allocatePrize(tokenCode, boxId);

      setTimeout(() => {
        onBoxSelected(boxId, allocation.prize, allocation.claimId);
      }, 1400);
    } catch (err) {
      // Fallback prize allocation
      const fallbackPrize = Prizes.getRandomPrize();
      const fallbackClaimId = `AKM-CLAIM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      setTimeout(() => {
        onBoxSelected(boxId, fallbackPrize, fallbackClaimId);
      }, 1400);
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
          <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal" />
          <span>Diwali Festival Reward</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold-metallic">
          Choose Your Mystery Box
        </h2>

        <p className="text-xs text-gray-300 font-sans max-w-xs mx-auto leading-relaxed">
          Tap any of the 3 luxury gift boxes below to unveil your exclusive reward.
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

      {/* 2. 3 Luxury Mystery Boxes Grid (Staggered Entrance & Hover Shake) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10 pt-2">
        {[1, 2, 3].map((boxId, index) => {
          const isThisSelected = selectedBox === boxId;
          const isOtherSelected = selectedBox !== null && selectedBox !== boxId;

          return (
            <motion.div
              key={boxId}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={isThisSelected ? {
                scale: 1.05,
                y: -8,
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.85)'
              } : isOtherSelected ? {
                opacity: 0.35,
                scale: 0.9,
                y: 10
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
                damping: 18,
                y: { repeat: Infinity, duration: 4 + index * 0.5, ease: "easeInOut" }
              }}
              onClick={() => handleBoxClick(boxId)}
              className={`relative rounded-3xl p-4 sm:p-5 border flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
                isThisSelected
                  ? 'bg-gradient-to-b from-akm-purple-light via-akm-purple-base to-akm-purple-deepest border-akm-gold-royal shadow-[0_0_45px_#FFD700]'
                  : 'bg-[#0F061A]/90 border-akm-gold-royal/40 hover:border-akm-gold-royal hover:shadow-gold-glow backdrop-blur-md'
              }`}
            >
              {/* Box Header Badge */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-akm-gold-light uppercase tracking-wider font-mono">
                  Box #{boxId}
                </span>
                {isThisSelected ? (
                  <Lock className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
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

                {/* Box Lid Animation (Shakes Gently on Tap) */}
                <motion.div
                  animate={isThisSelected ? {
                    rotate: [-3, 3, -3, 3, 0],
                    y: [-2, 2, -2, 2, 0]
                  } : {}}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze p-0.5 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full rounded-2xl bg-[#07020E] p-2 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Gold Ribbon Accent */}
                      <div className="absolute inset-y-0 w-3 bg-gradient-to-b from-amber-200 via-akm-gold-royal to-amber-400 opacity-90" />
                      <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-amber-200 via-akm-gold-royal to-amber-400 opacity-90" />
                      <Gift className="w-8 h-8 text-akm-gold-light relative z-10 drop-shadow-md" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Box Footer Button Label */}
              <span className={`text-[11px] font-bold tracking-wider uppercase transition-colors ${
                isThisSelected ? 'text-akm-gold-royal font-extrabold' : 'text-gray-300 group-hover:text-akm-gold-light'
              }`}>
                {isThisSelected ? 'Unlocking...' : 'Tap To Open'}
              </span>

            </motion.div>
          );
        })}
      </div>

      {/* Selected Box Status Footer */}
      <AnimatePresence>
        {selectedBox !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-2xl bg-akm-purple-light/40 border border-akm-gold-royal/50 text-akm-gold-light text-xs font-semibold flex items-center justify-center gap-2 shadow-gold-glow"
          >
            <Sparkles className="w-4 h-4 text-akm-gold-royal animate-spin" />
            <span>Opening Mystery Box #{selectedBox}... Prepare for Prize Reveal!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MysteryBoxExperience;
