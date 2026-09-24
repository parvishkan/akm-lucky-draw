import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye, Search, ShieldCheck } from 'lucide-react';
import ActivityLogDetails from './ActivityLogDetails';
import { db, collections } from '../../../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { MASTER_OWNER_UID, MASTER_OWNER_EMAIL } from '../../../services/deviceSessionService';

export interface ActivityLogItem {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  description: string;
  ipAddress: string;
  device: string;
}

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');

  useEffect(() => {
    const colRef = collection(db, collections.ACTIVITY_LOGS);
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(100));

    const unsubscribe = onSnapshot(q, (snap) => {
      const EXCLUDED_TYPES = new Set(['NEW_WINNER', 'PRIZE_CLAIMED', 'TOKEN_VERIFIED', 'QR_SCAN', 'GIFT_ADDED']);
      const EXCLUDED_MODULES = new Set(['Token Management', 'Tokens', 'Prize Management', 'Prizes', 'Claims', 'Winners', 'Customer']);

      const liveItems: ActivityLogItem[] = [];

      snap.docs.forEach((d) => {
        const data = d.data();
        const type = (data.type || '').toUpperCase();
        const mod = data.module || 'Security';
        const title = data.title || '';

        // Exclude customer/campaign transaction logs
        if (EXCLUDED_TYPES.has(type) || EXCLUDED_MODULES.has(mod)) return;
        if (/prize|token|claim|winner/i.test(title) && !/session|admin|role|account|auth/i.test(title)) return;

        let timeStr = 'Just now';
        if (data.timestamp?.toDate) {
          try {
            timeStr = data.timestamp.toDate().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          } catch {
            timeStr = 'Just now';
          }
        }

        const isOwner = data.actorUid === MASTER_OWNER_UID ||
          data.user?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase() ||
          data.actorEmail?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase() ||
          data.user?.includes('Farvish');

        const userDisplay = isOwner ? 'Parvish Kan' : (data.user || data.actorEmail || 'Admin');

        liveItems.push({
          id: d.id,
          time: timeStr,
          user: userDisplay,
          action: data.title || data.type || 'Action',
          module: data.module || 'Authentication / Security',
          status: data.status || 'SUCCESS',
          description: data.details || data.title || 'Security audit entry',
          ipAddress: data.ip || '127.0.0.1',
          device: data.targetDeviceId || 'Admin Device'
        });
      });

      setLogs(liveItems);
    }, (err) => {
      console.warn('Live activityLogs subscription warning:', err);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchUser = log.user.toLowerCase().includes(q);
      const matchModule = log.module.toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchModule) return false;
    }
    if (selectedModule !== 'ALL' && log.module !== selectedModule) return false;
    return true;
  });

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Search & Module Filters */}
      <div className="bg-[#1D0636]/90 border border-[#FFD700]/25 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-glass">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter logs by User, Action, Module..."
            className="w-full pl-10 pr-4 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
        >
          <option value="ALL">All System Modules</option>
          <option value="Authentication / Security">Authentication / Security</option>
          <option value="Device & Session Management">Device & Session Management</option>
          <option value="Staff Administration">Staff Administration</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-[#1D0636]/90 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold">User Account</th>
                <th className="py-3.5 px-4 font-bold">Action Description</th>
                <th className="py-3.5 px-4 font-bold">System Module</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 text-right font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFD700]/10 font-mono text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0D021A]/60 transition-colors">
                  <td className="py-3 px-4 text-[#A0A0A0]">{log.time}</td>
                  <td className="py-3 px-4 text-white font-bold font-sans">{log.user}</td>
                  <td className="py-3 px-4 text-[#FFD700] font-sans">{log.action}</td>
                  <td className="py-3 px-4 text-[#A0A0A0]">{log.module}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ SUCCESS
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clean Empty State */}
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center space-y-2">
            <Clock className="w-10 h-10 text-[#FFD700]/40 mx-auto" />
            <h4 className="text-sm font-bold text-white">No system activity logs found.</h4>
            <p className="text-xs text-[#A0A0A0]">Authentication, session, device, and security events will appear here in real time.</p>
          </div>
        )}
      </div>

      {/* Log Details Drawer */}
      <AnimatePresence>
        {selectedLog && (
          <ActivityLogDetails
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default ActivityLogs;
