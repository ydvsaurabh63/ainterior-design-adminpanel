import React from 'react';
import logoHorizontal from '../assets/logo-horizontal.png';
import logoHorizontalDark from '../assets/logo-horizontal-dark.png';
import logoStacked from '../assets/logo-tight.png';
import logoStackedDark from '../assets/logo-tight-dark.png';
import logoEmblem from '../assets/logo-emblem.png';
import logoOriginal from '../assets/logo.png';

/**
 * Brand Logo component featuring the authentic 3D architectural AI logo.
 * Supports horizontal (navbar/footer/admin), stacked, emblem-only, or full original.
 */
const Logo = ({
  size = 'md',
  variant = 'light', // 'light' or 'dark'
  layout = 'horizontal', // 'horizontal', 'stacked', 'emblem', 'original'
  showTagline = true,
  className = '',
  imgClassName = '',
}) => {
  const isDark = variant === 'dark';

  // Sizing map for responsive heights
  const sizeMap = {
    xs: {
      horizontal: 'h-6 sm:h-7',
      stacked: 'h-10 w-auto',
      emblem: 'w-7 h-7',
    },
    sm: {
      horizontal: 'h-7 sm:h-8',
      stacked: 'h-12 w-auto',
      emblem: 'w-8 h-8',
    },
    md: {
      horizontal: 'h-9 sm:h-10 md:h-11',
      stacked: 'h-14 sm:h-16 w-auto',
      emblem: 'w-10 h-10',
    },
    lg: {
      horizontal: 'h-12 sm:h-14 md:h-16',
      stacked: 'h-20 sm:h-24 w-auto',
      emblem: 'w-14 h-14',
    },
    xl: {
      horizontal: 'h-16 sm:h-20',
      stacked: 'h-28 sm:h-32 w-auto',
      emblem: 'w-20 h-20',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Determine which image asset to display based on layout & variant
  let logoSrc = logoHorizontal;
  let activeHeightClass = currentSize.horizontal;

  if (layout === 'emblem' || (!showTagline && layout === 'emblem')) {
    logoSrc = logoEmblem;
    activeHeightClass = currentSize.emblem;
  } else if (layout === 'stacked') {
    logoSrc = isDark ? logoStackedDark : logoStacked;
    activeHeightClass = currentSize.stacked;
  } else if (layout === 'original') {
    logoSrc = logoOriginal;
    activeHeightClass = currentSize.stacked;
  } else {
    // Default: 'horizontal'
    logoSrc = isDark ? logoHorizontalDark : logoHorizontal;
    activeHeightClass = currentSize.horizontal;
  }

  return (
    <div className={`inline-flex items-center select-none group transition-transform duration-200 hover:scale-[1.02] ${className}`}>
      <img
        src={logoSrc}
        alt="aiterior — Reimagine Spaces with AI"
        className={`${activeHeightClass} w-auto object-contain transition-all duration-300 drop-shadow-sm ${imgClassName}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default Logo;
