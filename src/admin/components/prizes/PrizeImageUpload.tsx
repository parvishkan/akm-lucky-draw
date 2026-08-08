import React, { useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, Trash2, Sparkles } from 'lucide-react';

interface PrizeImageUploadProps {
  imagePath?: string;
  onImageChange: (path: string) => void;
}

export const PrizeImageUpload: React.FC<PrizeImageUploadProps> = ({
  imagePath,
  onImageChange
}) => {
  const [preview, setPreview] = useState<string | undefined>(imagePath || '/akm-logo.png');

  const handlePresetSelect = (preset: string) => {
    setPreview(preset);
    onImageChange(preset);
  };

  const handleSimulateUpload = () => {
    // Simulated image upload placeholder
    const sampleImages = [
      '/akm-logo.png',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    ];
    const chosen = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    setPreview(chosen);
    onImageChange(chosen);
  };

  return (
    <div className="space-y-3 text-left font-sans select-none">
      <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
        Prize Image (Firebase Storage Architecture Ready)
      </label>

      <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 flex flex-col sm:flex-row items-center gap-4">
        {/* Image Preview Box */}
        <div className="w-24 h-24 rounded-xl bg-[#1D0636] border border-[#FFD700]/30 p-2 flex items-center justify-center relative overflow-hidden shrink-0">
          {preview ? (
            <img src={preview} alt="Prize Preview" className="w-full h-full object-contain drop-shadow" />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#A0A0A0]" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <button
              type="button"
              onClick={handleSimulateUpload}
              className="px-3.5 py-2 rounded-xl bg-[#1D0636] border border-[#FFD700]/40 text-[#FFD700] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FFD700]/20 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{preview ? 'Replace Image' : 'Upload Image'}</span>
            </button>

            {preview && (
              <button
                type="button"
                onClick={() => { setPreview(undefined); onImageChange(''); }}
                className="px-3 py-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 hover:bg-rose-900/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p className="text-[10px] text-[#A0A0A0]">
            PNG, JPG or WebP up to 5MB. Prepares architecture for Cloud Storage deployment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrizeImageUpload;
