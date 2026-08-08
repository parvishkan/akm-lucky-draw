import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { LottiePeacockMorph } from './LottiePeacockMorph';
import { APP_CONFIG } from '../constants/appConfig';
import { LandingPageProps } from '../types';

export const ContinuousCinematicView: React.FC<LandingPageProps> = ({ onStartClick }) => {
  const [phase, setPhase] = useState<'BLACK' | 'SPARK' | 'MORPH' | 'ZOOM_OUT' | 'TITLE' | 'CTA'>('BLACK');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Uninterrupted Timeline Schedule Execution
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('SPARK'), 500);     // 0.5s: Golden Spark
    const t2 = setTimeout(() => setPhase('MORPH'), 1500);    // 1.5s: True Morphing Asset (Lottie / Path Morph)
    const t3 = setTimeout(() => setPhase('ZOOM_OUT'), 4000); // 4.0s: Zoom Out & UI Growth
    const t4 = setTimeout(() => setPhase('TITLE'), 4800);    // 4.8s: Title Reveal
    const t5 = setTimeout(() => setPhase('CTA'), 5400);      // 5.4s: CTA Unlock

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Ambient Golden Dust Canvas
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

    const dustCount = 45;
    const dustMotes = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.25
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

  const titleLetters = APP_CONFIG.brand.appName.split("");
  const isMorphVisible = phase === 'MORPH' || phase === 'ZOOM_OUT' || phase === 'TITLE' || phase === 'CTA';
  const isUIVisible = phase === 'ZOOM_OUT' || phase === 'TITLE' || phase === 'CTA';
  const isTitleVisible = phase === 'TITLE' || phase === 'CTA';
  const isCTAVisible = phase === 'CTA';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#05010B] overflow-hidden selection:bg-akm-gold-royal selection:text-akm-purple-deepest font-sans">
      {/* Background Spotlight Layer (Expands during ZOOM_OUT phase) */}
      <motion.div
        animate={{
          opacity: isUIVisible ? 1 : 0,
          scale: isUIVisible ? 1 : 0.8
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-luxury-static spotlight-radial pointer-events-none z-0"
      />

      {/* Ambient Golden Dust Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Corner Filigree Borders (Fade in during UI Growth) */}
      <motion.div
        animate={{ opacity: isUIVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="pointer-events-none z-10"
      >
        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-akm-gold-royal/25 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-akm-gold-royal/25 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-akm-gold-royal/25 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-akm-gold-royal/25 rounded-br-lg" />
      </motion.div>

      {/* Unified Timeline Mobile Container */}
      <div className="relative z-10 min-h-screen w-full max-w-md mx-auto flex flex-col justify-between items-center px-4 py-6 sm:px-6">
        
        {/* Top Brand Name Header (Fades in during UI Growth phase) */}
        <motion.div
          animate={{
            opacity: isUIVisible ? 1 : 0,
            y: isUIVisible ? 0 : -15
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center pt-2 space-y-1"
        >
          <h2 className="font-heading text-xs sm:text-sm font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
            {APP_CONFIG.brand.mallName}
          </h2>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-royal/50 to-transparent" />
        </motion.div>

        {/* Center Focal Section: Persistent Lottie / True Morphing Engine */}
        <div className="relative flex flex-col items-center justify-center text-center my-auto w-full space-y-4">
          
          {/* Phase 1: Golden Spark */}
          {phase === 'SPARK' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-akm-gold-royal shadow-[0_0_50px_rgba(255,215,0,1)]"
            />
          )}

          {/* Phase 2: True Lottie Vector Path Peacock Morphing Engine */}
          {isMorphVisible && (
            <LottiePeacockMorph
              src="/animations/peacock-logo-morph.json"
              onMorphComplete={() => console.log('Lottie Peacock Morph Completed')}
            />
          )}

          {/* Staggered Letter Title Reveal: AKM LUCKY DRAW */}
          {isTitleVisible && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
                {titleLetters.map((letter, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: idx * 0.04,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-gold-metallic drop-shadow-2xl"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>

              {/* Tagline Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-akm-purple-light/40 border border-akm-gold-royal/35 text-akm-gold-light text-xs font-sans font-semibold tracking-[0.25em] uppercase backdrop-blur-md shadow-gold-glow"
              >
                <span>Shop</span>
                <span className="text-akm-gold-royal">•</span>
                <span>Scan</span>
                <span className="text-akm-gold-royal">•</span>
                <span>Win</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Primary CTA Button */}
        <div className="w-full max-w-xs mx-auto pb-6">
          <motion.div
            animate={{
              opacity: isCTAVisible ? 1 : 0,
              y: isCTAVisible ? 0 : 20
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {isCTAVisible && (
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={onStartClick}
              >
                Start Your Lucky Draw
              </Button>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ContinuousCinematicView;
