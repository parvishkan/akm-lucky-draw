import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 px-4 py-4 my-auto max-w-md mx-auto">
      {/* Main Title Badge / Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-akm-gold-royal/10 border border-akm-gold-royal/20 text-akm-gold-light text-xs tracking-wider uppercase">
          <Star className="w-3 h-3 text-akm-gold-royal fill-akm-gold-royal" />
          <span>Exclusive Customer Privilege</span>
          <Star className="w-3 h-3 text-akm-gold-royal fill-akm-gold-royal" />
        </div>

        {/* Main AKM LUCKY DRAW Title */}
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-gold-metallic drop-shadow-2xl">
          AKM LUCKY DRAW
        </h1>

        {/* Tagline: Shop • Scan • Win */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-akm-gold-royal/40" />
          <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-akm-gold-light">
            Shop <span className="text-akm-gold-royal">•</span> Scan <span className="text-akm-gold-royal">•</span> Win
          </span>
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-akm-gold-royal/40" />
        </div>
      </motion.div>

      {/* Glassmorphic Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-akm-gold-royal/30 shadow-glass"
      >
        {/* Card Top Light Edge Glow */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-royal/60 to-transparent" />
        
        <div className="flex flex-col items-center space-y-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-akm-purple-light/80 border border-akm-gold-royal/40 flex items-center justify-center shadow-gold-glow">
            <Gift className="w-6 h-6 text-akm-gold-royal animate-float-slow" />
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
            Your Festival Rewards Await
          </h3>

          <p className="font-sans text-xs sm:text-sm text-gray-200/90 leading-relaxed max-w-xs font-normal">
            Thank you for celebrating Diwali with Anu Krishna Mall. Enter your shopping token to instantly unlock your guaranteed mystery prize.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
