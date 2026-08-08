import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Gift, ArrowRight } from 'lucide-react';
import { VerificationSuccessProps } from '../types';

export const VerificationSuccessCard: React.FC<VerificationSuccessProps> = ({ data, onProceed }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto my-auto px-4 py-4 z-20"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-glass border border-akm-gold-royal/40 space-y-6">
        {/* Glow halo */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
        
        {/* Checkmark Icon Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]"
        >
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </motion.div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Token Verified Successfully</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-metallic">
            Welcome, {data.customerName}!
          </h2>

          <p className="text-xs sm:text-sm text-gray-200/90 font-sans leading-relaxed">
            Your shopping receipt token has been authenticated by <span className="text-akm-gold-royal font-semibold">Anu Krishna Mall</span>.
          </p>
        </div>

        {/* Verified Badge Details Card */}
        <div className="p-4 rounded-2xl bg-akm-purple-deepest/90 border border-akm-gold-royal/30 flex items-center justify-between text-left shadow-inner">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">
              Verified Shopping Token
            </span>
            <span className="font-mono text-lg font-bold text-akm-gold-royal tracking-wider">
              {data.tokenCode}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">
              Status
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Prize Ready
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <motion.button
          onClick={onProceed}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full relative group overflow-hidden rounded-xl p-[2px] focus:outline-none shadow-gold-glow-lg"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-xl" />
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-akm-purple-base via-akm-purple-light to-akm-purple-base text-akm-gold-light font-bold text-base tracking-wider uppercase">
            <Sparkles className="w-5 h-5 text-akm-gold-royal" />
            <span className="text-gold-light font-extrabold">
              Play Mystery Gift Reveal
            </span>
            <ArrowRight className="w-5 h-5 text-akm-gold-royal group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
