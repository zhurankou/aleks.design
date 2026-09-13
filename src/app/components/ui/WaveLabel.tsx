import * as React from "react";

// Per-character colour-wave label (SELECTED WORK / CASE STUDY / PROBLEM / etc.),
// shared by both mobile pages. Relies on the 'selected-wave' keyframe already
// injected globally by the page (homeLoadAnim / loadAnim) — doesn't own it.
export function WaveLabel({ text, color = "#A8AFB6", fontSize = 18, lineHeight = "28px", onClick, style }: {
  text: string;
  color?: string;
  fontSize?: number;
  lineHeight?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <p
      onClick={onClick}
      style={{ margin: 0, fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize, lineHeight, color, textAlign: "center", whiteSpace: "nowrap", ...style }}
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", animation: "selected-wave 2s ease-in-out infinite", animationDelay: `${i * 0.12}s` }}>
          {ch}
        </span>
      ))}
    </p>
  );
}
