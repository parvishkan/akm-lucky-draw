import React from 'react';
import { Shield, Check, Minus } from 'lucide-react';

export const PermissionMatrix: React.FC = () => {
  const features = [
    { name: 'Dashboard Home', owner: true, admin: true, manager: true, staff: true, viewer: true },
    { name: 'Token Management', owner: true, admin: true, manager: true, staff: false, viewer: false },
    { name: 'Prize Management', owner: true, admin: true, manager: true, staff: false, viewer: false },
    { name: 'Winners Registry', owner: true, admin: true, manager: true, staff: true, viewer: true },
    { name: 'Prize Claims Fulfillment', owner: true, admin: true, manager: true, staff: true, viewer: false },
    { name: 'QR & Campaign Controls', owner: true, admin: true, manager: false, staff: false, viewer: false },
    { name: 'Campaign Analytics', owner: true, admin: true, manager: true, staff: false, viewer: true },
    { name: 'Staff Management', owner: true, admin: true, manager: false, staff: false, viewer: false },
    { name: 'Campaign Settings', owner: true, admin: false, manager: false, staff: false, viewer: false },
  ];

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5 text-left select-none font-sans relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">Role Permission Matrix (RBAC)</h3>
            <p className="text-[11px] text-[#A0A0A0]">Feature permissions mapped by administrative role level.</p>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-bold">System Feature</th>
              <th className="py-3 px-4 text-center font-bold">Owner</th>
              <th className="py-3 px-4 text-center font-bold">Admin</th>
              <th className="py-3 px-4 text-center font-bold">Manager</th>
              <th className="py-3 px-4 text-center font-bold">Staff</th>
              <th className="py-3 px-4 text-center font-bold">Viewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10 font-mono text-xs">
            {features.map((f, idx) => (
              <tr key={idx} className="hover:bg-[#0D021A]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-sans">{f.name}</td>
                
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" /> Allowed
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  {f.admin ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500"><Minus className="w-3.5 h-3.5" /> Denied</span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  {f.manager ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500"><Minus className="w-3.5 h-3.5" /> Denied</span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  {f.staff ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500"><Minus className="w-3.5 h-3.5" /> Denied</span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  {f.viewer ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><Check className="w-3.5 h-3.5" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500"><Minus className="w-3.5 h-3.5" /> Denied</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PermissionMatrix;
