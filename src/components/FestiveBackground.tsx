import React from 'react';

export const FestiveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-akm-purple-deepest">
      {/* Primary Radial Ambient Spotlight Glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] bg-radial from-akm-purple-bright/40 via-akm-purple-base/20 to-transparent blur-3xl rounded-full opacity-80" />
      
      {/* Soft Gold Heartbeat Glow */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-akm-gold-royal/10 blur-[100px] rounded-full animate-pulse-glow" />

      {/* Deep Bottom Vignette Glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-akm-purple-bright/25 blur-3xl rounded-full" />

      {/* Elegant Diwali Mandala Watermark Silhouette (Rotating Slowly) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[650px] sm:h-[650px] opacity-[0.035] animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full text-akm-gold-royal fill-current">
          <path d="M100,10 L110,40 L140,30 L125,60 L155,70 L130,90 L160,100 L130,110 L155,130 L125,140 L140,170 L110,160 L100,190 L90,160 L60,170 L75,140 L45,130 L70,110 L40,100 L70,90 L45,70 L75,60 L60,30 L90,40 Z" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Decorative Golden Corner Accents */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-akm-gold-royal/20 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-akm-gold-royal/20 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-akm-gold-royal/20 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-akm-gold-royal/20 rounded-br-xl pointer-events-none" />
    </div>
  );
};
