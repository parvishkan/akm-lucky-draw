import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const CinematicLogoReveal: React.FC = () => {
  const titleLetters = "AKM LUCKY DRAW".split("");

  return (
    <div className="relative flex flex-col items-center justify-center text-center space-y-6 z-10 my-auto w-full px-4">
      {/* 1 & 9. Soft Bloom Depth Aura behind the Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.7, 0.45], scale: [0.5, 1.2, 1] }}
        transition={{ delay: 0.3, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-12 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-akm-gold-royal/30 via-akm-purple-bright/40 to-transparent blur-3xl pointer-events-none"
      />

      {/* 2 & 6. Rotating Dual Golden Light Rings around the Logo Pedestal */}
      <motion.div
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ delay: 0.6, duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-akm-gold-royal/35 border-dashed pointer-events-none"
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
      </motion.div>

      {/* 3, 4, 7. Official Anu Krishna Mall Peacock Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative group"
      >
        {/* 7. Gentle Breathing Glow Outer Pedestal */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 25px rgba(255,215,0,0.4))', 'drop-shadow(0 0 45px rgba(255,215,0,0.75))', 'drop-shadow(0 0 25px rgba(255,215,0,0.4))'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-akm-purple-light/90 via-akm-purple-base to-akm-purple-deepest p-3 sm:p-4 border-2 border-akm-gold-royal/60 shadow-glass flex items-center justify-center overflow-hidden"
        >
          {/* Top Highlight Specular Edge */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-light to-transparent" />

          {/* 3. Official Peacock Logo Asset */}
          <img
            src="/akm-logo.png"
            alt="Anu Krishna Mall Official Logo"
            className="w-full h-full object-contain drop-shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105"
          />

          {/* 4. Golden Metallic Light Sweep Beam (Sweeps Left to Right) */}
          <motion.div
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '120%', opacity: [0, 1, 0] }}
            transition={{ delay: 1.3, duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-akm-gold-light/60 to-transparent skew-x-12 pointer-events-none z-20"
          />
        </motion.div>
      </motion.div>

      {/* Brand Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="space-y-1"
      >
        <span className="text-xs sm:text-sm font-serif font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
          Anu Krishna Mall
        </span>
        <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-akm-gold-royal/70 to-transparent" />
      </motion.div>

      {/* 10. AKM LUCKY DRAW Title with Staggered Letter Animations */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap py-1">
        {titleLetters.map((letter, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 2.2 + idx * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-gold-metallic drop-shadow-2xl"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>

      {/* Subtle Diwali Tagline Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
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
