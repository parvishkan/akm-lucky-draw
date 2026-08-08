import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LandingPageProps } from '../types';

export const MagneticCTA: React.FC<LandingPageProps> = ({ onStart }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.2;
    const distanceY = (e.clientY - centerY) * 0.2;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handlePointerLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    setRipples((prev) => [...prev, { x: rippleX, y: rippleY, id: Date.now() }]);

    onStart?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xs mx-auto px-4 pb-8 z-20"
    >
      <motion.button
        ref={buttonRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255, 215, 0, 0.7)' }}
        whileTap={{ scale: 0.96 }}
        className="relative w-full group overflow-hidden rounded-full p-[2px] focus:outline-none shadow-gold-glow-lg transition-all duration-300"
      >
        {/* Animated Gradient Border */}
        <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Button Inner Body */}
        <div className="relative flex items-center justify-center gap-3 px-8 py-4.5 rounded-full bg-gradient-to-r from-akm-purple-base via-akm-purple-light to-akm-purple-base text-akm-gold-light font-sans font-bold text-base sm:text-lg tracking-widest uppercase overflow-hidden">
          
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 bg-gold-shimmer -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          
          {/* Ripple Click Rings */}
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => {
                setRipples((prev) => prev.filter((item) => item.id !== r.id));
              }}
              style={{ left: r.x, top: r.y }}
              className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-akm-gold-royal/40 pointer-events-none"
            />
          ))}

          <Sparkles className="w-5 h-5 text-akm-gold-royal animate-pulse" />
          
          <span className="text-gold-light font-black drop-shadow relative z-10">
            Enter Experience
          </span>

          <ArrowRight className="w-5 h-5 text-akm-gold-royal group-hover:translate-x-1 transition-transform relative z-10" />
        </div>
      </motion.button>
    </motion.div>
  );
};
