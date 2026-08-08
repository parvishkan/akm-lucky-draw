import React from 'react';
import { Clock, ShieldCheck, Flame, Pause, Play, RefreshCw } from 'lucide-react';

export const CampaignActivity: React.FC = () => {
  const activities = [
    { title: 'Customer Access Enabled', time: '08 Aug 2026, 11:30 AM', desc: 'Mall Manager turned ON mobile participation gate.' },
    { title: 'Campaign Parameters Updated', time: '08 Aug 2026, 09:15 AM', desc: 'Adjusted campaign dates for Diwali Festival shopping peak.' },
    { title: 'Print QR Posters Generated', time: '01 Oct 2026, 08:00 AM', desc: 'Exported A4 printable QR posters for 12 billing counters.' },
    { title: 'Diwali Campaign Officially Live', time: '01 Oct 2026, 07:00 AM', desc: 'Campaign status transitioned to LIVE.' },
  ];

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 text-left select-none font-sans">
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FFD700]" />
          <span>Campaign Activity Timeline</span>
        </h3>
        <span className="text-xs text-[#D4AF37] font-mono">Audit Logs</span>
      </div>

      <div className="space-y-3 text-xs">
        {activities.map((act, idx) => (
          <div key={idx} className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/15 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">{act.title}</span>
              <span className="text-[10px] font-mono text-[#D4AF37]">{act.time}</span>
            </div>
            <p className="text-[11px] text-[#A0A0A0] leading-relaxed">{act.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignActivity;
