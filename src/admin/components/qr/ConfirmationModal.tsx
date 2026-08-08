import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmText,
  confirmVariant = 'primary',
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const buttonStyles = {
    danger: 'bg-rose-600 hover:bg-rose-500 text-white font-extrabold',
    warning: 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold',
    primary: 'bg-[#FFD700] hover:bg-[#D4AF37] text-[#0D021A] font-extrabold',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1D0636] border-2 border-[#FFD700]/50 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-[#0D021A] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer ${buttonStyles[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
