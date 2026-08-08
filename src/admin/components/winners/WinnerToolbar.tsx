import React from 'react';
import { Search, Download, FileText } from 'lucide-react';

interface WinnerToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedDate: string;
  onDateChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export const WinnerToolbar: React.FC<WinnerToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
  sortBy,
  onSortChange,
  onExportCSV,
  onExportPDF
}) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-2xl p-4 space-y-4 shadow-glass select-none text-left font-sans">
      
      {/* Top Search & Primary Export Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Winner ID, Token Code, Claim ID, Prize..."
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

        {/* Export Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] font-bold text-xs flex items-center gap-1.5 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onExportPDF}
            className="px-3.5 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Export PDF</span>
          </button>
        </div>

      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#FFD700]/15">
        
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Claim Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">🟡 Pending</option>
            <option value="CLAIMED">🟢 Claimed</option>
            <option value="REJECTED">🔴 Rejected</option>
            <option value="CANCELLED">⚪ Cancelled</option>
          </select>
        </div>

        {/* Prize Category Filter */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Prize Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Categories</option>
            <option value="Grand Prize">Grand Prize</option>
            <option value="Premium Prize">Premium Prize</option>
            <option value="Regular Gift">Regular Gift</option>
            <option value="Gift Voucher">Gift Voucher</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Date Filter
          </label>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
          </select>
        </div>

        {/* Sorting Selector */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="NEWEST">Newest Winner</option>
            <option value="OLDEST">Oldest Winner</option>
            <option value="PRIZE">Prize Title (A-Z)</option>
            <option value="STATUS">Claim Status</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default WinnerToolbar;
