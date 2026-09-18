import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db, collections } from '../../../services/firebase';

export interface PrizeImageUploadProps {
  imagePath?: string | null;
  prizeId?: string;
  prizeName?: string;
  onImageChange: (path: string) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const STORAGE_TIMEOUT_MS = 3500; // 3.5s timeout to prevent 10-minute retry hang on unprovisioned storage

/**
 * Uploads file to Firebase Storage with strict timeout and cancel control
 * Prevents browser from hanging in an internal 10-minute retry loop when storage is unprovisioned
 */
const uploadToFirebaseStorageWithTimeout = (
  storageRef: any,
  file: File,
  timeoutMs: number,
  onProgress?: (pct: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let isSettled = false;
    const metadata = { contentType: file.type || 'image/jpeg' };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          uploadTask.cancel();
        } catch {
          // Ignore cancel error
        }
        reject(new Error(`Storage operation timed out after ${timeoutMs / 1000}s`));
      }
    }, timeoutMs);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (!isSettled && snapshot.totalBytes > 0 && onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      },
      (error) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          reject(error);
        }
      },
      async () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      }
    );
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
  const [stageMessage, setStageMessage] = useState('');
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
      setIsUploading(false);
      setUploadProgress(0);
      setStageMessage('');
      setErrorMessage('Unsupported file format. Please upload a PNG, JPG/JPEG, or WebP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Validation: Maximum 5MB File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setIsUploading(false);
      setUploadProgress(0);
      setStageMessage('');
      setErrorMessage(`File size (${sizeMb}MB) exceeds the 5MB maximum limit. Please select a smaller image.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 3. Instant Local Preview for Immediate Responsiveness
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);
    setIsUploading(true);
    setUploadProgress(15);
    setStageMessage('Uploading image...');

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const cleanFolder = (prizeId || 'general').replace(/[^a-zA-Z0-9_-]/g, '_');
    const storagePath = `prizes/${cleanFolder}/${Date.now()}_${cleanFileName}`;

    try {
      // Stage 1: Upload directly to Firebase Storage
      setStageMessage('Uploading to Firebase Storage...');
      setUploadProgress(30);

      const storageRef = ref(storage, storagePath);
      const downloadUrl = await uploadToFirebaseStorageWithTimeout(
        storageRef,
        file,
        STORAGE_TIMEOUT_MS,
        (pct) => setUploadProgress(Math.min(85, Math.max(30, pct)))
      );

      // Verify that downloadUrl is a genuine HTTPS URL from Firebase Storage
      if (!downloadUrl || (!downloadUrl.startsWith('https://') && !downloadUrl.startsWith('http://'))) {
        throw new Error('Invalid download URL returned by Firebase Storage.');
      }

      console.log('[PrizeImageUpload] Firebase Storage upload successful. Download URL:', downloadUrl);

      // Stage 2: Save ONLY the URL reference to the prize document in Firestore
      if (prizeId) {
        setStageMessage('Saving image reference...');
        setUploadProgress(90);

        const prizeRef = doc(db, collections.PRIZES, prizeId);
        // Strictly update ONLY image and imageUrl references; preserve all inventory counts and configurations
        await updateDoc(prizeRef, {
          image: downloadUrl,
          imageUrl: downloadUrl,
          updatedAt: serverTimestamp()
        });
      }

      // Stage 3: Success confirmation
      setUploadProgress(100);
      setStageMessage('Image uploaded successfully.');
      URL.revokeObjectURL(localPreviewUrl);
      setPreview(downloadUrl);
      onImageChange(downloadUrl);
      setIsUploading(false);
      setSuccessMessage('Product image uploaded to Firebase Storage and reference saved!');
    } catch (err: any) {
      console.error('[PrizeImageUpload] Firebase Storage upload error:', err?.code || 'ERROR', err?.message || err);
      setIsUploading(false);
      setUploadProgress(0);
      setStageMessage('');
      URL.revokeObjectURL(localPreviewUrl);
      setPreview(sanitizeInitialImage(imagePath));

      const errMsg = err?.message || '';
      if (errMsg.includes('timed out') || err?.code === 'storage/unknown' || err?.code === 'storage/bucket-not-found' || err?.code === 'storage/unauthorized') {
        setErrorMessage(
          'Firebase Cloud Storage is currently unprovisioned or unreachable. Please enable Cloud Storage in Firebase Console (Storage -> Get Started) before uploading product photos.'
        );
      } else {
        setErrorMessage(`Storage upload failed: ${errMsg || 'Please check network connection and try again.'}`);
      }
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setPreview(null);
    onImageChange('');

    if (prizeId) {
      try {
        const prizeRef = doc(db, collections.PRIZES, prizeId);
        await updateDoc(prizeRef, {
          image: null,
          imageUrl: null,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Failed to update prize image to null in Firestore:', err);
      }
    }

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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1 text-[#FFD700] p-1">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFD700]" />
              <span className="text-[10px] font-mono font-bold">{uploadProgress}%</span>
              {stageMessage && (
                <span className="text-[8px] font-sans text-amber-200/90 leading-tight text-center px-1 truncate max-w-full">
                  {stageMessage}
                </span>
              )}
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
                  ? 'bg-gray-800 border-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1D0636] border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{stageMessage || `Processing (${uploadProgress}%)...`}</span>
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
