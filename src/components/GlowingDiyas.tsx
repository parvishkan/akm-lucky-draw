import React from 'react';
import { motion } from 'framer-motion';

export const GlowingDiyas: React.FC = () => {
  return (
    <div className="fixed bottom-3 inset-x-0 flex justify-between px-6 pointer-events-none z-10">
      {/* Left Glowing Diya */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative flex flex-col items-center"
      >
        {/* Flame Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 0.95, 1.15, 1], opacity: [0.75, 1, 0.8, 0.95, 0.75] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-4 h-7 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full blur-[1px] shadow-[0_0_20px_rgba(255,215,0,0.9)] mb-[-4px] z-10"
        />
        {/* Lamp Base */}
        <svg viewBox="0 0 60 35" className="w-10 h-6 text-akm-gold-royal fill-current drop-shadow-md">
          <path d="M5,10 Q30,35 55,10 Q35,20 30,20 Q25,20 5,10 Z" />
        </svg>
      </motion.div>

      {/* Right Glowing Diya */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="relative flex flex-col items-center"
      >
        {/* Flame Glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 0.9, 1.2, 1], opacity: [0.8, 0.95, 0.75, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
          className="w-4 h-7 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full blur-[1px] shadow-[0_0_20px_rgba(255,215,0,0.9)] mb-[-4px] z-10"
        />
        {/* Lamp Base */}
        <svg viewBox="0 0 60 35" className="w-10 h-6 text-akm-gold-royal fill-current drop-shadow-md">
          <path d="M5,10 Q30,35 55,10 Q35,20 30,20 Q25,20 5,10 Z" />
        </svg>
      </motion.div>
    </div>
  );
};
