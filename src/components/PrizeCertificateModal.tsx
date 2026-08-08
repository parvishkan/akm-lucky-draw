import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Gift, QrCode, CheckCircle2, Download, RefreshCw, Gem, Award } from 'lucide-react';
import { PrizeCertificateProps } from '../types';
import { ConfettiCanvas } from './ConfettiCanvas';

export const PrizeCertificateModal: React.FC<PrizeCertificateProps> = ({ tokenData, prize, onReset }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const renderPrizeIcon = () => {
    switch (prize.iconName) {
      case 'crown':
        return <Crown className="w-8 h-8 text-akm-gold-royal" />;
      case 'gem':
        return <Gem className="w-8 h-8 text-cyan-400" />;
      case 'gift':
        return <Gift className="w-8 h-8 text-pink-400" />;
      default:
        return <Award className="w-8 h-8 text-akm-gold-royal" />;
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto my-auto px-4 py-4 z-20">
      {/* Golden Festive Fireworks Overlay */}
      <ConfettiCanvas />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-6 sm:p-7 text-center relative overflow-hidden shadow-glass border-2 border-akm-gold-royal/50 space-y-5"
      >
        {/* Certificate Top Metallic Border Glow */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gold-metallic" />
        
        {/* Corner Royal Filigree Ornaments */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-akm-gold-royal/40" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-akm-gold-royal/40" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-akm-gold-royal/40" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-akm-gold-royal/40" />

        {/* Mall Seal Branding Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-akm-gold-royal text-xs font-serif font-bold tracking-[0.2em] uppercase">
            <Crown className="w-4 h-4" />
            <span>Anu Krishna Mall</span>
            <Crown className="w-4 h-4" />
          </div>
          <h3 className="text-[10px] text-akm-gold-light uppercase tracking-widest font-sans">
            Official Diwali Lucky Draw Winner Certificate
          </h3>
        </div>

        {/* Prize Box Highlight */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-5 rounded-2xl bg-gradient-to-b from-akm-purple-light/70 to-akm-purple-deepest border border-akm-gold-royal/40 relative shadow-gold-glow space-y-3"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-akm-purple-deepest border border-akm-gold-royal flex items-center justify-center shadow-gold-glow">
            {renderPrizeIcon()}
          </div>

          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-akm-gold-royal/15 border border-akm-gold-royal/30 text-akm-gold-light text-[10px] uppercase font-bold tracking-wider">
              {prize.category}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-gold-metallic">
              {prize.title}
            </h2>
            <div className="text-sm font-bold text-white">
              Estimated Value: <span className="text-akm-gold-royal">{prize.value}</span>
            </div>
          </div>

          <p className="text-xs text-gray-300/90 leading-relaxed pt-1">
            {prize.description}
          </p>
        </motion.div>

        {/* Redemption Voucher Details Box */}
        <div className="p-4 rounded-2xl bg-akm-purple-deepest/90 border border-akm-gold-royal/20 text-left space-y-3">
          <div className="flex justify-between items-center border-b border-akm-gold-royal/15 pb-2 text-xs">
            <span className="text-gray-400 font-medium">Winner:</span>
            <span className="text-white font-bold">{tokenData.customerName} ({tokenData.mobileNumber})</span>
          </div>

          <div className="flex justify-between items-center border-b border-akm-gold-royal/15 pb-2 text-xs">
            <span className="text-gray-400 font-medium">Receipt Token:</span>
            <span className="font-mono text-akm-gold-royal font-bold">{tokenData.tokenCode}</span>
          </div>

          {/* Barcode & Voucher Code */}
          <div className="pt-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">
                Voucher Claim Code
              </span>
              <span className="font-mono text-base font-extrabold text-akm-gold-light tracking-wider">
                {prize.voucherCode}
              </span>
            </div>
            
            {/* Visual Barcode Graphic */}
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <QrCode className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>

        {/* Claim Instructions Note */}
        <div className="p-3 rounded-xl bg-akm-gold-royal/10 border border-akm-gold-royal/20 text-xs text-akm-gold-light flex items-center gap-2 text-left">
          <CheckCircle2 className="w-4 h-4 text-akm-gold-royal shrink-0" />
          <span>Present this digital certificate at the Anu Krishna Mall Help Desk to claim your reward!</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-akm-gold-royal text-akm-purple-deepest font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:bg-akm-gold-light transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? 'Saved!' : 'Save Pass'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-akm-purple-light/50 border border-akm-gold-royal/30 text-akm-gold-light font-bold text-xs uppercase tracking-wider hover:bg-akm-purple-light transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
