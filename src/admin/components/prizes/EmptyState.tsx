import React from 'react';
import { motion } from 'framer-motion';
import { Gift, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#1D0636]/80 border border-[#FFD700]/30 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-glass max-w-md mx-auto my-8 select-none"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-[#0D021A] border-2 border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]">
        <Gift className="w-8 h-8" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading text-xl font-bold text-white">No Prizes Added Yet</h3>
        <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-xs mx-auto">
          Start building your Anu Krishna Mall Lucky Draw prize collection by adding your first gift.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase inline-flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 text-[#0D021A]" />
        <span>+ Add First Prize</span>
      </button>
    </motion.div>
  );
};

export default EmptyState;
