import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift } from 'lucide-react';

interface LuxuryBoxOpeningCinematicProps {
  boxId: number;
  onOpeningComplete: () => void;
}

export const LuxuryBoxOpeningCinematic: React.FC<LuxuryBoxOpeningCinematicProps> = ({
  boxId,
  onOpeningComplete
}) => {
  const [openingPhase, setOpeningPhase] = useState<'FOCUS' | 'LID_LIFT' | 'LIGHT_BURST'>('FOCUS');

  useEffect(() => {
    // Timeline Sequence:
    // 0.0s - 0.6s: Box Focus & Scale
    // 0.6s - 1.4s: 3D Lid Lift & Golden Rays Burst
    // 1.4s - 2.4s: Light Burst Suspense Peak ➔ Trigger Prize Reveal
    const timer1 = setTimeout(() => setOpeningPhase('LID_LIFT'), 600);
    const timer2 = setTimeout(() => setOpeningPhase('LIGHT_BURST'), 1400);
    const timer3 = setTimeout(() => onOpeningComplete(), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onOpeningComplete]);

  // 16 Radiant Light Rays Emitters
  const rays = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 16
  }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl overflow-hidden select-none">
      
      {/* 1. Volumetric Radial Golden Light Burst Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: openingPhase === 'LIGHT_BURST' ? 1 : 0.4,
          scale: openingPhase === 'LIGHT_BURST' ? 2.5 : 1
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-amber-200 via-akm-gold-royal to-amber-500 blur-3xl pointer-events-none opacity-60"
      />

      {/* 2. Rotating Light Rays Burst Emitter */}
      <AnimatePresence>
        {(openingPhase === 'LID_LIFT' || openingPhase === 'LIGHT_BURST') && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.0, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {rays.map((r) => (
              <div
                key={r.id}
                style={{ transform: `rotate(${r.angle}deg)` }}
                className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-akm-gold-light/40 to-transparent"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Center 3D Gift Box Animation */}
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center z-20">
        
        {/* Box Lid (Lifts Up in 3D Motion) */}
        <motion.div
          initial={{ y: 0, rotateX: 0 }}
          animate={openingPhase === 'LID_LIFT' || openingPhase === 'LIGHT_BURST' ? {
            y: -90,
            rotateX: -110,
            opacity: 0.1
          } : { y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-4 inset-x-0 h-16 rounded-t-2xl bg-gradient-to-b from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze p-1 shadow-2xl z-30"
        >
          <div className="w-full h-full rounded-t-xl bg-[#07020E] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-y-0 w-4 bg-akm-gold-royal opacity-90" />
            <Sparkles className="w-6 h-6 text-akm-gold-light relative z-10" />
          </div>
        </motion.div>

        {/* Box Base & Emerging Golden Beam */}
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-b from-akm-purple-light via-akm-purple-base to-akm-purple-deepest border-2 border-akm-gold-royal shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Internal Golden Beam Light Beam */}
          <motion.div
            initial={{ height: '0%', opacity: 0 }}
            animate={openingPhase === 'LIGHT_BURST' ? {
              height: '100%',
              opacity: 1
            } : { height: '20%', opacity: 0.3 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-akm-gold-royal via-akm-gold-light to-white blur-md"
          />

          <Gift className="w-16 h-16 text-akm-gold-light relative z-10 drop-shadow-2xl" />
        </div>
      </div>

      {/* 4. Cinematic Suspense Caption */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 text-center space-y-2 z-20"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-akm-purple-light/40 border border-akm-gold-royal/50 text-akm-gold-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-gold-glow">
          <Sparkles className="w-3.5 h-3.5 text-akm-gold-royal animate-spin" />
          <span>Opening Mystery Box #{boxId}</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-gold-metallic">
          Unveiling Your Exclusive Reward...
        </h3>
      </motion.div>

    </div>
  );
};

export default LuxuryBoxOpeningCinematic;
