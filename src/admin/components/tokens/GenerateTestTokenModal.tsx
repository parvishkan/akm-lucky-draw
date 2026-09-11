import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Copy, Check, FlaskConical, AlertTriangle, ExternalLink } from 'lucide-react';
import { TokensService } from '../../../services/tokensService';

interface GenerateTestTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GenerateTestTokenModal: React.FC<GenerateTestTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [count, setCount] = useState<1 | 5 | 10>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage('');

    const res = await TokensService.generateTestTokens(count);
    setIsGenerating(false);

    if (res.success && res.tokens.length > 0) {
      setGeneratedTokens(res.tokens);
      onSuccess();
    } else {
      setErrorMessage(res.message || 'Failed to generate test tokens.');
    }
  };

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedTokens.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleReset = () => {
    setGeneratedTokens([]);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D021A]/85 backdrop-blur-md select-none font-sans text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-[#1D0636] border-2 border-fuchsia-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(217,70,239,0.25)] space-y-6 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-fuchsia-500/25 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-fuchsia-950 border border-fuchsia-500/40 text-fuchsia-300 text-[11px] font-mono uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>🧪 TEST MODE — DEMO DATA ONLY</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
              Generate Test Tokens
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0D021A] border border-fuchsia-500/30 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Notice Callout */}
        <div className="p-3.5 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-500/30 text-xs text-fuchsia-200/90 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-fuchsia-300 block mb-0.5">Production Isolation Guarantee:</span>
            Test tokens are stored separately in <code className="bg-[#0D021A] px-1.5 py-0.5 rounded text-[11px] text-fuchsia-300 font-mono">/testTokens</code>. They award demo gifts and will <span className="underline font-bold text-white">NEVER</span> reduce real prize inventory or affect production winners.
          </div>
        </div>

        {generatedTokens.length === 0 ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                Select Number of Test Tokens
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([1, 5, 10] as const).map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setCount(qty)}
                    className={`py-3 px-4 rounded-2xl border text-sm font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      count === qty
                        ? 'bg-fuchsia-600/30 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                        : 'bg-[#0D021A] border-fuchsia-500/20 text-[#A0A0A0] hover:border-fuchsia-500/50'
                    }`}
                  >
                    <span className="text-lg font-black">{qty}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-300/80">
                      {qty === 1 ? 'Token' : qty === 5 ? 'Tokens (Demo)' : 'Tokens'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Format Preview */}
            <div className="p-3 rounded-xl bg-[#0D021A] border border-fuchsia-500/20 text-center space-y-1">
              <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-wider block">
                Token Format Preview
              </span>
              <span className="font-mono text-base font-bold text-fuchsia-400 tracking-wider">
                TEST-AKM-XXXXX
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-fuchsia-500/20 text-[#A0A0A0] hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate {count} Demo Tokens</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Generated Tokens Display */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider">
                Generated {generatedTokens.length} Test Token(s)
              </span>
              <button
                onClick={handleCopyAll}
                className="px-3 py-1 rounded-lg bg-[#0D021A] border border-fuchsia-500/30 text-fuchsia-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied All!' : 'Copy All'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {generatedTokens.map((token) => (
                <div
                  key={token}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0D021A] border border-fuchsia-500/30 hover:border-fuchsia-400 transition-colors"
                >
                  <div className="font-mono font-bold text-sm text-fuchsia-300 tracking-wider">
                    {token}
                  </div>
                  <button
                    onClick={() => handleCopy(token)}
                    className="p-1.5 rounded-lg bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                    title="Copy token"
                  >
                    {copiedToken === token ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Instruction for Testers */}
            <div className="p-3 rounded-xl bg-[#0D021A]/60 border border-fuchsia-500/20 text-xs text-[#A0A0A0] leading-relaxed">
              💡 <span className="text-white font-semibold">How to test:</span> Give these tokens to the 5 testers. They can enter them directly on the customer website to experience the complete mystery box and prize reveal flow.
            </div>

            {/* Done & Generate More Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[#0D021A] border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold hover:text-white transition-colors cursor-pointer"
              >
                + Generate More
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-extrabold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GenerateTestTokenModal;
