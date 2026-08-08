import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';

export const TrustBadge: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8 }}
      className="flex flex-col items-center justify-center space-y-1 pb-6 px-4 text-center z-10"
    >
      <div className="flex items-center gap-4 text-akm-gold-royal/80 text-[11px] sm:text-xs tracking-wider uppercase font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-akm-gold-royal" />
          <span>Verified Mall Token</span>
        </div>
        <span className="text-akm-gold-royal/40">•</span>
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-akm-gold-royal" />
          <span>Guaranteed Reward</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400/60 font-sans tracking-widest uppercase">
        © 2026 Anu Krishna Mall. All Rights Reserved.
      </p>
    </motion.footer>
  );
};
