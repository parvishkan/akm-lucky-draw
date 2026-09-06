import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  Gift,
  Trophy,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  QrCode
} from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';
import { AdminAuthService } from '../services/adminAuthService';
import DashboardHome from './pages/DashboardHome';
import TokensPage from './pages/TokensPage';
import PrizesPage from './pages/PrizesPage';
import WinnersPage from './pages/WinnersPage';
import ClaimsPage from './pages/ClaimsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import QRManagementPage from './pages/QRManagementPage';
import { GlobalSearch } from './components/GlobalSearch';
import { NotificationPanel } from './components/NotificationPanel';

export type AdminTab = 'DASHBOARD' | 'QR_MANAGEMENT' | 'TOKENS' | 'PRIZES' | 'WINNERS' | 'CLAIMS' | 'ANALYTICS' | 'SETTINGS';

interface AdminLayoutProps {
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sync with window.location.hash for external links / backward compatibility
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#tokens') setActiveTab('TOKENS');
      else if (hash === '#prizes') setActiveTab('PRIZES');
      else if (hash === '#winners') setActiveTab('WINNERS');
      else if (hash === '#claims') setActiveTab('CLAIMS');
      else if (hash === '#qr' || hash === '#qr_management') setActiveTab('QR_MANAGEMENT');
      else if (hash === '#analytics') setActiveTab('ANALYTICS');
      else if (hash === '#settings') setActiveTab('SETTINGS');
      else if (hash === '#dashboard') setActiveTab('DASHBOARD');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'QR_MANAGEMENT', label: 'QR Management', icon: QrCode },
    { id: 'TOKENS', label: 'Token Management', icon: Ticket },
    { id: 'PRIZES', label: 'Prize Management', icon: Gift },
    { id: 'WINNERS', label: 'Winners', icon: Trophy },
    { id: 'CLAIMS', label: 'Prize Claims', icon: CheckSquare },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  const renderActivePage = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <DashboardHome onNavigate={setActiveTab} />;
      case 'QR_MANAGEMENT':
        return <QRManagementPage />;
      case 'TOKENS':
        return <TokensPage />;
      case 'PRIZES':
        return <PrizesPage />;
      case 'WINNERS':
        return <WinnersPage />;
      case 'CLAIMS':
        return <ClaimsPage />;
      case 'ANALYTICS':
        return <AnalyticsPage />;
      case 'SETTINGS':
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#0D021A] text-[#FFFFFF] flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-[#FFD700]/20 bg-[#1D0636]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0D021A] text-[#A0A0A0] hover:text-[#FFFFFF]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0D021A] p-1 border border-[#FFD700]/40 flex items-center justify-center">
              <img src={APP_CONFIG.brand.logoPath} alt="AKM Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-heading text-xs font-extrabold tracking-wider text-[#FFD700] block">
                {APP_CONFIG.brand.mallName}
              </span>
              <span className="text-[10px] text-[#A0A0A0] tracking-widest uppercase block">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center w-72 lg:w-96 relative">
          <GlobalSearch onNavigate={setActiveTab} />
        </div>

        {/* Right: Notification Bell & Admin Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Notification Bell */}
          <NotificationPanel onNavigate={setActiveTab} />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-left hover:border-[#FFD700]/50 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#1D0636] border border-[#FFD700] flex items-center justify-center text-[#FFD700]">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-xs">
                <span className="font-bold text-[#FFFFFF] block leading-none">Mall Manager</span>
                <span className="text-[10px] text-[#D4AF37] font-mono">Senior Admin</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A0A0A0] hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1D0636] border border-[#FFD700]/30 rounded-2xl p-2 shadow-2xl z-40 text-xs text-left"
                >
                  <div className="px-3 py-2 border-b border-[#FFD700]/15">
                    <span className="font-bold text-[#FFFFFF] block">{APP_CONFIG.brand.mallName}</span>
                    <span className="text-[10px] text-[#A0A0A0] truncate block">
                      {AdminAuthService.getCurrentUser()?.email || 'admin@anukrishnamall.com'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('SETTINGS');
                    }}
                    className="w-full text-left px-3 py-2 text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#0D021A] rounded-lg transition-colors mt-1"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-2 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Console</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR MENU */}
        <aside className={`fixed md:static inset-y-0 left-0 z-20 w-64 bg-[#1D0636] border-r border-[#FFD700]/20 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest px-3 block text-left">
              Navigation Menu
            </span>

            <nav className="space-y-1 pt-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0D021A] text-[#FFD700] border border-[#FFD700]/40 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                        : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#0D021A]/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFD700]' : 'text-[#A0A0A0]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Logout */}
          <div className="pt-4 border-t border-[#FFD700]/15">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Console</span>
            </button>
          </div>

        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0D021A]">
          {renderActivePage()}
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
