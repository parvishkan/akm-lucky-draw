import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Star, Lock } from 'lucide-react';
import { MysteryRevealProps } from '../types';
import { Prizes, Prize } from '../data/prizes';

export const MysteryGiftReveal: React.FC<MysteryRevealProps> = ({ tokenData, onPrizeRevealed }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedPrize, setRevealedPrize] = useState<Prize | null>(null);

  const boxes = [
    { id: 0, label: 'Royal Box I', color: 'from-amber-400 via-yellow-500 to-amber-700' },
    { id: 1, label: 'Royal Box II', color: 'from-yellow-300 via-amber-400 to-yellow-600' },
    { id: 2, label: 'Royal Box III', color: 'from-amber-500 via-yellow-400 to-amber-800' }
  ];

  const handleSelectBox = (index: number) => {
    if (isOpening || selectedIndex !== null) return;
    setSelectedIndex(index);
    setIsOpening(true);

    const wonPrize = Prizes.getRandomPrize();
    setRevealedPrize(wonPrize);

    // Suspense opening delay before transitioning to certificate
    setTimeout(() => {
      onPrizeRevealed(wonPrize);
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto my-auto px-4 py-4 z-20 text-center space-y-6"
    >
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-akm-gold-royal/10 border border-akm-gold-royal/30 text-akm-gold-light text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
          <span>Diwali Mystery Gift Reveal</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-metallic">
          Choose Your Diwali Box
        </h2>

        <p className="text-xs sm:text-sm text-gray-200/90 font-sans max-w-xs mx-auto leading-relaxed">
          Token <span className="text-akm-gold-royal font-mono font-bold">{tokenData.tokenCode}</span> verified. Select one of the three royal gifts to reveal your prize.
        </p>
      </div>

      {/* 3 Interactive Mystery Boxes */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4">
        {boxes.map((box, index) => {
          const isSelected = selectedIndex === index;
          const isOtherSelected = selectedIndex !== null && !isSelected;

          return (
            <motion.button
              key={box.id}
              onClick={() => handleSelectBox(index)}
              disabled={isOpening}
              animate={
                isSelected
                  ? { scale: [1, 1.1, 1.05], y: [-5, -20, -15], rotate: [0, -5, 5, 0] }
                  : isOtherSelected
                  ? { opacity: 0.3, scale: 0.85 }
                  : { y: [0, -6, 0] }
              }
              transition={
                isSelected
                  ? { duration: 1.8, ease: "easeInOut" }
                  : { repeat: Infinity, duration: 3 + index * 0.4, ease: "easeInOut" }
              }
              whileHover={!isOpening ? { scale: 1.06, y: -8 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              className="relative group focus:outline-none"
            >
              {/* Glass Pedestal Stand */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 relative flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] border border-akm-gold-royal/30 shadow-glass overflow-hidden">
                {/* Top Spotlight Glow */}
                <div className={`absolute -top-10 inset-x-0 h-20 rounded-full blur-xl transition-opacity ${isSelected ? 'bg-akm-gold-royal/40 opacity-100' : 'bg-akm-gold-royal/10 opacity-50'}`} />

                {/* Lock / Star Status Badge */}
                <div className="absolute top-2 right-2">
                  {isSelected ? (
                    <Star className="w-4 h-4 text-akm-gold-royal fill-akm-gold-royal animate-spin-slow" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-akm-gold-royal/50" />
                  )}
                </div>

                {/* 3D Gift Box Icon Container */}
                <div className="my-auto relative">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${box.color} p-[2px] shadow-gold-glow-lg transition-transform duration-300 group-hover:scale-105`}>
                    <div className="w-full h-full bg-akm-purple-deepest rounded-[14px] flex items-center justify-center relative overflow-hidden">
                      <Gift className={`w-7 h-7 sm:w-8 sm:h-8 text-akm-gold-royal ${isSelected ? 'animate-bounce' : 'animate-pulse'}`} />
                      
                      {/* Inner Ribbon Cross Accent */}
                      <div className="absolute inset-0 border-t border-b border-akm-gold-royal/30 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <div className="absolute inset-0 border-l border-r border-akm-gold-royal/30 left-1/2 -translate-x-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Box Label */}
                <div className="pt-2">
                  <span className="text-[11px] font-serif font-bold text-akm-gold-light tracking-wider block">
                    {box.label}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest block">
                    Tap to Open
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Opening Suspense Status Notification */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 border border-akm-gold-royal shadow-gold-glow flex items-center justify-center gap-3 text-akm-gold-light"
          >
            <Sparkles className="w-5 h-5 text-akm-gold-royal animate-spin-slow" />
            <span className="font-serif font-bold text-sm text-gold-metallic animate-pulse">
              Unlocking Diwali Reward...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
