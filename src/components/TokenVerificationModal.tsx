import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Phone, User, Sparkles, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { TokenVerificationProps } from '../types';

export const TokenVerificationModal: React.FC<TokenVerificationProps> = ({ onVerify, onSuccess, onBack }) => {
  const [tokenCode, setTokenCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);

  // Quick fill demo token helper
  const handleQuickDemo = () => {
    setTokenCode('AKM-8892');
    setMobileNumber('9876543210');
    setCustomerName('Diwali Shopper');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanToken = tokenCode.trim().toUpperCase();
    const cleanMobile = mobileNumber.trim();

    if (!cleanToken || cleanToken.length < 4) {
      setError('Please enter a valid Shopping Token Code (e.g. AKM-8892)');
      triggerShake();
      return;
    }

    if (!cleanMobile || cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number for prize confirmation');
      triggerShake();
      return;
    }

    setIsVerifying(true);

    // Simulate luxury mall database verification delay
    setTimeout(() => {
      setIsVerifying(false);
      const data = {
        tokenCode: cleanToken,
        mobileNumber: cleanMobile,
        customerName: customerName.trim() || 'Valued Mall Guest'
      };
      if (onVerify) {
        onVerify(data);
      } else if (onSuccess) {
        onSuccess(data);
      }
    }, 1600);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto my-auto px-4 py-4 z-20"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-glass border border-akm-gold-royal/40">
        {/* Subtle Card Glow Highlights */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-akm-gold-royal/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-royal/70 to-transparent" />

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between pb-5 border-b border-akm-gold-royal/15 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-akm-gold-light hover:text-white transition-colors bg-akm-purple-light/40 px-3 py-1.5 rounded-full border border-akm-gold-royal/20"
          >
            <ArrowLeft className="w-4 h-4 text-akm-gold-royal" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 text-akm-gold-royal text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Step 1 of 3</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-akm-gold-royal/10 border border-akm-gold-royal/30 flex items-center justify-center shadow-gold-glow">
            <KeyRound className="w-6 h-6 text-akm-gold-royal" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gold-metallic">
            Verify Lucky Token
          </h2>
          <p className="text-xs text-gray-300/90 font-sans max-w-xs mx-auto leading-relaxed">
            Enter the lucky token code from your Anu Krishna Mall shopping bill to claim your Diwali prize.
          </p>
        </div>

        {/* Quick Demo Token Action Banner */}
        <div className="mb-5 p-2.5 rounded-xl bg-akm-purple-light/30 border border-akm-gold-royal/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-akm-gold-royal" />
            <span className="text-[11px] text-gray-300">Testing? Auto-fill sample token:</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] font-bold text-akm-gold-royal hover:underline bg-akm-gold-royal/10 px-2.5 py-1 rounded-md border border-akm-gold-royal/30"
          >
            Use Demo Code
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input 1: Token Code */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-akm-gold-light">
              Lucky Token Code <span className="text-akm-gold-royal">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="w-4 h-4 text-akm-gold-royal/70" />
              </div>
              <input
                type="text"
                value={tokenCode}
                onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
                placeholder="e.g. AKM-8892"
                maxLength={12}
                disabled={isVerifying}
                className="w-full pl-10 pr-4 py-3 bg-akm-purple-deepest/80 border border-akm-gold-royal/30 rounded-xl text-white placeholder-gray-500 font-mono text-base tracking-wider focus:outline-none focus:border-akm-gold-royal focus:ring-1 focus:ring-akm-gold-royal uppercase transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Input 2: Mobile Number */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-akm-gold-light">
              Mobile Number <span className="text-akm-gold-royal">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-akm-gold-royal/70" />
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit Mobile Number"
                maxLength={10}
                disabled={isVerifying}
                className="w-full pl-10 pr-4 py-3 bg-akm-purple-deepest/80 border border-akm-gold-royal/30 rounded-xl text-white placeholder-gray-500 font-sans text-sm tracking-wide focus:outline-none focus:border-akm-gold-royal focus:ring-1 focus:ring-akm-gold-royal transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Input 3: Customer Name (Optional) */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-akm-gold-light/80">
              Customer Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-akm-gold-royal/50" />
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your Full Name"
                disabled={isVerifying}
                className="w-full pl-10 pr-4 py-3 bg-akm-purple-deepest/80 border border-akm-gold-royal/20 rounded-xl text-white placeholder-gray-500 font-sans text-sm tracking-wide focus:outline-none focus:border-akm-gold-royal focus:ring-1 focus:ring-akm-gold-royal transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 text-left"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Verification Submit Button */}
          <motion.button
            type="submit"
            disabled={isVerifying}
            whileHover={!isVerifying ? { scale: 1.02 } : {}}
            whileTap={!isVerifying ? { scale: 0.98 } : {}}
            className="w-full mt-4 relative group overflow-hidden rounded-xl p-[2px] focus:outline-none shadow-gold-glow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze rounded-xl" />
            <div className="relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-akm-purple-base to-akm-purple-light text-akm-gold-light font-bold text-sm tracking-wider uppercase">
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-akm-gold-royal border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Token...</span>
                </div>
              ) : (
                <>
                  <Check className="w-4 h-4 text-akm-gold-royal" />
                  <span>Verify & Unlock Draw</span>
                </>
              )}
            </div>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default TokenVerificationModal;
