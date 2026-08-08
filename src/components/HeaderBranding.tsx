import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';

export const HeaderBranding: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center space-y-3 pt-6 pb-2"
    >
      {/* Festive Diwali Season Pill Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-akm-purple-light/50 border border-akm-gold-royal/30 backdrop-blur-md shadow-gold-glow"
      >
        <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-akm-gold-light">
          Diwali Grand Celebration
        </span>
        <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
      </motion.div>

      {/* Royal AKM Mall Emblem & Title */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-akm-gold-royal" />
          <h2 className="font-serif text-sm sm:text-base font-bold tracking-[0.25em] text-akm-gold-royal uppercase">
            Anu Krishna Mall
          </h2>
          <Crown className="w-5 h-5 text-akm-gold-royal" />
        </div>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-royal/50 to-transparent" />
      </div>
    </motion.header>
  );
};
