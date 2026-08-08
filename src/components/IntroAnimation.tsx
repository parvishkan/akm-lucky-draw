import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroAnimationProps } from '../types';

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Timeline Sequence Execution
    const t1 = setTimeout(() => setScene(2), 500);   // Scene 2: Spark Ignition (0.5s)
    const t2 = setTimeout(() => setScene(3), 1500);  // Scene 3: Peacock Particle Trails (1.5s)
    const t3 = setTimeout(() => setScene(4), 2800);  // Scene 4: Logo Convergence (2.8s)
    const t4 = setTimeout(() => setScene(5), 3800);  // Scene 5: Light Sweep & Bloom (3.8s)
    const t5 = setTimeout(() => {
      setScene(6);
      onComplete();
    }, 4500);                                        // Scene 6: Complete Intro & Reveal Landing (4.5s)

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Ambient Floating Dust Motes Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const dustCount = 40;
    const dustMotes = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dustMotes.forEach((m) => {
        m.y += m.speedY;
        m.x += m.speedX + Math.sin(m.y * 0.01) * 0.1;

        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${m.alpha})`;
        ctx.shadowBlur = m.size * 4;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#05010B] flex items-center justify-center overflow-hidden select-none">
      {/* Canvas Layer for Ambient Golden Dust */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Scene 1: Completely Black (0.0s - 0.5s) */}
      {scene === 1 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#05010B]"
        />
      )}

      {/* Scene 2: Center Golden Spark Ignition (0.5s - 1.5s) */}
      {scene === 2 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.9] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex items-center justify-center z-10"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-akm-gold-royal shadow-[0_0_50px_rgba(255,215,0,1)]" />
          <div className="absolute w-24 h-24 rounded-full bg-akm-gold-royal/20 blur-xl animate-pulse" />
        </motion.div>
      )}

      {/* Scene 3: Abstract Light Particles Peacock Form (1.5s - 2.8s) */}
      {scene === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center z-10"
        >
          <div className="absolute inset-0 rounded-full bg-akm-gold-royal/25 blur-2xl animate-pulse" />
          
          {/* Artistic Abstract Peacock Light Particle Feather Graphic */}
          <svg viewBox="0 0 100 100" className="w-full h-full text-akm-gold-royal fill-current drop-shadow-[0_0_25px_rgba(255,215,0,0.85)]">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 3" className="animate-spin-slow" />
            <path d="M50,15 Q30,30 30,50 Q30,70 50,85 Q70,70 70,50 Q70,30 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="30" r="5" />
            <circle cx="36" cy="42" r="4" />
            <circle cx="64" cy="42" r="4" />
            <circle cx="42" cy="58" r="4" />
            <circle cx="58" cy="58" r="4" />
          </svg>
        </motion.div>
      )}

      {/* Scene 4 & 5: Official Logo Transformation, Light Sweep & Breathing Aura (2.8s - 4.5s) */}
      {(scene === 4 || scene === 5) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center z-10"
        >
          {/* Soft Golden Bloom Aura (Scene 5) */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.75, 0.4]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-akm-gold-royal/30 via-akm-purple-light/40 to-transparent blur-3xl pointer-events-none"
          />

          {/* Dual Rotating Concentric Light Rings */}
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-akm-gold-royal/35 border-dashed animate-spin-slow pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-akm-gold-royal shadow-gold-glow" />
          </div>

          {/* Official Peacock Logo Pedestal */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-akm-purple-light/90 via-akm-purple-base to-akm-purple-deepest p-3 sm:p-4 border-2 border-akm-gold-royal/60 shadow-glass flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-light to-transparent" />

            {/* Official Logo Asset */}
            <img
              src="/akm-logo.png"
              alt="Anu Krishna Mall Peacock Logo"
              className="w-full h-full object-contain drop-shadow-xl relative z-10"
            />

            {/* Metallic Light Sweep Beam (Scene 5) */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '120%', opacity: [0, 1, 0] }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-akm-gold-light/60 to-transparent skew-x-12 pointer-events-none z-20"
            />
          </div>

          {/* Brand Name Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-1 mt-4"
          >
            <span className="text-xs sm:text-sm font-heading font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
              Anu Krishna Mall
            </span>
            <div className="w-20 h-[1px] mx-auto bg-gradient-to-r from-transparent via-akm-gold-royal/70 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default IntroAnimation;
