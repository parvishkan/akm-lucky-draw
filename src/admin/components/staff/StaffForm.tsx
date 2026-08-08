import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, ShieldCheck, Mail, Check } from 'lucide-react';
import { StaffItem } from './StaffTable';
import { StaffRole } from './RoleBadge';

interface StaffFormProps {
  isOpen: boolean;
  staffToEdit?: StaffItem | null;
  onClose: () => void;
  onSave: (data: Partial<StaffItem>) => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  isOpen,
  staffToEdit,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('STAFF');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name);
      setEmail(staffToEdit.email);
      setRole(staffToEdit.role);
      setStatus(staffToEdit.status);
    } else {
      setName('');
      setEmail('');
      setRole('STAFF');
      setStatus('ACTIVE');
    }
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      id: staffToEdit?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      status
    });
    onClose();
  };

  const roleDescriptions = {
    OWNER: 'Full system access & administrative ownership privileges.',
    ADMIN: 'Manage campaign parameters, tokens, prizes, winners, and claims.',
    MANAGER: 'Manage daily campaign operations and counter claims.',
    STAFF: 'Verify counter claims and view operational information.',
    VIEWER: 'Read-only access to campaign analytics and activity timelines.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-md bg-[#1D0636] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6 text-left"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                {staffToEdit ? 'Edit Staff Permissions' : 'Add New Staff Member'}
              </h3>
              <p className="text-[11px] text-[#A0A0A0]">Configure user account and RBAC access level.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arun Kumar"
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arun@anukrishnamall.com"
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            >
              <option value="OWNER">Owner (Full Access)</option>
              <option value="ADMIN">Administrator (Manage System)</option>
              <option value="MANAGER">Manager (Manage Operations)</option>
              <option value="STAFF">Staff (Verify Claims)</option>
              <option value="VIEWER">Viewer (Read-Only)</option>
            </select>
            <p className="text-[10px] text-[#A0A0A0] italic pt-0.5">
              {roleDescriptions[role]}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Account Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
            >
              <option value="ACTIVE">🟢 Active</option>
              <option value="INACTIVE">⚪ Inactive / Disabled</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFD700]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:shadow-gold-glow transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#0D021A]" />
              <span>{staffToEdit ? 'Save Role' : 'Send Invitation'}</span>
            </button>
          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default StaffForm;
