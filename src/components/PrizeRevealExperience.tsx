import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, Award, Gift } from 'lucide-react';
import { Prize } from '../data/prizes';

interface PrizeRevealExperienceProps {
  boxId: number;
  prize: Prize;
  onClaimClick: () => void;
}

export const PrizeRevealExperience: React.FC<PrizeRevealExperienceProps> = ({
  boxId,
  prize,
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
          <span>Congratulations Winner!</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold-metallic">
          You Won {prize.title}!
        </h2>

        <p className="text-xs text-gray-300 font-sans max-w-xs mx-auto leading-relaxed">
          Anu Krishna Mall Diwali Festival 2026 Official Lucky Draw Reward.
        </p>
      </motion.div>

      {/* 2. Prize Card Presentation (Smooth Scale 0.85 -> 1.0) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#0F061A]/95 border-2 border-akm-gold-royal/60 rounded-3xl p-6 shadow-glass-lg overflow-hidden space-y-4"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gold-metallic" />

        {/* Prize Icon Badge Container */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-2xl bg-[#07020E] border border-akm-gold-royal/30 p-3 shadow-inner flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-akm-gold-royal/10 blur-xl pointer-events-none" />
          <Gift className="w-14 h-14 text-akm-gold-royal drop-shadow-2xl relative z-10" />
        </div>

        {/* Prize Details & Value */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-akm-gold-royal bg-akm-purple-deepest px-3 py-1 rounded-full border border-akm-gold-royal/30 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-akm-gold-royal" />
            <span>Worth {prize.value}</span>
          </div>

          <h3 className="font-heading text-lg font-bold text-white pt-1">
            {prize.title}
          </h3>

          <p className="text-xs text-gray-300 leading-relaxed">
            {prize.description}
          </p>
        </div>
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
