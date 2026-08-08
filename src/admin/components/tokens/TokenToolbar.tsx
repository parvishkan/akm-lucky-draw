import React from 'react';
import { Search, Filter, Download, ArrowUpDown, RefreshCw, FileText } from 'lucide-react';
import { TokenStatus } from './StatusBadge';

interface TokenToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPrize: string;
  onPrizeChange: (val: string) => void;
  selectedDate: string;
  onDateChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onResetFilters: () => void;
}

export const TokenToolbar: React.FC<TokenToolbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPrize,
  onPrizeChange,
  selectedDate,
  onDateChange,
  sortBy,
  onSortChange,
  onExportCSV,
  onExportPDF,
  onResetFilters
}) => {
  return (
    <div className="bg-[#1D0636]/80 border border-[#FFD700]/25 rounded-2xl p-4 space-y-4 shadow-glass select-none text-left">
      
      {/* Top Search & Primary Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Token, Status, Prize, Claim ID..."
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

        {/* Export Buttons */}
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

      {/* Bottom Filters & Sorting Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#FFD700]/15">
        
        {/* Filter 1: Status */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Filter Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNUSED">Unused</option>
            <option value="VERIFIED">Verified</option>
            <option value="CLAIMED">Claimed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Filter 2: Prize */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Filter Prize
          </label>
          <select
            value={selectedPrize}
            onChange={(e) => onPrizeChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="ALL">All Prizes</option>
            <option value="Gold Coin">Grand Gold Coin</option>
            <option value="Diamond Voucher">Diamond Voucher</option>
            <option value="Silk Saree">Silk Saree</option>
            <option value="Smart Watch">Smart Watch</option>
            <option value="Cash Voucher">Shopping Cash Voucher</option>
          </select>
        </div>

        {/* Filter 3: Date Range */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Date Range
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

        {/* Sort Selector */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D021A] border border-[#FFD700]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFD700]"
          >
            <option value="CREATED_DESC">Created Date (Newest)</option>
            <option value="CREATED_ASC">Created Date (Oldest)</option>
            <option value="TOKEN_ASC">Token Code (A-Z)</option>
            <option value="STATUS">Status Order</option>
          </select>
        </div>

      </div>

    </div>
  );
};

export default TokenToolbar;
