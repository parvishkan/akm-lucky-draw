import React from 'react';
import { HeaderProps } from '../types';
import { APP_CONFIG } from '../constants/appConfig';
import { cn } from '../utilities/cn';

export const Header: React.FC<HeaderProps> = ({
  logoUrl = APP_CONFIG.brand.logoPath,
  mallName = APP_CONFIG.brand.mallName,
  className
}) => {
  return (
    <header className={cn("flex flex-col items-center text-center space-y-2 pt-6 pb-2 z-10", className)}>
      {/* Official Peacock Logo Pedestal */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-akm-purple-light/90 via-akm-purple-base to-akm-purple-deepest p-2.5 border-2 border-akm-gold-royal/50 shadow-glass flex items-center justify-center">
        <img
          src={logoUrl}
          alt={`${mallName} Logo`}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Brand Title */}
      <div className="flex flex-col items-center space-y-1 pt-1">
        <h2 className="font-heading text-xs sm:text-sm font-extrabold tracking-[0.35em] text-akm-gold-royal uppercase">
          {mallName}
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-akm-gold-royal/50 to-transparent" />
      </div>
    </header>
  );
};

export default Header;
