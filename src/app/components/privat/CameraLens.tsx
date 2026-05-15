export function CameraLens() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#000000' }}>
      <svg viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="p-silver-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#444444" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#dddddd" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#111111" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="p-inner-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="71%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.97)" />
          </radialGradient>
          <radialGradient id="p-center-element" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#242430" />
            <stop offset="50%" stopColor="#08080c" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <linearGradient id="p-glass-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="p-blur-0_5" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
          <filter id="p-blur-2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <filter id="p-blur-3" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="p-blur-5" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <style>{`
            @keyframes p-glareShift {
              0%, 100% { transform: rotate(0deg); opacity: 0.8; }
              50% { transform: rotate(5deg); opacity: 1.3; }
            }
            @keyframes p-apertureZoom {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.04); }
            }
            @keyframes p-shadeRotate {
              0%, 100% { transform: rotate(180deg); opacity: 0.70; }
              50%       { transform: rotate(196deg); opacity: 0.54; }
            }
            @keyframes p-edgeGlare {
              0%, 100% { opacity: 0.5; }
              50%       { opacity: 0.85; }
            }
            @keyframes p-rimGlare {
              0%, 100% { opacity: 0.8; }
              50%       { opacity: 1; }
            }
          `}</style>
        </defs>

        {/* Outer bezel */}
        <circle cx="150" cy="150" r="148" fill="none" stroke="#1a1a1e" strokeWidth="2" />
        <circle cx="150" cy="150" r="130" fill="none" stroke="#08080a" strokeWidth="36" />
        <circle cx="150" cy="150" r="111" fill="none" stroke="#33333b" strokeWidth="1.5" />
        <circle cx="150" cy="150" r="113" fill="none" stroke="#222225" strokeWidth="1" />

        {/* Silver ring */}
        <circle cx="150" cy="150" r="105" fill="none" stroke="url(#p-silver-rim)" strokeWidth="6" />
        <circle cx="150" cy="150" r="99" fill="none" stroke="#ffffff" strokeWidth="1" style={{ animation: 'p-rimGlare 8s ease-in-out infinite' }} />
        <circle cx="150" cy="150" r="96" fill="none" stroke="#44444c" strokeWidth="2" />
        <circle cx="150" cy="150" r="91" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
        <circle cx="150" cy="150" r="86" fill="none" stroke="#111115" strokeWidth="4" />

        {/* Lens internals */}
        <circle cx="150" cy="150" r="117" fill="url(#p-inner-shadow)" />
        <g style={{ transformOrigin: '150px 150px', animation: 'p-apertureZoom 5s ease-in-out infinite' }}>
          <circle cx="150" cy="150" r="85" fill="url(#p-center-element)" />
          <circle cx="150" cy="150" r="75" fill="none" stroke="#222" strokeWidth="1" />
          <circle cx="150" cy="150" r="65" fill="none" stroke="#111" strokeWidth="3" />
          <circle cx="150" cy="150" r="55" fill="none" stroke="#333" strokeWidth="1.5" opacity="0.5" />
          <circle cx="150" cy="150" r="45" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="150" cy="150" r="30" fill="none" stroke="#222" strokeWidth="1" />
          <circle cx="150" cy="150" r="12" fill="#ffffff" opacity="0.25" filter="url(#p-blur-2)" />
          <circle cx="150" cy="150" r="4" fill="#ffffff" opacity="0.6" />
        </g>
        <path d="M 225 75 Q 235 235 75 225 A 106 106 0 0 1 225 75 Z" fill="#000000" filter="url(#p-blur-3)" style={{ transformOrigin: '150px 150px', animation: 'p-shadeRotate 8s ease-in-out infinite' }} />

        {/* Glass reflections */}
        <g style={{ transformOrigin: '150px 150px', animation: 'p-glareShift 8s ease-in-out infinite' }}>
          <path d="M 112 139 A 40 40 0 0 1 139 112 L 120 50 A 105 105 0 0 0 50 120 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="8" strokeLinejoin="round" opacity="0.15" filter="url(#p-blur-5)" />
          <path d="M 107 125 A 50 50 0 0 1 125 107 L 108 77 A 85 85 0 0 0 77 108 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" opacity="0.28" filter="url(#p-blur-2)" />
        </g>
        <path d="M 50 150 A 100 100 0 0 1 150 50 A 105 105 0 0 0 50 150 Z" fill="#ffffff" opacity="0.1" filter="url(#p-blur-3)" />
        <circle cx="150" cy="150" r="117" fill="url(#p-glass-overlay)" />
        <path d="M 45 150 A 105 105 0 0 1 150 45" fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#p-blur-0_5)" style={{ animation: 'p-edgeGlare 8s ease-in-out infinite' }} />
      </svg>
    </div>
  );
}
