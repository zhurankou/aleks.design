import { useState } from "react";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";

interface SlideProps {
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
      onClick={onClick || (() => window.location.href = '/')}
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

export default function HomeProject314({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#fdfcff] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center w-full flex-1 shrink-0 py-[clamp(24px,4vh,48px)]">
          <div className="flex flex-col w-full max-w-[800px]" style={{ gap: "clamp(16px, 3vh, 28px)" }}>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#ffc400] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Design direction
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Keep the BBPS trend chart, clarify what “adequate” means
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Use either a bar chart or table for BBPS segments, not both.
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Keep the line chart in CIR chart, emphasize ESGE thresholds.
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Make reasons for not reaching the cecum more visible, including by doctor for leads.
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic text-[rgba(0,0,0,0.3)] whitespace-nowrap" style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors flex-1 text-left" onClick={onPreviousClick}>Previous</p>
          <div className="shrink-0 px-4" /> {/* Spacer */}
          <p className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors flex-1 text-right" onClick={onNextClick}>Next</p>
        </div>

      </div>
    </div>
  );
}