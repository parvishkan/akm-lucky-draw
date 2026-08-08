import React from 'react';
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
  ShieldCheck,
  TrendingUp,
  Flame,
  Smartphone,
  Watch,
  Headphones,
  Award,
  Key
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/appConfig';

export const DashboardHome: React.FC = () => {
  // Today's Date & Time Display
  const todayFormatted = 'Thursday, 06 August 2026 • 10:30 AM';

  // 1. Statistics Cards Data (6 Cards)
  const stats = [
    { id: 'tokens', title: 'Total Tokens', value: '12,840', change: '+14% vs yesterday', isPositive: true, icon: Ticket },
    { id: 'verified', title: 'Verified Tokens', value: '9,420', change: '73.3% conversion rate', isPositive: true, icon: CheckCircle2 },
    { id: 'gifts', title: 'Available Gifts', value: '482', change: '84% stock remaining', isPositive: true, icon: Gift },
    { id: 'winners', title: 'Winners', value: '1,420', change: '100% verified', isPositive: true, icon: Trophy },
    { id: 'pending', title: 'Pending Claims', value: '38', change: 'Action required', isPositive: false, icon: Package },
    { id: 'claimed', title: 'Claimed Gifts', value: '1,382', change: '97.3% fulfillment rate', isPositive: true, icon: Sparkles },
  ];

  // 2. Quick Actions Cards Data (6 Cards)
  const quickActions = [
    { id: 'gen-tokens', title: 'Generate Tokens', desc: 'Create new batch of receipt codes', icon: PlusCircle, action: () => alert('Quick Action: Open Token Generator') },
    { id: 'add-prize', title: 'Add Prize', desc: 'Add new gift to campaign pool', icon: Gift, action: () => alert('Quick Action: Open Add Prize Modal') },
    { id: 'view-winners', title: 'View Winners', desc: 'Inspect verified winner registry', icon: Trophy, action: () => alert('Quick Action: View Winners') },
    { id: 'qr-mgmt', title: 'QR Management', desc: 'Customize & export campaign QR', icon: QrCode, action: () => alert('Quick Action: Open QR Console') },
    { id: 'view-analytics', title: 'View Analytics', desc: 'Realtime visitor & conversion data', icon: BarChart3, action: () => alert('Quick Action: Open Analytics') },
    { id: 'settings', title: 'Campaign Settings', desc: 'Adjust parameters & staff permissions', icon: Settings, action: () => alert('Quick Action: Open Settings') },
  ];

  // 3. Recent Activity Timeline Data
  const recentActivities = [
    { time: '09:10 AM', title: 'Token Verified', desc: 'Token AKM-9410 authenticated via mobile web', badge: 'Verified' },
    { time: '09:15 AM', title: 'Prize Claimed', desc: 'Grand Gold Coin fulfilled at Help Desk Counter #1', badge: 'Fulfilled' },
    { time: '09:20 AM', title: 'New Prize Added', desc: 'Added 5x Diamond Jewelry Vouchers to active pool', badge: 'Stock Update' },
    { time: '09:35 AM', title: 'Admin Logged In', desc: 'Mall Manager signed into Admin Portal console', badge: 'Security' },
  ];

  // 4. Top Winning Prizes Data
  const topPrizes = [
    { name: 'iPhone 16 Pro Max', category: 'Grand Prize', value: '₹1,39,900', icon: Smartphone },
    { name: 'Apple Watch Series 10', category: 'Luxury Tech', value: '₹46,900', icon: Watch },
    { name: 'AirPods Pro 2', category: 'Audio Privilege', value: '₹24,900', icon: Headphones },
    { name: '₹10,000 Diamond Voucher', category: 'Jewelry Voucher', value: '₹10,000', icon: Award },
    { name: 'Gold Commemorative Keychain', category: 'Diwali Special', value: '₹4,500', icon: Key },
  ];

  // 5. Notifications Data
  const notifications = [
    { title: 'Diwali Campaign Started', desc: 'Official Lucky Draw went live across all mall floors.', time: '08:00 AM', tag: 'System' },
    { title: 'Prize Stock Low', desc: 'Grand Gold Coins down to last 12 units in main vault.', time: '08:45 AM', tag: 'Inventory' },
    { title: 'Pending Claims Alert', desc: '38 winner claims waiting for counter fulfillment.', time: '09:05 AM', tag: 'Claims' },
    { title: 'System Security Update', desc: 'Firestore security rules active & encrypted.', time: '09:30 AM', tag: 'Security' },
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
            Good Morning, Admin 👋
          </h1>

          <p className="text-xs text-[#A0A0A0]">
            Welcome back to AKM Lucky Draw Dashboard. Here is your live campaign overview.
          </p>
        </div>

        {/* Date & Time Display Badge */}
        <div className="flex items-center gap-2 bg-[#1D0636] border border-[#FFD700]/30 px-4 py-2.5 rounded-2xl shrink-0">
          <Clock className="w-4 h-4 text-[#FFD700]" />
          <span className="text-xs font-mono font-semibold text-[#FFFFFF]">{todayFormatted}</span>
        </div>
      </motion.div>

      {/* 2. STATISTICS CARDS GRID (6 Responsive Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
          Campaign Metrics & Performance
        </h3>

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
                    {stat.value}
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

      {/* 3. QUICK ACTIONS SECTION (6 Responsive Action Cards) */}
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
        
        {/* RECENT ACTIVITY TIMELINE (8 Cols) */}
        <div className="lg:col-span-8 bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-base font-bold text-[#FFFFFF] font-sans flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <span>Recent Activity Stream</span>
            </h3>
            <span className="text-xs text-[#D4AF37] font-mono">Live Timeline</span>
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

        {/* LIVE CAMPAIGN STATUS CARD (4 Cols) */}
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
              <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Campaign Period</span>
              <span className="font-bold text-white block">01 Oct 2026 – 15 Nov 2026</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">Gifts Remaining</span>
                <span className="font-mono text-base font-bold text-[#FFFFFF] block">482 Gifts</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase block font-semibold">High Value Units</span>
                <span className="font-mono text-base font-bold text-[#FFD700] block">12 Units</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. SECONDARY GRID: TOP WINNING PRIZES & NOTIFICATIONS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* TOP WINNING PRIZES (8 Cols) */}
        <div className="lg:col-span-8 bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-base font-bold text-[#FFFFFF] font-sans flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFD700]" />
              <span>Top Winning Prizes Showcase</span>
            </h3>
            <span className="text-xs text-[#D4AF37] font-mono">Diwali Pool</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topPrizes.map((prize, idx) => {
              const IconComponent = prize.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#0D021A] border border-[#FFD700]/20 hover:border-[#FFD700]/50 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="font-bold text-xs text-[#FFFFFF] truncate block">{prize.name}</span>
                    <span className="text-[10px] text-[#D4AF37] block font-mono">{prize.value} • {prize.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATIONS PANEL (4 Cols) */}
        <div className="lg:col-span-4 bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
            <h3 className="text-base font-bold text-[#FFFFFF] font-sans flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FFD700]" />
              <span>System Notifications</span>
            </h3>
            <span className="text-xs text-rose-400 font-mono font-bold">4 Alerts</span>
          </div>

          <div className="space-y-3">
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/15 space-y-1 hover:border-[#FFD700]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#FFFFFF]">{note.title}</span>
                  <span className="text-[9px] font-mono text-[#D4AF37]">{note.time}</span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-tight">{note.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardHome;
