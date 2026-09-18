import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Download, Ban, Trash2, AlertTriangle, FileText, Printer } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkBlock: () => void;
  onBulkDelete: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkBlock,
  onBulkDelete,
  onExportCSV,
  onExportPDF
}) => {
  const [confirmModalType, setConfirmModalType] = useState<'BLOCK' | 'DELETE' | null>(null);

  if (selectedCount === 0) return null;

  return (
    <>
      {/* Floating Bottom Bulk Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-40 bg-[#1D0636] border-2 border-[#FFD700]/50 rounded-2xl p-3 sm:px-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center justify-between gap-4 max-w-2xl select-none font-sans text-xs"
      >
        <div className="flex items-center gap-2 text-[#FFD700] font-bold shrink-0">
          <CheckSquare className="w-4 h-4 text-[#FFD700]" />
          <span>Selected: {selectedCount}</span>
          <button
            onClick={onClearSelection}
            className="text-[10px] text-[#A0A0A0] hover:text-white font-mono underline ml-1 cursor-pointer"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] font-bold flex items-center gap-1 hover:bg-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={onExportPDF}
            className="px-3 py-1.5 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-white font-bold flex items-center gap-1 hover:bg-white/10 transition-colors cursor-pointer"
            title="Download Printable Token Sheet HTML file"
          >
            <Printer className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>

          <button
            onClick={() => setConfirmModalType('BLOCK')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1 hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block</span>
          </button>

          <button
            onClick={() => setConfirmModalType('DELETE')}
            className="px-3 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1 hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal for Destructive Bulk Actions */}
      <AnimatePresence>
        {confirmModalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1D0636] border-2 border-rose-500/50 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-white">
                  Confirm {confirmModalType === 'BLOCK' ? 'Bulk Block' : 'Bulk Deletion'}
                </h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Are you sure you want to {confirmModalType.toLowerCase()} {selectedCount} selected tokens? This action requires administrative authorization.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmModalType(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (confirmModalType === 'BLOCK') onBulkBlock();
                    else onBulkDelete();
                    setConfirmModalType(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold tracking-wider uppercase shadow-lg cursor-pointer"
                >
                  Confirm {confirmModalType}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkActionBar;
