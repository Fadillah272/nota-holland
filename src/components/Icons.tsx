import React from 'react';

export const WindmillLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 110"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Windmill blades/sails with iconic bakery branch-leaf pattern */}
    <g transform="translate(50, 42)">
      {/* Center hub */}
      <circle cx="0" cy="0" r="4.5" fill="black" />

      {/* Top blade */}
      <g transform="rotate(0)">
        <path d="M -1.5 0 L -1.5 -36 L 1.5 -36 L 1.5 0 Z" fill="black" />
        {/* Vanes / leaves */}
        <ellipse cx="-7" cy="-12" rx="4.5" ry="2.5" transform="rotate(-30 -7 -12)" fill="black" />
        <ellipse cx="7" cy="-15" rx="4.5" ry="2.5" transform="rotate(30 7 -15)" fill="black" />
        <ellipse cx="-8" cy="-22" rx="5" ry="2.8" transform="rotate(-30 -8 -22)" fill="black" />
        <ellipse cx="8" cy="-25" rx="5" ry="2.8" transform="rotate(30 8 -25)" fill="black" />
        <ellipse cx="-7" cy="-31" rx="4.5" ry="2.5" transform="rotate(-30 -7 -31)" fill="black" />
        <ellipse cx="7" cy="-33" rx="4" ry="2.2" transform="rotate(30 7 -33)" fill="black" />
        <ellipse cx="0" cy="-38" rx="2.5" ry="4" fill="black" />
      </g>

      {/* Right blade */}
      <g transform="rotate(90)">
        <path d="M -1.5 0 L -1.5 -36 L 1.5 -36 L 1.5 0 Z" fill="black" />
        <ellipse cx="-7" cy="-12" rx="4.5" ry="2.5" transform="rotate(-30 -7 -12)" fill="black" />
        <ellipse cx="7" cy="-15" rx="4.5" ry="2.5" transform="rotate(30 7 -15)" fill="black" />
        <ellipse cx="-8" cy="-22" rx="5" ry="2.8" transform="rotate(-30 -8 -22)" fill="black" />
        <ellipse cx="8" cy="-25" rx="5" ry="2.8" transform="rotate(30 8 -25)" fill="black" />
        <ellipse cx="-7" cy="-31" rx="4.5" ry="2.5" transform="rotate(-30 -7 -31)" fill="black" />
        <ellipse cx="7" cy="-33" rx="4" ry="2.2" transform="rotate(30 7 -33)" fill="black" />
        <ellipse cx="0" cy="-38" rx="2.5" ry="4" fill="black" />
      </g>

      {/* Bottom blade */}
      <g transform="rotate(180)">
        <path d="M -1.5 0 L -1.5 -36 L 1.5 -36 L 1.5 0 Z" fill="black" />
        <ellipse cx="-7" cy="-12" rx="4.5" ry="2.5" transform="rotate(-30 -7 -12)" fill="black" />
        <ellipse cx="7" cy="-15" rx="4.5" ry="2.5" transform="rotate(30 7 -15)" fill="black" />
        <ellipse cx="-8" cy="-22" rx="5" ry="2.8" transform="rotate(-30 -8 -22)" fill="black" />
        <ellipse cx="8" cy="-25" rx="5" ry="2.8" transform="rotate(30 8 -25)" fill="black" />
        <ellipse cx="-7" cy="-31" rx="4.5" ry="2.5" transform="rotate(-30 -7 -31)" fill="black" />
        <ellipse cx="7" cy="-33" rx="4" ry="2.2" transform="rotate(30 7 -33)" fill="black" />
        <ellipse cx="0" cy="-38" rx="2.5" ry="4" fill="black" />
      </g>

      {/* Left blade */}
      <g transform="rotate(270)">
        <path d="M -1.5 0 L -1.5 -36 L 1.5 -36 L 1.5 0 Z" fill="black" />
        <ellipse cx="-7" cy="-12" rx="4.5" ry="2.5" transform="rotate(-30 -7 -12)" fill="black" />
        <ellipse cx="7" cy="-15" rx="4.5" ry="2.5" transform="rotate(30 7 -15)" fill="black" />
        <ellipse cx="-8" cy="-22" rx="5" ry="2.8" transform="rotate(-30 -8 -22)" fill="black" />
        <ellipse cx="8" cy="-25" rx="5" ry="2.8" transform="rotate(30 8 -25)" fill="black" />
        <ellipse cx="-7" cy="-31" rx="4.5" ry="2.5" transform="rotate(-30 -7 -31)" fill="black" />
        <ellipse cx="7" cy="-33" rx="4" ry="2.2" transform="rotate(30 7 -33)" fill="black" />
        <ellipse cx="0" cy="-38" rx="2.5" ry="4" fill="black" />
      </g>
    </g>

    {/* Windmill base body */}
    <path
      d="M 44 48 L 36 94 L 64 94 L 56 48 Z"
      fill="black"
    />
    {/* Windmill roof rim */}
    <path
      d="M 40 48 L 50 42 L 60 48 Z"
      fill="black"
    />
    {/* Door (white cutout) */}
    <path
      d="M 46 94 L 46 80 A 4 4 0 0 1 54 80 L 54 94 Z"
      fill="white"
    />
    {/* Small windows (white cutout) */}
    <rect x="39" y="86" width="3.5" height="3.5" rx="0.5" fill="white" />
    <rect x="57.5" y="86" width="3.5" height="3.5" rx="0.5" fill="white" />
    {/* Ground base */}
    <rect x="28" y="94" width="44" height="3" rx="1.5" fill="black" />
  </svg>
);

export const PrinterIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const RotateCcwIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const UploadIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const BakeryIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Croissant / bread outline */}
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
