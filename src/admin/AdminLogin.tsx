import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, ArrowLeft, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';
import { AdminAuthService } from '../services/adminAuthService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToCustomerSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToCustomerSite }) => {
  const [username, setUsername] = useState('admin@anukrishnamall.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsSubmitting(true);
    const res = await AdminAuthService.login(username.trim(), password.trim());
    setIsSubmitting(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      alert(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      setRipples((prev) => [...prev, { x: rippleX, y: rippleY, id: Date.now() }]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D021A] text-white flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden select-none font-sans">
      
      {/* Background Atmosphere & Ambient Gold Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#1D0636] rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Accent */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10 pt-2">
        <button
          onClick={onBackToCustomerSite}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D0636]/80 border border-[#FFD700]/30 text-[#A0A0A0] hover:text-[#FFFFFF] text-xs font-semibold transition-all hover:border-[#FFD700]/60 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Customer Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D0636]/60 border border-[#FFD700]/20 text-[#D4AF37] text-[11px] font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Staff Security Portal</span>
        </div>
      </div>

      {/* CENTER LOGIN CARD (Fade In + Slight Scale Animation) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md my-auto z-10"
      >
        <div className="bg-[#1D0636]/90 border border-[#FFD700]/40 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden space-y-6 text-left">
          
          {/* Top Gold Border Highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

          {/* 1. Logo & Portal Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-[#1D0636] to-[#0D021A] p-1.5 border border-[#FFD700]/50 shadow-[0_0_25px_rgba(255,215,0,0.3)] flex items-center justify-center">
              <img
                src={APP_CONFIG.brand.logoPath}
                alt="AKM Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold text-[#FFD700]">
                {APP_CONFIG.brand.mallName}
              </h1>
              <span className="text-xs font-semibold text-[#FFFFFF] tracking-wider uppercase block">
                Admin Portal
              </span>
              <p className="text-[11px] text-[#A0A0A0] tracking-wide">
                Authorized Staff Access Only
              </p>
            </div>
          </div>

          {/* 2. Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            
            {/* Username / Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#FFD700]/70" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@anukrishnamall.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-[#FFFFFF] placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-[#FFD700]/70" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-[#FFFFFF] placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A0A0A0] hover:text-[#FFFFFF]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#FFD700]/40 bg-[#0D021A] text-[#FFD700] focus:ring-0 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Please contact Anu Krishna Mall IT Manager to reset admin credentials.')}
                className="text-[#D4AF37] hover:text-[#FFD700] hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Primary Action Button: LOGIN (Hover Glow & Click Ripple) */}
            <motion.button
              ref={buttonRef}
              type="submit"
              onClick={handleButtonClick}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(255, 215, 0, 0.65)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 relative group overflow-hidden rounded-xl p-[2px] focus:outline-none cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] rounded-xl" />
              <div className="relative flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0D021A] text-[#FFD700] font-bold text-xs tracking-widest uppercase group-hover:bg-[#1D0636] transition-colors">
                {/* Ripple Effect Emitters */}
                {ripples.map((r) => (
                  <motion.span
                    key={r.id}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ left: r.x, top: r.y }}
                    className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#FFD700]/40 pointer-events-none"
                  />
                ))}

                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#FFD700]" />
                    <span>LOGIN CONSOLE</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Secondary Action: Back to Customer Website */}
          <div className="pt-2 border-t border-[#FFD700]/15 text-center">
            <button
              onClick={onBackToCustomerSite}
              className="text-xs text-[#A0A0A0] hover:text-[#FFD700] transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Return to Customer Landing Page</span>
            </button>
          </div>

        </div>
      </motion.div>

      {/* Footer Copyright */}
      <footer className="text-center text-[11px] text-[#A0A0A0] z-10 pb-2 font-mono">
        © 2026 Anu Krishna Mall. All Rights Reserved. • Authorized Staff Console
      </footer>

    </div>
  );
};

export default AdminLogin;
