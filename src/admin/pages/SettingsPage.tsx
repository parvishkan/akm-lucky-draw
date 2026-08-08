import React, { useState } from 'react';
import { Settings, Users, Shield, Clock, PlusCircle } from 'lucide-react';
import StaffStats from '../components/staff/StaffStats';
import StaffTable, { StaffItem } from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import PermissionMatrix from '../components/staff/PermissionMatrix';
import ActivityLogs from '../components/staff/ActivityLogs';
import ConfirmationModal from '../components/qr/ConfirmationModal';

const initialMockStaff: StaffItem[] = [
  { id: 'usr-1', name: 'Anu Krishna Executive', email: 'owner@anukrishnamall.com', role: 'OWNER', status: 'ACTIVE', lastActive: 'Just Now' },
  { id: 'usr-2', name: 'Arun Kumar', email: 'arun@anukrishnamall.com', role: 'ADMIN', status: 'ACTIVE', lastActive: '5 mins ago' },
  { id: 'usr-3', name: 'Priya Sharma', email: 'priya@anukrishnamall.com', role: 'MANAGER', status: 'ACTIVE', lastActive: '12 mins ago' },
  { id: 'usr-4', name: 'Staff Counter #1', email: 'counter1@anukrishnamall.com', role: 'STAFF', status: 'ACTIVE', lastActive: '2 mins ago' },
  { id: 'usr-5', name: 'Staff Counter #2', email: 'counter2@anukrishnamall.com', role: 'STAFF', status: 'ACTIVE', lastActive: '18 mins ago' },
  { id: 'usr-6', name: 'Audit Supervisor', email: 'auditor@anukrishnamall.com', role: 'VIEWER', status: 'INACTIVE', lastActive: 'Yesterday' },
];

export const SettingsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'STAFF' | 'MATRIX' | 'LOGS'>('STAFF');
  const [staffList, setStaffList] = useState<StaffItem[]>(initialMockStaff);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffItem | null>(null);

  // Stats calculation
  const total = staffList.length;
  const active = staffList.filter((s) => s.status === 'ACTIVE').length;
  const inactive = staffList.filter((s) => s.status === 'INACTIVE').length;
  const admins = staffList.filter((s) => s.role === 'OWNER' || s.role === 'ADMIN').length;

  const handleOpenAdd = () => {
    setStaffToEdit(null);
    setIsStaffFormOpen(true);
  };

  const handleOpenEdit = (staff: StaffItem) => {
    setStaffToEdit(staff);
    setIsStaffFormOpen(true);
  };

  const handleSaveStaff = (data: Partial<StaffItem>) => {
    if (data.id) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === data.id ? ({ ...s, ...data } as StaffItem) : s))
      );
    } else {
      const newMember: StaffItem = {
        id: `usr-${Date.now()}`,
        name: data.name || 'New Staff Member',
        email: data.email || 'staff@anukrishnamall.com',
        role: data.role || 'STAFF',
        status: data.status || 'ACTIVE',
        lastActive: 'Just Inviting'
      };
      setStaffList((prev) => [newMember, ...prev]);
    }
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Settings className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Staff Administration & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Staff Management & System Logs
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Manage staff accounts, assign RBAC role permissions, and review security audit logs.
          </p>
        </div>

        {activeSubTab === 'STAFF' && (
          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#0D021A]" />
            <span>+ Add Staff</span>
          </button>
        )}
      </div>

      {/* 2. Sub-Tab Switcher Bar */}
      <div className="flex items-center gap-2 border-b border-[#FFD700]/15 pb-3 flex-wrap">
        <button
          onClick={() => setActiveSubTab('STAFF')}
          className={`px-4 py-2 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'STAFF'
              ? 'bg-[#FFD700] text-[#0D021A] shadow-gold-glow'
              : 'bg-[#1D0636] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Staff Accounts ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('MATRIX')}
          className={`px-4 py-2 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'MATRIX'
              ? 'bg-[#FFD700] text-[#0D021A] shadow-gold-glow'
              : 'bg-[#1D0636] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>🛡 Permission Matrix (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('LOGS')}
          className={`px-4 py-2 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'LOGS'
              ? 'bg-[#FFD700] text-[#0D021A] shadow-gold-glow'
              : 'bg-[#1D0636] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>📜 System Activity Logs</span>
        </button>
      </div>

      {/* 3. Sub-Tab Content Rendering */}
      {activeSubTab === 'STAFF' && (
        <div className="space-y-6">
          <StaffStats total={total} active={active} inactive={inactive} admins={admins} />
          <StaffTable staffList={staffList} onEditStaff={handleOpenEdit} />
        </div>
      )}

      {activeSubTab === 'MATRIX' && <PermissionMatrix />}

      {activeSubTab === 'LOGS' && <ActivityLogs />}

      {/* Add / Edit Staff Modal */}
      <StaffForm
        isOpen={isStaffFormOpen}
        staffToEdit={staffToEdit}
        onClose={() => setIsStaffFormOpen(false)}
        onSave={handleSaveStaff}
      />

    </div>
  );
};

export default SettingsPage;
