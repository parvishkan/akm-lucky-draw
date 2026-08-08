import React, { useState } from 'react';
import { Settings, Save, Sparkles, Check } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/appConfig';

export const CampaignSettings: React.FC = () => {
  const [name, setName] = useState(APP_CONFIG.brand.appName);
  const [desc, setDesc] = useState('Diwali Season Grand Shopping Lucky Draw');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('22:00');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans">
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Campaign Parameters</h3>
            <p className="text-[11px] text-[#A0A0A0]">Configure campaign dates, times, and regional timezones.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Campaign Name
            </label>
            <input
              type="text"
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
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
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-gold-glow transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-[#0D021A]" />
                <span>Saved Changes!</span>
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
