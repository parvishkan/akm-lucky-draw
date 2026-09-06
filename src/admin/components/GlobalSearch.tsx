import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Ticket, Trophy, Gift, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import { TokensService } from '../../services/tokensService';
import { PrizesService } from '../../services/prizesService';
import { ClaimsService } from '../../services/claimsService';
import { db, collections } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

export type AdminTab = 'DASHBOARD' | 'QR_MANAGEMENT' | 'TOKENS' | 'PRIZES' | 'WINNERS' | 'CLAIMS' | 'ANALYTICS' | 'SETTINGS';

interface SearchResultItem {
  id: string;
  type: 'TOKEN' | 'PRIZE' | 'WINNER' | 'CLAIM';
  title: string;
  subtitle: string;
  badge?: string;
  tab: AdminTab;
}

interface GlobalSearchProps {
  onNavigate: (tab: AdminTab) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Perform search
  useEffect(() => {
    const clean = query.trim();
    if (clean.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const lower = clean.toLowerCase();
        const found: SearchResultItem[] = [];

        // 1. Search Prizes
        try {
          const prizes = await PrizesService.getActivePrizes();
          for (const p of prizes) {
            const nameMatch = (p.name || p.title || '').toLowerCase().includes(lower);
            const codeMatch = (p.code || '').toLowerCase().includes(lower);
            const catMatch = (p.category || '').toLowerCase().includes(lower);
            if (nameMatch || codeMatch || catMatch) {
              found.push({
                id: p.id,
                type: 'PRIZE',
                title: p.name || p.title || 'Diwali Gift',
                subtitle: `${p.code} • Stock: ${p.availableQuantity ?? p.totalQuantity} • ${p.value || ''}`,
                badge: p.category || 'Prize',
                tab: 'PRIZES'
              });
            }
          }
        } catch (e) {
          // ignore error
        }

        // 2. Search Tokens
        try {
          const tokens = await TokensService.getAllTokens();
          for (const t of tokens) {
            const codeMatch = (t.tokenCode || '').toLowerCase().includes(lower);
            const prizeMatch = (t.prizeTitle || t.assignedPrizeName || '').toLowerCase().includes(lower);
            const claimMatch = (t.claimId || '').toLowerCase().includes(lower);
            if (codeMatch || prizeMatch || claimMatch) {
              found.push({
                id: t.tokenCode,
                type: 'TOKEN',
                title: t.tokenCode,
                subtitle: `Status: ${t.status} • Prize: ${t.prizeTitle || 'Unassigned'}`,
                badge: t.status,
                tab: 'TOKENS'
              });
            }
          }
        } catch (e) {
          // ignore error
        }

        // 3. Search Claims
        try {
          const claims = await ClaimsService.getAllClaims();
          for (const c of claims) {
            const idMatch = (c.claimId || '').toLowerCase().includes(lower);
            const tokenMatch = (c.tokenCode || '').toLowerCase().includes(lower);
            const prizeMatch = (c.prizeName || '').toLowerCase().includes(lower);
            if (idMatch || tokenMatch || prizeMatch) {
              found.push({
                id: c.claimId,
                type: 'CLAIM',
                title: c.claimId,
                subtitle: `${c.prizeName} • Token: ${c.tokenCode}`,
                badge: c.claimStatus,
                tab: 'CLAIMS'
              });
            }
          }
        } catch (e) {
          // ignore error
        }

        // 4. Search Winners
        try {
          const snap = await getDocs(collection(db, collections.WINNERS));
          snap.forEach((d) => {
            const data = d.data();
            const tokenCode = data.tokenCode || data.tokenId || '';
            const prizeName = data.prizeName || '';
            const claimId = data.claimId || '';
            if (
              tokenCode.toLowerCase().includes(lower) ||
              prizeName.toLowerCase().includes(lower) ||
              claimId.toLowerCase().includes(lower)
            ) {
              found.push({
                id: d.id,
                type: 'WINNER',
                title: `Winner: ${tokenCode}`,
                subtitle: `${prizeName} • Claim ID: ${claimId || 'Pending'}`,
                badge: data.claimStatus || 'WINNER',
                tab: 'WINNERS'
              });
            }
          });
        } catch (e) {
          // ignore error
        }

        // Deduplicate & limit results to 10
        const seen = new Set<string>();
        const unique = found.filter(item => {
          const key = `${item.type}-${item.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 10);

        setResults(unique);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (item: SearchResultItem) => {
    onNavigate(item.tab);
    setIsOpen(false);
    setQuery('');
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'TOKEN':
        return <Ticket className="w-3.5 h-3.5 text-amber-400" />;
      case 'PRIZE':
        return <Gift className="w-3.5 h-3.5 text-purple-400" />;
      case 'WINNER':
        return <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />;
      case 'CLAIM':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Search tokens, winners, claims, prizes..."
          className="w-full pl-9 pr-8 py-2 bg-[#0D021A] border border-[#FFD700]/20 rounded-xl text-xs text-[#FFFFFF] placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700] transition-colors"
        />

        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-[#FFD700] animate-spin absolute right-3" />
        ) : query ? (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="p-1 text-[#A0A0A0] hover:text-white absolute right-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-0 right-0 top-full mt-2 bg-[#1D0636] border border-[#FFD700]/30 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 text-left text-xs"
          >
            <div className="p-2 border-b border-[#FFD700]/15 flex items-center justify-between text-[10px] text-[#A0A0A0] font-mono">
              <span>{isLoading ? 'Searching...' : `${results.length} results found`}</span>
              <span className="text-[#D4AF37]">ESC to close</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#FFD700]/10">
              {results.length === 0 && !isLoading ? (
                <div className="p-6 text-center text-[#A0A0A0]">
                  <p className="text-xs">No tokens, winners, or prizes found for &quot;{query}&quot;</p>
                  <p className="text-[10px] text-[#A0A0A0]/60 mt-1">Try searching by token code (e.g. AKM-), prize name, or claim ID.</p>
                </div>
              ) : (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="w-full p-3 hover:bg-[#0D021A] transition-colors flex items-center justify-between gap-3 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#0D021A] border border-[#FFD700]/20 flex items-center justify-center shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate text-xs group-hover:text-[#FFD700] transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#0D021A] border border-[#FFD700]/20 text-[#D4AF37]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#A0A0A0] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#A0A0A0] group-hover:text-[#FFD700] shrink-0">
                      <span>Jump</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
