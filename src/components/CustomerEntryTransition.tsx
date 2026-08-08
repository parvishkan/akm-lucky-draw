import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

interface TransitionProps {
  onComplete: () => void;
}

export const CustomerEntryTransition: React.FC<TransitionProps> = ({ onComplete }) => {
  useEffect(() => {
    // 1.8s Luxury Loading Transition Delay before pausing prior to Token Verification
    const timer = setTimeout(() => {
      onComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center p-4 text-center select-none"
    >
      {/* Central Rotating Golden Ring & Monogram Container */}
      <div className="relative flex items-center justify-center my-auto">
        {/* Soft Golden Bloom Background Aura */}
        <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-akm-gold-royal/20 blur-2xl animate-pulse" />

        {/* Concentric Rotating Golden Light Ring */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-akm-gold-royal/40 border-dashed animate-spin-slow">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-akm-gold-royal shadow-gold-glow" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-akm-gold-royal shadow-gold-glow" />
        </div>

        {/* AKM Peacock Monogram Center Pedestal */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-akm-purple-light/90 to-akm-purple-deepest p-2 border-2 border-akm-gold-royal/60 shadow-glass flex items-center justify-center overflow-hidden"
        >
          <img
            src={APP_CONFIG.brand.logoPath}
            alt="AKM Monogram"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </motion.div>
      </div>

      {/* Luxury Loading Micro-Copy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3 mb-auto pb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-akm-purple-light/50 border border-akm-gold-royal/30 text-akm-gold-light text-xs font-sans font-semibold tracking-widest uppercase shadow-gold-glow">
          <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-pulse" />
          <span>Securing Festival Privilege</span>
        </div>

        <h3 className="font-heading text-lg sm:text-xl font-bold text-gold-metallic">
          Anu Krishna Mall
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticating Token Access...</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerEntryTransition;
