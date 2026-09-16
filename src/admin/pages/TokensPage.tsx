import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Ticket, RefreshCw, Printer, FlaskConical, Trash2 } from 'lucide-react';
import TokenStats from '../components/tokens/TokenStats';
import TokenToolbar from '../components/tokens/TokenToolbar';
import TokenTable, { TokenItem } from '../components/tokens/TokenTable';
import TokenDetailsPanel from '../components/tokens/TokenDetailsPanel';
import GenerateTokenModal from '../components/tokens/GenerateTokenModal';
import GenerateTestTokenModal from '../components/tokens/GenerateTestTokenModal';
import ClearTestDataModal from '../components/tokens/ClearTestDataModal';
import BulkActionBar from '../components/tokens/BulkActionBar';
import EmptyState from '../components/tokens/EmptyState';
import LoadingSkeleton from '../components/tokens/LoadingSkeleton';
import { TokenStatus } from '../components/tokens/StatusBadge';
import { TokensService } from '../../services/tokensService';

export const TokensPage: React.FC = () => {
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isClearTestModalOpen, setIsClearTestModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [dataScope, setDataScope] = useState<'ALL' | 'PRODUCTION' | 'TEST'>('ALL');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPrize, setSelectedPrize] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('CREATED_DESC');

  const mapProdToken = (r: any): TokenItem => ({
    id: r.tokenId || r.id || 'token',
    tokenCode: r.tokenCode || r.tokenId,
    status: (r.status === 'AVAILABLE' ? 'UNUSED' : r.status) as TokenStatus,
    createdDate: r.createdDate || 'Today',
    verifiedDate: r.verifiedDate,
    prizeTitle: r.assignedPrizeName || r.prizeTitle || 'Unassigned (Reveals on Unlock)',
    claimId: r.claimId,
    claimStatus: r.claimStatus === 'PENDING' ? 'PENDING' : r.claimStatus === 'CLAIMED' ? 'FULFILLED' : undefined,
    claimedDate: r.claimedDate,
    isTest: false
  });

  const mapTestToken = (r: any): TokenItem => ({
    id: r.tokenId || r.id || 'test-token',
    tokenCode: r.tokenCode || r.tokenId,
    status: (r.status === 'AVAILABLE' ? 'UNUSED' : r.status === 'REDEEMED' ? 'CLAIMED' : r.status) as TokenStatus,
    createdDate: r.createdDate || 'Today',
    verifiedDate: r.verifiedDate,
    prizeTitle: r.prizeTitle || 'Demo Prize (Reveals on Unlock)',
    claimId: r.claimId,
    claimStatus: r.claimStatus === 'PENDING' ? 'PENDING' : r.claimStatus === 'CLAIMED' ? 'FULFILLED' : undefined,
    claimedDate: r.claimedDate,
    isTest: true
  });

  const loadTokens = async () => {
    try {
      setIsLoading(true);
      const [prodRecords, testRecords] = await Promise.all([
        TokensService.getAllTokens(),
        TokensService.getTestTokens()
      ]);
      setTokens([...prodRecords.map(mapProdToken), ...testRecords.map(mapTestToken)]);
    } catch (err) {
      console.warn('loadTokens error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-Time Firestore onSnapshot Subscription for Tokens (Both production and test)
  useEffect(() => {
    setIsLoading(true);
    let prodList: TokenItem[] = [];
    let testList: TokenItem[] = [];

    const updateCombined = () => {
      setTokens([...prodList, ...testList]);
      setIsLoading(false);
    };

    const unsubscribeProd = TokensService.subscribeToTokens((prodRecords) => {
      prodList = prodRecords.map(r => ({
        id: r.tokenId || r.id || 'token',
        tokenCode: r.tokenCode || r.tokenId,
        status: (r.status === 'AVAILABLE' ? 'UNUSED' : r.status) as TokenStatus,
        createdDate: r.createdDate || 'Today',
        verifiedDate: r.verifiedDate,
        prizeTitle: r.assignedPrizeName || r.prizeTitle || 'Unassigned (Reveals on Unlock)',
        claimId: r.claimId,
        claimStatus: r.claimStatus === 'PENDING' ? 'PENDING' : r.claimStatus === 'CLAIMED' ? 'FULFILLED' : undefined,
        claimedDate: r.claimedDate,
        isTest: false
      }));
      updateCombined();
    }, (err) => {
      console.warn('TokensPage prod subscription warning:', err);
      setIsLoading(false);
    });

    const unsubscribeTest = TokensService.subscribeToTestTokens((testRecords) => {
      testList = testRecords.map(r => ({
        id: r.tokenId || r.id || 'test-token',
        tokenCode: r.tokenCode || r.tokenId,
        status: (r.status === 'AVAILABLE' ? 'UNUSED' : r.status === 'REDEEMED' ? 'CLAIMED' : r.status) as TokenStatus,
        createdDate: r.createdDate || 'Today',
        verifiedDate: r.verifiedDate,
        prizeTitle: r.prizeTitle || 'Demo Prize (Reveals on Unlock)',
        claimId: r.claimId,
        claimStatus: r.claimStatus === 'PENDING' ? 'PENDING' : r.claimStatus === 'CLAIMED' ? 'FULFILLED' : undefined,
        claimedDate: r.claimedDate,
        isTest: true
      }));
      updateCombined();
    }, (err) => {
      console.warn('TokensPage test subscription warning:', err);
      setIsLoading(false);
    });

    return () => {
      unsubscribeProd();
      unsubscribeTest();
    };
  }, []);

  // Summary Metrics calculation (Filtered by selected Data Scope)
  const summaryMetrics = useMemo(() => {
    const scopeTokens = tokens.filter((item) => {
      if (dataScope === 'PRODUCTION') return !item.isTest;
      if (dataScope === 'TEST') return item.isTest;
      return true;
    });

    const total = scopeTokens.length;
    const unused = scopeTokens.filter((t) => t.status === 'UNUSED').length;
    const verified = scopeTokens.filter((t) => t.status === 'VERIFIED').length;
    const claimed = scopeTokens.filter((t) => t.status === 'CLAIMED').length;
    const blocked = scopeTokens.filter((t) => t.status === 'BLOCKED').length;

    return { total, unused, verified, claimed, blocked };
  }, [tokens, dataScope]);

  // Filtered & Sorted Tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((item) => {
      // Data Scope filter (ALL / PRODUCTION / TEST)
      if (dataScope === 'PRODUCTION' && item.isTest) return false;
      if (dataScope === 'TEST' && !item.isTest) return false;

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
  }, [tokens, searchTerm, selectedStatus, sortBy, dataScope]);

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

    // Use full production tokens list, strictly excluding test tokens
    const tokensToPrint = (searchTerm.trim() || selectedStatus !== 'ALL')
      ? filteredTokens.filter((t) => !t.isTest)
      : tokens.filter((t) => !t.isTest);

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
            .token-card { border: 1px dashed #000; padding: 10px; text-align: center; border-radius: 6px; page-break-inside: avoid; }
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
          <p>Generated: ${new Date().toLocaleDateString()} | Total Tokens: ${tokensToPrint.length}</p>
          <div class="grid">
            ${tokensToPrint.map(t => `
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

        {/* Primary Actions: Print, Refresh, Demo Mode, Clear Test Data, Generate Slot Tokens */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Dedicated Demo / Test Mode Button */}
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-fuchsia-950/80 border border-fuchsia-500/50 text-fuchsia-300 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-fuchsia-900/60 hover:border-fuchsia-400 hover:shadow-[0_0_20px_rgba(217,70,239,0.35)] transition-all cursor-pointer shrink-0"
          >
            <FlaskConical className="w-4 h-4 text-fuchsia-400" />
            <span>🧪 Demo / Test Mode</span>
          </button>

          {/* Clear Test Data Button (shown if test tokens exist) */}
          {tokens.some((t) => t.isTest) && (
            <button
              onClick={() => setIsClearTestModalOpen(true)}
              className="px-3.5 py-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-900/50 transition-colors cursor-pointer shrink-0"
              title="Delete all demo test tokens and test winners"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Test Data</span>
            </button>
          )}

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#0D021A]" />
            <span>+ Generate Slot Tokens</span>
          </button>
        </div>
      </div>

      {/* Scope Filter Tabs: ALL / PRODUCTION / TEST */}
      <div className="flex items-center gap-2 bg-[#1D0636]/60 p-1.5 rounded-2xl border border-[#FFD700]/20 w-fit">
        <button
          onClick={() => setDataScope('ALL')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dataScope === 'ALL'
              ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#0D021A] shadow-gold-glow'
              : 'text-[#A0A0A0] hover:text-white'
          }`}
        >
          All Tokens ({tokens.length})
        </button>
        <button
          onClick={() => setDataScope('PRODUCTION')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            dataScope === 'PRODUCTION'
              ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#0D021A] shadow-gold-glow'
              : 'text-[#A0A0A0] hover:text-white'
          }`}
        >
          Production ({tokens.filter((t) => !t.isTest).length})
        </button>
        <button
          onClick={() => setDataScope('TEST')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            dataScope === 'TEST'
              ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
              : 'text-fuchsia-400/80 hover:text-fuchsia-300'
          }`}
        >
          <span>🧪 Test Mode</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#0D021A] text-[10px]">
            {tokens.filter((t) => t.isTest).length}
          </span>
        </button>
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

          {/* 8. Demo Test Token Modal */}
          <GenerateTestTokenModal
            isOpen={isTestModalOpen}
            onClose={() => setIsTestModalOpen(false)}
            onSuccess={loadTokens}
          />

          {/* 9. Clear Test Data Modal */}
          <ClearTestDataModal
            isOpen={isClearTestModalOpen}
            onClose={() => setIsClearTestModalOpen(false)}
            onSuccess={loadTokens}
          />
        </>
      )}

    </div>
  );
};

export default TokensPage;
