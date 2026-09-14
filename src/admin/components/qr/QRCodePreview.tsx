import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Printer, Check, QrCode, Loader2, AlertCircle } from 'lucide-react';
import { APP_CONFIG, CAMPAIGN_BASE_URL } from '../../../constants/appConfig';

interface QRCodePreviewProps {
  onOpenPrintModal: () => void;
}

const RESOLUTION_MAP = {
  SMALL: 512,
  MEDIUM: 1024,
  LARGE: 2048,
} as const;

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({ onOpenPrintModal }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'PNG' | 'SVG'>('PNG');
  const [size, setSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string>('');

  const svgContainerRef = useRef<HTMLDivElement>(null);

  const campaignUrl = CAMPAIGN_BASE_URL || APP_CONFIG.brand.productionUrl;

  // Pre-cache mall logo to Base64 data URI for instant, self-contained vector & canvas export
  useEffect(() => {
    let isMounted = true;
    const preloadLogo = async () => {
      try {
        const res = await fetch(APP_CONFIG.brand.logoPath);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && typeof reader.result === 'string') {
            setLogoBase64(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.warn('Could not pre-cache logo for QR export:', err);
      }
    };
    preloadLogo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getOrFetchLogoBase64 = async (): Promise<string> => {
    if (logoBase64) return logoBase64;
    const res = await fetch(APP_CONFIG.brand.logoPath);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoBase64(reader.result);
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert logo to data URI'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const buildSelfContainedSvg = (targetPx: number, logoUri: string): string => {
    const svgEl = svgContainerRef.current?.querySelector('svg');
    if (!svgEl) throw new Error('QR code vector preview not found');

    const viewBox = svgEl.getAttribute('viewBox') || '0 0 39 39';
    const parts = viewBox.split(' ');
    const numCells = parseFloat(parts[2] || '39');

    const paths = svgEl.querySelectorAll('path');
    if (paths.length < 2) throw new Error('Invalid QR code paths');
    const fgD = paths[1].getAttribute('d') || '';

    const center = numCells / 2;
    const radius = (numCells * 0.22) / 2; // proportional circular badge radius
    const maxDim = radius * 1.4;
    const aspect = 682 / 1024; // exact 682:1024 aspect ratio of akm-logo.png
    const logoH = maxDim;
    const logoW = maxDim * aspect;
    const logoX = center - logoW / 2;
    const logoY = center - logoH / 2;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${targetPx}" height="${targetPx}" viewBox="0 0 ${numCells} ${numCells}">
  <title>AKM Lucky Draw - Diwali 2026 QR Code</title>
  <rect width="${numCells}" height="${numCells}" fill="#FFFFFF" />
  <path fill="#000000" d="${fgD}" shape-rendering="crispEdges" />
  <circle cx="${center}" cy="${center}" r="${radius}" fill="#FFFFFF" stroke="#D4AF37" stroke-width="0.25" />
  <image href="${logoUri}" x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      setErrorMessage(null);
      const targetPx = RESOLUTION_MAP[size];
      setDownloadMessage(`Generating ${format} (${targetPx}px)...`);

      const logoUri = await getOrFetchLogoBase64();
      const svgString = buildSelfContainedSvg(targetPx, logoUri);

      if (format === 'SVG') {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `AKM-Lucky-Draw-QR.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        setDownloadMessage('Downloaded AKM-Lucky-Draw-QR.svg successfully!');
      } else {
        // High-Resolution PNG via Canvas
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = targetPx;
              canvas.height = targetPx;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Canvas 2D context unavailable'));
                return;
              }

              ctx.drawImage(img, 0, 0, targetPx, targetPx);
              URL.revokeObjectURL(svgUrl);

              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Failed to generate PNG blob'));
                  return;
                }
                const pngUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = `AKM-Lucky-Draw-QR-${targetPx}px.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(pngUrl);
                setDownloadMessage(`Downloaded AKM-Lucky-Draw-QR-${targetPx}px.png successfully!`);
                resolve();
              }, 'image/png');
            } catch (canvasErr) {
              URL.revokeObjectURL(svgUrl);
              reject(canvasErr);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            reject(new Error('Failed to rasterize QR vector'));
          };
          img.src = svgUrl;
        });
      }

      setTimeout(() => setDownloadMessage(null), 4000);
    } catch (err: any) {
      console.error('QR Download Error:', err);
      setErrorMessage(err?.message || 'Failed to download QR code');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsDownloading(false);
    }
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
        <div ref={svgContainerRef} className="p-3 bg-white rounded-xl border border-gray-200 inline-block shadow-inner">
          <QRCodeSVG
            value={campaignUrl}
            size={220}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
            marginSize={3}
            imageSettings={{
              src: APP_CONFIG.brand.logoPath,
              x: undefined,
              y: undefined,
              height: 44,
              width: 44,
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
            disabled={isDownloading}
            className="px-4 py-2.5 rounded-xl bg-[#0D021A] border border-[#FFD700]/30 text-[#FFD700] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#FFD700]/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FFD700]" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {format}</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenPrintModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] text-[#0D021A] font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-gold-glow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0D021A]" />
            <span>Print QR Poster</span>
          </button>
        </div>

        {/* Dynamic Status Notifications */}
        {downloadMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="truncate">{downloadMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default QRCodePreview;
