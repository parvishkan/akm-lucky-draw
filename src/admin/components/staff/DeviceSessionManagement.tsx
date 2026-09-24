import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  User,
  Sparkles,
  Info,
  Smartphone,
  Monitor
} from 'lucide-react';
import { DeviceSessionService, AdminSessionRecord, MASTER_OWNER_UID, MASTER_OWNER_EMAIL } from '../../../services/deviceSessionService';
import RoleBadge from './RoleBadge';
import ConfirmationModal from '../qr/ConfirmationModal';

interface DeviceSessionManagementProps {
  currentUid?: string;
  isOwner?: boolean;
}

export const DeviceSessionManagement: React.FC<DeviceSessionManagementProps> = ({
  currentUid,
  isOwner = true
}) => {
  const [sessions, setSessions] = useState<AdminSessionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED'>('ALL');
  
  // Revocation state
  const [sessionToRevoke, setSessionToRevoke] = useState<AdminSessionRecord | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revocationReason, setRevocationReason] = useState('Security policy enforcement');

  // Real-time toast for newly discovered active sessions
  const [newSessionToast, setNewSessionToast] = useState<AdminSessionRecord | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Helper to safely format Firestore timestamp
  const formatTime = (ts: any, fallback = 'Just now'): string => {
    if (!ts) return fallback;
    if (typeof ts.toDate === 'function') {
      try {
        return ts.toDate().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch {
        return fallback;
      }
    }
    if (typeof ts.seconds === 'number') {
      try {
        return new Date(ts.seconds * 1000).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch {
        return fallback;
      }
    }
    return String(ts);
  };

  // Helper to check if last active is within last 5 minutes
  const isCurrentlyOnline = (ts: any): boolean => {
    if (!ts) return false;
    let timeMs = 0;
    if (typeof ts.toDate === 'function') timeMs = ts.toDate().getTime();
    else if (typeof ts.seconds === 'number') timeMs = ts.seconds * 1000;
    if (!timeMs) return false;
    return (Date.now() - timeMs) < (5 * 60 * 1000);
  };

  // Subscribe to real-time session stream
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = DeviceSessionService.listenToAllSessions((updatedSessions) => {
      // Check for new active session notification
      if (initialLoadComplete) {
        const latest = updatedSessions.find(
          (s) => s.status === 'ACTIVE' && !sessions.some((old) => old.sessionId === s.sessionId)
        );
        if (latest && !latest.isMasterDevice) {
          setNewSessionToast(latest);
        }
      }

      setSessions(updatedSessions);
      setIsLoading(false);
      setInitialLoadComplete(true);
    });

    return () => unsubscribe();
  }, [initialLoadComplete]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = sessions.length;
    const active = sessions.filter((s) => s.status === 'ACTIVE').length;
    const revoked = sessions.filter((s) => s.status === 'REVOKED').length;
    const master = sessions.filter((s) => s.isMasterDevice).length;
    return { total, active, revoked, master };
  }, [sessions]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesUser = s.displayName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
        const matchesDevice = s.deviceInfo.deviceName.toLowerCase().includes(q) || s.deviceInfo.browser.toLowerCase().includes(q);
        const matchesId = s.maskedDeviceId.toLowerCase().includes(q) || s.sessionId.toLowerCase().includes(q);
        if (!matchesUser && !matchesDevice && !matchesId) return false;
      }
      return true;
    });
  }, [sessions, statusFilter, searchTerm]);

  // Find Master Device Session
  const masterSession = useMemo(() => {
    return sessions.find((s) => s.isMasterDevice || s.uid === MASTER_OWNER_UID || s.email.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase());
  }, [sessions]);

  // Handle Revocation Execution
  const handleConfirmRevoke = async () => {
    if (!sessionToRevoke) return;

    if (sessionToRevoke.isMasterDevice || sessionToRevoke.uid === MASTER_OWNER_UID) {
      alert('CRITICAL SECURITY: The Master Device is permanently protected and cannot be revoked.');
      setSessionToRevoke(null);
      return;
    }

    setIsRevoking(true);
    const res = await DeviceSessionService.revokeSession(
      sessionToRevoke.sessionId,
      sessionToRevoke.uid,
      sessionToRevoke.deviceId,
      revocationReason
    );
    setIsRevoking(false);
    setSessionToRevoke(null);

    if (!res.success) {
      alert(res.message || 'Failed to revoke session.');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans select-none">
      
      {/* 1. TOP REAL-TIME NOTIFICATION TOAST */}
      <AnimatePresence>
        {newSessionToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 to-[#1D0636] border border-[#FFD700]/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#FFD700] uppercase tracking-wider block">
                  ⚡ New Active Session Detected
                </span>
                <p className="text-xs text-white">
                  User: <strong className="text-[#FFD700]">{newSessionToast.displayName}</strong> ({newSessionToast.email}) • Device: {newSessionToast.deviceInfo.deviceName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  setSearchTerm(newSessionToast.email);
                  setNewSessionToast(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FFD700] text-[#0D021A] text-xs font-bold hover:shadow-gold-glow transition-all cursor-pointer"
              >
                View
              </button>
              <button
                onClick={() => setNewSessionToast(null)}
                className="px-3 py-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white text-xs border border-[#FFD700]/20 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Active Devices */}
        <div className="p-4 rounded-2xl bg-[#1D0636]/80 border border-[#FFD700]/30 shadow-glass space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">Active Devices</span>
            <Laptop className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">{stats.active}</span>
        </div>

        {/* Active Sessions */}
        <div className="p-4 rounded-2xl bg-[#1D0636]/80 border border-[#FFD700]/30 shadow-glass space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">Active Sessions</span>
            <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">{stats.active}</span>
        </div>

        {/* Revoked Sessions */}
        <div className="p-4 rounded-2xl bg-[#1D0636]/80 border border-rose-500/30 shadow-glass space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">Revoked Sessions</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 block">{stats.revoked}</span>
        </div>

        {/* Protected Master Device */}
        <div className="p-4 rounded-2xl bg-[#1D0636]/80 border border-[#FFD700]/50 shadow-glass space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">Master Device</span>
            <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#FFD700] block">1</span>
            <span className="text-[10px] font-extrabold text-[#0D021A] bg-[#FFD700] px-2 py-0.5 rounded-full uppercase">PROTECTED</span>
          </div>
        </div>

      </div>

      {/* 3. MASTER OWNER DEVICE SPOTLIGHT CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1D0636] via-[#0D021A] to-[#1D0636] border-2 border-[#FFD700]/50 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0D021A] border border-[#FFD700]/60 p-2.5 flex items-center justify-center text-[#FFD700] shadow-gold-glow shrink-0">
              <Laptop className="w-full h-full" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                  PARVISH KAN
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFD700] text-[#0D021A] font-black text-[10px] uppercase tracking-wider shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIGITAL MARKETING • OWNER DEVICE</span>
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0]">
                Primary administrative hardware-verified session. Permanent protection active against remote deletion or revocation.
              </p>
            </div>
          </div>

          {/* Master Device Quick Info Badge */}
          <div className="p-3 rounded-2xl bg-[#0D021A]/80 border border-[#FFD700]/30 flex items-center gap-4 text-xs font-mono shrink-0">
            <div>
              <span className="text-[#A0A0A0] text-[10px] uppercase block">Designation</span>
              <span className="text-[#FFD700] font-bold">Digital Marketing</span>
            </div>
            <div className="border-l border-[#FFD700]/20 pl-4">
              <span className="text-[#A0A0A0] text-[10px] uppercase block">Device Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE / PROTECTED</span>
              </span>
            </div>
          </div>

        </div>

        {/* Security Notice Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#FFD700]/15 text-[11px] text-[#A0A0A0]">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
            <span>Only the Master Owner session has authorization to revoke or terminate other device sessions.</span>
          </div>
        </div>

      </div>

      {/* 4. SEARCH & FILTER TOOLBAR */}
      <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-glass">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by User, Email, Device ID, Browser..."
            className="w-full pl-10 pr-4 py-2 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Session Statuses</option>
            <option value="ACTIVE">🟢 Active Sessions</option>
            <option value="REVOKED">🔴 Revoked Sessions</option>
          </select>
        </div>

      </div>

      {/* 5. DEVICES & SESSIONS DATA TABLE */}
      <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass">
        
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">User / Staff</th>
                <th className="py-3.5 px-4 font-bold">Role</th>
                <th className="py-3.5 px-4 font-bold">Device ID</th>
                <th className="py-3.5 px-4 font-bold">Device & OS</th>
                <th className="py-3.5 px-4 font-bold">First Seen</th>
                <th className="py-3.5 px-4 font-bold">Last Active</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFD700]/10">
              {filteredSessions.map((session) => {
                const online = isCurrentlyOnline(session.lastActiveAt);
                return (
                  <tr key={session.sessionId} className="hover:bg-[#0D021A]/60 transition-colors">
                    
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white block">{session.displayName}</span>
                            {session.isMasterDevice && (
                              <span className="text-[9px] font-black bg-[#FFD700] text-[#0D021A] px-1.5 py-0.2 rounded font-mono">MASTER</span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-[#A0A0A0] block">{session.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <RoleBadge role={session.role as any} />
                    </td>

                    {/* Device ID */}
                    <td className="py-3.5 px-4 font-mono text-[#A0A0A0] text-[11px]">
                      {session.maskedDeviceId}
                    </td>

                    {/* Device Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-white font-semibold block flex items-center gap-1">
                          {session.deviceInfo.platform === 'Mobile' ? (
                            <Smartphone className="w-3 h-3 text-[#FFD700]" />
                          ) : (
                            <Monitor className="w-3 h-3 text-[#FFD700]" />
                          )}
                          <span>{session.deviceInfo.deviceName}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#A0A0A0] block">
                          {session.deviceInfo.browser} • {session.deviceInfo.os}
                        </span>
                      </div>
                    </td>

                    {/* First Seen */}
                    <td className="py-3.5 px-4 font-mono text-[#A0A0A0] text-[11px]">
                      {formatTime(session.createdAt, 'Initial setup')}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {online && session.status === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active now</span>
                        </span>
                      ) : (
                        <span className="text-[#A0A0A0]">{formatTime(session.lastActiveAt, 'Earlier')}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {session.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 uppercase">
                          <span>✓ ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-400 uppercase">
                          <span>🚫 REVOKED</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {session.isMasterDevice ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-2.5 py-1 rounded-xl">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>PROTECTED</span>
                        </span>
                      ) : session.status === 'REVOKED' ? (
                        <span className="text-[11px] font-mono text-[#A0A0A0]">Revoked</span>
                      ) : (
                        <button
                          onClick={() => setSessionToRevoke(session)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Revoke Session
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden p-4 space-y-3">
          {filteredSessions.map((session) => (
            <div
              key={session.sessionId}
              className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1D0636] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{session.displayName}</span>
                    <span className="text-[10px] font-mono text-[#A0A0A0]">{session.email}</span>
                  </div>
                </div>

                <RoleBadge role={session.role as any} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FFD700]/10 text-[11px] font-mono">
                <div>
                  <span className="text-[#A0A0A0] block text-[9px] uppercase">Device</span>
                  <span className="text-white font-bold">{session.deviceInfo.deviceName}</span>
                </div>
                <div>
                  <span className="text-[#A0A0A0] block text-[9px] uppercase">Device ID</span>
                  <span className="text-[#D4AF37]">{session.maskedDeviceId}</span>
                </div>
                <div>
                  <span className="text-[#A0A0A0] block text-[9px] uppercase">Last Active</span>
                  <span className="text-white">{formatTime(session.lastActiveAt)}</span>
                </div>
                <div>
                  <span className="text-[#A0A0A0] block text-[9px] uppercase">Status</span>
                  <span className={session.status === 'ACTIVE' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {session.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#FFD700]/10 flex justify-end">
                {session.isMasterDevice ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FFD700]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>DIGITAL MARKETING • PROTECTED</span>
                  </span>
                ) : session.status === 'ACTIVE' ? (
                  <button
                    onClick={() => setSessionToRevoke(session)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-bold"
                  >
                    Revoke Session
                  </button>
                ) : (
                  <span className="text-[10px] text-[#A0A0A0] font-mono">Session Revoked</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && !isLoading && (
          <div className="p-12 text-center space-y-2">
            <Monitor className="w-10 h-10 text-[#FFD700]/40 mx-auto" />
            <h4 className="text-sm font-bold text-white">No active devices or sessions found.</h4>
            <p className="text-xs text-[#A0A0A0]">Active administrative logins will appear here automatically in real time.</p>
          </div>
        )}

      </div>

      {/* 6. REVOCATION CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={!!sessionToRevoke}
        title="Revoke Staff Device Session?"
        description={`Are you sure you want to terminate the active session for ${sessionToRevoke?.displayName} (${sessionToRevoke?.email}) on device ${sessionToRevoke?.deviceInfo.deviceName}? The user will be immediately logged out and their authentication tokens invalidated.`}
        confirmText={isRevoking ? 'Revoking...' : 'Confirm Revocation'}
        confirmVariant="danger"
        onConfirm={handleConfirmRevoke}
        onClose={() => setSessionToRevoke(null)}
      />

    </div>
  );
};

export default DeviceSessionManagement;
