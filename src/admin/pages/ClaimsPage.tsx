import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, FileText, RefreshCw } from 'lucide-react';
import ClaimStats from '../components/winners/ClaimStats';
import ClaimTable from '../components/winners/ClaimTable';
import ClaimVerification from '../components/winners/ClaimVerification';
import ClaimConfirmationModal from '../components/winners/ClaimConfirmationModal';
import ClaimSuccess from '../components/winners/ClaimSuccess';
import PrintClaimSlip from '../components/winners/PrintClaimSlip';
import EmptyState from '../components/winners/EmptyState';
import LoadingSkeleton from '../components/winners/LoadingSkeleton';
import { WinnerItem } from '../components/winners/WinnerTable';
import { ClaimsService } from '../../services/claimsService';

export const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<WinnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State Flow Controls
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [targetClaimForVerification, setTargetClaimForVerification] = useState<WinnerItem | null>(null);
  
  const [confirmingClaim, setConfirmingClaim] = useState<WinnerItem | null>(null);
  const [staffNotesText, setStaffNotesText] = useState('');
  
  const [successfulClaim, setSuccessfulClaim] = useState<WinnerItem | null>(null);
  const [printSlipClaim, setPrintSlipClaim] = useState<WinnerItem | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const loadClaims = async () => {
    setIsLoading(true);
    const records = await ClaimsService.getAllClaims();
    const mappedItems: WinnerItem[] = records.map(r => ({
      id: r.winnerId || 'WIN-0000',
      tokenCode: r.tokenCode || r.tokenId || 'AKM-TOKEN',
      prizeName: r.prizeName || 'Diwali Gift',
      prizeCategory: 'Diwali Privilege',
      prizeImage: '/akm-logo.png',
      isHighValue: r.prizeValue ? r.prizeValue.includes('10,000') || r.prizeValue.includes('Gold') : false,
      wonAt: r.createdAt || 'Today',
      claimStatus: r.claimStatus === 'CLAIMED' ? 'CLAIMED' : 'PENDING',
      claimId: r.claimId,
      claimedAt: r.claimedAt || undefined,
      verifiedBy: r.verifiedBy,
      staffNotes: r.staffNotes
    }));
    setClaims(mappedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadClaims();
  }, []);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = claims.length;
    const pending = claims.filter((c) => c.claimStatus === 'PENDING').length;
    const fulfilled = claims.filter((c) => c.claimStatus === 'CLAIMED').length;
    const highValue = claims.filter((c) => c.isHighValue && c.claimStatus === 'CLAIMED').length;

    return { total, pending, fulfilled, highValue };
  }, [claims]);

  // Filtered Claims List
  const filteredClaims = useMemo(() => {
    return claims.filter((item) => {
      if (searchTerm.trim()) {
        const queryStr = searchTerm.trim().toUpperCase();
        const matchesId = item.claimId.toUpperCase().includes(queryStr);
        const matchesWinner = item.id.toUpperCase().includes(queryStr);
        const matchesToken = item.tokenCode.toUpperCase().includes(queryStr);
        const matchesPrize = item.prizeName.toUpperCase().includes(queryStr);
        if (!matchesId && !matchesWinner && !matchesToken && !matchesPrize) return false;
      }

      if (selectedStatus !== 'ALL' && item.claimStatus !== selectedStatus) return false;

      return true;
    });
  }, [claims, searchTerm, selectedStatus]);

  // Verification Handlers
  const handleOpenVerification = (claim?: WinnerItem) => {
    setTargetClaimForVerification(claim || null);
    setIsVerificationOpen(true);
  };

  const handleInitiateCollection = (claim: WinnerItem, notes: string) => {
    setIsVerificationOpen(false);
    setStaffNotesText(notes);
    setConfirmingClaim(claim);
  };

  const handleConfirmCollection = async (claim: WinnerItem) => {
    setIsLoading(true);
    const res = await ClaimsService.verifyAndFulfillClaim(claim.claimId, 'Senior Mall Admin', staffNotesText);
    
    if (!res.success) {
      alert(res.message);
      setIsLoading(false);
      return;
    }

    await loadClaims();

    const updatedClaimObject: WinnerItem = {
      ...claim,
      claimStatus: 'CLAIMED',
      claimedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }),
      verifiedBy: 'Senior Mall Admin',
      staffNotes: staffNotesText || claim.staffNotes
    };

    setConfirmingClaim(null);
    setSuccessfulClaim(updatedClaimObject);
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    const headers = 'ClaimID,WinnerID,TokenCode,PrizeName,Status,Created,ClaimedAt,VerifiedBy\n';
    const rows = filteredClaims.map((c) =>
      `"${c.claimId}","${c.id}","${c.tokenCode}","${c.prizeName}","${c.claimStatus}","${c.wonAt}","${c.claimedAt || ''}","${c.verifiedBy || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AKM-Claims-Export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Banner & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Counter Redemption Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Prize Claims
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Verify customer Claim IDs, authenticate token receipts, and confirm physical prize collection in Firestore.
          </p>
        </div>

        {/* Primary CTA: Verify Claim */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadClaims}
            className="p-3 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#0D021A] transition-colors"
            title="Refresh Claims"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => handleOpenVerification()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#0D021A]" />
            <span>Verify Claim</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* 2. Summary Metric Cards */}
          <ClaimStats
            total={stats.total}
            pending={stats.pending}
            fulfilled={stats.fulfilled}
            highValue={stats.highValue}
          />

          {/* 3. Search & Export Bar */}
          <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-glass">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Claim ID, Winner ID, Token Code, Prize..."
              className="w-full md:w-96 px-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700]"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] font-bold text-xs flex items-center gap-1.5 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => alert(`Exporting ${filteredClaims.length} claims`)}
                className="px-3.5 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* 4. Claims Table */}
          {filteredClaims.length === 0 ? (
            <EmptyState type="CLAIMS" />
          ) : (
            <ClaimTable
              claims={filteredClaims}
              onVerifyClaim={handleOpenVerification}
            />
          )}

          {/* 5. Claim Verification Interface Modal */}
          <ClaimVerification
            isOpen={isVerificationOpen}
            initialClaim={targetClaimForVerification}
            allClaims={claims}
            onClose={() => setIsVerificationOpen(false)}
            onInitiateCollection={handleInitiateCollection}
          />

          {/* 6. Handover Confirmation Modal */}
          <ClaimConfirmationModal
            claim={confirmingClaim}
            staffNotesText={staffNotesText}
            onClose={() => setConfirmingClaim(null)}
            onConfirmCollection={handleConfirmCollection}
          />

          {/* 7. Successful Claim View */}
          <AnimatePresence>
            {successfulClaim && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="w-full max-w-md">
                  <ClaimSuccess
                    claim={successfulClaim}
                    onPrintSlip={() => {
                      setPrintSlipClaim(successfulClaim);
                      setSuccessfulClaim(null);
                    }}
                    onClose={() => setSuccessfulClaim(null)}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* 8. Printable Claim Slip Receipt Popup */}
          <PrintClaimSlip
            claim={printSlipClaim}
            onClose={() => setPrintSlipClaim(null)}
          />
        </>
      )}

    </div>
  );
};

export default ClaimsPage;
