import * as React from "react";

// Full-screen prompt shown on phones in portrait (<768px width): the desktop
// scroll-morph experience is served in landscape instead of a cut-down stacked
// layout. The phone glyph tips 90° on a loop to suggest the gesture.
export function RotateNotice() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#E0E0E4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 28px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes rotate-hint {
          0%, 18%   { transform: rotate(0deg); }
          45%, 72%  { transform: rotate(-90deg); }
          95%, 100% { transform: rotate(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rotate-glyph { animation: none !important; transform: rotate(-90deg); }
        }
      `}</style>

      {/* Phone glyph — tips onto its side and back. */}
      <div
        className="rotate-glyph"
        style={{
          width: 40,
          height: 64,
          border: "2.5px solid #1A1A1A",
          borderRadius: 9,
          position: "relative",
          marginBottom: 36,
          animation: "rotate-hint 3.2s cubic-bezier(0.45, 0, 0.2, 1) infinite",
        }}
      >
        {/* speaker notch */}
        <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 12, height: 2.5, borderRadius: 2, backgroundColor: "#1A1A1A" }} />
      </div>

      <h1
        style={{
          margin: 0,
          fontFamily: "'Stack Sans Notch', sans-serif",
          fontWeight: 300,
          fontSize: 30,
          lineHeight: 1.15,
          color: "#1A1A1A",
          maxWidth: 360,
        }}
      >
        Rotate your phone
      </h1>

      <p
        style={{
          margin: "16px 0 0",
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "26px",
          color: "#5b5b5b",
          maxWidth: 320,
        }}
      >
        This portfolio is an interactive experience — turn your phone to
        landscape to explore it.
      </p>

      <div
        style={{
          marginTop: 36,
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 500,
          fontSize: 15,
          color: "#888",
        }}
      >
        — Aleks Zhurankou
      </div>
    </div>
  );
}
