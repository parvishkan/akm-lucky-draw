import React from 'react';
import { Search, Filter, Star, Sparkles, AlertTriangle } from 'lucide-react';

interface PrizeToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (val: string) => void;
  selectedCategoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  showHighValueOnly: boolean;
  onToggleHighValueOnly: () => void;
  showLowStockOnly: boolean;
  onToggleLowStockOnly: () => void;
  sortBy: string;
  onSortChange: (val: string) => void;
}

export const PrizeToolbar: React.FC<PrizeToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatusFilter,
  onStatusFilterChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
  showHighValueOnly,
  onToggleHighValueOnly,
  showLowStockOnly,
  onToggleLowStockOnly,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-2xl p-4 space-y-4 shadow-glass select-none text-left font-sans">
      
      {/* Search Input & High-Value / Low-Stock Toggles */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Prize Name, Category, Status..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D021A] border border-[#FFD700]/30 rounded-xl text-xs text-white placeholder-[#A0A0A0]/60 focus:outline-none focus:border-[#FFD700] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#A0A0A0] hover:text-white font-mono"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHighValueOnly}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showHighValueOnly
                ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700] shadow-gold-glow'
                : 'border-[#FFD700]/20 bg-[#0D021A] text-[#A0A0A0] hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showHighValueOnly ? 'fill-[#FFD700] text-[#FFD700]' : ''}`} />
            <span>High Value Only</span>
          </button>

          <button
            onClick={onToggleLowStockOnly}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showLowStockOnly
                ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md'
                : 'border-[#FFD700]/20 bg-[#0D021A] text-[#A0A0A0] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Low Stock</span>
          </button>
        </div>

      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#FFD700]/15">
        
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Status Filter
          </label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">🟢 Active</option>
            <option value="INACTIVE">⚪ Inactive</option>
            <option value="OUT_OF_STOCK">🔴 Out of Stock</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Category Filter
          </label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Categories</option>
            <option value="Grand Prize">Grand Prize</option>
            <option value="Premium Prize">Premium Prize</option>
            <option value="Regular Gift">Regular Gift</option>
            <option value="Gift Voucher">Gift Voucher</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sort By Selector */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Sort By Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="PRIORITY">Priority / Display Order</option>
            <option value="NAME_ASC">Name (A-Z)</option>
            <option value="QUANTITY_DESC">Total Quantity (High to Low)</option>
            <option value="REMAINING_DESC">Remaining Stock (High to Low)</option>
            <option value="DISTRIBUTED_DESC">Distributed (High to Low)</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default PrizeToolbar;
