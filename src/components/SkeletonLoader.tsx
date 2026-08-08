import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'circle' | 'text' | 'button';
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const base = "animate-pulse bg-akm-purple-light/30 border border-akm-gold-royal/20 rounded-xl";

  const variants = {
    text: "h-4 w-full rounded-md",
    circle: "w-12 h-12 rounded-full",
    button: "h-12 w-full rounded-full",
    card: "h-36 w-full rounded-2xl"
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};

export default SkeletonLoader;
