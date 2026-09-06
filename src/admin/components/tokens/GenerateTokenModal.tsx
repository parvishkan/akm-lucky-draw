import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, PlusCircle, Calendar, Clock, AlertCircle } from 'lucide-react';
import { CampaignService, CampaignData, TimeSlotData } from '../../../services/campaignService';
import { TokensService } from '../../../services/tokensService';

interface GenerateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GenerateTokenModal: React.FC<GenerateTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('akm-diwali-2026');
  
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-day1-morning');

  const [count, setCount] = useState(100);
  const [prefix, setPrefix] = useState('AKM-D1S1-');
  const [length, setLength] = useState(5);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load campaigns and time slots on mount/open
  useEffect(() => {
    if (isOpen) {
      loadCampaignsAndSlots();
    }
  }, [isOpen]);

  const loadCampaignsAndSlots = async () => {
    const allCampaigns = await CampaignService.getAllCampaigns();
    setCampaigns(allCampaigns);

    const activeCid = allCampaigns[0]?.campaignId || 'akm-diwali-2026';
    setSelectedCampaignId(activeCid);

    const slots = await CampaignService.getTimeSlots(activeCid);
    if (slots.length > 0) {
      setTimeSlots(slots);
      setSelectedSlotId(slots[0].slotId);
    } else {
      // Default 4-day slots fallback if collection is empty
      const defaultSlots: TimeSlotData[] = [
        { slotId: 'slot-day1-morning', campaignId: activeCid, dayNumber: 1, date: '2026-10-01', slotStart: null, giftUnlock: null, slotEnd: null, tokenLimit: 100, status: 'UPCOMING' },
        { slotId: 'slot-day1-evening', campaignId: activeCid, dayNumber: 1, date: '2026-10-01', slotStart: null, giftUnlock: null, slotEnd: null, tokenLimit: 100, status: 'UPCOMING' },
        { slotId: 'slot-day2-morning', campaignId: activeCid, dayNumber: 2, date: '2026-10-02', slotStart: null, giftUnlock: null, slotEnd: null, tokenLimit: 100, status: 'UPCOMING' },
        { slotId: 'slot-day3-morning', campaignId: activeCid, dayNumber: 3, date: '2026-10-03', slotStart: null, giftUnlock: null, slotEnd: null, tokenLimit: 100, status: 'UPCOMING' },
        { slotId: 'slot-day4-grand', campaignId: activeCid, dayNumber: 4, date: '2026-10-04', slotStart: null, giftUnlock: null, slotEnd: null, tokenLimit: 100, status: 'UPCOMING' }
      ];
      setTimeSlots(defaultSlots);
      setSelectedSlotId(defaultSlots[0].slotId);
    }
  };

  // Handle Campaign Change
  const handleCampaignChange = async (cid: string) => {
    setSelectedCampaignId(cid);
    const slots = await CampaignService.getTimeSlots(cid);
    setTimeSlots(slots);
    if (slots.length > 0) {
      setSelectedSlotId(slots[0].slotId);
    }
  };

  if (!isOpen) return null;

  // Sample preview generator
  const generatePreview = () => {
    const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
    let rand = '';
    for (let i = 0; i < length; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${rand}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage('');

    const res = await TokensService.generateBatchForSlot(
      selectedCampaignId,
      selectedSlotId,
      count,
      prefix,
      length
    );

    setIsGenerating(false);

    if (res.success) {
      alert(res.message);
      onSuccess();
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const activeSlot = timeSlots.find(s => s.slotId === selectedSlotId);

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
              <h3 className="font-heading text-lg font-bold text-white">Generate Blind Time-Slot Tokens</h3>
              <p className="text-[11px] text-[#A0A0A0]">Issue a new batch of tokens locked to a Campaign Time Slot.</p>
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
          
          {/* Campaign Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Select Active Campaign</span>
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => handleCampaignChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-sans text-xs font-bold focus:outline-none focus:border-[#FFD700]"
            >
              {campaigns.map((c) => (
                <option key={c.campaignId} value={c.campaignId}>
                  {c.name} ({c.startDate} to {c.endDate})
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Select Time Slot (Token Limit: {activeSlot?.tokenLimit || 100})</span>
            </label>
            <select
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs font-bold focus:outline-none focus:border-[#FFD700]"
            >
              {timeSlots.map((s) => (
                <option key={s.slotId} value={s.slotId}>
                  Day {s.dayNumber} ({s.date}) — Slot: {s.slotId} [Limit: {s.tokenLimit || 100}]
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selector + Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Number of Tokens to Issue (Slot Capacity Cap Enforced)
            </label>
            <input
              type="number"
              min={1}
              max={activeSlot?.tokenLimit || 100}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-[#FFD700]"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[25, 50, 75, 100].map((val) => (
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
                  {val} Tokens
                </button>
              ))}
            </div>
          </div>

          {/* Prefix & Length */}
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

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Format Preview Card */}
          <div className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 space-y-1 text-center">
            <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest block">
              Sample Format Preview (Blind Token • Secret Prize Map Hidden)
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
                  <span>Generate {count} Blind Tokens</span>
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
