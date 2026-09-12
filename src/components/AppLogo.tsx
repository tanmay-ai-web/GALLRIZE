import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Background squircle */}
        <rect width="100" height="100" rx="28" fill="#131316" />
        
        {/* Rear angled card */}
        <rect
          x="20"
          y="24"
          width="48"
          height="58"
          rx="14"
          transform="rotate(-8 20 24)"
          fill="#1c1f26"
          stroke="#2d3748"
          strokeWidth="2.5"
        />

        {/* Front card with glowing blue stroke */}
        <rect
          x="30"
          y="18"
          width="48"
          height="58"
          rx="14"
          fill="#182234"
          fillOpacity="0.85"
          stroke="#3B82F6"
          strokeWidth="3.5"
        />

        {/* Green checkmark */}
        <path
          d="M42 48.5L51.5 58L69.5 37"
          stroke="#10B981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Red notification dot */}
        <circle cx="70" cy="23" r="5" fill="#EF4444" />
      </svg>
    </div>
  );
};
