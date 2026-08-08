import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, PlusCircle, Sparkles } from 'lucide-react';
import PrizeStats from '../components/prizes/PrizeStats';
import PrizeToolbar from '../components/prizes/PrizeToolbar';
import PrizeGrid from '../components/prizes/PrizeGrid';
import { PrizeItem } from '../components/prizes/PrizeCard';
import PrizeForm from '../components/prizes/PrizeForm';
import PrizeDetailsPanel from '../components/prizes/PrizeDetailsPanel';
import DeleteConfirmationModal from '../components/prizes/DeleteConfirmationModal';
import EmptyState from '../components/prizes/EmptyState';
import LoadingSkeleton from '../components/prizes/LoadingSkeleton';

// Initial realistic placeholder prizes dataset
const initialMockPrizes: PrizeItem[] = [
  {
    id: 'prize-1',
    name: 'Grand Gold Coin (24K 1 Gram)',
    category: 'Grand Prize',
    image: '/akm-logo.png',
    totalQuantity: 20,
    distributedQuantity: 8,
    remainingQuantity: 12,
    value: '₹8,500',
    description: 'Exclusive 24K Pure Gold Diwali Coin redeemable at Anu Krishna Mall Jewelry Section.',
    priority: 1,
    status: 'ACTIVE',
    isHighValue: true,
    displayOrder: 1
  },
  {
    id: 'prize-2',
    name: 'Diamond Jewelry Voucher',
    category: 'Premium Prize',
    image: '/akm-logo.png',
    totalQuantity: 15,
    distributedQuantity: 3,
    remainingQuantity: 12,
    value: '₹10,000',
    description: 'Premium voucher valid on fine diamond & gold ornaments at Anu Krishna Mall.',
    priority: 2,
    status: 'ACTIVE',
    isHighValue: true,
    displayOrder: 2
  },
  {
    id: 'prize-3',
    name: 'Designer Silk Saree / Suit Gift',
    category: 'Regular Gift',
    image: '/akm-logo.png',
    totalQuantity: 50,
    distributedQuantity: 18,
    remainingQuantity: 32,
    value: '₹5,000',
    description: 'Exclusive luxury traditional ethnic attire voucher at AKM Fashion Pavilion.',
    priority: 3,
    status: 'ACTIVE',
    isHighValue: false,
    displayOrder: 3
  },
  {
    id: 'prize-4',
    name: 'Smart Home Appliance Gift Box',
    category: 'Regular Gift',
    image: '/akm-logo.png',
    totalQuantity: 30,
    distributedQuantity: 27,
    remainingQuantity: 3,
    value: '₹3,500',
    description: 'Complimentary premium home appliance voucher redeemable at AKM Digital Hub.',
    priority: 4,
    status: 'ACTIVE',
    isHighValue: false,
    displayOrder: 4
  },
  {
    id: 'prize-5',
    name: 'Diwali Shopping Cash Voucher',
    category: 'Gift Voucher',
    image: '/akm-logo.png',
    totalQuantity: 200,
    distributedQuantity: 72,
    remainingQuantity: 128,
    value: '₹1,500',
    description: 'Instant shopping cash voucher applicable across all Anu Krishna Mall partner stores.',
    priority: 5,
    status: 'ACTIVE',
    isHighValue: false,
    displayOrder: 5
  },
  {
    id: 'prize-6',
    name: 'Commemorative Brass Peacock Diya',
    category: 'Merchandise',
    image: '/akm-logo.png',
    totalQuantity: 150,
    distributedQuantity: 150,
    remainingQuantity: 0,
    value: '₹1,200',
    description: 'Traditional handcrafted brass peacock oil lamp souvenir.',
    priority: 6,
    status: 'OUT_OF_STOCK',
    isHighValue: false,
    displayOrder: 6
  }
];

export const PrizesPage: React.FC = () => {
  const [prizes, setPrizes] = useState<PrizeItem[]>(initialMockPrizes);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal & Panel Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [prizeToEdit, setPrizeToEdit] = useState<PrizeItem | null>(null);
  const [selectedPrizeDetails, setSelectedPrizeDetails] = useState<PrizeItem | null>(null);
  const [prizeToDelete, setPrizeToDelete] = useState<PrizeItem | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [showHighValueOnly, setShowHighValueOnly] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('PRIORITY');

  // Inventory Summary Metrics calculation
  const stats = useMemo(() => {
    const totalTypes = prizes.length;
    const totalGifts = prizes.reduce((acc, p) => acc + p.totalQuantity, 0);
    const distributed = prizes.reduce((acc, p) => acc + p.distributedQuantity, 0);
    const remaining = prizes.reduce((acc, p) => acc + p.remainingQuantity, 0);
    const lowStockCount = prizes.filter((p) => p.remainingQuantity > 0 && p.remainingQuantity <= 5).length;

    return { totalTypes, totalGifts, distributed, remaining, lowStockCount };
  }, [prizes]);

  // Filtered & Sorted Prizes Grid
  const filteredPrizes = useMemo(() => {
    return prizes.filter((item) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toUpperCase();
        const matchesName = item.name.toUpperCase().includes(query);
        const matchesCategory = item.category.toUpperCase().includes(query);
        const matchesStatus = item.status.toUpperCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesStatus) return false;
      }

      // 2. Status Filter
      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) return false;

      // 3. Category Filter
      if (selectedCategoryFilter !== 'ALL' && item.category !== selectedCategoryFilter) return false;

      // 4. High Value Only Toggle
      if (showHighValueOnly && !item.isHighValue) return false;

      // 5. Low Stock Only Toggle
      if (showLowStockOnly && !(item.remainingQuantity > 0 && item.remainingQuantity <= 5)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'QUANTITY_DESC') return b.totalQuantity - a.totalQuantity;
      if (sortBy === 'REMAINING_DESC') return b.remainingQuantity - a.remainingQuantity;
      if (sortBy === 'DISTRIBUTED_DESC') return b.distributedQuantity - a.distributedQuantity;
      return a.priority - b.priority; // Default PRIORITY
    });
  }, [prizes, searchTerm, selectedStatusFilter, selectedCategoryFilter, showHighValueOnly, showLowStockOnly, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setPrizeToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prize: PrizeItem) => {
    setPrizeToEdit(prize);
    setIsFormOpen(true);
  };

  const handleSavePrize = (data: Partial<PrizeItem>) => {
    if (data.id) {
      // Edit existing prize
      setPrizes((prev) =>
        prev.map((p) => {
          if (p.id === data.id) {
            const newTotal = data.totalQuantity || p.totalQuantity;
            const newRemaining = Math.max(0, newTotal - p.distributedQuantity);
            const newStatus = newRemaining === 0 ? 'OUT_OF_STOCK' : (data.status || p.status);
            return {
              ...p,
              ...data,
              totalQuantity: newTotal,
              remainingQuantity: newRemaining,
              status: newStatus
            } as PrizeItem;
          }
          return p;
        })
      );
    } else {
      // Add new prize
      const newTotal = data.totalQuantity || 10;
      const newPrize: PrizeItem = {
        id: `prize-${Date.now()}`,
        name: data.name || 'New Diwali Gift',
        category: data.category || 'Regular Gift',
        image: data.image || '/akm-logo.png',
        totalQuantity: newTotal,
        distributedQuantity: 0,
        remainingQuantity: newTotal,
        value: data.value || '₹1,000',
        description: data.description || '',
        priority: prizes.length + 1,
        status: data.status || 'ACTIVE',
        isHighValue: data.isHighValue || false,
        displayOrder: prizes.length + 1
      };
      setPrizes((prev) => [newPrize, ...prev]);
    }
  };

  const handleConfirmDelete = (prize: PrizeItem) => {
    setPrizes((prev) => prev.filter((p) => p.id !== prize.id));
    setPrizeToDelete(null);
  };

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header Banner & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Campaign Gift Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Prize Management
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Manage all Lucky Draw gifts, quantities, high-value rewards, and allocation statuses.
          </p>
        </div>

        {/* Primary CTA: + Add Prize */}
        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#0D021A]" />
          <span>+ Add Prize</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* 2. Summary Metric Cards */}
          <PrizeStats
            totalTypes={stats.totalTypes}
            totalGifts={stats.totalGifts}
            distributed={stats.distributed}
            remaining={stats.remaining}
            lowStockCount={stats.lowStockCount}
          />

          {/* 3. Search, Filter, Sort Toolbar */}
          <PrizeToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatusFilter={selectedStatusFilter}
            onStatusFilterChange={setSelectedStatusFilter}
            selectedCategoryFilter={selectedCategoryFilter}
            onCategoryFilterChange={setSelectedCategoryFilter}
            showHighValueOnly={showHighValueOnly}
            onToggleHighValueOnly={() => setShowHighValueOnly(!showHighValueOnly)}
            showLowStockOnly={showLowStockOnly}
            onToggleLowStockOnly={() => setShowLowStockOnly(!showLowStockOnly)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* 4. Prize Responsive Grid View / Empty State */}
          {filteredPrizes.length === 0 ? (
            <EmptyState onAddClick={handleOpenAdd} />
          ) : (
            <PrizeGrid
              prizes={filteredPrizes}
              onEdit={handleOpenEdit}
              onViewDetails={setSelectedPrizeDetails}
              onDelete={setPrizeToDelete}
            />
          )}

          {/* 5. Add / Edit Prize Form Modal */}
          <PrizeForm
            isOpen={isFormOpen}
            prizeToEdit={prizeToEdit}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSavePrize}
          />

          {/* 6. Side-Panel Prize Details Specification Drawer */}
          <AnimatePresence>
            {selectedPrizeDetails && (
              <PrizeDetailsPanel
                prize={selectedPrizeDetails}
                onClose={() => setSelectedPrizeDetails(null)}
              />
            )}
          </AnimatePresence>

          {/* 7. Delete Confirmation Modal */}
          <DeleteConfirmationModal
            prize={prizeToDelete}
            onClose={() => setPrizeToDelete(null)}
            onConfirmDelete={handleConfirmDelete}
          />
        </>
      )}

    </div>
  );
};

export default PrizesPage;
