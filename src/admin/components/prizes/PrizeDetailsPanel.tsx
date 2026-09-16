import React from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Star, Clock, Award, CheckSquare, Layers } from 'lucide-react';
import { PrizeItem } from './PrizeCard';
import PrizeStatusBadge from './PrizeStatusBadge';
import InventoryProgress from './InventoryProgress';
import PrizeProductVisual from '../../../components/PrizeProductVisual';

interface PrizeDetailsPanelProps {
  prize: PrizeItem | null;
  onClose: () => void;
}

export const PrizeDetailsPanel: React.FC<PrizeDetailsPanelProps> = ({ prize, onClose }) => {
  if (!prize) return null;

  const activityLogs = [
    { title: 'Prize Registered in Campaign Pool', time: '01 Oct 2026', desc: `Total ${prize.totalQuantity} units added under ${prize.category}.` },
    { title: 'Allocation Rules Configured', time: '01 Oct 2026', desc: prize.isHighValue ? 'Flagged as High-Value reward with protected allocation.' : 'Standard random draw allocation.' },
    { title: 'Inventory Distribution Tracked', time: '06 Aug 2026', desc: `${prize.distributedQuantity} units redeemed by customers so far.` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm select-none font-sans">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md h-full bg-[#1D0636] border-l border-[#FFD700]/30 shadow-2xl overflow-y-auto p-6 space-y-6 text-left"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Prize Specification</h3>
              <p className="text-[11px] text-[#A0A0A0]">Complete inventory & allocation rules metadata.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prize Hero Card */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/40 space-y-3 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />

          <div className="relative w-32 h-32 mx-auto rounded-xl bg-[#1D0636] border border-[#FFD700]/20 p-2 flex items-center justify-center overflow-hidden">
            <PrizeProductVisual prize={prize} size="lg" alt={prize.name} />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-white">{prize.name}</h3>
            <span className="font-mono text-xs font-bold text-[#FFD700] block">{prize.value} • {prize.category}</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <PrizeStatusBadge status={prize.status} />
            {prize.isHighValue && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D021A] bg-[#FFD700] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Star className="w-3 h-3 fill-[#0D021A]" />
                <span>HIGH VALUE</span>
              </span>
            )}
          </div>
        </div>

        {/* Inventory Breakdown */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 space-y-3">
          <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px]">
            Inventory Breakdown
          </h4>

          <InventoryProgress
            total={prize.totalQuantity}
            distributed={prize.distributedQuantity}
            remaining={prize.remainingQuantity}
          />
        </div>

        {/* Activity Logs */}
        <div className="space-y-3 text-xs pt-1">
          <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Audit & Activity Stream</span>
          </h4>

          <div className="space-y-3">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0D021A] border border-[#FFD700]/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{log.title}</span>
                  <span className="text-[9px] font-mono text-[#D4AF37]">{log.time}</span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-relaxed">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default PrizeDetailsPanel;
