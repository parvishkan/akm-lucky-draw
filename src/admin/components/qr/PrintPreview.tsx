import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../../../constants/appConfig';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const campaignUrl = APP_CONFIG.brand.productionUrl || 'https://draw.anukrishnamall.in';

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="bg-[#1D0636] border-2 border-[#FFD700]/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-6 shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0D021A] text-[#A0A0A0] hover:text-white border border-[#FFD700]/20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Poster Preview Container */}
        <div id="printable-qr-poster" className="bg-white text-black p-8 rounded-3xl space-y-6 border-4 border-black text-center font-sans">
          
          {/* Header */}
          <div className="space-y-1 border-b-4 border-black pb-4">
            <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-widest text-black">
              {APP_CONFIG.brand.mallName}
            </h1>
            <span className="text-sm sm:text-base font-extrabold text-[#D4AF37] tracking-widest uppercase block">
              DIWALI LUCKY DRAW 2026
            </span>
          </div>

          {/* Call To Action */}
          <div className="space-y-1">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-wider block text-black">
              SHOP • SCAN • WIN!
            </span>
            <p className="text-xs font-bold text-gray-700">
              Scan QR code below with your mobile camera to participate.
            </p>
          </div>

          {/* High Contrast Scannable QR Code */}
          <div className="p-4 bg-white rounded-2xl border-4 border-black inline-block shadow-2xl">
            <QRCodeSVG
              value={campaignUrl}
              size={240}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
              includeMargin={true}
              imageSettings={{
                src: APP_CONFIG.brand.logoPath,
                x: undefined,
                y: undefined,
                height: 48,
                width: 48,
                excavate: true,
              }}
            />
          </div>

          {/* Simple Instructions */}
          <div className="p-4 bg-gray-100 rounded-2xl border-2 border-black space-y-1.5 text-xs text-left font-mono">
            <div className="font-bold uppercase tracking-wider text-black text-center pb-1 border-b border-gray-300">
              3 Simple Steps to Claim Your Gift
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div><strong>1. SCAN QR</strong><span className="block text-[9px] text-gray-600">Camera App</span></div>
              <div><strong>2. ENTER TOKEN</strong><span className="block text-[9px] text-gray-600">From Bill Receipt</span></div>
              <div><strong>3. WIN GIFTS</strong><span className="block text-[9px] text-gray-600">Open Mystery Box</span></div>
            </div>
          </div>

          {/* Footer Web Address */}
          <div className="text-[11px] font-mono font-bold text-gray-800 pt-2 border-t-2 border-black flex justify-between items-center">
            <span>Official Web Portal: {campaignUrl}</span>
            <span>Help Desk Counter #1</span>
          </div>

        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/20 text-[#A0A0A0] hover:text-white text-xs font-bold"
          >
            Close
          </button>

          <button
            onClick={handleTriggerPrint}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-widest uppercase flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0D021A]" />
            <span>🖨 Print A4 Counter Poster</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrintPreview;
