import React, { useState } from 'react';
import { QrCode, Sparkles } from 'lucide-react';
import QRCodePreview from '../components/qr/QRCodePreview';
import PrintPreview from '../components/qr/PrintPreview';
import CampaignStatus, { CampaignState } from '../components/qr/CampaignStatus';
import CustomerAccessControl from '../components/qr/CustomerAccessControl';
import EmergencyControls from '../components/qr/EmergencyControls';
import CampaignSettings from '../components/qr/CampaignSettings';
import QRUsageStats from '../components/qr/QRUsageStats';
import CampaignActivity from '../components/qr/CampaignActivity';
import ConfirmationModal from '../components/qr/ConfirmationModal';

export const QRManagementPage: React.FC = () => {
  const [campaignStatus, setCampaignStatus] = useState<CampaignState>('LIVE');
  const [customerAccess, setCustomerAccess] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Status Change Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: '',
    confirmVariant: 'primary',
    action: () => {},
  });

  // Handlers for Status Transitions
  const handleRequestPause = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Pause Lucky Draw Campaign?',
      description: 'Customers will temporarily be unable to submit receipt tokens or participate in the draw.',
      confirmText: 'Pause Campaign',
      confirmVariant: 'warning',
      action: () => {
        setCampaignStatus('PAUSED');
        setCustomerAccess(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestResume = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Resume Lucky Draw Campaign?',
      description: 'Customers will immediately be able to scan QR codes and participate again.',
      confirmText: 'Resume Campaign',
      confirmVariant: 'primary',
      action: () => {
        setCampaignStatus('LIVE');
        setCustomerAccess(true);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestEnd = () => {
    setConfirmModal({
      isOpen: true,
      title: 'End Lucky Draw Campaign?',
      description: 'Once ended, the campaign will be permanently closed to new entries. This action requires administrative confirmation.',
      confirmText: 'End Campaign',
      confirmVariant: 'danger',
      action: () => {
        setCampaignStatus('ENDED');
        setCustomerAccess(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleEmergencyDisable = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Disable Customer Access?',
      description: 'This emergency kill-switch will immediately suspend new Lucky Draw participation across all mobile browsers.',
      confirmText: 'Emergency Disable',
      confirmVariant: 'danger',
      action: () => {
        setCustomerAccess(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <QrCode className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Campaign Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            QR & Campaign Management
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Manage customer access to AKM Lucky Draw, print billing counter QR posters, and switch campaign status.
          </p>
        </div>
      </div>

      {/* 2. QR Usage Analytics Stats */}
      <QRUsageStats />

      {/* 3. Main Grid: QR Preview + Campaign Status & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QRCodePreview (5 Cols) */}
        <div className="lg:col-span-5">
          <QRCodePreview onOpenPrintModal={() => setIsPrintModalOpen(true)} />
        </div>

        {/* Right Column: Campaign Status & Customer Gate (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CampaignStatus
            status={campaignStatus}
            customerAccess={customerAccess}
            onPauseClick={handleRequestPause}
            onResumeClick={handleRequestResume}
            onEndClick={handleRequestEnd}
          />

          <CustomerAccessControl
            accessEnabled={customerAccess}
            onToggleAccess={() => {
              if (customerAccess) handleEmergencyDisable();
              else setCustomerAccess(true);
            }}
          />

          <EmergencyControls
            accessEnabled={customerAccess}
            onEmergencyDisable={handleEmergencyDisable}
          />
        </div>

      </div>

      {/* 4. Secondary Grid: Campaign Settings & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CampaignSettings />
        </div>
        <div className="lg:col-span-5">
          <CampaignActivity />
        </div>
      </div>

      {/* 5. A4 Printable Poster Modal */}
      <PrintPreview
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* 6. Universal Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action}
      />

    </div>
  );
};

export default QRManagementPage;
