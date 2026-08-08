import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [mode, setMode] = useState<'CUSTOMER' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD'>('CUSTOMER');

  if (mode === 'ADMIN_LOGIN') {
    return (
      <AdminLogin
        onLoginSuccess={() => setMode('ADMIN_DASHBOARD')}
        onBackToCustomerSite={() => setMode('CUSTOMER')}
      />
    );
  }

  if (mode === 'ADMIN_DASHBOARD') {
    return <AdminLayout onLogout={() => setMode('CUSTOMER')} />;
  }

  return (
    <div className="relative">
      {/* Customer Web Application View */}
      <LandingPage onStartClick={() => console.log('Customer Entry Clicked')} />

      {/* Discrete Floating Toggle for Admin Dashboard Preview Mode */}
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setMode('ADMIN_LOGIN')}
          className="glass-surface px-3 py-1.5 rounded-full border border-akm-gold-royal/40 text-akm-gold-light text-[10px] font-mono font-bold tracking-wider hover:border-akm-gold-royal flex items-center gap-1.5 shadow-gold-glow cursor-pointer"
        >
          <Shield className="w-3 h-3 text-akm-gold-royal" />
          <span>Admin Console</span>
        </button>
      </div>
    </div>
  );
};

export default App;
