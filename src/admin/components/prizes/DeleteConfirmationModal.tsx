import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { PrizeItem } from './PrizeCard';

interface DeleteConfirmationModalProps {
  prize: PrizeItem | null;
  onClose: () => void;
  onConfirmDelete: (prize: PrizeItem) => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  prize,
  onClose,
  onConfirmDelete
}) => {
  if (!prize) return null;

  const hasWinners = prize.distributedQuantity > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1D0636] border-2 border-rose-500/50 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-bold text-white">
            Delete Prize: {prize.name}?
          </h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            {hasWinners ? (
              <span className="text-amber-300 font-semibold block">
                ⚠️ Warning: {prize.distributedQuantity} winners have already been allocated this prize. Deleting it may cause campaign inconsistencies.
              </span>
            ) : (
              'Are you sure you want to remove this prize from the Lucky Draw campaign pool? This action cannot be undone.'
            )}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D021A] border border-rose-500/30 text-left space-y-1 font-mono text-xs">
          <div className="flex justify-between text-[#A0A0A0]">
            <span>Prize ID:</span>
            <span className="text-white font-bold">{prize.id}</span>
          </div>
          <div className="flex justify-between text-[#A0A0A0]">
            <span>Remaining Stock:</span>
            <span className="text-[#FFD700] font-bold">{prize.remainingQuantity} units</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirmDelete(prize)}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;
