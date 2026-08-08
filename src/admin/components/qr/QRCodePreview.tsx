import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Printer, Check, Sparkles, QrCode } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/appConfig';

interface QRCodePreviewProps {
  onOpenPrintModal: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({ onOpenPrintModal }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'PNG' | 'SVG'>('PNG');
  const [size, setSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');

  const campaignUrl = APP_CONFIG.brand.productionUrl || 'https://draw.anukrishnamall.in';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert(`Downloading campaign QR code in ${format} format (${size} resolution)...`);
  };

  return (
    <div className="bg-[#1D0636]/90 border border-[#FFD700]/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 text-left select-none relative overflow-hidden font-sans">
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

      {/* Card Title Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Campaign QR Code</h3>
            <p className="text-[11px] text-[#A0A0A0]">Scannable QR printed across all mall collateral.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          ✓ SCANNABLE & READY
        </span>
      </div>

      {/* Large Premium QR Code Box */}
      <div className="p-6 rounded-2xl bg-white text-black text-center space-y-3 shadow-2xl max-w-sm mx-auto border-2 border-[#FFD700]">
        <div className="space-y-0.5">
          <span className="font-heading text-sm font-black tracking-wider uppercase block text-[#0D021A]">
            {APP_CONFIG.brand.mallName}
          </span>
          <span className="text-[11px] font-extrabold text-[#D4AF37] tracking-widest uppercase block">
            AKM LUCKY DRAW
          </span>
        </div>

        {/* Scannable QR SVG Container */}
        <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block shadow-inner">
          <QRCodeSVG
            value={campaignUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#0D021A"
            level="H"
            includeMargin={true}
            imageSettings={{
              src: APP_CONFIG.brand.logoPath,
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <p className="text-[10px] font-bold tracking-wider text-gray-700 uppercase">
          Scan to Check Your Luck • Enter Token • Win
        </p>
      </div>

      {/* Campaign URL & Copy Button */}
      <div className="p-3 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 flex items-center justify-between gap-2 font-mono text-xs">
        <div className="overflow-hidden">
          <span className="text-[9px] text-[#A0A0A0] block uppercase font-sans">Campaign Web URL</span>
          <span className="text-white font-bold truncate block">{campaignUrl}</span>
        </div>

        <button
          onClick={handleCopyUrl}
          className="px-3 py-1.5 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy URL'}</span>
        </button>
      </div>

      {/* Download Options (Format & Resolution Selectors) */}
      <div className="space-y-3 pt-1 border-t border-[#FFD700]/15">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-1 bg-[#0D021A] p-1 rounded-xl border border-[#FFD700]/20">
              <button
                type="button"
                onClick={() => setFormat('PNG')}
                className={`py-1 rounded-lg font-mono font-bold text-[10px] transition-colors ${
                  format === 'PNG' ? 'bg-[#FFD700] text-[#0D021A]' : 'text-gray-400 hover:text-white'
                }`}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => setFormat('SVG')}
                className={`py-1 rounded-lg font-mono font-bold text-[10px] transition-colors ${
                  format === 'SVG' ? 'bg-[#FFD700] text-[#0D021A]' : 'text-gray-400 hover:text-white'
                }`}
              >
                SVG
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
              Resolution Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-[#0D021A] border border-[#FFD700]/20 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="SMALL">Small (512px)</option>
              <option value="MEDIUM">Medium (1024px)</option>
              <option value="LARGE">Large (2048px)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#FFD700]/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download {format}</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-gold-glow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0D021A]" />
            <span>Print QR Poster</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default QRCodePreview;
