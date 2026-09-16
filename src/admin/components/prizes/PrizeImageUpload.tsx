import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../services/firebase';

export interface PrizeImageUploadProps {
  imagePath?: string | null;
  prizeId?: string;
  prizeName?: string;
  onImageChange: (path: string) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

/**
 * Client-side canvas helper to create an optimized data URL
 * Used as a reliable fallback if Firebase Cloud Storage bucket is uninitialized
 */
const createOptimizedDataUrl = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // Fallback to jpeg
        }
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const PrizeImageUpload: React.FC<PrizeImageUploadProps> = ({
  imagePath,
  prizeId,
  prizeName,
  onImageChange
}) => {
  const sanitizeInitialImage = (val?: string | null): string | null => {
    if (!val) return null;
    const clean = val.trim();
    if (clean === '/akm-logo.png' || clean.endsWith('/akm-logo.png')) return null;
    return clean;
  };

  const [preview, setPreview] = useState<string | null>(sanitizeInitialImage(imagePath));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize preview when imagePath changes from parent
  useEffect(() => {
    setPreview(sanitizeInitialImage(imagePath));
  }, [imagePath]);

  const handleButtonClick = () => {
    setErrorMessage('');
    setSuccessMessage('');
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setSuccessMessage('');

    // 1. Validation: Allowed File Formats (PNG, JPG/JPEG, WebP)
    const fileType = file.type.toLowerCase();
    const isExtensionAllowed = /\.(png|jpe?g|webp)$/i.test(file.name);
    if (!ALLOWED_MIME_TYPES.includes(fileType) && !isExtensionAllowed) {
      setErrorMessage('Unsupported file format. Please upload a PNG, JPG/JPEG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Validation: Maximum 5MB File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`File size (${sizeMb}MB) exceeds the 5MB maximum limit. Please select a smaller image.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 3. Instant Local Preview for Immediate Responsiveness
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setIsUploading(true);
    setUploadProgress(10);

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const cleanFolder = (prizeId || 'general').replace(/[^a-zA-Z0-9_-]/g, '_');
    const storagePath = `prizes/${cleanFolder}/${Date.now()}_${cleanFileName}`;

    try {
      // Attempt upload to Firebase Storage
      const storageRef = ref(storage, storagePath);
      const metadata = { contentType: file.type || 'image/jpeg' };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      let didFailToStorage = false;

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(Math.max(10, pct));
          }
        },
        async (storageErr) => {
          console.warn('Firebase Storage upload notice (falling back to database persistence):', storageErr?.message);
          didFailToStorage = true;

          // Fallback: Generate optimized data URL and save directly to prize document
          try {
            const optimizedDataUrl = await createOptimizedDataUrl(file);
            URL.revokeObjectURL(localPreviewUrl);
            setPreview(optimizedDataUrl);
            onImageChange(optimizedDataUrl);
            setIsUploading(false);
            setSuccessMessage('Product image attached successfully and ready to save!');
          } catch (canvasErr) {
            console.error('Failed to create optimized image fallback:', canvasErr);
            setIsUploading(false);
            URL.revokeObjectURL(localPreviewUrl);
            setPreview(sanitizeInitialImage(imagePath));
            setErrorMessage('Unable to process the image file. Please try a different photo.');
          }
        },
        async () => {
          if (didFailToStorage) return;
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            URL.revokeObjectURL(localPreviewUrl);
            setPreview(downloadUrl);
            onImageChange(downloadUrl);
            setIsUploading(false);
            setSuccessMessage('Product image uploaded successfully to Firebase Storage!');
          } catch (urlErr) {
            // Fallback to optimized data URL if getDownloadURL fails
            try {
              const fallbackUrl = await createOptimizedDataUrl(file);
              URL.revokeObjectURL(localPreviewUrl);
              setPreview(fallbackUrl);
              onImageChange(fallbackUrl);
              setIsUploading(false);
              setSuccessMessage('Product image attached successfully!');
            } catch {
              setIsUploading(false);
              setErrorMessage('Image uploaded, but failed to retrieve URL.');
            }
          }
        }
      );
    } catch (initErr: any) {
      console.warn('Could not initialize Firebase Storage task, using direct database fallback:', initErr);
      try {
        const optimizedDataUrl = await createOptimizedDataUrl(file);
        URL.revokeObjectURL(localPreviewUrl);
        setPreview(optimizedDataUrl);
        onImageChange(optimizedDataUrl);
        setIsUploading(false);
        setSuccessMessage('Product image attached successfully!');
      } catch {
        setIsUploading(false);
        URL.revokeObjectURL(localPreviewUrl);
        setPreview(sanitizeInitialImage(imagePath));
        setErrorMessage('Failed to initialize image upload. Please try again.');
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange('');
    setErrorMessage('');
    setSuccessMessage('Product image removed. Clean fallback will be shown.');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasPhoto = Boolean(preview);

  return (
    <div className="space-y-3 text-left font-sans select-none">
      <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
        Product Image {prizeName ? `— ${prizeName}` : ''}
      </label>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="p-4 rounded-2xl bg-[#0D021A] border border-[#FFD700]/25 flex flex-col sm:flex-row items-center gap-4">
        {/* Image Preview Box */}
        <div className="w-28 h-28 rounded-2xl bg-[#1D0636] border border-[#FFD700]/30 p-2 flex flex-col items-center justify-center relative overflow-hidden shrink-0 text-center">
          {hasPhoto ? (
            <img
              src={preview!}
              alt="Prize Preview"
              className="w-full h-full object-contain drop-shadow transition-opacity"
              onError={() => setPreview(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-1 space-y-1">
              <ImageIcon className="w-8 h-8 text-[#A0A0A0]/60" />
              <span className="text-[9px] font-medium text-amber-200/70 leading-tight">
                Product image not uploaded
              </span>
            </div>
          )}

          {/* Uploading Spinner Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-1 text-[#FFD700]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-mono font-bold">{uploadProgress}%</span>
            </div>
          )}
        </div>

        {/* Upload Controls & Status */}
        <div className="space-y-2 flex-1 text-center sm:text-left w-full">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isUploading}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isUploading
                  ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1D0636] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>{hasPhoto ? 'Replace Image' : '+ Upload Product Image'}</span>
                </>
              )}
            </button>

            {hasPhoto && !isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-900/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Image</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#A0A0A0]">
            PNG, JPG or WebP up to 5MB. Uploaded photos are stored securely for this prize.
          </p>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full bg-[#1D0636] h-1.5 rounded-full overflow-hidden border border-[#FFD700]/20 mt-1">
              <div
                className="bg-gradient-to-r from-[#FFD700] to-[#D4AF37] h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Validation / Error Banner */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px] font-semibold flex items-start gap-2 text-left mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Notification Banner */}
          {successMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-2 text-left mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeImageUpload;
