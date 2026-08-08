import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import WinnerStats from '../components/winners/WinnerStats';
import WinnerToolbar from '../components/winners/WinnerToolbar';
import WinnerTable, { WinnerItem } from '../components/winners/WinnerTable';
import WinnerDetailsPanel from '../components/winners/WinnerDetailsPanel';
import EmptyState from '../components/winners/EmptyState';
import LoadingSkeleton from '../components/winners/LoadingSkeleton';

// Realistic mock winners dataset
export const initialMockWinners: WinnerItem[] = [
  {
    id: 'WIN-000428',
    tokenCode: 'AKM-DW-26-X8K4P',
    prizeName: 'iPhone 16 Pro Max',
    prizeCategory: 'Grand Prize',
    prizeImage: '/akm-logo.png',
    isHighValue: true,
    wonAt: '08 Aug 2026, 11:32 AM',
    claimStatus: 'PENDING',
    claimId: 'CLM-8F42K',
    staffNotes: 'Customer verified at Help Desk Counter #1.'
  },
  {
    id: 'WIN-000427',
    tokenCode: 'AKM-DW-26-A7L9Q',
    prizeName: 'Grand Gold Coin (24K)',
    prizeCategory: 'Grand Prize',
    prizeImage: '/akm-logo.png',
    isHighValue: true,
    wonAt: '08 Aug 2026, 10:45 AM',
    claimStatus: 'CLAIMED',
    claimId: 'CLM-9M24P',
    claimedAt: '08 Aug 2026, 11:00 AM',
    verifiedBy: 'Senior Mall Admin',
    staffNotes: 'Handed 1g Gold Coin in velvet box.'
  },
  {
    id: 'WIN-000426',
    tokenCode: 'AKM-DW-26-M4D8X',
    prizeName: 'Smart Watch Series 10',
    prizeCategory: 'Premium Prize',
    prizeImage: '/akm-logo.png',
    isHighValue: true,
    wonAt: '08 Aug 2026, 10:15 AM',
    claimStatus: 'CLAIMED',
    claimId: 'CLM-3R88K',
    claimedAt: '08 Aug 2026, 10:30 AM',
    verifiedBy: 'Mall Manager'
  },
  {
    id: 'WIN-000425',
    tokenCode: 'AKM-DW-26-G8N4C',
    prizeName: 'Designer Silk Saree',
    prizeCategory: 'Regular Gift',
    prizeImage: '/akm-logo.png',
    isHighValue: false,
    wonAt: '07 Aug 2026, 04:20 PM',
    claimStatus: 'CLAIMED',
    claimId: 'CLM-7T12X',
    claimedAt: '07 Aug 2026, 04:40 PM',
    verifiedBy: 'Staff Counter #2'
  },
  {
    id: 'WIN-000424',
    tokenCode: 'AKM-DW-26-T2Y9H',
    prizeName: '₹10,000 Diamond Voucher',
    prizeCategory: 'Premium Prize',
    prizeImage: '/akm-logo.png',
    isHighValue: true,
    wonAt: '07 Aug 2026, 03:10 PM',
    claimStatus: 'PENDING',
    claimId: 'CLM-5K99B'
  },
  {
    id: 'WIN-000423',
    tokenCode: 'AKM-DW-26-Z7P3X',
    prizeName: 'Diwali Cash Voucher',
    prizeCategory: 'Gift Voucher',
    prizeImage: '/akm-logo.png',
    isHighValue: false,
    wonAt: '06 Aug 2026, 05:00 PM',
    claimStatus: 'CLAIMED',
    claimId: 'CLM-1Z44W',
    claimedAt: '06 Aug 2026, 05:15 PM',
    verifiedBy: 'Senior Mall Admin'
  }
];

export const WinnersPage: React.FC = () => {
  const [winners, setWinners] = useState<WinnerItem[]>(initialMockWinners);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<WinnerItem | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Summary Metrics
  const stats = useMemo(() => {
    const total = winners.length;
    const today = winners.filter((w) => w.wonAt.includes('08 Aug')).length;
    const pending = winners.filter((w) => w.claimStatus === 'PENDING').length;
    const claimed = winners.filter((w) => w.claimStatus === 'CLAIMED').length;
    const highValue = winners.filter((w) => w.isHighValue).length;

    return { total, today, pending, claimed, highValue };
  }, [winners]);

  // Filtered & Sorted Winners
  const filteredWinners = useMemo(() => {
    return winners.filter((item) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toUpperCase();
        const matchesId = item.id.toUpperCase().includes(query);
        const matchesToken = item.tokenCode.toUpperCase().includes(query);
        const matchesClaim = item.claimId.toUpperCase().includes(query);
        const matchesPrize = item.prizeName.toUpperCase().includes(query);
        if (!matchesId && !matchesToken && !matchesClaim && !matchesPrize) return false;
      }

      // 2. Status Filter
      if (selectedStatus !== 'ALL' && item.claimStatus !== selectedStatus) return false;

      // 3. Category Filter
      if (selectedCategory !== 'ALL' && item.prizeCategory !== selectedCategory) return false;

      // 4. Date Filter
      if (selectedDate === 'TODAY' && !item.wonAt.includes('08 Aug')) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'OLDEST') return a.id.localeCompare(b.id);
      if (sortBy === 'PRIZE') return a.prizeName.localeCompare(b.prizeName);
      if (sortBy === 'STATUS') return a.claimStatus.localeCompare(b.claimStatus);
      return b.id.localeCompare(a.id); // Default NEWEST
    });
  }, [winners, searchTerm, selectedStatus, selectedCategory, selectedDate, sortBy]);

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

  const handleExportPDF = () => {
    alert(`Exporting ${filteredWinners.length} winner records to PDF format...`);
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
            Manage all AKM Lucky Draw winners, tokens, claim IDs, and prize collection statuses.
          </p>
        </div>
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
            onExportPDF={handleExportPDF}
          />

          {/* 4. Winners Data Table / Mobile Cards / Empty State */}
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
