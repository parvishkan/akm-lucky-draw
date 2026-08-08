import React, { useEffect, useRef } from 'react';

export const CinematicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.targetX = clientX;
      mouseRef.current.targetY = clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Floating gold dust motes
    const particleCount = Math.min(Math.floor((width * height) / 14000), 55);
    const motes = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * 0.02 + 0.005
    }));

    const render = () => {
      // Smooth lerp mouse position for cinematic delay feel
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Dark Vignette & Volumetric Purple Center Spotlight
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * 0.35, 10,
        width / 2, height / 2, Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#20083B');
      bgGrad.addColorStop(0.4, '#0F031E');
      bgGrad.addColorStop(1, '#05010B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Interactive Gold Spotlight following User Pointer
      const spotlightGrad = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 250
      );
      spotlightGrad.addColorStop(0, 'rgba(255, 215, 0, 0.09)');
      spotlightGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.03)');
      spotlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotlightGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Volumetric Top Beams
      const beamGrad = ctx.createLinearGradient(width / 2, 0, width / 2, height * 0.6);
      beamGrad.addColorStop(0, 'rgba(255, 215, 0, 0.15)');
      beamGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.04)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, 0);
      ctx.lineTo(width / 2 + 120, 0);
      ctx.lineTo(width / 2 + 350, height * 0.6);
      ctx.lineTo(width / 2 - 350, height * 0.6);
      ctx.closePath();
      ctx.fill();

      // 4. Render Gold Embers / Dust Motes
      motes.forEach((mote) => {
        mote.y += mote.speedY;
        mote.x += mote.speedX + Math.sin(mote.y * 0.01) * 0.15;
        mote.opacity += mote.pulse;

        if (mote.opacity > 1 || mote.opacity < 0.2) mote.pulse = -mote.pulse;
        if (mote.y < -10) {
          mote.y = height + 10;
          mote.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0, mote.opacity)})`;
        ctx.shadowBlur = mote.size * 5;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
