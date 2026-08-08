import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, PlusCircle, Check } from 'lucide-react';

interface GenerateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (count: number, prefix: string, length: number) => void;
}

export const GenerateTokenModal: React.FC<GenerateTokenModalProps> = ({
  isOpen,
  onClose,
  onGenerate
}) => {
  const [count, setCount] = useState(100);
  const [prefix, setPrefix] = useState('AKM-DW-26-');
  const [length, setLength] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  // Sample preview generator (excluding O, 0, I, 1, S, 5)
  const generatePreview = () => {
    const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
    let rand = '';
    for (let i = 0; i < length; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${rand}`;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      onGenerate(count, prefix, length);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-lg bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6 text-left"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Generate Lucky Tokens</h3>
              <p className="text-[11px] text-[#A0A0A0]">Issue a new batch of receipt codes for billing counters.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="space-y-5">
          
          {/* Quantity Selector + Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Number of Tokens to Issue
            </label>
            <input
              type="number"
              min={1}
              max={50000}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-[#FFD700]"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[100, 500, 1000, 5000, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCount(val)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                    count === val
                      ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]'
                      : 'border-[#FFD700]/20 bg-[#0D021A] text-gray-400 hover:text-white'
                  }`}
                >
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Token Prefix & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Token Prefix
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs font-bold uppercase focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Random Code Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs font-bold focus:outline-none focus:border-[#FFD700]"
              >
                <option value={4}>4 Characters</option>
                <option value={5}>5 Characters (Recommended)</option>
                <option value={6}>6 Characters</option>
              </select>
            </div>
          </div>

          {/* Live Format Preview Card */}
          <div className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 space-y-1 text-center">
            <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest block">
              Sample Format Preview (Excludes Confusing O/0, I/1, S/5)
            </span>
            <span className="font-mono text-lg font-black text-[#FFD700] tracking-widest block">
              {generatePreview()}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFD700]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all cursor-pointer"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#0D021A] border-t-transparent rounded-full animate-spin" />
                  <span>Generating Batch...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0D021A]" />
                  <span>Generate {count.toLocaleString()} Tokens</span>
                </>
              )}
            </button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default GenerateTokenModal;
