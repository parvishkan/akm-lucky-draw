import React from 'react';
import { Download, FileText, Sparkles } from 'lucide-react';

export const ReportExport: React.FC = () => {
  const handleExportCSV = (reportName: string) => {
    alert(`Exporting ${reportName} in CSV format...`);
  };

  const handleExportPDF = () => {
    alert('Exporting Full Campaign Intelligence Executive PDF Report...');
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4 text-left select-none font-sans">
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-3">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-[#FFD700]" />
          <h3 className="font-heading text-base font-bold text-white">Executive Report Exports</h3>
        </div>
        <span className="text-xs text-[#D4AF37] font-mono">PDF & CSV Engine</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleExportCSV('Campaign Analytics')}
          className="px-3.5 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics CSV</span>
        </button>

        <button
          onClick={() => handleExportCSV('Winners Registry')}
          className="px-3.5 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Winners CSV</span>
        </button>

        <button
          onClick={() => handleExportCSV('Prize Inventory Report')}
          className="px-3.5 py-2 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Prize Report</span>
        </button>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] text-xs font-extrabold flex items-center gap-1.5 shadow-gold-glow transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#0D021A]" />
          <span>Executive PDF Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReportExport;
