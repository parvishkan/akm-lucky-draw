import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

interface LottiePeacockMorphProps {
  src?: string;
  onMorphComplete?: () => void;
  className?: string;
}

export const LottiePeacockMorph: React.FC<LottiePeacockMorphProps> = ({
  src = '/animations/peacock-logo-morph.json',
  onMorphComplete,
  className
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${className || ''}`}>
      {/* Soft Golden Bloom Aura Background */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-akm-gold-royal/30 via-akm-purple-light/40 to-transparent blur-3xl pointer-events-none"
      />

      {/* Dual Concentric Light Rings */}
      <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-akm-gold-royal/35 border-dashed animate-spin-slow pointer-events-none">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
      </div>

      {!hasError ? (
        /* Lottie Vector Path Morphing Player */
        <Player
          autoplay
          keepLastFrame
          src={src}
          style={{ width: '180px', height: '180px' }}
          onEvent={(event) => {
            if (event === 'complete' && onMorphComplete) {
              onMorphComplete();
            }
            if (event === 'error') {
              setHasError(true);
            }
          }}
        />
      ) : (
        /* Fallback Official Logo Display if Lottie JSON asset is pending */
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-akm-purple-light/90 via-akm-purple-base to-akm-purple-deepest p-3 sm:p-4 border-2 border-akm-gold-royal/60 shadow-glass flex items-center justify-center overflow-hidden">
          <img
            src="/akm-logo.png"
            alt="Anu Krishna Mall Peacock Logo"
            className="w-full h-full object-contain drop-shadow-xl relative z-10"
          />
        </div>
      )}
    </div>
  );
};

export default LottiePeacockMorph;
