import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, ShieldCheck, User, Laptop, Globe } from 'lucide-react';
import { ActivityLogItem } from './ActivityLogs';

interface ActivityLogDetailsProps {
  log: ActivityLogItem | null;
  onClose: () => void;
}

export const ActivityLogDetails: React.FC<ActivityLogDetailsProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm select-none font-sans">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md h-full bg-[#1D0636] border-l border-[#FFD700]/30 shadow-2xl overflow-y-auto p-6 space-y-6 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Audit Event Specification</h3>
              <p className="text-[11px] text-[#A0A0A0]">Security event & staff action parameters.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Summary */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/40 space-y-2 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-[#FFD700]" />
          <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest block">
            Security Audit Record #{log.id}
          </span>
          <span className="font-heading text-lg font-bold text-[#FFD700] block">
            {log.action}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
            ✓ AUTHENTICATED EVENT
          </span>
        </div>

        {/* Audit Metadata Grid */}
        <div className="space-y-2 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
            <span className="text-[9px] text-[#A0A0A0] uppercase block">Staff User Account</span>
            <span className="text-white font-bold block text-sm font-sans">{log.user}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
            <span className="text-[9px] text-[#A0A0A0] uppercase block">Module</span>
            <span className="text-[#FFD700] font-bold block">{log.module}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
            <span className="text-[9px] text-[#A0A0A0] uppercase block">Action Timestamp</span>
            <span className="text-white block">{log.time}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
            <span className="text-[9px] text-[#A0A0A0] uppercase block">IP Address</span>
            <span className="text-white font-bold block">{log.ipAddress}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 space-y-0.5">
            <span className="text-[9px] text-[#A0A0A0] uppercase block">Device & Browser</span>
            <span className="text-[#A0A0A0] block">{log.device}</span>
          </div>
        </div>

        {/* Event Description */}
        <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 space-y-1">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">Full Event Payload</span>
          <p className="text-xs text-white leading-relaxed">{log.description}</p>
        </div>

      </motion.div>
    </div>
  );
};

export default ActivityLogDetails;
