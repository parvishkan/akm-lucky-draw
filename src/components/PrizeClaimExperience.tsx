import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, QrCode, Download, CheckCircle2, Building2 } from 'lucide-react';
import { TokenVerificationData } from '../types';
import { Prize } from '../data/prizes';
import { APP_CONFIG } from '../constants/appConfig';

interface PrizeClaimExperienceProps {
  tokenData: TokenVerificationData;
  prize: Prize;
  onClaimConfirmed: () => void;
}

export const PrizeClaimExperience: React.FC<PrizeClaimExperienceProps> = ({
  tokenData,
  prize,
  onClaimConfirmed
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const claimId = `AKM-CLAIM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      alert(`Claim Certificate ${claimId} downloaded to device gallery! Present at Anu Krishna Mall help desk to redeem.`);
      onClaimConfirmed();
    }, 600);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6 text-center select-none space-y-5 z-10">
      
      {/* 1. Verified Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-1.5"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_25px_rgba(52,211,153,0.3)]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Prize Pass</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-gold-metallic">
          Digital Prize Claim Card
        </h2>

        <p className="text-xs text-gray-300 font-sans leading-relaxed">
          Present this pass at Anu Krishna Mall Help Desk to collect your prize.
        </p>
      </motion.div>

      {/* 2. Digital Claim Card Pass (Slides Up Elegantly) */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#0F061A]/95 border-2 border-akm-gold-royal/50 rounded-3xl p-5 shadow-glass-lg backdrop-blur-xl space-y-4 overflow-hidden text-left"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gold-metallic" />

        {/* Mall Brand Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-akm-gold-royal/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-akm-gold-royal/20 border border-akm-gold-royal flex items-center justify-center">
              <Building2 className="w-4 h-4 text-akm-gold-royal" />
            </div>
            <div>
              <span className="font-heading text-xs font-bold text-white block">
                {APP_CONFIG.brand.mallName}
              </span>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block">
                Official Diwali Pass
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Active Valid
          </span>
        </div>

        {/* Claim ID Code (Reveals Elegantly) */}
        <div className="p-3 rounded-2xl bg-[#07020E] border border-akm-gold-royal/40 space-y-1">
          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">
            Unique Redemption Claim ID
          </span>
          <span className="font-mono text-lg font-black text-akm-gold-royal tracking-widest block">
            {claimId}
          </span>
        </div>

        {/* Prize & Winner Data Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-akm-purple-deepest border border-akm-gold-royal/20 space-y-0.5">
            <span className="text-[9px] text-gray-400 uppercase block">Won Reward</span>
            <span className="font-bold text-white block truncate">{prize.title}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-akm-purple-deepest border border-akm-gold-royal/20 space-y-0.5">
            <span className="text-[9px] text-gray-400 uppercase block">Token Code</span>
            <span className="font-mono font-bold text-akm-gold-royal block">{tokenData.tokenCode}</span>
          </div>
        </div>

        {/* QR / Barcode Display Section (Fades In) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-3 rounded-2xl bg-white border border-akm-gold-royal/40 flex flex-col items-center justify-center text-center space-y-1"
        >
          <div className="w-44 h-12 flex items-center justify-center bg-black/5 rounded p-1">
            <QrCode className="w-10 h-10 text-black" />
            <div className="flex-1 font-mono text-[10px] text-black font-bold tracking-widest text-right">
              ||||| ||| |||| |||
            </div>
          </div>
          <span className="text-[9px] font-mono text-gray-700 tracking-wider">
            Scan at Help Desk Desk #1 or #2
          </span>
        </motion.div>

      </motion.div>

      {/* 3. Save Screenshot Button with Soft Glowing Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.button
          onClick={handleDownload}
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.35)',
              '0 0 35px rgba(255, 215, 0, 0.65)',
              '0 0 20px rgba(255, 215, 0, 0.35)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-akm-gold-light via-akm-gold-royal to-akm-gold-bronze text-akm-purple-deepest font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 border border-amber-200 shadow-gold-glow cursor-pointer"
        >
          {downloaded ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Download className="w-4 h-4 text-akm-purple-deepest" />}
          <span>{downloaded ? 'Pass Saved to Device!' : 'Save Pass / Screenshot'}</span>
        </motion.button>
      </motion.div>

    </div>
  );
};

export default PrizeClaimExperience;
