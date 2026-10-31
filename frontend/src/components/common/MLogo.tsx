import React, { useId } from 'react';

export interface MLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MLogo: React.FC<MLogoProps> = ({ size = 'md', className = '' }) => {
  const rawId = useId();
  // Sanitize useId for CSS/SVG selector safety
  const gradientId = `mLogoGrad-${rawId.replace(/:/g, '')}`;

  const dimensions = {
    sm: { width: 22, height: 15 },
    md: { width: 26, height: 18 },
    lg: { width: 34, height: 24 },
  }[size];

  return (
    <span
      className={`mediscan-m-logo mediscan-m-logo--${size} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}
      aria-hidden="true"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 54 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="25%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#FF5A36" />
          </linearGradient>
        </defs>
        <path
          d="M 8 30 L 8 16 C 8 8, 12 5, 17 5 C 22 5, 24.5 18, 27 24 C 29.5 18, 32 5, 37 5 C 42 5, 46 8, 46 16 L 46 30"
          stroke={`url(#${gradientId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export default MLogo;
