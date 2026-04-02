import { useState } from "react";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";

interface Project31Props {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

function HouseBtn({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)", ["--fill-0" as string]: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? <HouseFilled /> : <HouseOutline />}
    </div>
  );
}

function AvatarImg() {
  return (
    <div className="relative shrink-0 rounded-full overflow-hidden" style={{ width: "clamp(40px, 5.5vw, 80px)", height: "clamp(40px, 5.5vw, 80px)" }}>
      <img alt="Avatar" className="absolute block max-w-none size-full object-cover" src={imgAvatar} />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)] rounded-full" />
    </div>
  );
}

export default function Project31({ onHomeClick, onPreviousClick, onNextClick }: Project31Props = {}) {
  return (
    <div
      className="bg-[#fdfcff] flex flex-col items-start relative w-full min-h-screen"
      style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}
    >
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content rows */}
        <div className="flex flex-col items-center justify-center w-full shrink-0" style={{ gap: "clamp(24px, 5vh, 40px)" }}>

          {/* Objective */}
          <div
            className="flex items-start"
            style={{ gap: "clamp(16px, 3vw, 40px)" }}
          >
            <p
              className="shrink-0 text-right font-['Geologica',sans-serif] font-bold not-italic text-[#ffc400] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(100px, 22vw, 400px)" }}
            >
              Objective
            </p>
            <p
              className="font-['Geologica',sans-serif] font-bold not-italic text-[#0f0f0f] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(200px, 50vw, 720px)" }}
            >
              To help endoscopists and endoscopy leads quickly see if they meet quality standards for two of the most important colonoscopy metrics.
            </p>
          </div>

          {/* Contribution */}
          <div
            className="flex items-start"
            style={{ gap: "clamp(16px, 3vw, 40px)" }}
          >
            <p
              className="shrink-0 text-right font-['Geologica',sans-serif] font-bold not-italic text-[#ffc400] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(100px, 22vw, 400px)" }}
            >
              Contribution
            </p>
            <p
              className="font-['Geologica',sans-serif] font-bold not-italic text-[#0f0f0f] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(200px, 50vw, 720px)" }}
            >
              I co‑led this project with another designer, partnering closely with UX Research across discovery, concept testing, and hi‑fi usability.
            </p>
          </div>

          {/* Duration */}
          <div
            className="flex items-center"
            style={{ gap: "clamp(16px, 3vw, 40px)" }}
          >
            <p
              className="shrink-0 text-right font-['Geologica',sans-serif] font-bold not-italic text-[#ffc400] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(100px, 22vw, 400px)" }}
            >
              Duration
            </p>
            <p
              className="font-['Geologica',sans-serif] font-bold not-italic text-[#0f0f0f] leading-[normal]"
              style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0", width: "clamp(200px, 50vw, 720px)" }}
            >
              Apr 2024 - Dec 2024
            </p>
          </div>

        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic text-[rgba(0,0,0,0.3)] whitespace-nowrap"
          style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
        >
          <p className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors" onClick={onPreviousClick}>Previous</p>
          <p className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors text-right" onClick={onNextClick}>Next</p>
        </div>

      </div>
    </div>
  );
}