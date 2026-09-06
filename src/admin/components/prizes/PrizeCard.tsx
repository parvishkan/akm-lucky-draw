import React from 'react';
import { motion } from 'framer-motion';
import { Star, Edit3, Eye, Trash2, AlertTriangle, Gift } from 'lucide-react';
import PrizeStatusBadge, { PrizeStatus } from './PrizeStatusBadge';
import InventoryProgress from './InventoryProgress';

export interface PrizeItem {
  id: string;
  name: string;
  category: 'Grand Prize' | 'Premium Prize' | 'Regular Gift' | 'Gift Voucher' | 'Merchandise' | 'Other';
  image: string;
  totalQuantity: number;
  distributedQuantity: number;
  remainingQuantity: number;
  value: string;
  description: string;
  priority: number;
  status: PrizeStatus;
  isHighValue: boolean;
  displayOrder: number;
  slotId?: string;
}

interface PrizeCardProps {
  prize: PrizeItem;
  onEdit: (prize: PrizeItem) => void;
  onViewDetails: (prize: PrizeItem) => void;
  onDelete: (prize: PrizeItem) => void;
}

export const PrizeCard: React.FC<PrizeCardProps> = ({
  prize,
  onEdit,
  onViewDetails,
  onDelete
}) => {
  const isLowStock = prize.remainingQuantity > 0 && prize.remainingQuantity <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-[#1D0636]/90 border rounded-3xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-4 overflow-hidden text-left transition-all ${
        prize.isHighValue ? 'border-[#FFD700]/60 shadow-[0_0_25px_rgba(255,215,0,0.2)]' : 'border-[#FFD700]/25'
      }`}
    >
      {/* Top Gold Accent Line */}
      <div className={`absolute top-0 inset-x-0 h-[2px] ${prize.isHighValue ? 'bg-[#FFD700]' : 'bg-[#FFD700]/30'}`} />

      {/* Header Row: Category & High Value Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0D021A] px-2.5 py-0.5 rounded-full border border-[#FFD700]/20">
          {prize.category}
        </span>

        {prize.isHighValue && (
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D021A] bg-[#FFD700] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-gold-glow">
            <Star className="w-3 h-3 fill-[#0D021A] text-[#0D021A]" />
            <span>HIGH VALUE</span>
          </span>
        )}
      </div>

      {/* Prize Visual Container & Title */}
      <div className="space-y-3">
        <div className="relative w-full h-32 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 p-3 flex items-center justify-center overflow-hidden">
          {prize.image ? (
            <img src={prize.image} alt={prize.name} className="w-full h-full object-contain drop-shadow-md" />
          ) : (
            <Gift className="w-12 h-12 text-[#FFD700]" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base font-bold text-white leading-tight">
              {prize.name}
            </h3>
            <span className="font-mono text-xs font-bold text-[#FFD700] shrink-0">
              {prize.value}
            </span>
          </div>

          <p className="text-[11px] text-[#A0A0A0] line-clamp-2 leading-relaxed">
            {prize.description}
          </p>
        </div>
      </div>

      {/* Low Stock Warning Pill */}
      {isLowStock && (
        <div className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Low Stock Warning — Only {prize.remainingQuantity} units left!</span>
        </div>
      )}

      {/* Inventory Progress Bar */}
      <InventoryProgress
        total={prize.totalQuantity}
        distributed={prize.distributedQuantity}
        remaining={prize.remainingQuantity}
      />

      {/* Footer Row: Status & Action Buttons */}
      <div className="pt-3 border-t border-[#FFD700]/15 flex items-center justify-between gap-2">
        <PrizeStatusBadge status={prize.status} />

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewDetails(prize)}
            className="p-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors cursor-pointer"
            title="View Specification Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onEdit(prize)}
            className="p-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Edit Prize"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(prize)}
            className="p-2 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 transition-colors cursor-pointer"
            title="Delete Prize"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </motion.div>
  );
};

export default PrizeCard;
