import React from 'react';
import { motion } from 'framer-motion';

export const CinematicHero: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto px-4 z-10">
      {/* Brand Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1"
      >
        <span className="text-[11px] sm:text-xs font-serif font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
          Anu Krishna Mall
        </span>
        <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-akm-gold-royal/60 to-transparent" />
      </motion.div>

      {/* Main Title: Apple-style bold headline with metallic shine */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-4xl sm:text-6xl font-black tracking-tight text-gold-metallic drop-shadow-2xl leading-none"
      >
        AKM LUCKY DRAW
      </motion.h1>

      {/* Minimalist Subtext Pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-akm-purple-light/30 border border-akm-gold-royal/30 text-akm-gold-light text-xs font-semibold tracking-[0.25em] uppercase backdrop-blur-md shadow-gold-glow"
      >
        <span>Shop</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Scan</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Win</span>
      </motion.div>
    </div>
  );
};
