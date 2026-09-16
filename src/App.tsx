import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { AdminAuthService, AdminProfile } from './services/adminAuthService';
import { User } from 'firebase/auth';
import { Shield, Sparkles } from 'lucide-react';

import { DeviceSessionService } from './services/deviceSessionService';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(window.location.pathname);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Monitor URL location path changes
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Monitor Firebase Authentication & Authorization State
  useEffect(() => {
    const unsubscribe = AdminAuthService.onAuthChange(async (user) => {
      if (user) {
        setAuthUser(user);
        const check = await AdminAuthService.verifyAdminAuthorization(user);
        if (check.isAuthorized && check.profile) {
          try {
            await DeviceSessionService.registerCurrentSession(check.profile);
            setIsAuthorizedAdmin(true);
            setAdminProfile(check.profile);
          } catch (sessionErr: any) {
            console.warn('Session verification failed:', sessionErr);
            alert(sessionErr?.message || 'Access Denied: Session revoked or invalid.');
            await AdminAuthService.logout();
            setIsAuthorizedAdmin(false);
            setAdminProfile(null);
          }
        } else {
          setIsAuthorizedAdmin(false);
          setAdminProfile(null);
        }
      } else {
        setAuthUser(null);
        setIsAuthorizedAdmin(false);
        setAdminProfile(null);
      }
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Active Session Revocation Listener & Heartbeat
  useEffect(() => {
    if (!authUser || !isAuthorizedAdmin) return;

    const unsubscribeSession = DeviceSessionService.listenToCurrentSession(authUser.uid, async () => {
      alert('⚠️ Access Revoked: Your administrative session has been revoked by the Master Owner.');
      await handleLogout();
    });

    const heartbeatInterval = setInterval(() => {
      DeviceSessionService.sendHeartbeat(authUser.uid);
    }, 2 * 60 * 1000);

    return () => {
      unsubscribeSession();
      clearInterval(heartbeatInterval);
    };
  }, [authUser, isAuthorizedAdmin]);

  const isAdminRoute = pathname.startsWith('/admin');

  // Handle Admin Logout
  const handleLogout = async () => {
    await AdminAuthService.logout();
    setAuthUser(null);
    setIsAuthorizedAdmin(false);
    setAdminProfile(null);
    window.history.pushState({}, '', '/admin');
    setPathname('/admin');
  };

  // Handle Admin Navigation back to Customer Site
  const handleNavigateToCustomer = () => {
    window.history.pushState({}, '', '/');
    setPathname('/');
  };

  // Handle Admin Login Success
  const handleLoginSuccess = () => {
    window.history.pushState({}, '', '/admin');
    setPathname('/admin');
  };

  // 1. ADMIN ROUTE EVALUATION (/admin, /admin/dashboard, /admin/tokens, etc.)
  if (isAdminRoute) {
    // Auth & Authorization resolution loading state to prevent flash of protected content
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen w-full bg-[#0D021A] text-white flex flex-col items-center justify-center space-y-4 font-sans select-none">
          <div className="w-12 h-12 rounded-2xl bg-[#1D0636] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] shadow-gold-glow">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1 text-center">
            <span className="font-heading text-sm font-bold text-[#FFD700] block">
              AKM LUCKY DRAW • STAFF PORTAL
            </span>
            <p className="text-xs text-[#A0A0A0] font-mono">
              Verifying Security Credentials & Authorization...
            </p>
          </div>
        </div>
      );
    }

    // Protected Route: Render Admin Dashboard ONLY if authenticated AND authorized as an admin
    if (authUser && isAuthorizedAdmin) {
      return <AdminLayout onLogout={handleLogout} />;
    }

    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToCustomerSite={handleNavigateToCustomer}
      />
    );
  }

  // 2. PUBLIC CUSTOMER ROUTE (/)
  // Pure Customer Web Application Experience (No admin buttons or links)
  return (
    <div className="relative min-h-screen bg-[#0D021A]">
      <LandingPage onStartClick={() => console.log('Customer Entry Clicked')} />
    </div>
  );
};

export default App;
