import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Watch, 
  Headphones, 
  Wallet, 
  Sparkles, 
  Award, 
  Heart, 
  Smile,
  ShieldCheck 
} from 'lucide-react';
import { 
  getPrizeImageCandidates, 
  getPrizeDefinition, 
  getPrizeSlug 
} from '../utils/prizeImages';

export interface PrizeProductVisualProps {
  prize?: {
    id?: string;
    title?: string;
    name?: string;
    image?: string | null;
    imageUrl?: string | null;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  imgClassName?: string;
  alt?: string;
  showFallbackLabel?: boolean;
}

export const PrizeProductVisual: React.FC<PrizeProductVisualProps> = ({
  prize,
  size = 'md',
  className = '',
  imgClassName = '',
  alt,
  showFallbackLabel = true
}) => {
  const candidates = getPrizeImageCandidates(prize);
  const def = getPrizeDefinition(prize);
  const slug = getPrizeSlug(prize);
  const prizeTitle = prize?.title || prize?.name || def?.title || 'Diwali Gift';

  const [candidateIdx, setCandidateIdx] = useState(0);
  const [hasAllFailed, setHasAllFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset states when prize changes
  useEffect(() => {
    setCandidateIdx(0);
    setHasAllFailed(candidates.length === 0);
    setIsLoaded(false);
  }, [prize?.id, prize?.title, prize?.name, prize?.image, prize?.imageUrl]);

  const handleImageError = () => {
    if (candidateIdx + 1 < candidates.length) {
      setCandidateIdx(candidateIdx + 1);
    } else {
      setHasAllFailed(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Render Icon according to prize type
  const renderFallbackIcon = () => {
    const iconType = def?.iconType;
    const iconSizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      hero: 'w-20 h-20'
    }[size];

    const iconProps = {
      className: `${iconSizeClasses} text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]`
    };

    switch (iconType) {
      case 'watch':
        return <Watch {...iconProps} />;
      case 'headphones':
        return <Headphones {...iconProps} />;
      case 'wallet':
        return <Wallet {...iconProps} />;
      case 'spray':
        return <Sparkles {...iconProps} />;
      case 'belt':
        return <Award {...iconProps} />;
      case 'chocolate':
        return <Heart {...iconProps} />;
      case 'teddy':
        return <Smile {...iconProps} />;
      default:
        return <Gift {...iconProps} />;
    }
  };

  const sizeContainerClasses = {
    xs: 'w-8 h-8 rounded-lg',
    sm: 'w-12 h-12 rounded-xl',
    md: 'w-28 h-28 rounded-2xl',
    lg: 'w-36 h-36 rounded-2xl',
    hero: 'w-full h-full min-h-[140px] rounded-3xl'
  }[size];

  // Clean Fallback Placeholder when no image file exists or all fail to load
  if (hasAllFailed || candidates.length === 0) {
    return (
      <div 
        data-testid="prize-placeholder"
        data-prize-slug={slug || 'unknown'}
        className={`relative flex flex-col items-center justify-center p-2 text-center overflow-hidden bg-gradient-to-br from-[#1D0636] via-[#0E031B] to-[#07020E] border border-[#FFD700]/25 shadow-inner ${sizeContainerClasses} ${className}`}
      >
        {/* Soft Radial Ambient Glow */}
        <div 
          className="absolute inset-0 blur-xl opacity-25 pointer-events-none"
          style={{ backgroundColor: def?.accentColor || '#D4AF37' }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 max-w-full px-1">
          {renderFallbackIcon()}

          {showFallbackLabel && (size === 'md' || size === 'lg' || size === 'hero') && (
            <div className="pt-0.5 max-w-full">
              <span className="text-[10px] font-sans font-medium text-amber-200/80 block leading-tight">
                Product image not uploaded
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Image Render with graceful error fallback
  const currentSrc = candidates[candidateIdx];

  return (
    <div 
      data-testid="prize-image-container"
      data-prize-slug={slug || 'unknown'}
      className={`relative flex items-center justify-center overflow-hidden ${sizeContainerClasses} ${className}`}
    >
      {/* Background Soft Gold Radial Aura */}
      <div 
        className="absolute inset-0 blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: def?.accentColor || '#D4AF37' }}
      />

      {/* Loading Skeleton / Placeholder until loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#07020E]/70 animate-pulse">
          {renderFallbackIcon()}
        </div>
      )}

      {/* Main Product Image */}
      <img
        src={currentSrc}
        alt={alt || prizeTitle}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-contain relative z-10 transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] ${imgClassName}`}
      />
    </div>
  );
};

export default PrizeProductVisual;
