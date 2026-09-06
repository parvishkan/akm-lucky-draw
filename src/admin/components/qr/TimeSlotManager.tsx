import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { CampaignService, ACTIVE_CAMPAIGN_ID, TimeSlotData } from '../../../services/campaignService';

export const TimeSlotManager: React.FC = () => {
  const [slots, setSlots] = useState<TimeSlotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotData | null>(null);
  const [slotToDelete, setSlotToDelete] = useState<TimeSlotData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slotId: '',
    dayNumber: 1,
    date: '2026-10-01',
    slotStart: '2026-10-01T10:00',
    giftUnlock: '2026-10-01T11:00',
    slotEnd: '2026-10-01T13:00',
    tokenLimit: 100,
    status: 'UPCOMING' as TimeSlotData['status']
  });

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const data = await CampaignService.getTimeSlots(ACTIVE_CAMPAIGN_ID);
      // Sort by slotStart
      data.sort((a, b) => {
        const timeA = a.slotStart?.toDate ? a.slotStart.toDate().getTime() : new Date(a.slotStart).getTime();
        const timeB = b.slotStart?.toDate ? b.slotStart.toDate().getTime() : new Date(b.slotStart).getTime();
        return timeA - timeB;
      });
      setSlots(data);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const openAddModal = () => {
    const nextSlotNum = slots.length + 1;
    setEditingSlot(null);
    setFormData({
      slotId: `slot-day1-slot${nextSlotNum}`,
      dayNumber: 1,
      date: '2026-10-01',
      slotStart: '2026-10-01T10:00',
      giftUnlock: '2026-10-01T11:00',
      slotEnd: '2026-10-01T13:00',
      tokenLimit: 100,
      status: 'UPCOMING'
    });
    setErrorMessage(null);
    setIsFormOpen(true);
  };

  const openEditModal = (slot: TimeSlotData) => {
    const formatForInput = (timestampOrStr: any) => {
      if (!timestampOrStr) return '';
      const d = timestampOrStr.toDate ? timestampOrStr.toDate() : new Date(timestampOrStr);
      if (isNaN(d.getTime())) return '';
      // Return YYYY-MM-DDTHH:mm format in local time
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setEditingSlot(slot);
    setFormData({
      slotId: slot.slotId,
      dayNumber: slot.dayNumber || 1,
      date: slot.date || '2026-10-01',
      slotStart: formatForInput(slot.slotStart),
      giftUnlock: formatForInput(slot.giftUnlock),
      slotEnd: formatForInput(slot.slotEnd),
      tokenLimit: slot.tokenLimit || 100,
      status: slot.status || 'UPCOMING'
    });
    setErrorMessage(null);
    setIsFormOpen(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const startMillis = new Date(formData.slotStart).getTime();
    const unlockMillis = new Date(formData.giftUnlock).getTime();
    const endMillis = new Date(formData.slotEnd).getTime();

    // 1. Time Logic Validation
    if (isNaN(startMillis) || isNaN(unlockMillis) || isNaN(endMillis)) {
      setErrorMessage('Please provide valid date and time values for all slot times.');
      return;
    }

    if (startMillis >= unlockMillis) {
      setErrorMessage('Slot Start Time must be strictly before Gift Unlock Time.');
      return;
    }

    if (unlockMillis >= endMillis) {
      setErrorMessage('Gift Unlock Time must be strictly before Slot End Time.');
      return;
    }

    if (formData.tokenLimit < 1) {
      setErrorMessage('Token limit must be at least 1.');
      return;
    }

    // 2. Overlap Validation with other slots on same date
    const conflictingSlot = slots.find((other) => {
      if (editingSlot && other.slotId === editingSlot.slotId) return false;
      if (other.date !== formData.date) return false;
      const otherStart = other.slotStart?.toDate ? other.slotStart.toDate().getTime() : new Date(other.slotStart).getTime();
      const otherEnd = other.slotEnd?.toDate ? other.slotEnd.toDate().getTime() : new Date(other.slotEnd).getTime();
      // Check if [startMillis, endMillis] overlaps with [otherStart, otherEnd]
      return startMillis < otherEnd && endMillis > otherStart;
    });

    if (conflictingSlot) {
      setErrorMessage(`Time range overlaps with existing slot "${conflictingSlot.slotId}". Please adjust times.`);
      return;
    }

    try {
      setIsLoading(true);
      if (editingSlot) {
        // Update
        await CampaignService.updateTimeSlot(ACTIVE_CAMPAIGN_ID, editingSlot.slotId, {
          dayNumber: formData.dayNumber,
          date: formData.date,
          slotStart: new Date(formData.slotStart).toISOString(),
          giftUnlock: new Date(formData.giftUnlock).toISOString(),
          slotEnd: new Date(formData.slotEnd).toISOString(),
          tokenLimit: formData.tokenLimit,
          status: formData.status
        });
        setSuccessMessage(`Slot "${editingSlot.slotId}" updated successfully.`);
      } else {
        // Create
        await CampaignService.createTimeSlot(ACTIVE_CAMPAIGN_ID, {
          slotId: formData.slotId.trim() || `slot-day${formData.dayNumber}-${Date.now()}`,
          dayNumber: formData.dayNumber,
          date: formData.date,
          slotStart: new Date(formData.slotStart).toISOString(),
          giftUnlock: new Date(formData.giftUnlock).toISOString(),
          slotEnd: new Date(formData.slotEnd).toISOString(),
          tokenLimit: formData.tokenLimit,
          status: formData.status
        });
        setSuccessMessage(`New slot "${formData.slotId}" created in Firestore.`);
      }

      setIsFormOpen(false);
      await loadSlots();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Failed to save slot:', err);
      setErrorMessage(err?.message || 'Failed to save time slot to Firestore.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (slot: TimeSlotData) => {
    const nextStatus: Record<TimeSlotData['status'], TimeSlotData['status']> = {
      UPCOMING: 'ACTIVE',
      ACTIVE: 'ENDED',
      ENDED: 'UPCOMING'
    };
    const targetStatus = nextStatus[slot.status || 'UPCOMING'];

    try {
      setIsLoading(true);
      await CampaignService.toggleTimeSlotStatus(ACTIVE_CAMPAIGN_ID, slot.slotId, targetStatus);
      await loadSlots();
    } catch (err) {
      console.error('Failed to toggle slot status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlot = async () => {
    if (!slotToDelete) return;
    try {
      setIsLoading(true);
      await CampaignService.deleteTimeSlot(ACTIVE_CAMPAIGN_ID, slotToDelete.slotId);
      setSlotToDelete(null);
      await loadSlots();
      setSuccessMessage(`Time slot "${slotToDelete.slotId}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to delete slot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDisplayTime = (timestampOrStr: any) => {
    if (!timestampOrStr) return 'N/A';
    const d = timestampOrStr.toDate ? timestampOrStr.toDate() : new Date(timestampOrStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getStatusBadge = (status: TimeSlotData['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">🟢 ACTIVE</span>;
      case 'ENDED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 border border-rose-500/40 text-rose-400">🔴 ENDED</span>;
      case 'UPCOMING':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 border border-amber-500/40 text-amber-300">🟡 UPCOMING</span>;
    }
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 text-left select-none relative overflow-hidden font-sans">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Campaign Time-Slot Manager</h3>
            <p className="text-[11px] text-[#A0A0A0]">
              Configure slot hours, gift unlock moments, and capacity limits in Firestore.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSlots}
            className="p-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
            title="Refresh Slots"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#0D021A]" />
            <span>+ Add Time Slot</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Slots Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Slot ID / Day</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Slot Window</th>
              <th className="py-3 px-3">Gift Unlock</th>
              <th className="py-3 px-3">Token Limit</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10">
            {slots.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#A0A0A0]">
                  No time slots configured in Firestore yet. Click <strong>+ Add Time Slot</strong> to schedule campaign draw windows.
                </td>
              </tr>
            ) : (
              slots.map((slot) => (
                <tr key={slot.slotId} className="hover:bg-[#0D021A]/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-white text-xs">{slot.slotId}</div>
                    <span className="text-[10px] text-[#A0A0A0]">Day {slot.dayNumber || 1}</span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[#A0A0A0]">
                    {slot.date || '2026-10-01'}
                  </td>

                  <td className="py-3 px-3 font-mono text-white text-xs">
                    {formatDisplayTime(slot.slotStart)} - {formatDisplayTime(slot.slotEnd)}
                  </td>

                  <td className="py-3 px-3 font-mono text-amber-300 text-xs flex items-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span>{formatDisplayTime(slot.giftUnlock)}</span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#0D021A] border border-[#FFD700]/20 text-white font-bold">
                      {slot.tokenLimit || 100}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleStatus(slot)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      title="Click to cycle status"
                    >
                      {getStatusBadge(slot.status)}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(slot)}
                        className="p-1.5 rounded-lg bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-[#FFD700] transition-colors cursor-pointer"
                        title="Edit Slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSlotToDelete(slot)}
                        className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Time Slot Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-4 text-left my-8"
            >
              <div className="flex items-center justify-between border-b border-[#FFD700]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="font-heading text-base font-bold text-white">
                    {editingSlot ? `Edit Slot: ${editingSlot.slotId}` : 'Add Campaign Time Slot'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                      Slot Identifier
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingSlot}
                      value={formData.slotId}
                      onChange={(e) => setFormData({ ...formData, slotId: e.target.value })}
                      placeholder="e.g. slot-day1-morning"
                      className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700] disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                      Day Number
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      required
                      value={formData.dayNumber}
                      onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                      Campaign Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                      Slot Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#FFD700]"
                    >
                      <option value="UPCOMING">🟡 UPCOMING</option>
                      <option value="ACTIVE">🟢 ACTIVE</option>
                      <option value="ENDED">🔴 ENDED</option>
                    </select>
                  </div>
                </div>

                {/* Timing Pickers */}
                <div className="p-3 bg-[#0D021A] border border-[#FFD700]/20 rounded-2xl space-y-3">
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
                    Slot Time Parameters (Validated for Serverless Reveal)
                  </span>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#A0A0A0] block">1. Slot Start Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.slotStart}
                      onChange={(e) => setFormData({ ...formData, slotStart: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-amber-300 font-bold block flex items-center gap-1">
                      <Unlock className="w-3 h-3 text-[#FFD700]" />
                      <span>2. Gift Unlock Time (Prizes become revealable)</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.giftUnlock}
                      onChange={(e) => setFormData({ ...formData, giftUnlock: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1D0636] border border-amber-400/50 rounded-xl text-amber-200 font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#A0A0A0] block">3. Slot End Time (Slot closes)</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.slotEnd}
                      onChange={(e) => setFormData({ ...formData, slotEnd: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider block">
                    Token Capacity Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.tokenLimit}
                    onChange={(e) => setFormData({ ...formData, tokenLimit: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
                  />
                  <span className="text-[10px] text-[#A0A0A0] block">Maximum tokens permitted to be generated for this window.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFD700]/15">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs uppercase cursor-pointer"
                  >
                    {editingSlot ? 'Save Changes' : 'Create Time Slot'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {slotToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1D0636] border-2 border-rose-500/50 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-white">Delete Time Slot?</h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Are you sure you want to delete time slot <strong>{slotToDelete.slotId}</strong>? Tokens associated with this slot will need reassignment.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSlotToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteSlot}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold uppercase shadow-lg cursor-pointer"
                >
                  Delete Slot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimeSlotManager;

