import React from 'react';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { icon: 28, text: 'text-xl' },
  md: { icon: 44, text: 'text-3xl' },
  lg: { icon: 64, text: 'text-5xl' },
  xl: { icon: 96, text: 'text-7xl' },
};

const FWDLogo: React.FC<Props> = ({ size = 'md', showText = true, className = '' }) => {
  const s = sizeMap[size];
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="FWD logo">
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 64 64" width={s.icon} height={s.icon} className="drop-shadow-[0_0_18px_rgba(217,70,239,0.85)]">
          <defs>
            <linearGradient id="fwdGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path d="M6 12 L28 32 L6 52 Z" fill="none" stroke="url(#fwdGrad)" strokeWidth="4" strokeLinejoin="round" />
          <path d="M28 12 L52 32 L28 52 Z" fill="none" stroke="url(#fwdGrad)" strokeWidth="4" strokeLinejoin="round" />
        </svg>
        <div className="absolute inset-0 blur-2xl opacity-60 -z-10 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-cyan-400 rounded-full" />
      </div>
      {showText && (
        <span className={`font-black tracking-tight italic text-white ${s.text}`} style={{ textShadow: '0 0 24px rgba(255,255,255,0.25)' }}>
          FWD
        </span>
      )}
    </div>
  );
};

export default FWDLogo;
