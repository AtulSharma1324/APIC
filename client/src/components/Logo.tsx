import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'light' | 'dark' | 'sunset';
  disableLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'dark',
  disableLink = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
    full: 'w-full h-full'
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Official LPU Circular Emblem Vector matching Image 1 - Fills full circle */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-md border-2 border-slate-900 group-hover:scale-105 transition-transform shrink-0 p-0`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full rounded-full block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="lpuEmblemClip">
              <circle cx="100" cy="100" r="66.5" />
            </clipPath>
          </defs>

          {/* Outer Ring Circle - Extends to edges */}
          <circle cx="100" cy="100" r="97.5" fill="#FFFFFF" stroke="#000000" strokeWidth="5" />

          {/* Top Arc Text Path */}
          <path id="lpuTextTop" d="M 19, 100 A 81 81 0 1 1 181, 100" fill="none" />
          <text fontSize="14" fontWeight="800" fill="#000000" letterSpacing="0.6">
            <textPath href="#lpuTextTop" startOffset="50%" textAnchor="middle">
              Lovely Professional University
            </textPath>
          </text>

          {/* Bottom Arc Text Path */}
          <path id="lpuTextBottom" d="M 181, 100 A 81 81 0 0 1 19, 100" fill="none" />
          <text fontSize="13.5" fontWeight="800" fill="#000000" letterSpacing="1">
            <textPath href="#lpuTextBottom" startOffset="50%" textAnchor="middle">
              Punjab (India)
            </textPath>
          </text>

          {/* Left & Right Solid Dots */}
          <circle cx="33" cy="142" r="5" fill="#000000" />
          <circle cx="167" cy="142" r="5" fill="#000000" />

          {/* Inner Orange Circle */}
          <circle cx="100" cy="100" r="66.5" fill="#F37023" stroke="#000000" strokeWidth="5" />

          {/* Radiating Black Rays / Sunburst Stripes */}
          <g clipPath="url(#lpuEmblemClip)">
            <polygon points="52,135 60,34 82,34 62,145" fill="#000000" />
            <polygon points="62,145 106,34 128,38 76,153" fill="#000000" />
            <polygon points="76,153 162,72 167,98 90,161" fill="#000000" />
            <polygon points="90,161 161,138 135,166 90,166" fill="#000000" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-base sm:text-lg font-black tracking-tight leading-none ${
            variant === 'light' ? 'text-white' : variant === 'sunset' ? 'text-orange-950' : 'text-slate-900'
          }`}>
            ACADEMICZ <span className="text-brand-600 font-extrabold">PORTAL</span>
          </span>
        </div>
      )}
    </div>
  );

  if (disableLink) {
    return logoContent;
  }

  return (
    <Link to="/">
      {logoContent}
    </Link>
  );
};
