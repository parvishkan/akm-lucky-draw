import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const LetterStaggerTitle: React.FC = () => {
  const letters = "AKM LUCKY DRAW".split("");

  return (
    <div className="flex flex-col items-center text-center space-y-3 z-10 px-4 my-2">
      {/* Letter by Letter Stagger Animation */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: 2.3 + index * 0.05,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-gold-metallic drop-shadow-2xl"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtext Diwali Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 3.1, duration: 0.6 }}
        className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-akm-purple-light/40 border border-akm-gold-royal/35 text-akm-gold-light text-xs font-sans font-semibold tracking-[0.25em] uppercase backdrop-blur-md shadow-gold-glow"
      >
        <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
        <span>Shop</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Scan</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Win</span>
        <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
      </motion.div>
    </div>
  );
};
