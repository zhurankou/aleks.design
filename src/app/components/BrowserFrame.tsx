import type { ReactNode } from 'react';

// Browser-window frame — based on Figma New-Portfolio node 15830:5630.
// A very-light-grey rounded-40 outer with three traffic-light dots (vivid macOS
// red/yellow/green at 50% opacity → pastel) top-left and a centred white address
// bar, wrapping a white rounded-24 content panel inset 24px (60.5px top strip).
// `expand` 0→1 transitions to the full view: the chrome fades out and the content
// panel's top inset shrinks 60.5px → 24px (24px all around).
export function BrowserFrame({ children, address = 'olysense.com', expand = 0 }: { children: ReactNode; address?: string; expand?: number }) {
  const chromeOpacity = 1 - expand;
  const panelTop = 60.5 - 36.5 * expand; // 60.5 → 24
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#f0f0f2',
      }}
    >
      {/* Traffic lights — #FF3B30 / #FFCC00 / #34C759 at 50% opacity (60×16).
          Hidden in the full-size view via chromeOpacity. */}
      <img src="/polyps/window-lights.svg" alt="" style={{ position: 'absolute', left: 24, top: 24.5, width: 60, height: 16, display: 'block', opacity: chromeOpacity, pointerEvents: 'none' }} />

      {/* Link / address bar — white, rounded, centred in the top strip. */}
      <div
        style={{
          position: 'absolute',
          top: 16.25,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: 28,
          width: '44%',
          maxWidth: 380,
          minWidth: 0,
          padding: '0 12px',
          boxSizing: 'border-box',
          borderRadius: 8,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(15,30,55,0.06)',
          opacity: chromeOpacity,
          pointerEvents: 'none',
        }}
      >
        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" style={{ flexShrink: 0 }}>
          <rect x="1.4" y="4.8" width="8.2" height="6.4" rx="1.3" fill="#7a828f" />
          <path d="M3.4 5V3.6a2.1 2.1 0 0 1 4.2 0V5" stroke="#7a828f" strokeWidth="1.1" fill="none" />
        </svg>
        <span style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: '#546274', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{address}</span>
      </div>

      {/* White content panel — top inset shrinks to 24px in the full view. */}
      <div style={{ position: 'absolute', left: 24, right: 24, top: panelTop, bottom: 24, borderRadius: 24, overflow: 'hidden', backgroundColor: '#ffffff' }}>
        {children}
      </div>
    </div>
  );
}
