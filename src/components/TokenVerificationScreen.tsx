import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { TokenVerificationProps } from '../types';
import { TokensService } from '../services/tokensService';

export const TokenVerificationScreen: React.FC<TokenVerificationProps> = ({ onSuccess }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [validationState, setValidationState] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus cursor on input field upon screen mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim() || validationState === 'LOADING' || validationState === 'SUCCESS') return;

    setValidationState('LOADING');
    setErrorMessage('');

    try {
      const cleanCode = tokenInput.trim().toUpperCase();
      const result = await TokensService.verifyToken(cleanCode);

      if (result.success) {
        // Show scanning & loading state for 1.2s
        setTimeout(() => {
          setValidationState('SUCCESS');
          // Automatically transition to Mystery Box experience after 1.2s success pause
          setTimeout(() => {
            onSuccess({
              tokenCode: cleanCode,
              verifiedAt: new Date().toISOString(),
              isValid: true,
              status: 'VERIFIED'
            });
          }, 1200);
        }, 1200);
      } else {
        setTimeout(() => {
          setValidationState('ERROR');
          setErrorMessage(result.message || 'Invalid token. Please check your billing receipt.');
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setValidationState('ERROR');
        setErrorMessage('Connection error. Please try again.');
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6 text-center select-none">
      
      {/* Verification Card (Slides Up Elegantly) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#0F061A]/90 border border-akm-gold-royal/40 rounded-3xl p-6 sm:p-7 shadow-glass-lg backdrop-blur-xl overflow-hidden space-y-6"
      >
        {/* Ambient Top Gold Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-akm-gold-royal to-transparent" />

        {/* Laser Scanning Line Animation (Active during LOADING state) */}
        <AnimatePresence>
          {validationState === 'LOADING' && (
            <motion.div
              initial={{ top: '0%', opacity: 0 }}
              animate={{
                top: ['0%', '100%', '0%'],
                opacity: [0, 0.8, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-akm-gold-royal to-transparent shadow-[0_0_15px_#FFD700] z-20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* 1. Header Icon & Title */}
        <div className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="w-12 h-12 mx-auto rounded-2xl bg-akm-purple-light/40 border border-akm-gold-royal/50 flex items-center justify-center text-akm-gold-royal shadow-gold-glow"
          >
            <Ticket className="w-6 h-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="space-y-1"
          >
            <h2 className="font-heading text-xl font-bold text-gold-metallic">
              Token Verification
            </h2>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Enter your receipt token code to unlock your lucky mystery box.
            </p>
          </motion.div>
        </div>

        {/* 2. Input Form (Fades In, Cursor Auto-Focus) */}
        <form onSubmit={handleVerify} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="relative"
          >
            <input
              ref={inputRef}
              type="text"
              value={tokenInput}
              onChange={(e) => {
                setTokenInput(e.target.value.toUpperCase());
                if (validationState === 'ERROR') setValidationState('IDLE');
              }}
              placeholder="e.g. AKM-8892"
              disabled={validationState === 'LOADING' || validationState === 'SUCCESS'}
              className={`w-full px-4 py-3.5 bg-[#07020E]/90 border rounded-2xl text-center font-mono text-lg font-bold tracking-widest text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                validationState === 'ERROR'
                  ? 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  : validationState === 'SUCCESS'
                  ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.4)]'
                  : 'border-akm-gold-royal/40 focus:border-akm-gold-royal focus:shadow-gold-glow'
              }`}
            />
          </motion.div>

          {/* Error Message Alert */}
          <AnimatePresence>
            {validationState === 'ERROR' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. Action / Status Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {validationState === 'SUCCESS' ? (
              
              /* Verification Success Button State (SVG Golden Checkmark Draws Itself) */
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 border border-emerald-300 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(52,211,153,0.6)]"
              >
                {/* SVG Golden Checkmark Drawing Animation */}
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
                  <motion.path
                    d="M 10 24 L 20 34 L 38 14"
                    stroke="#FFD700"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </svg>
                <span>Token Verified!</span>
              </motion.div>

            ) : validationState === 'LOADING' ? (

              /* Verification Loading Button State (Golden Circular Loader & Particles) */
              <div className="w-full py-4 rounded-2xl bg-akm-purple-light/50 border border-akm-gold-royal/60 text-akm-gold-light font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-3 shadow-gold-glow">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.0, ease: "linear" }}
                    className="w-5 h-5 rounded-full border-2 border-akm-gold-royal border-t-transparent"
                  />
                  {/* Floating Micro-Particle Emitter around Loader */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute w-2 h-2 rounded-full bg-akm-gold-light blur-[1px]"
                  />
                </div>
                <span>Verifying Token...</span>
              </div>

            ) : (

              /* IDLE Action Button with Breathing Glow */
              <motion.button
                type="submit"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 215, 0, 0.3)',
                    '0 0 35px rgba(255, 215, 0, 0.55)',
                    '0 0 20px rgba(255, 215, 0, 0.3)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 3.0, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!tokenInput.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  tokenInput.trim()
                    ? 'bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze text-akm-purple-deepest border border-amber-200 font-extrabold shadow-gold-glow'
                    : 'bg-akm-purple-light/30 border border-akm-gold-royal/20 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-akm-purple-deepest" />
                <span>Verify Token</span>
                <ArrowRight className="w-4 h-4 text-akm-purple-deepest" />
              </motion.button>

            )}
          </motion.div>
        </form>

        {/* Footer Note */}
        <p className="text-[10px] text-gray-400 font-sans tracking-wide">
          Official receipt token issued by Anu Krishna Mall billing counters.
        </p>

      </motion.div>
    </div>
  );
};

export default TokenVerificationScreen;
