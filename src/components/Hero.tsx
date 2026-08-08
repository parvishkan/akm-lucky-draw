import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HeroProps } from '../types';
import { APP_CONFIG } from '../constants/appConfig';
import { cn } from '../utilities/cn';

export const Hero: React.FC<HeroProps> = ({
  className
}) => {
  const line1 = "AKM LUCKY".split("");
  const line2 = "DRAW".split("");

  return (
    <div className={cn("flex flex-col items-center text-center my-auto w-full max-w-md mx-auto z-10 px-3 space-y-2.5 select-none pt-0", className)}>
      
      {/* 1. Official Logo Presentation & Animation (0.9 -> 1.0 Scale, SVG Ring Draw, Breathing Glow) */}
      <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 my-1">
        
        {/* Soft Ambient Golden Glow in Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-full bg-akm-gold-royal/20 blur-3xl pointer-events-none"
        />

        {/* Thin Gold Ring Draws Around the Logo */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            stroke="url(#goldRingDraw)"
            strokeWidth="1.5"
            strokeDasharray="305"
            initial={{ strokeDashoffset: 305 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="goldRingDraw" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo Image Asset (Smooth Scale 0.9 -> 1.0, Subtle Breathing Glow) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center justify-center w-full h-full p-1"
        >
          <motion.img
            animate={{ scale: [1, 1.018, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src={APP_CONFIG.brand.logoPath}
            alt={`${APP_CONFIG.brand.mallName} Official Logo`}
            className="w-56 h-56 sm:w-68 sm:h-68 object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
          />
        </motion.div>
      </div>

      {/* 2. Sequential Reveal 1: ANU KRISHNA MALL (Smooth Upward Motion) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1 pt-0.5"
      >
        <span className="text-xs sm:text-sm font-heading font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase block">
          {APP_CONFIG.brand.mallName}
        </span>
        <div className="w-16 h-[1px] mx-auto bg-gradient-to-r from-transparent via-akm-gold-royal/60 to-transparent" />
      </motion.div>

      {/* 3. Sequential Reveal 2: AKM LUCKY DRAW (Letter-by-Letter Upward Motion) */}
      <div className="flex flex-col items-center justify-center pt-0.5 space-y-0">
        
        {/* Line 1: AKM LUCKY */}
        <div className="flex justify-center items-center gap-1 sm:gap-1.5">
          {line1.map((letter, index) => (
            <motion.span
              key={`l1-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.1 + index * 0.03,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-gold-metallic drop-shadow-2xl"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Line 2: DRAW */}
        <div className="flex justify-center items-center gap-1 sm:gap-1.5">
          {line2.map((letter, index) => (
            <motion.span
              key={`l2-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.4 + index * 0.04,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-gold-metallic drop-shadow-2xl"
            >
              {letter}
            </motion.span>
          ))}
        </div>

      </div>

      {/* 4. Sequential Reveal 3: SHOP • SCAN • WIN (Smooth Upward Motion) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-akm-purple-light/40 border border-akm-gold-royal/35 text-akm-gold-light text-[11px] font-sans font-semibold tracking-[0.2em] uppercase backdrop-blur-md shadow-gold-glow"
      >
        <Sparkles className="w-3 h-3 text-akm-gold-royal animate-pulse" />
        <span>Shop</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Scan</span>
        <span className="text-akm-gold-royal">•</span>
        <span>Win</span>
        <Sparkles className="w-3 h-3 text-akm-gold-royal animate-pulse" />
      </motion.div>

    </div>
  );
};

export default Hero;
