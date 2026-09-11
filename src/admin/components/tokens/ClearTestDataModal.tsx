import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { TokensService } from '../../../services/tokensService';

interface ClearTestDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClearTestDataModal: React.FC<ClearTestDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleConfirmClear = async () => {
    setIsDeleting(true);
    setErrorMessage('');

    const res = await TokensService.clearAllTestData();
    setIsDeleting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.message || 'Failed to clear test data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D021A]/85 backdrop-blur-md select-none font-sans text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-[#1D0636] border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-6 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-rose-500/25 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-sans">
                Clear Test Data
              </h3>
              <p className="text-xs text-rose-300/80 font-mono">
                Admin Demo Reset Action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0D021A] border border-rose-500/30 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Explanation */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2 text-xs text-rose-200/90 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Are you sure you want to clear test data?</span>
          </div>
          <p>
            This action will permanently delete all records in <code className="bg-[#0D021A] px-1.5 py-0.5 rounded text-rose-300 font-mono">/testTokens</code> and any test winners/claims marked with <code className="bg-[#0D021A] px-1.5 py-0.5 rounded text-rose-300 font-mono">isTest: true</code>.
          </p>
        </div>

        {/* Protection Guarantee */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Production Guarantee:</strong> Real tokens, prizes, and campaign winners are 100% protected and will NOT be touched.</span>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-rose-500/20 text-[#A0A0A0] hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmClear}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Clearing Test Data...</span>
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Test Data</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ClearTestDataModal;
