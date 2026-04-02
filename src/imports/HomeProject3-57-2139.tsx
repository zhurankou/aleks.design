import { useState } from "react";
import svgPaths from "./svg-8z3mzxr5oq";

interface SlideProps {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

function HouseBtn({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative shrink-0 cursor-pointer transition-opacity duration-200"
      style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)", opacity: hovered ? 0.5 : 0.3 }}
      onClick={onClick || (() => window.location.href = '/')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <path clipRule="evenodd" d={svgPaths.p1deead90} fill="black" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function OlympusLogo() {
  return (
    <div className="relative shrink-0" style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)" }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <path d={svgPaths.p302f5200} fill="black" fillOpacity="0.3" />
        <path clipRule="evenodd" d={svgPaths.p11f3de00} fill="black" fillOpacity="0.3" fillRule="evenodd" />
      </svg>
    </div>
  );
}

export default function HomeProject({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#ffc400] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">
        
        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <OlympusLogo />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center w-full flex-1 shrink-0 my-[clamp(24px,4vh,48px)]">
          <p className="font-['Geologica',sans-serif] font-semibold leading-[normal] not-italic text-[#0f0f0f] max-w-[960px]" style={{ fontSize: "clamp(32px, 6vw, 72px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Enabling Quality Performance Insights for Endoscopy Teams
          </p>
        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic whitespace-nowrap"
          style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
        >
          <p className="cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors" onClick={onPreviousClick}>Let’s chat!</p>
          <p className="cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors" onClick={onNextClick}>Read more</p>
        </div>

      </div>
    </div>
  );
}
