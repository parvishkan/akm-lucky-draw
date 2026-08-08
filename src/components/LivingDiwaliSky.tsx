import React, { useEffect, useRef } from 'react';

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
}

interface Spark {
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

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  color: string;
}

export const LivingDiwaliSky: React.FC = () => {
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

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];

    // Falling festive petals (Marigold & Rose Gold)
    const petalColors = ['#FFD700', '#F59E0B', '#E11D48', '#FFB703', '#F43F5E'];
    const petals: Petal[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 5 + 3,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      alpha: Math.random() * 0.6 + 0.3,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    }));

    // Function to launch a rocket naturally from a bottom corner
    const launchRocket = () => {
      const startFromLeft = Math.random() > 0.5;
      const startX = startFromLeft ? width * (0.1 + Math.random() * 0.15) : width * (0.75 + Math.random() * 0.15);
      const targetY = height * (0.2 + Math.random() * 0.2);

      rockets.push({
        x: startX,
        y: height + 10,
        targetY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 4 + 7),
        trail: [],
        exploded: false
      });
    };

    // Periodically launch rockets every 4.5 seconds
    const interval = setInterval(() => {
      launchRocket();
    }, 4500);

    // Initial rocket launch after 3.2 seconds
    const initialTimer = setTimeout(() => {
      launchRocket();
    }, 3200);

    const triggerExplosion = (x: number, y: number) => {
      const goldPalette = ['#FFD700', '#FFF8DC', '#F59E0B', '#E5B80B', '#FFFFFF'];
      const sparkCount = 80;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() * 0.3 - 0.15);
        const speed = Math.random() * 5 + 1.8;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1,
          color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
          alpha: 1,
          decay: Math.random() * 0.012 + 0.005,
          gravity: 0.035
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian Base & Volumetric Radial Ambient Lighting
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * 0.35, 10,
        width / 2, height / 2, Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#1A0633');
      bgGrad.addColorStop(0.5, '#0B0218');
      bgGrad.addColorStop(1, '#030008');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Falling Petals
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.015) * 0.3;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Render Rockets Trajectory
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Trail spark particles
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 12) r.trail.shift();

        // Draw rocket trail
        r.trail.forEach((t) => {
          t.alpha -= 0.08;
          if (t.alpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${t.alpha})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#FFD700';
            ctx.fill();
            ctx.restore();
          }
        });

        // Explode condition
        if (r.y <= r.targetY && !r.exploded) {
          r.exploded = true;
          triggerExplosion(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      // 4. Render Firework Explosion Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowBlur = s.size * 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      clearTimeout(initialTimer);
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
