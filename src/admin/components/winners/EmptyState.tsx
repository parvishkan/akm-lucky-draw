import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  type: 'WINNERS' | 'CLAIMS';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1D0636]/80 border border-[#FFD700]/30 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-glass max-w-md mx-auto my-8 select-none"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-[#0D021A] border-2 border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]">
        {type === 'WINNERS' ? <Trophy className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-xl font-bold text-white">
          {type === 'WINNERS' ? 'No Winners Yet' : 'No Pending Claims'}
        </h3>
        <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-xs mx-auto">
          {type === 'WINNERS'
            ? 'Winners will appear here after customers successfully complete the Lucky Draw entry.'
            : 'All prize claims have been verified and processed by counter staff.'}
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyState;
