import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Ticket, RefreshCw, Printer } from 'lucide-react';
import TokenStats from '../components/tokens/TokenStats';
import TokenToolbar from '../components/tokens/TokenToolbar';
import TokenTable, { TokenItem } from '../components/tokens/TokenTable';
import TokenDetailsPanel from '../components/tokens/TokenDetailsPanel';
import GenerateTokenModal from '../components/tokens/GenerateTokenModal';
import BulkActionBar from '../components/tokens/BulkActionBar';
import EmptyState from '../components/tokens/EmptyState';
import LoadingSkeleton from '../components/tokens/LoadingSkeleton';
import { TokenStatus } from '../components/tokens/StatusBadge';
import { TokensService } from '../../services/tokensService';

export const TokensPage: React.FC = () => {
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPrize, setSelectedPrize] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('CREATED_DESC');

  // Load tokens from Firestore
  const loadTokens = async () => {
    setIsLoading(true);
    const records = await TokensService.getAllTokens();
    const mappedItems: TokenItem[] = records.map(r => ({
      id: r.tokenId || r.id || 'token',
      tokenCode: r.tokenCode || r.tokenId,
      status: (r.status === 'AVAILABLE' ? 'UNUSED' : r.status) as TokenStatus,
      createdDate: r.createdDate || 'Today',
      verifiedDate: r.verifiedDate,
      prizeTitle: r.assignedPrizeName || r.prizeTitle || 'Unassigned (Reveals on Unlock)',
      claimId: r.claimId,
      claimStatus: r.claimStatus === 'PENDING' ? 'PENDING' : r.claimStatus === 'CLAIMED' ? 'FULFILLED' : undefined,
      claimedDate: r.claimedDate
    }));
    setTokens(mappedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTokens();
  }, []);

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
      if (searchTerm.trim()) {
        const queryStr = searchTerm.trim().toUpperCase();
        const matchesCode = item.tokenCode.toUpperCase().includes(queryStr);
        const matchesStatus = item.status.toUpperCase().includes(queryStr);
        const matchesPrize = item.prizeTitle?.toUpperCase().includes(queryStr) || false;
        const matchesClaim = item.claimId?.toUpperCase().includes(queryStr) || false;
        if (!matchesCode && !matchesStatus && !matchesPrize && !matchesClaim) return false;
      }

      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'TOKEN_ASC') return a.tokenCode.localeCompare(b.tokenCode);
      if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
      return b.id.localeCompare(a.id);
    });
  }, [tokens, searchTerm, selectedStatus, sortBy]);

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

  // Block / Unblock single token in Firestore
  const handleToggleBlock = async (token: TokenItem) => {
    await TokensService.toggleBlockStatus(token.tokenCode, token.status);
    await loadTokens();
  };

  // Bulk Block selected tokens in Firestore
  const handleBulkBlock = async () => {
    if (selectedTokenIds.length === 0) return;
    try {
      setIsLoading(true);
      const selectedCodes = tokens
        .filter((t) => selectedTokenIds.includes(t.id))
        .map((t) => t.tokenCode);
      await TokensService.bulkBlockTokens(selectedCodes, true);
      setSelectedTokenIds([]);
      await loadTokens();
    } catch (err) {
      console.error('Failed to bulk block tokens in Firestore:', err);
      alert('Failed to block selected tokens. Please check Firestore permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk Delete selected tokens from Firestore
  const handleBulkDelete = async () => {
    if (selectedTokenIds.length === 0) return;
    try {
      setIsLoading(true);
      const selectedCodes = tokens
        .filter((t) => selectedTokenIds.includes(t.id))
        .map((t) => t.tokenCode);
      await TokensService.bulkDeleteTokens(selectedCodes);
      setSelectedTokenIds([]);
      await loadTokens();
    } catch (err) {
      console.error('Failed to bulk delete tokens from Firestore:', err);
      alert('Failed to delete selected tokens. Please check Firestore permissions.');
    } finally {
      setIsLoading(false);
    }
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
    a.download = `AKM-Blind-Tokens-Export-${Date.now()}.csv`;
    a.click();
  };

  // Print Token Sheet for physical counter distribution
  const handlePrintTokens = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AKM Lucky Draw - Printable Token Sheet</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #000; }
            h2 { text-align: center; margin-bottom: 5px; }
            p { text-align: center; font-size: 12px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
            .token-card { border: 1px dashed #000; padding: 10px; text-align: center; border-radius: 6px; }
            .code { font-size: 16px; font-weight: bold; }
            .sub { font-size: 9px; color: #555; margin-top: 4px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 15px; text-align: right;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 4px;">Print Tokens Sheet</button>
          </div>
          <h2>ANU KRISHNA MALL - LUCKY DRAW TOKENS</h2>
          <p>Generated: ${new Date().toLocaleDateString()} | Total Tokens: ${filteredTokens.length}</p>
          <div class="grid">
            ${filteredTokens.map(t => `
              <div class="token-card">
                <div class="code">${t.tokenCode}</div>
                <div class="sub">AKM Official Receipt Token</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Title Banner & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Ticket className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Time-Slot Token Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Token Management
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Generate, search, filter, and print blind time-slot tokens for AKM Lucky Draw. Secret prize maps remain 100% hidden until customer reveal.
          </p>
        </div>

        {/* Primary CTA: + Generate Tokens & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintTokens}
            className="px-4 py-3 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] font-bold text-xs flex items-center gap-2 hover:bg-[#0D021A] transition-colors cursor-pointer"
            title="Print Token Sheet for Counters"
          >
            <Printer className="w-4 h-4 text-[#FFD700]" />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>

          <button
            onClick={loadTokens}
            className="p-3 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#0D021A] transition-colors"
            title="Refresh Tokens"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#0D021A]" />
            <span>+ Generate Slot Tokens</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* 2. Token Statistics */}
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
            onExportPDF={handlePrintTokens}
            onResetFilters={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
              setSelectedPrize('ALL');
              setSelectedDate('ALL');
            }}
          />

          {/* 4. Token Data Table */}
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

          {/* 5. Bulk Action Bar */}
          <BulkActionBar
            selectedCount={selectedTokenIds.length}
            onClearSelection={() => setSelectedTokenIds([])}
            onBulkBlock={handleBulkBlock}
            onBulkDelete={handleBulkDelete}
            onExportCSV={handleExportCSV}
            onExportPDF={handlePrintTokens}
          />

          {/* 6. Token Details Panel */}
          <AnimatePresence>
            {selectedToken && (
              <TokenDetailsPanel
                token={selectedToken}
                onClose={() => setSelectedToken(null)}
              />
            )}
          </AnimatePresence>

          {/* 7. Generate Token Modal */}
          <GenerateTokenModal
            isOpen={isGenerateModalOpen}
            onClose={() => setIsGenerateModalOpen(false)}
            onSuccess={loadTokens}
          />
        </>
      )}

    </div>
  );
};

export default TokensPage;
