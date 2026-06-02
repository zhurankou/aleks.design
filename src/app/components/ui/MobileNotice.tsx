import * as React from "react";

// Temporary stand-in for the mobile breakpoint (<768px) while the real mobile
// layout is being finished. Rendered in place of NewPageMobile / OlySenseMobile.
// To restore the mobile layouts, swap the `<MobileNotice />` returns back to the
// page's own mobile component.
export function MobileNotice() {
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
      {/* Monitor + tablet glyph */}
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 28 }}>
        <rect x="2" y="3" width="14" height="11" rx="1.5" stroke="#1A1A1A" strokeWidth="1.5" />
        <path d="M6 17h6" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 14v3" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="16" y="9" width="6" height="11" rx="1.5" fill="#E0E0E4" stroke="#1A1A1A" strokeWidth="1.5" />
        <path d="M18.5 17.5h1" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

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
        Best viewed on a<br />tablet or desktop
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
        The mobile version of my portfolio is in the works — please visit on a
        larger screen for the full experience.
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
