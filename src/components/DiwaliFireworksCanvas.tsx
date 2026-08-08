import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

export const DiwaliFireworksCanvas: React.FC<{ triggerFireworks?: boolean }> = ({ triggerFireworks = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const particles: Particle[] = [];

    // Ambient floating embers
    const emberCount = 35;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.015 + 0.005
    }));

    const createFireworkBurst = (centerX: number, centerY: number) => {
      const goldPalette = ['#FFD700', '#FFF8DC', '#F59E0B', '#D4AF37', '#E5B80B'];
      const sparkCount = 65;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() * 0.2 - 0.1);
        const speed = Math.random() * 4.5 + 1.5;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1,
          color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
          alpha: 1,
          decay: Math.random() * 0.012 + 0.006,
          gravity: 0.03
        });
      }
    };

    // Trigger two subtle luxury fireworks bursts tastefully at 2.2 seconds
    let timeout1: ReturnType<typeof setTimeout>;
    let timeout2: ReturnType<typeof setTimeout>;

    if (triggerFireworks) {
      timeout1 = setTimeout(() => {
        createFireworkBurst(width * 0.28, height * 0.28);
      }, 2100);

      timeout2 = setTimeout(() => {
        createFireworkBurst(width * 0.72, height * 0.25);
      }, 2500);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Ambient Embers
      embers.forEach((e) => {
        e.y += e.speedY;
        e.x += e.speedX + Math.sin(e.y * 0.01) * 0.1;
        e.alpha += e.pulse;
        if (e.alpha > 0.9 || e.alpha < 0.2) e.pulse = -e.pulse;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0, e.alpha)})`;
        ctx.shadowBlur = e.size * 4;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();
        ctx.restore();
      });

      // Render Firework Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = p.size * 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      cancelAnimationFrame(animationFrameId);
    };
  }, [triggerFireworks]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
