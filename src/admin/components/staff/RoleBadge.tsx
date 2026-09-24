import React from 'react';
import { cn } from '../../../utilities/cn';

export type StaffRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'VIEWER';

interface RoleBadgeProps {
  role: StaffRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const styles = {
    OWNER: 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700] shadow-gold-glow',
    ADMIN: 'bg-[#FFD700]/15 border-[#FFD700]/50 text-[#FFD700]',
    MANAGER: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
    STAFF: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
    VIEWER: 'bg-gray-800 border-gray-700 text-gray-400',
  };

  const labels = {
    OWNER: 'Digital Marketing',
    ADMIN: 'Administrator',
    MANAGER: 'Manager',
    STAFF: 'Staff',
    VIEWER: 'Viewer',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider',
        styles[role],
        className
      )}
    >
      {labels[role]}
    </span>
  );
};

export default RoleBadge;
