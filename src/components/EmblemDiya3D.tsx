import React from 'react';
import { motion } from 'framer-motion';

export const EmblemDiya3D: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center my-4"
    >
      {/* Multilayer Pulsing Golden Aura Ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-akm-gold-royal/20 via-akm-purple-light/40 to-akm-gold-royal/10 blur-2xl pointer-events-none"
      />

      {/* Rotating Concentric Royal Ring */}
      <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-akm-gold-royal/30 animate-spin-slow pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-akm-gold-royal shadow-gold-glow" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-akm-gold-royal shadow-gold-glow" />
      </div>

      {/* Center 3D Diya & Crown Emblem Container */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-akm-purple-light/80 to-akm-purple-deepest border-2 border-akm-gold-royal/60 flex items-center justify-center shadow-gold-glow-lg backdrop-blur-xl group">
        {/* Top Edge Gold Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-light to-transparent" />

        {/* Diya SVG Icon with Flame Animation */}
        <div className="relative flex flex-col items-center">
          {/* Breathing Flame */}
          <motion.div
            animate={{ scale: [1, 1.18, 0.95, 1.1, 1], opacity: [0.85, 1, 0.9, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-6 h-9 sm:w-8 sm:h-11 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full blur-[1px] shadow-[0_0_25px_rgba(255,215,0,0.9)] mb-[-6px] z-10"
          />

          {/* Golden Lamp Body */}
          <svg viewBox="0 0 100 60" className="w-16 h-10 sm:w-20 sm:h-12 text-akm-gold-royal fill-current drop-shadow-lg">
            <path d="M10,20 Q50,60 90,20 Q60,35 50,35 Q40,35 10,20 Z" />
            <path d="M50,35 Q50,55 50,55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
