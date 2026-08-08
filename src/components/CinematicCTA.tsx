import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LandingPageProps } from '../types';

export const CinematicCTA: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xs mx-auto px-4 pb-8 z-20"
    >
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.04, boxShadow: '0 0 45px rgba(255, 215, 0, 0.65)' }}
        whileTap={{ scale: 0.96 }}
        className="relative w-full group overflow-hidden rounded-full p-[2px] focus:outline-none shadow-gold-glow-lg transition-all duration-300"
      >
        {/* Animated Rotating Gradient Border */}
        <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Button Inner Body */}
        <div className="relative flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-gradient-to-r from-akm-purple-base via-akm-purple-light to-akm-purple-base text-akm-gold-light font-sans font-bold text-base sm:text-lg tracking-widest uppercase overflow-hidden">
          
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 bg-gold-shimmer -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          <Sparkles className="w-5 h-5 text-akm-gold-royal animate-pulse" />
          
          <span className="text-gold-light font-black drop-shadow">
            Enter Experience
          </span>

          <ArrowRight className="w-5 h-5 text-akm-gold-royal group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>
    </motion.div>
  );
};
