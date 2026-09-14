import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  CheckCircle2,
  Gift,
  Trophy,
  Package,
  Sparkles,
  Clock,
  PlusCircle,
  QrCode,
  BarChart3,
  Settings,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Smartphone,
  Watch,
  Headphones,
  Award,
  Key
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/appConfig';
import { DashboardService, DashboardMetrics } from '../../services/dashboardService';

export type DashboardNavTab = 'DASHBOARD' | 'QR_MANAGEMENT' | 'TOKENS' | 'PRIZES' | 'WINNERS' | 'CLAIMS' | 'ANALYTICS' | 'SETTINGS';

interface DashboardHomeProps {
  onNavigate?: (tab: DashboardNavTab) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTokens: 0,
    verifiedTokens: 0,
    availableGifts: 0,
    totalWinners: 0,
    pendingClaims: 0,
    claimedGifts: 0,
    demoTestsRun: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // Today's Date & Time Display
  const todayFormatted = new Date().toLocaleString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = DashboardService.subscribeToLiveMetrics(
      (data) => {
        setMetrics(data);
        setIsLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe to live dashboard metrics:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 1. Statistics Cards Data (6 Cards connected to Firestore)
  const stats = [
    { id: 'tokens', title: 'Total Tokens', value: metrics.totalTokens.toLocaleString(), change: 'Live Firestore Count', isPositive: true, icon: Ticket },
    { id: 'verified', title: 'Verified Tokens', value: metrics.verifiedTokens.toLocaleString(), change: metrics.totalTokens > 0 ? `${((metrics.verifiedTokens / metrics.totalTokens) * 100).toFixed(1)}% conversion` : '0% conversion', isPositive: true, icon: CheckCircle2 },
    { id: 'gifts', title: 'Available Gifts', value: metrics.availableGifts.toLocaleString(), change: 'Realtime Stock', isPositive: true, icon: Gift },
    { id: 'winners', title: 'Winners', value: metrics.totalWinners.toLocaleString(), change: '100% verified', isPositive: true, icon: Trophy },
    { id: 'pending', title: 'Pending Claims', value: metrics.pendingClaims.toLocaleString(), change: 'Counter action required', isPositive: false, icon: Package },
    { id: 'claimed', title: 'Claimed Gifts', value: metrics.claimedGifts.toLocaleString(), change: 'Fulfilled at counter', isPositive: true, icon: Sparkles },
  ];

  // 2. Quick Actions Cards Data
  const quickActions = [
    { id: 'gen-tokens', title: 'Generate Tokens', desc: 'Create new batch of receipt codes', icon: PlusCircle, action: () => onNavigate ? onNavigate('TOKENS') : (window.location.hash = '#tokens') },
    { id: 'add-prize', title: 'Add Prize', desc: 'Add new gift to campaign pool', icon: Gift, action: () => onNavigate ? onNavigate('PRIZES') : (window.location.hash = '#prizes') },
    { id: 'view-winners', title: 'View Winners', desc: 'Inspect verified winner registry', icon: Trophy, action: () => onNavigate ? onNavigate('WINNERS') : (window.location.hash = '#winners') },
    { id: 'qr-mgmt', title: 'QR Management', desc: 'Customize & export campaign QR', icon: QrCode, action: () => onNavigate ? onNavigate('QR_MANAGEMENT') : (window.location.hash = '#qr') },
    { id: 'view-analytics', title: 'View Analytics', desc: 'Realtime visitor & conversion data', icon: BarChart3, action: () => onNavigate ? onNavigate('ANALYTICS') : (window.location.hash = '#analytics') },
    { id: 'settings', title: 'Campaign Settings', desc: 'Adjust parameters & staff permissions', icon: Settings, action: () => onNavigate ? onNavigate('SETTINGS') : (window.location.hash = '#settings') },
  ];

  // 3. Recent Activity Timeline Data
  const recentActivities = [
    { time: 'Just Now', title: 'System Active', desc: 'AKM Lucky Draw connected to live Firestore database.', badge: 'Live Database' },
    { time: 'Today', title: 'Firestore Security', desc: 'Hardened role-based rules active for /admins, /tokens, /prizes.', badge: 'Security' }
  ];

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. WELCOME SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-5"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Staff Operational Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] font-sans">
            Good Day, Admin 👋
          </h1>

          <p className="text-xs text-[#A0A0A0]">
            Welcome back to AKM Lucky Draw Dashboard. Here is your live campaign overview from Firestore.
          </p>
        </div>

        {/* Date & Time Display Badge */}
        <div className="flex items-center gap-2 bg-[#1D0636] border border-[#FFD700]/30 px-4 py-2.5 rounded-2xl shrink-0">
          <Clock className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-mono font-semibold text-[#FFFFFF]">{todayFormatted}</span>
        </div>
      </motion.div>

      {/* 2. STATISTICS CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
            Live Campaign Metrics & Performance
          </h3>
          {metrics.demoTestsRun > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-950/80 border border-fuchsia-400/40 text-fuchsia-300 text-xs font-mono font-medium">
              <span>🧪 Demo Tests Run: {metrics.demoTestsRun}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[#1D0636]/80 border border-[#FFD700]/25 hover:border-[#FFD700]/60 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-3 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] group-hover:scale-105 transition-transform">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <span className="text-2xl font-bold text-[#FFFFFF] font-mono tracking-tight block">
                    {isLoading ? '...' : stat.value}
                  </span>
                  <span className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>{stat.change}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. QUICK ACTIONS SECTION */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
          Quick Actions Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickActions.map((qa, index) => {
            const IconComponent = qa.icon;
            return (
              <motion.button
                key={qa.id}
                onClick={qa.action}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1D0636]/80 border border-[#FFD700]/25 hover:border-[#FFD700]/60 rounded-2xl p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-3 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] group-hover:scale-110 transition-transform">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A0A0A0] group-hover:text-[#FFD700] transition-colors" />
                </div>

                <div>
                  <span className="font-bold text-xs text-[#FFFFFF] block group-hover:text-[#FFD700] transition-colors">
                    {qa.title}
                  </span>
                  <span className="text-[10px] text-[#A0A0A0] leading-tight block mt-0.5">
                    {qa.desc}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN GRID: RECENT ACTIVITY & LIVE CAMPAIGN STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* RECENT ACTIVITY TIMELINE */}
        <div className="lg:col-span-8 bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-base font-bold text-[#FFFFFF] font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <span>Recent System Activity</span>
            </h3>
            <span className="text-xs text-[#D4AF37] font-mono">Firestore Connected</span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/15 flex items-start justify-between gap-3 hover:border-[#FFD700]/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#FFFFFF]">{act.title}</span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A0A0]">{act.desc}</p>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-mono shrink-0">{act.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* LIVE CAMPAIGN STATUS CARD */}
        <div className="lg:col-span-4 bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-base font-bold text-[#FFFFFF] font-sans flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FFD700]" />
              <span>Campaign Status</span>
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE</span>
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
              <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Active Campaign Name</span>
              <span className="font-bold text-sm text-[#FFD700] block">{APP_CONFIG.brand.appName}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
              <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Campaign Database</span>
              <span className="font-bold text-white block">Firestore (akm-lucky-draw)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Gifts Available</span>
                <span className="font-mono text-base font-bold text-[#FFFFFF] block">{isLoading ? '...' : metrics.availableGifts} Gifts</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Pending Claims</span>
                <span className="font-mono text-base font-bold text-[#FFD700] block">{isLoading ? '...' : metrics.pendingClaims} Claims</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
