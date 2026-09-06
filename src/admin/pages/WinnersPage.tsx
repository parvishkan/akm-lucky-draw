import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import WinnerStats from '../components/winners/WinnerStats';
import WinnerToolbar from '../components/winners/WinnerToolbar';
import WinnerTable, { WinnerItem } from '../components/winners/WinnerTable';
import WinnerDetailsPanel from '../components/winners/WinnerDetailsPanel';
import EmptyState from '../components/winners/EmptyState';
import LoadingSkeleton from '../components/winners/LoadingSkeleton';
import { db, collections } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const WinnersPage: React.FC = () => {
  const [winners, setWinners] = useState<WinnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWinner, setSelectedWinner] = useState<WinnerItem | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  const loadWinners = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, collections.WINNERS));
      if (!snap.empty) {
        const items: WinnerItem[] = snap.docs.map(d => {
          const data = d.data();
          return {
            id: data.winnerId || d.id,
            tokenCode: data.tokenCode || data.tokenId || 'AKM-TOKEN',
            prizeName: data.prizeName || 'Diwali Gift',
            prizeCategory: data.prizeCategory || 'Diwali Privilege',
            prizeImage: '/akm-logo.png',
            isHighValue: data.prizeValue ? data.prizeValue.includes('10,000') || data.prizeValue.includes('Gold') || data.prizeValue.includes('iPhone') : false,
            wonAt: data.wonAt || 'Today',
            claimStatus: (data.claimStatus === 'CLAIMED' || data.status === 'CLAIMED') ? 'CLAIMED' : 'PENDING',
            claimId: data.claimId || `CLM-${d.id.substring(0, 5)}`,
            claimedAt: data.claimedAt,
            verifiedBy: data.verifiedBy,
            staffNotes: data.staffNotes
          };
        });
        setWinners(items);
      } else {
        setWinners([]);
      }
    } catch (err) {
      console.warn('Firestore loadWinners error:', err);
      setWinners([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadWinners();
  }, []);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = winners.length;
    const today = winners.filter((w) => w.wonAt.includes('2026') || w.wonAt.includes('Today')).length;
    const pending = winners.filter((w) => w.claimStatus === 'PENDING').length;
    const claimed = winners.filter((w) => w.claimStatus === 'CLAIMED').length;
    const highValue = winners.filter((w) => w.isHighValue).length;

    return { total, today, pending, claimed, highValue };
  }, [winners]);

  // Filtered & Sorted Winners
  const filteredWinners = useMemo(() => {
    return winners.filter((item) => {
      if (searchTerm.trim()) {
        const queryStr = searchTerm.trim().toUpperCase();
        const matchesId = item.id.toUpperCase().includes(queryStr);
        const matchesToken = item.tokenCode.toUpperCase().includes(queryStr);
        const matchesClaim = item.claimId.toUpperCase().includes(queryStr);
        const matchesPrize = item.prizeName.toUpperCase().includes(queryStr);
        if (!matchesId && !matchesToken && !matchesClaim && !matchesPrize) return false;
      }

      if (selectedStatus !== 'ALL' && item.claimStatus !== selectedStatus) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'OLDEST') return a.id.localeCompare(b.id);
      if (sortBy === 'PRIZE') return a.prizeName.localeCompare(b.prizeName);
      return b.id.localeCompare(a.id);
    });
  }, [winners, searchTerm, selectedStatus, sortBy]);

  // CSV Export logic
  const handleExportCSV = () => {
    const headers = 'WinnerID,TokenCode,PrizeName,Category,WonAt,ClaimStatus,ClaimID,ClaimedAt,VerifiedBy\n';
    const rows = filteredWinners.map((w) =>
      `"${w.id}","${w.tokenCode}","${w.prizeName}","${w.prizeCategory}","${w.wonAt}","${w.claimStatus}","${w.claimId}","${w.claimedAt || ''}","${w.verifiedBy || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AKM-Winners-Export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Winner Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Winners
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Manage all AKM Lucky Draw winners, tokens, claim IDs, and prize collection statuses in Firestore.
          </p>
        </div>

        <button
          onClick={loadWinners}
          className="p-3 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#0D021A] transition-colors self-start sm:self-auto"
          title="Refresh Winners"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* 2. Summary Metric Cards */}
          <WinnerStats
            total={stats.total}
            today={stats.today}
            pending={stats.pending}
            claimed={stats.claimed}
            highValue={stats.highValue}
          />

          {/* 3. Search & Filter Toolbar */}
          <WinnerToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onExportCSV={handleExportCSV}
            onExportPDF={() => alert(`Exporting ${filteredWinners.length} winners`)}
          />

          {/* 4. Winners Data Table */}
          {filteredWinners.length === 0 ? (
            <EmptyState type="WINNERS" />
          ) : (
            <WinnerTable
              winners={filteredWinners}
              onViewDetails={setSelectedWinner}
            />
          )}

          {/* 5. Side Drawer Specifications */}
          <AnimatePresence>
            {selectedWinner && (
              <WinnerDetailsPanel
                winner={selectedWinner}
                onClose={() => setSelectedWinner(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}

    </div>
  );
};

export default WinnersPage;
