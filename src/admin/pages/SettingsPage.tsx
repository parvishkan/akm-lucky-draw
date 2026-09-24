import React, { useState, useEffect } from 'react';
import { Settings, Users, Shield, Clock, PlusCircle, Laptop } from 'lucide-react';
import StaffStats from '../components/staff/StaffStats';
import StaffTable, { StaffItem } from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import PermissionMatrix from '../components/staff/PermissionMatrix';
import ActivityLogs from '../components/staff/ActivityLogs';
import DeviceSessionManagement from '../components/staff/DeviceSessionManagement';
import { db, collections } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { MASTER_OWNER_UID, MASTER_OWNER_EMAIL } from '../../services/deviceSessionService';
import { ActivityLogger } from '../../services/activityLogger';
import { StaffRole } from '../components/staff/RoleBadge';

export const SettingsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'STAFF' | 'MATRIX' | 'LOGS' | 'DEVICES'>('STAFF');
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffItem | null>(null);

  // Subscribe to real Firestore /admins collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, collections.ADMINS), (snap) => {
      const items: StaffItem[] = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        const isMaster = docSnap.id === MASTER_OWNER_UID || data.role === 'OWNER' || data.email?.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase();

        return {
          id: docSnap.id,
          name: isMaster ? 'Parvish Kan' : (data.displayName || data.name || data.email?.split('@')[0] || 'Staff Member'),
          email: isMaster ? 'parvish@anukrishnamall.com' : (data.email || 'admin@anukrishnamall.com').replace(/[\[\n]/g, ''),
          role: (data.role || (isMaster ? 'OWNER' : 'STAFF')) as StaffRole,
          status: (data.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
          lastActive: isMaster ? 'Active now' : 'Registered'
        };
      });

      // Sort: Master Owner first
      items.sort((a, b) => (a.role === 'OWNER' ? -1 : b.role === 'OWNER' ? 1 : 0));
      setStaffList(items);
    }, (err) => {
      console.warn('Live admins subscription error:', err);
    });

    return () => unsub();
  }, []);

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

  const handleSaveStaff = async (data: Partial<StaffItem>) => {
    try {
      if (data.id) {
        if (data.id === MASTER_OWNER_UID) {
          alert('Master Owner account role cannot be modified.');
          return;
        }

        const staffRef = doc(db, collections.ADMINS, data.id);
        await updateDoc(staffRef, {
          role: data.role || 'STAFF',
          status: data.status || 'ACTIVE',
          updatedAt: serverTimestamp()
        });

        await ActivityLogger.log(
          'ROLE_CHANGED',
          'Admin account role updated',
          'Parvish Kan',
          {
            module: 'Staff Administration',
            status: 'SUCCESS',
            details: `Updated role for ${data.email || data.id} to ${data.role} (${data.status})`
          }
        );
      } else {
        const newDoc = await addDoc(collection(db, collections.ADMINS), {
          displayName: data.name || 'Staff Member',
          email: data.email || 'staff@anukrishnamall.com',
          role: data.role || 'STAFF',
          status: data.status || 'ACTIVE',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        await ActivityLogger.log(
          'ADMIN_CREATED',
          'Admin account created',
          'Parvish Kan',
          {
            module: 'Staff Administration',
            status: 'SUCCESS',
            details: `Created new staff account: ${data.name} (${data.email}) as ${data.role} [${newDoc.id}]`
          }
        );
      }
    } catch (err: any) {
      console.error('Error saving staff member:', err);
      alert(err?.message || 'Failed to save staff member. Please check Firestore permissions.');
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

        <button
          onClick={() => setActiveSubTab('DEVICES')}
          className={`px-4 py-2 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'DEVICES'
              ? 'bg-[#FFD700] text-[#0D021A] shadow-gold-glow'
              : 'bg-[#1D0636] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>💻 Device & Session Management</span>
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

      {activeSubTab === 'DEVICES' && <DeviceSessionManagement />}

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
