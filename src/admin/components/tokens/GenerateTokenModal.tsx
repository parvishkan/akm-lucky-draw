import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sparkles,
  PlusCircle,
  Calendar,
  Clock,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Gift,
  ArrowRight
} from 'lucide-react';
import { CampaignService, CampaignData, TimeSlotData } from '../../../services/campaignService';
import { TokensService } from '../../../services/tokensService';
import { PrizesService } from '../../../services/prizesService';

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
  const [prefix, setPrefix] = useState('AKMSPA');
  const [length, setLength] = useState(3);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Prize Inventory State
  const [availableGifts, setAvailableGifts] = useState<number>(0);
  const [activePrizeCount, setActivePrizeCount] = useState<number>(0);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(true);

  // Load campaigns and time slots on mount/open
  useEffect(() => {
    if (isOpen) {
      loadCampaignsAndSlots();
      setErrorMessage('');
    }
  }, [isOpen]);

  // Subscribe to real-time active prizes when modal is open
  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingInventory(true);
    const unsubscribe = PrizesService.subscribeToActivePrizes(
      (prizes) => {
        const activePrizes = prizes.filter(
          (p) => (p.status ? p.status === 'ACTIVE' : true) && p.enabled !== false
        );
        const totalAvail = activePrizes.reduce((sum, p) => {
          const qty = Number(p.availableQuantity ?? p.remainingStock ?? p.quantity ?? 0);
          return sum + (isNaN(qty) || qty < 0 ? 0 : qty);
        }, 0);

        setAvailableGifts(totalAvail);
        setActivePrizeCount(activePrizes.length);
        setIsLoadingInventory(false);
      },
      (err) => {
        console.error('Failed to subscribe to prizes in GenerateTokenModal:', err);
        setIsLoadingInventory(false);
      }
    );

    return () => unsubscribe();
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

  // Navigate to Prize Management
  const handleReviewGifts = () => {
    onClose();
    window.location.hash = '#prizes';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  if (!isOpen) return null;

  // Sample preview generator
  const generatePreview = () => {
    const chars = '234679ACDEFGHJKLMNPQRTUVWXYZ';
    let rand = '';
    for (let i = 0; i < length; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${rand}`;
  };

  // Inventory Safety Calculations
  const isDepleted = !isLoadingInventory && availableGifts === 0;
  const shortage = Math.max(0, count - availableGifts);
  const buffer = Math.max(0, availableGifts - count);
  const isBlockedByInventory = !isLoadingInventory && (isDepleted || shortage > 0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Safety Gate Enforcement
    if (isBlockedByInventory) {
      setErrorMessage(
        availableGifts === 0
          ? 'Cannot generate tokens: No active gifts are currently available for this campaign.'
          : `Cannot generate tokens: Requested ${count} tokens exceeds available gift inventory (${availableGifts} available, shortage of ${shortage}).`
      );
      return;
    }

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

  const activeSlot = timeSlots.find((s) => s.slotId === selectedSlotId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-lg bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-5 text-left my-8"
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

        {/* PRIZE INVENTORY SAFETY GATE CARD */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isBlockedByInventory
              ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              : 'bg-[#150527] border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
          }`}
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              {isBlockedByInventory ? (
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Prize Inventory Safety Gate
                </h4>
                <p className="text-[10px] text-gray-400">
                  Dual-layer live validation against active gifts
                </p>
              </div>
            </div>

            {/* Status badge */}
            {isBlockedByInventory ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                GENERATION BLOCKED
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                INVENTORY VERIFIED
              </span>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center mb-3">
            <div className="bg-[#0D021A] p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase">Requested</span>
              <span className="text-base font-black text-white font-mono">{count}</span>
              <span className="text-[9px] text-gray-500 block">Tokens</span>
            </div>

            <div className="bg-[#0D021A] p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase">Active Gifts</span>
              <span className="text-base font-black text-[#FFD700] font-mono">
                {isLoadingInventory ? '...' : availableGifts}
              </span>
              <span className="text-[9px] text-gray-500 block">
                {activePrizeCount} Prize Types
              </span>
            </div>

            <div className="bg-[#0D021A] p-2.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-semibold text-gray-400 block uppercase">
                {isBlockedByInventory ? 'Shortage' : 'Safety Buffer'}
              </span>
              <span
                className={`text-base font-black font-mono ${
                  isBlockedByInventory ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isBlockedByInventory ? `-${shortage}` : `+${buffer}`}
              </span>
              <span className="text-[9px] text-gray-500 block">
                {isBlockedByInventory ? 'Gifts Deficit' : 'Surplus Gifts'}
              </span>
            </div>
          </div>

          {/* Detailed Status Explanation */}
          {isDepleted ? (
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed">
              <strong>Critical:</strong> No active gifts are currently available for this campaign. All prize inventory is either depleted or inactive. Generation is completely disabled until gifts are added or enabled.
            </div>
          ) : shortage > 0 ? (
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed">
              <strong>Warning:</strong> Requested token count ({count}) exceeds available active gifts ({availableGifts}). You are short by <strong>{shortage} gifts</strong>. Reduce the requested tokens or add gift inventory before proceeding.
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] leading-relaxed">
              <strong>Safe to Issue:</strong> All {count} requested tokens are 100% backed by available gift stock, leaving a safety buffer of {buffer} gifts in the active prize pool.
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="space-y-4">
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
              <span>Select Time Slot (Slot Capacity: {activeSlot?.tokenLimit || 100})</span>
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
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center justify-between">
              <span>Number of Tokens to Issue</span>
              <span className="text-[11px] text-gray-400 font-mono">
                Available Gifts: {availableGifts}
              </span>
            </label>
            <input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-full px-4 py-3 bg-[#0D021A] border rounded-xl text-white font-mono text-base font-bold focus:outline-none transition-colors ${
                isBlockedByInventory
                  ? 'border-rose-500/50 focus:border-rose-400'
                  : 'border-[#FFD700]/30 focus:border-[#FFD700]'
              }`}
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[25, 50, 75, 100, 200, 500, 800, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCount(val)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                    count === val
                      ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]'
                      : 'border-[#FFD700]/20 bg-[#0D021A] text-gray-400 hover:text-white'
                  }`}
                >
                  {val}
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
                <option value={3}>3 Characters (AKMSPA + 3)</option>
                <option value={4}>4 Characters</option>
                <option value={5}>5 Characters</option>
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
            <span className="font-mono text-base sm:text-lg font-black text-[#FFD700] tracking-widest block">
              {generatePreview()}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#FFD700]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              {isBlockedByInventory && (
                <button
                  type="button"
                  onClick={handleReviewGifts}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Review Gifts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                disabled={isBlockedByInventory || isGenerating || count <= 0}
                className={`px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 transition-all ${
                  isBlockedByInventory || count <= 0
                    ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50 shadow-none'
                    : 'bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] cursor-pointer'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#0D021A] border-t-transparent rounded-full animate-spin" />
                    <span>Generating Batch...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className={`w-4 h-4 ${isBlockedByInventory ? 'text-gray-500' : 'text-[#0D021A]'}`} />
                    <span>
                      {isBlockedByInventory
                        ? 'Generation Blocked'
                        : `Generate ${count} Blind Tokens`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default GenerateTokenModal;
