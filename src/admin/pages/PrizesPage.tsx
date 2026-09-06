import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, PlusCircle, RefreshCw } from 'lucide-react';
import PrizeStats from '../components/prizes/PrizeStats';
import PrizeToolbar from '../components/prizes/PrizeToolbar';
import PrizeGrid from '../components/prizes/PrizeGrid';
import { PrizeItem } from '../components/prizes/PrizeCard';
import PrizeForm from '../components/prizes/PrizeForm';
import PrizeDetailsPanel from '../components/prizes/PrizeDetailsPanel';
import DeleteConfirmationModal from '../components/prizes/DeleteConfirmationModal';
import EmptyState from '../components/prizes/EmptyState';
import LoadingSkeleton from '../components/prizes/LoadingSkeleton';
import { PrizesService, PrizeDocument } from '../../services/prizesService';

export const PrizesPage: React.FC = () => {
  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  const loadPrizes = async () => {
    setIsLoading(true);
    const docs = await PrizesService.getActivePrizes();
    const mappedItems: PrizeItem[] = docs.map(d => ({
      id: d.id,
      name: d.name || d.title,
      category: (d.category && ['Grand Prize', 'Premium Prize', 'Regular Gift', 'Gift Voucher', 'Merchandise', 'Other'].includes(d.category) ? d.category : 'Regular Gift') as any,
      image: '/akm-logo.png',
      totalQuantity: d.totalQuantity ?? d.quantity ?? 100,
      distributedQuantity: (d.totalQuantity ?? d.quantity ?? 100) - (d.availableQuantity ?? d.remainingStock ?? 50),
      remainingQuantity: d.availableQuantity ?? d.remainingStock ?? 50,
      value: d.value || '₹5,000',
      description: d.description || '',
      priority: d.priority || 1,
      status: (d.availableQuantity <= 0 ? 'OUT_OF_STOCK' : d.status) as any,
      isHighValue: d.value ? d.value.includes('10,000') || d.value.includes('Gold') || d.value.includes('8,500') : false,
      displayOrder: d.displayOrder || 1
    }));
    setPrizes(mappedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPrizes();
  }, []);

  // Inventory Summary Metrics
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
      if (searchTerm.trim()) {
        const queryStr = searchTerm.trim().toUpperCase();
        const matchesName = item.name.toUpperCase().includes(queryStr);
        const matchesCategory = item.category.toUpperCase().includes(queryStr);
        const matchesStatus = item.status.toUpperCase().includes(queryStr);
        if (!matchesName && !matchesCategory && !matchesStatus) return false;
      }

      if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) return false;
      if (selectedCategoryFilter !== 'ALL' && item.category !== selectedCategoryFilter) return false;
      if (showHighValueOnly && !item.isHighValue) return false;
      if (showLowStockOnly && !(item.remainingQuantity > 0 && item.remainingQuantity <= 5)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'QUANTITY_DESC') return b.totalQuantity - a.totalQuantity;
      if (sortBy === 'REMAINING_DESC') return b.remainingQuantity - a.remainingQuantity;
      return a.priority - b.priority;
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

  const handleSavePrize = async (data: Partial<PrizeItem>) => {
    setIsLoading(true);
    if (data.id) {
      // Update in Firestore
      await PrizesService.updatePrize(data.id, {
        name: data.name,
        title: data.name,
        totalQuantity: data.totalQuantity,
        availableQuantity: data.remainingQuantity ?? data.totalQuantity,
        value: data.value,
        category: data.category,
        description: data.description,
        slotId: data.slotId
      });
    } else {
      // Add in Firestore
      await PrizesService.addPrize({
        name: data.name || 'Diwali Gift',
        title: data.name || 'Diwali Gift',
        code: `PRZ-${Math.floor(100 + Math.random() * 900)}`,
        totalQuantity: data.totalQuantity || 50,
        availableQuantity: data.totalQuantity || 50,
        value: data.value || '₹2,500',
        category: data.category || 'Festive Gift',
        description: data.description || 'Diwali Lucky Draw Prize',
        slotId: data.slotId
      });
    }

    setIsFormOpen(false);
    await loadPrizes();
  };

  const handleConfirmDelete = async (prize: PrizeItem) => {
    try {
      setIsLoading(true);
      await PrizesService.deletePrize(prize.id);
      setPrizes((prev) => prev.filter((p) => p.id !== prize.id));
      setPrizeToDelete(null);
    } catch (err) {
      console.error('Failed to delete prize from Firestore:', err);
      alert('Failed to delete prize from database. Please check Firestore permissions.');
    } finally {
      setIsLoading(false);
    }
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
            Manage all Lucky Draw gifts, quantities, high-value rewards, and allocation statuses in Firestore.
          </p>
        </div>

        {/* Primary CTA: + Add Prize */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadPrizes}
            className="p-3 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#0D021A] transition-colors"
            title="Refresh Prizes"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#0D021A]" />
            <span>+ Add Prize</span>
          </button>
        </div>
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

          {/* 4. Prize Responsive Grid View */}
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
