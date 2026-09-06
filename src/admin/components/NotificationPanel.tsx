import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Package, Trophy, CheckCircle2 } from 'lucide-react';
import { PrizesService } from '../../services/prizesService';
import { ClaimsService } from '../../services/claimsService';

export type AdminTab = 'DASHBOARD' | 'QR_MANAGEMENT' | 'TOKENS' | 'PRIZES' | 'WINNERS' | 'CLAIMS' | 'ANALYTICS' | 'SETTINGS';

interface NotificationItem {
  id: string;
  type: 'WARNING' | 'CLAIM' | 'WINNER' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  tab?: AdminTab;
  read: boolean;
}

interface NotificationPanelProps {
  onNavigate: (tab: AdminTab) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load live notifications from Firestore
  useEffect(() => {
    async function loadNotifications() {
      const items: NotificationItem[] = [];

      // 1. Low stock prizes alert
      try {
        const prizes = await PrizesService.getActivePrizes();
        const lowStock = prizes.filter(p => (p.availableQuantity ?? p.totalQuantity) <= 10);
        lowStock.slice(0, 3).forEach(p => {
          items.push({
            id: `low-stock-${p.id}`,
            type: 'WARNING',
            title: 'Low Stock Alert',
            message: `${p.name || p.title} has only ${p.availableQuantity ?? p.totalQuantity} units remaining in inventory!`,
            timestamp: 'Stock Alert',
            tab: 'PRIZES',
            read: false
          });
        });
      } catch (e) {
        // ignore
      }

      // 2. Pending claims alert
      try {
        const claims = await ClaimsService.getAllClaims();
        const pending = claims.filter(c => c.claimStatus === 'PENDING');
        pending.slice(0, 3).forEach(c => {
          items.push({
            id: `claim-${c.claimId}`,
            type: 'CLAIM',
            title: 'Pending Claim Fulfillment',
            message: `Claim ${c.claimId} (${c.prizeName}) is waiting for counter verification.`,
            timestamp: c.createdAt || 'Recent',
            tab: 'CLAIMS',
            read: false
          });
        });
      } catch (e) {
        // ignore
      }

      // 3. System Online Notification
      items.push({
        id: 'system-status',
        type: 'SYSTEM',
        title: 'Campaign Engine Active',
        message: 'AKM Diwali 2026 Lucky Draw engine is connected with Firestore transactions.',
        timestamp: 'Live Now',
        tab: 'DASHBOARD',
        read: false
      });

      setNotifications(items);
      setUnreadCount(items.length);
    }

    loadNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleItemClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setIsOpen(false);
    if (item.tab) {
      onNavigate(item.tab);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'CLAIM':
        return <Package className="w-4 h-4 text-[#FFD700]" />;
      case 'WINNER':
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case 'SYSTEM':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
          isOpen
            ? 'bg-[#1D0636] border-[#FFD700] text-[#FFD700]'
            : 'bg-[#0D021A] border-[#FFD700]/20 text-[#A0A0A0] hover:text-[#FFD700]'
        }`}
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1D0636] border border-[#FFD700]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden z-50 text-left text-xs"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-[#FFD700]/20 bg-[#0D021A]/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FFD700]" />
                <span className="font-bold text-white text-xs">Campaign Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] rounded-full font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-[#D4AF37] hover:text-white underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#FFD700]/10">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-[#A0A0A0]">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs">All clear! No notifications at this time.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#0D021A] ${
                      !item.read ? 'bg-[#FFD700]/5' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${!item.read ? 'text-[#FFD700]' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#A0A0A0] shrink-0 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[#FFD700]/15 bg-[#0D021A]/50 text-center">
              <span className="text-[10px] text-[#A0A0A0]/70">
                Connected to Anu Krishna Mall Firestore Live
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
