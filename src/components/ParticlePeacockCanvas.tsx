import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ParticlePeacockCanvas: React.FC = () => {
  const [phase, setPhase] = useState<'SPARK' | 'PEACOCK' | 'LOGO'>('SPARK');

  useEffect(() => {
    // Phase 1: Spark (0s - 0.4s)
    // Phase 2: Particle Peacock Assembly & Rotation (0.4s - 1.4s)
    const t1 = setTimeout(() => setPhase('PEACOCK'), 400);

    // Phase 3: Morphing into Official Logo (1.4s+)
    const t2 = setTimeout(() => setPhase('LOGO'), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center text-center my-auto w-full z-20">
      {/* PHASE 1: Single Golden Center Spark */}
      {phase === 'SPARK' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0.8], opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-4 h-4 rounded-full bg-akm-gold-royal shadow-[0_0_40px_rgba(255,215,0,1)]"
        />
      )}

      {/* PHASE 2: Particle Peacock Silhouette Formation */}
      {phase === 'PEACOCK' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-akm-gold-royal/20 blur-xl animate-pulse" />

          {/* Golden Particle Peacock Vector Graphic */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-akm-gold-royal fill-current drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className="animate-spin-slow" />
            <path d="M50,15 C40,15 32,25 32,40 C32,58 50,75 50,75 C50,75 68,58 68,40 C68,25 60,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Peacock Fan Feathers */}
            <circle cx="35" cy="30" r="4" />
            <circle cx="50" cy="22" r="4" />
            <circle cx="65" cy="30" r="4" />
            <circle cx="28" cy="42" r="4" />
            <circle cx="72" cy="42" r="4" />
          </svg>
        </motion.div>
      )}

      {/* PHASE 3: Completed Official Peacock Logo Reveal */}
      {phase === 'LOGO' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center"
        >
          {/* Soft Bloom Depth Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-akm-gold-royal/30 via-akm-purple-bright/40 to-transparent blur-3xl pointer-events-none" />

          {/* Dual Rotating Concentric Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-akm-gold-royal/40 border-dashed animate-spin-slow pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
          </div>

          {/* Official Logo Container */}
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 25px rgba(255,215,0,0.4))',
                'drop-shadow(0 0 45px rgba(255,215,0,0.8))',
                'drop-shadow(0 0 25px rgba(255,215,0,0.4))'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-akm-purple-light/90 via-akm-purple-base to-akm-purple-deepest p-3 sm:p-4 border-2 border-akm-gold-royal/60 shadow-glass flex items-center justify-center overflow-hidden group"
          >
            {/* Top Specular Edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-light to-transparent" />

            {/* Official Logo Asset */}
            <img
              src="/akm-logo.png"
              alt="Anu Krishna Mall Official Peacock Logo"
              className="w-full h-full object-contain drop-shadow-xl relative z-10"
            />

            {/* Golden Light Sweep Beam */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '120%', opacity: [0, 1, 0] }}
              transition={{ delay: 0.6, duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-akm-gold-light/60 to-transparent skew-x-12 pointer-events-none z-20"
            />
          </motion.div>

          {/* Brand Name Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-1 mt-4"
          >
            <span className="text-xs sm:text-sm font-serif font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
              Anu Krishna Mall
            </span>
            <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-akm-gold-royal/70 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
