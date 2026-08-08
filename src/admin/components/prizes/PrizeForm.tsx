import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, PlusCircle, Star, Check } from 'lucide-react';
import { PrizeItem } from './PrizeCard';
import PrizeImageUpload from './PrizeImageUpload';
import { PrizeStatus } from './PrizeStatusBadge';

interface PrizeFormProps {
  isOpen: boolean;
  prizeToEdit?: PrizeItem | null;
  onClose: () => void;
  onSave: (prizeData: Partial<PrizeItem>) => void;
}

export const PrizeForm: React.FC<PrizeFormProps> = ({
  isOpen,
  prizeToEdit,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PrizeItem['category']>('Grand Prize');
  const [image, setImage] = useState('/akm-logo.png');
  const [totalQuantity, setTotalQuantity] = useState(10);
  const [value, setValue] = useState('₹5,000');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState<PrizeStatus>('ACTIVE');
  const [isHighValue, setIsHighValue] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  useEffect(() => {
    if (prizeToEdit) {
      setName(prizeToEdit.name);
      setCategory(prizeToEdit.category);
      setImage(prizeToEdit.image || '/akm-logo.png');
      setTotalQuantity(prizeToEdit.totalQuantity);
      setValue(prizeToEdit.value);
      setDescription(prizeToEdit.description);
      setPriority(prizeToEdit.priority || 1);
      setStatus(prizeToEdit.status);
      setIsHighValue(prizeToEdit.isHighValue || false);
      setDisplayOrder(prizeToEdit.displayOrder || 1);
    } else {
      setName('');
      setCategory('Grand Prize');
      setImage('/akm-logo.png');
      setTotalQuantity(10);
      setValue('₹5,000');
      setDescription('');
      setPriority(1);
      setStatus('ACTIVE');
      setIsHighValue(false);
      setDisplayOrder(1);
    }
  }, [prizeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: prizeToEdit?.id,
      name: name.trim(),
      category,
      image,
      totalQuantity,
      value: value.trim() || '₹1,000',
      description: description.trim(),
      priority,
      status,
      isHighValue,
      displayOrder
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-xl bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6 text-left my-8"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                {prizeToEdit ? 'Edit Lucky Draw Prize' : 'Add New Lucky Draw Prize'}
              </h3>
              <p className="text-[11px] text-[#A0A0A0]">Configure prize details, image, stock, and high-value status.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Prize Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Prize Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. iPhone 16 Pro Max"
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                <option value="Grand Prize">Grand Prize</option>
                <option value="Premium Prize">Premium Prize</option>
                <option value="Regular Gift">Regular Gift</option>
                <option value="Gift Voucher">Gift Voucher</option>
                <option value="Merchandise">Merchandise</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Image Upload Placeholder UI */}
          <PrizeImageUpload imagePath={image} onImageChange={setImage} />

          {/* Row 3: Total Quantity & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Total Stock Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white font-mono font-bold focus:outline-none focus:border-[#FFD700]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Approx Prize Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. ₹1,39,900"
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Prize Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe prize details, voucher terms, or collection guidelines..."
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          {/* Row 4: Status & ⭐ High Value Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Campaign Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
              >
                <option value="ACTIVE">🟢 Active in Pool</option>
                <option value="INACTIVE">⚪ Inactive / Paused</option>
                <option value="OUT_OF_STOCK">🔴 Out of Stock</option>
              </select>
            </div>

            {/* ⭐ High Value Toggle */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setIsHighValue(!isHighValue)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isHighValue
                    ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700] shadow-gold-glow'
                    : 'border-[#FFD700]/20 bg-[#0D021A] text-gray-400'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${isHighValue ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-400'}`} />
                  <span>High Value Prize Toggle</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${isHighValue ? 'bg-[#FFD700] text-[#0D021A]' : 'bg-gray-800 text-gray-400'}`}>
                  {isHighValue ? '⭐ YES' : 'NO'}
                </span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFD700]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#0D021A]" />
              <span>{prizeToEdit ? 'Save Changes' : 'Add Prize'}</span>
            </button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default PrizeForm;
