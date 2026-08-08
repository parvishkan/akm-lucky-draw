import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ButtonProps } from '../types';
import { cn } from '../utilities/cn';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gold',
  size = 'lg',
  fullWidth = true,
  className,
  onClick,
  disabled
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      setRipples((prev) => [...prev, { x: rippleX, y: rippleY, id: Date.now() }]);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs rounded-full",
    md: "px-6 py-3.5 text-sm sm:text-base rounded-full",
    lg: "px-8 py-4 sm:py-4.5 text-base sm:text-lg rounded-full"
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      animate={!disabled ? {
        boxShadow: [
          '0 0 25px rgba(255, 215, 0, 0.35)',
          '0 0 45px rgba(255, 215, 0, 0.65)',
          '0 0 25px rgba(255, 215, 0, 0.35)'
        ]
      } : {}}
      transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
      whileHover={!disabled ? { scale: 1.02, boxShadow: '0 0 50px rgba(255, 215, 0, 0.75)' } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className={cn(
        "relative group overflow-hidden rounded-full p-[2px] focus:outline-none shadow-gold-glow transition-all duration-300 select-none cursor-pointer",
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Gold Gradient Border */}
      <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Button Body with Golden Light Fill on Click */}
      <div className={cn(
        "relative flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-akm-purple-base via-akm-purple-light to-akm-purple-base text-akm-gold-light font-sans font-bold tracking-widest uppercase overflow-hidden group-active:bg-akm-gold-royal transition-colors",
        sizeStyles[size]
      )}>
        {/* Tap Ripple Ring Effects */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((item) => item.id !== r.id));
            }}
            style={{ left: r.x, top: r.y }}
            className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-akm-gold-royal/50 pointer-events-none"
          />
        ))}

        <motion.div
          whileHover={{ x: -2, scale: 1.1 }}
          className="transition-transform"
        >
          <Sparkles className="w-4 h-4 text-akm-gold-royal" />
        </motion.div>

        <span className="text-gold-metallic font-extrabold drop-shadow relative z-10">
          {children}
        </span>

        <motion.div
          whileHover={{ x: 2, scale: 1.1 }}
          className="transition-transform"
        >
          <Sparkles className="w-4 h-4 text-akm-gold-royal" />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default Button;
