import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Sparkles, Download, Ticket, Layers, RefreshCw } from 'lucide-react';
import TokenStats from '../components/tokens/TokenStats';
import TokenToolbar from '../components/tokens/TokenToolbar';
import TokenTable, { TokenItem } from '../components/tokens/TokenTable';
import TokenDetailsPanel from '../components/tokens/TokenDetailsPanel';
import GenerateTokenModal from '../components/tokens/GenerateTokenModal';
import BulkActionBar from '../components/tokens/BulkActionBar';
import EmptyState from '../components/tokens/EmptyState';
import LoadingSkeleton from '../components/tokens/LoadingSkeleton';
import { TokenStatus } from '../components/tokens/StatusBadge';

// Initial realistic placeholder token dataset
const initialMockTokens: TokenItem[] = [
  { id: '1', tokenCode: 'AKM-DW-26-X8K4P', status: 'UNUSED', createdDate: '08 Aug 2026' },
  { id: '2', tokenCode: 'AKM-DW-26-A7L9Q', status: 'VERIFIED', createdDate: '08 Aug 2026', verifiedDate: '10:32 AM', claimStatus: 'PENDING' },
  { id: '3', tokenCode: 'AKM-DW-26-M4D8X', status: 'CLAIMED', createdDate: '08 Aug 2026', verifiedDate: '10:45 AM', prizeTitle: 'Smart Watch', claimId: 'AKM-CLAIM-2026-8892', claimStatus: 'FULFILLED', claimedDate: '11:00 AM' },
  { id: '4', tokenCode: 'AKM-DW-26-K9P2W', status: 'UNUSED', createdDate: '08 Aug 2026' },
  { id: '5', tokenCode: 'AKM-DW-26-B3R7V', status: 'BLOCKED', createdDate: '07 Aug 2026' },
  { id: '6', tokenCode: 'AKM-DW-26-G8N4C', status: 'CLAIMED', createdDate: '07 Aug 2026', verifiedDate: '02:15 PM', prizeTitle: 'Grand Gold Coin', claimId: 'AKM-CLAIM-2026-1044', claimStatus: 'FULFILLED', claimedDate: '02:30 PM' },
  { id: '7', tokenCode: 'AKM-DW-26-T2Y9H', status: 'VERIFIED', createdDate: '07 Aug 2026', verifiedDate: '03:40 PM', prizeTitle: 'Diamond Voucher', claimStatus: 'PENDING' },
  { id: '8', tokenCode: 'AKM-DW-26-L5W8K', status: 'UNUSED', createdDate: '06 Aug 2026' },
  { id: '9', tokenCode: 'AKM-DW-26-H4M9N', status: 'UNUSED', createdDate: '06 Aug 2026' },
  { id: '10', tokenCode: 'AKM-DW-26-Z7P3X', status: 'CLAIMED', createdDate: '05 Aug 2026', verifiedDate: '05:10 PM', prizeTitle: 'Silk Saree', claimId: 'AKM-CLAIM-2026-9410', claimStatus: 'FULFILLED', claimedDate: '05:25 PM' },
];

export const TokensPage: React.FC = () => {
  const [tokens, setTokens] = useState<TokenItem[]>(initialMockTokens);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPrize, setSelectedPrize] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('CREATED_DESC');

  // Summary Metrics calculation
  const summaryMetrics = useMemo(() => {
    const total = tokens.length;
    const unused = tokens.filter((t) => t.status === 'UNUSED').length;
    const verified = tokens.filter((t) => t.status === 'VERIFIED').length;
    const claimed = tokens.filter((t) => t.status === 'CLAIMED').length;
    const blocked = tokens.filter((t) => t.status === 'BLOCKED').length;

    return { total, unused, verified, claimed, blocked };
  }, [tokens]);

  // Filtered & Sorted Tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((item) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toUpperCase();
        const matchesCode = item.tokenCode.toUpperCase().includes(query);
        const matchesStatus = item.status.toUpperCase().includes(query);
        const matchesPrize = item.prizeTitle?.toUpperCase().includes(query) || false;
        const matchesClaim = item.claimId?.toUpperCase().includes(query) || false;
        if (!matchesCode && !matchesStatus && !matchesPrize && !matchesClaim) return false;
      }

      // 2. Status Filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

      // 3. Prize Filter
      if (selectedPrize !== 'ALL' && (!item.prizeTitle || !item.prizeTitle.includes(selectedPrize))) return false;

      // 4. Date Range Filter
      if (selectedDate === 'TODAY' && !item.createdDate.includes('08 Aug')) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'TOKEN_ASC') return a.tokenCode.localeCompare(b.tokenCode);
      if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
      return b.id.localeCompare(a.id); // Default NEWEST
    });
  }, [tokens, searchTerm, selectedStatus, selectedPrize, selectedDate, sortBy]);

  // Selection handlers
  const handleSelectToken = (id: string) => {
    setSelectedTokenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTokenIds.length === filteredTokens.length) {
      setSelectedTokenIds([]);
    } else {
      setSelectedTokenIds(filteredTokens.map((t) => t.id));
    }
  };

  // Batch token generation handler
  const handleGenerateBatch = (count: number, prefix: string, length: number) => {
    const chars = 'ABCDEFGHJKLMNPQRTUVWXY2346789';
    const newBatch: TokenItem[] = [];

    for (let i = 0; i < count; i++) {
      let rand = '';
      for (let j = 0; j < length; j++) {
        rand += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const code = `${prefix}${rand}`;
      newBatch.push({
        id: `gen-${Date.now()}-${i}`,
        tokenCode: code,
        status: 'UNUSED',
        createdDate: '08 Aug 2026'
      });
    }

    setTokens((prev) => [...newBatch, ...prev]);
    alert(`Successfully issued ${count.toLocaleString()} new tokens!`);
  };

  // Block / Unblock single token
  const handleToggleBlock = (token: TokenItem) => {
    const newStatus: TokenStatus = token.status === 'BLOCKED' ? 'UNUSED' : 'BLOCKED';
    setTokens((prev) =>
      prev.map((t) => (t.id === token.id ? { ...t, status: newStatus } : t))
    );
  };

  // Bulk Actions
  const handleBulkBlock = () => {
    setTokens((prev) =>
      prev.map((t) => (selectedTokenIds.includes(t.id) ? { ...t, status: 'BLOCKED' } : t))
    );
    setSelectedTokenIds([]);
  };

  const handleBulkDelete = () => {
    setTokens((prev) => prev.filter((t) => !selectedTokenIds.includes(t.id)));
    setSelectedTokenIds([]);
  };

  // CSV Export logic
  const handleExportCSV = () => {
    const headers = 'TokenCode,Status,CreatedDate,VerifiedDate,PrizeTitle,ClaimID,ClaimStatus\n';
    const rows = filteredTokens.map((t) =>
      `"${t.tokenCode}","${t.status}","${t.createdDate}","${t.verifiedDate || ''}","${t.prizeTitle || ''}","${t.claimId || ''}","${t.claimStatus || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AKM-Tokens-Export-${Date.now()}.csv`;
    a.click();
  };

  // PDF Export logic placeholder
  const handleExportPDF = () => {
    alert(`Exporting ${filteredTokens.length} token records to PDF format...`);
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Title Banner & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Campaign Token Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Token Management
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Manage, generate, search, filter, and monitor all AKM Lucky Draw receipt tokens.
          </p>
        </div>

        {/* Primary CTA: + Generate Tokens */}
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#0D021A]" />
          <span>+ Generate Tokens</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* 2. Token Statistics & Distribution Chart */}
          <TokenStats
            total={summaryMetrics.total}
            unused={summaryMetrics.unused}
            verified={summaryMetrics.verified}
            claimed={summaryMetrics.claimed}
            blocked={summaryMetrics.blocked}
          />

          {/* 3. Search, Filter, Sort Toolbar */}
          <TokenToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedPrize={selectedPrize}
            onPrizeChange={setSelectedPrize}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
            onResetFilters={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedPrize('ALL');
              setSelectedDate('ALL');
            }}
          />

          {/* 4. Token Data Table / Mobile Cards / Empty State */}
          {filteredTokens.length === 0 ? (
            <EmptyState onGenerateClick={() => setIsGenerateModalOpen(true)} />
          ) : (
            <TokenTable
              tokens={filteredTokens}
              selectedTokenIds={selectedTokenIds}
              onSelectToken={handleSelectToken}
              onSelectAll={handleSelectAll}
              onViewDetails={setSelectedToken}
              onToggleBlock={handleToggleBlock}
            />
          )}

          {/* 5. Floating Bulk Action Bar */}
          <BulkActionBar
            selectedCount={selectedTokenIds.length}
            onClearSelection={() => setSelectedTokenIds([])}
            onBulkBlock={handleBulkBlock}
            onBulkDelete={handleBulkDelete}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />

          {/* 6. Side-Panel Token Specification Drawer */}
          <AnimatePresence>
            {selectedToken && (
              <TokenDetailsPanel
                token={selectedToken}
                onClose={() => setSelectedToken(null)}
              />
            )}
          </AnimatePresence>

          {/* 7. Batch Token Generation Modal */}
          <GenerateTokenModal
            isOpen={isGenerateModalOpen}
            onClose={() => setIsGenerateModalOpen(false)}
            onGenerate={handleGenerateBatch}
          />
        </>
      )}

    </div>
  );
};

export default TokensPage;
