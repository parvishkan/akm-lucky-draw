import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, Award } from 'lucide-react';
import { Prize } from '../data/prizes';
import PrizeProductVisual from './PrizeProductVisual';

interface PrizeRevealExperienceProps {
  boxId: number;
  prize: Prize;
  claimId?: string;
  onClaimClick: () => void;
}

export const PrizeRevealExperience: React.FC<PrizeRevealExperienceProps> = ({
  boxId,
  prize,
  claimId,
  onClaimClick
}) => {

  // 12 Floating Golden Micro-Particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (i * 17) % 85 + 7,
    y: (i * 27) % 80 + 10,
    duration: 6 + (i % 4) * 1.5,
    delay: (i % 3) * 0.7
  }));

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6 text-center select-none space-y-6 z-10">
      
      {/* Floating Gold Particles Emitters */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-16, 16, -16]
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

      {/* 1. Congratulations Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-akm-gold-royal/15 border border-akm-gold-royal/40 text-akm-gold-light text-xs font-semibold uppercase tracking-widest shadow-gold-glow">
          <Trophy className="w-3.5 h-3.5 text-akm-gold-royal" />
          <span>🎁 YOU WON</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gold-metallic tracking-wide uppercase">
          {prize.title}
        </h2>

        <p className="text-xs text-gray-300 font-sans max-w-xs mx-auto leading-relaxed">
          Anu Krishna Mall Diwali Festival 2026 Official Lucky Draw Reward.
        </p>
      </motion.div>

      {/* 2. Prize Card Presentation with Large Product Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#0F061A]/95 border-2 border-akm-gold-royal/60 rounded-3xl p-6 shadow-glass-lg overflow-hidden space-y-4"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gold-metallic" />

        {/* Large Prominent Prize Product Visual */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl bg-[#07020E] border border-akm-gold-royal/40 p-4 shadow-[0_0_30px_rgba(255,215,0,0.18)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-akm-gold-royal/15 via-transparent to-akm-gold-royal/5 pointer-events-none" />
          <PrizeProductVisual prize={prize} size="hero" alt={prize.title} />
        </div>

        {/* Prize Details & Value */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-akm-gold-royal bg-akm-purple-deepest px-3 py-1 rounded-full border border-akm-gold-royal/30 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-akm-gold-royal" />
            <span>Worth {prize.value}</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white pt-1 tracking-wide uppercase">
            {prize.title}
          </h3>

          <p className="text-xs text-gray-300 leading-relaxed">
            {prize.description}
          </p>
        </div>

        {/* Claim ID & Physical Collection Instruction */}
        {claimId && (
          <div className="pt-2 border-t border-akm-gold-royal/20 space-y-2 text-center">
            <div className="p-3 rounded-2xl bg-[#07020E] border border-akm-gold-royal/40 space-y-1 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                Redemption Claim ID
              </span>
              <span className="font-mono text-xl font-black text-akm-gold-royal tracking-widest block">
                {claimId}
              </span>
            </div>
            <p className="text-xs text-amber-200/95 font-medium leading-relaxed">
              Show this Claim ID at the counter to collect your gift.
            </p>
          </div>
        )}
      </motion.div>

      {/* 3. Primary CTA: Claim My Prize Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.button
          onClick={onClaimClick}
          animate={{
            boxShadow: [
              '0 0 25px rgba(255, 215, 0, 0.4)',
              '0 0 45px rgba(255, 215, 0, 0.7)',
              '0 0 25px rgba(255, 215, 0, 0.4)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze text-akm-purple-deepest font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 border border-amber-200 shadow-gold-glow cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-akm-purple-deepest" />
          <span>Claim My Prize</span>
          <ArrowRight className="w-4 h-4 text-akm-purple-deepest" />
        </motion.button>
      </motion.div>

    </div>
  );
};

export default PrizeRevealExperience;
