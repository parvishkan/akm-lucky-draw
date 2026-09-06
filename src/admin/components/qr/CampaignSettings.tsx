import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/appConfig';
import { CampaignService, ACTIVE_CAMPAIGN_ID } from '../../../services/campaignService';

export const CampaignSettings: React.FC = () => {
  const [name, setName] = useState(APP_CONFIG.brand.appName);
  const [desc, setDesc] = useState('Diwali Season Grand Shopping Lucky Draw');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-04');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('22:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [dailyLimit, setDailyLimit] = useState(100);
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(60);
  const [cooldownMinutes, setCooldownMinutes] = useState(15);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved settings from Firestore on mount
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const state = await CampaignService.getCampaignState(ACTIVE_CAMPAIGN_ID);
        if (state) {
          if (state.name) setName(state.name);
          if (state.description) setDesc(state.description);
          if (state.startDate) setStartDate(state.startDate);
          if (state.endDate) setEndDate(state.endDate);
          if (state.startTime) setStartTime(state.startTime);
          if (state.endTime) setEndTime(state.endTime);
          if (state.timezone) setTimezone(state.timezone);
          if (state.dailyLimit !== undefined) setDailyLimit(state.dailyLimit);
          if (state.slotDurationMinutes !== undefined) setSlotDurationMinutes(state.slotDurationMinutes);
          if (state.cooldownMinutes !== undefined) setCooldownMinutes(state.cooldownMinutes);
        }
      } catch (err) {
        console.warn('Failed to load campaign settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await CampaignService.saveCampaignSettings({
        name: name.trim() || APP_CONFIG.brand.appName,
        description: desc.trim(),
        startDate,
        endDate,
        startTime,
        endTime,
        timezone,
        dailyLimit: Math.max(1, dailyLimit),
        slotDurationMinutes: Math.max(5, slotDurationMinutes),
        cooldownMinutes: Math.max(0, cooldownMinutes)
      }, ACTIVE_CAMPAIGN_ID);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save campaign settings to Firestore:', err);
      setErrorMessage(err?.message || 'Failed to save settings. Please check Firestore permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Campaign Parameters</h3>
            <p className="text-[11px] text-[#A0A0A0]">Configure campaign dates, limits, and draw cooldowns in Firestore.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-1.5 text-xs text-[#A0A0A0]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD700]" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Campaign Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Timezone
            </label>
            <input
              type="text"
              readOnly
              value={timezone}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/20 rounded-xl text-xs text-gray-400 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            Campaign Description
          </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Start Time
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              End Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              End Time
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        {/* Campaign Operational Limits (Daily Limit, Slot Duration, Cooldown) */}
        <div className="p-3 bg-[#0D021A] border border-[#FFD700]/20 rounded-2xl space-y-3">
          <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">
            Draw Cooldown & Customer Limits
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-[#A0A0A0]">Daily Token Limit</label>
              <input
                type="number"
                min={1}
                required
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
              />
              <span className="text-[9px] text-[#A0A0A0] block">Max entries / day</span>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-[#A0A0A0]">Slot Duration (Mins)</label>
              <input
                type="number"
                min={5}
                required
                value={slotDurationMinutes}
                onChange={(e) => setSlotDurationMinutes(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-full px-3 py-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
              />
              <span className="text-[9px] text-[#A0A0A0] block">Standard slot length</span>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-[#A0A0A0]">Token Cooldown (Mins)</label>
              <input
                type="number"
                min={0}
                required
                value={cooldownMinutes}
                onChange={(e) => setCooldownMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#FFD700]"
              />
              <span className="text-[9px] text-[#A0A0A0] block">Delay between attempts</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-[#0D021A] animate-spin" />
                <span>Saving to Firestore...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 text-[#0D021A]" />
                <span>Saved to Firestore!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#0D021A]" />
                <span>Save Parameters</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignSettings;
