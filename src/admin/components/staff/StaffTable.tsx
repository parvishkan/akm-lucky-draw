import React from 'react';
import { Edit3, User } from 'lucide-react';
import RoleBadge, { StaffRole } from './RoleBadge';

export interface StaffItem {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
}

interface StaffTableProps {
  staffList: StaffItem[];
  onEditStaff: (staff: StaffItem) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({ staffList, onEditStaff }) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-3xl overflow-hidden shadow-glass select-none font-sans">
      
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0D021A] border-b border-[#FFD700]/20 text-[#D4AF37] font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 font-bold">Staff Name</th>
              <th className="py-3.5 px-4 font-bold">Email Address</th>
              <th className="py-3.5 px-4 font-bold">Role</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold">Last Active</th>
              <th className="py-3.5 px-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFD700]/10">
            {staffList.map((user) => (
              <tr key={user.id} className="hover:bg-[#0D021A]/60 transition-colors">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{user.name}</span>
                </td>

                <td className="py-3 px-4 font-mono text-[#A0A0A0]">
                  {user.email}
                </td>

                <td className="py-3 px-4">
                  <RoleBadge role={user.role} />
                </td>

                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gray-800 border border-gray-700 text-gray-400'
                  }`}>
                    <span>{user.status === 'ACTIVE' ? '🟢 Active' : '⚪ Inactive'}</span>
                  </span>
                </td>

                <td className="py-3 px-4 text-[#A0A0A0] font-mono text-[11px]">
                  {user.lastActive}
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEditStaff(user)}
                    className="px-3 py-1.5 rounded-lg bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Role</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST CARDS */}
      <div className="md:hidden divide-y divide-[#FFD700]/15">
        {staffList.map((user) => (
          <div key={user.id} className="p-4 space-y-2 bg-[#0D021A]/80 text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{user.name}</span>
              <RoleBadge role={user.role} />
            </div>

            <div className="text-xs font-mono text-[#A0A0A0]">{user.email}</div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] pt-1">
              <span>Status: <strong className={user.status === 'ACTIVE' ? 'text-emerald-400' : 'text-gray-400'}>{user.status}</strong></span>
              <span>Active: {user.lastActive}</span>
            </div>

            <div className="pt-2 border-t border-[#FFD700]/10 flex justify-end">
              <button
                onClick={() => onEditStaff(user)}
                className="px-3 py-1.5 rounded-lg bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold"
              >
                Edit Role
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StaffTable;
