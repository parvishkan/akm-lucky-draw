import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { LandingPageProps } from '../types';

export const PrimaryCTA: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xs mx-auto px-4 pb-6 pt-2"
    >
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(255, 215, 0, 0.6)' }}
        whileTap={{ scale: 0.97 }}
        className="relative w-full group overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-akm-gold-royal focus:ring-offset-2 focus:ring-offset-akm-purple-deepest shadow-gold-glow-lg transition-all duration-300"
      >
        {/* Animated Rotating Gradient Border */}
        <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Button Inner Container */}
        <div className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-akm-purple-base via-akm-purple-light to-akm-purple-base text-akm-gold-light font-sans font-bold text-base sm:text-lg tracking-wider uppercase overflow-hidden">
          
          {/* Shimmer Light Sweep Overlay */}
          <div className="absolute inset-0 bg-gold-shimmer -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          <Sparkles className="w-5 h-5 text-akm-gold-royal group-hover:rotate-12 transition-transform duration-300" />
          
          <span className="text-gold-light font-extrabold drop-shadow">
            Start Your Lucky Draw
          </span>

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronRight className="w-5 h-5 text-akm-gold-royal" />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
};
