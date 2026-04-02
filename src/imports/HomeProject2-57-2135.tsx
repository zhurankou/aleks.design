import { useState } from "react";
import svgPaths from "./svg-jfahvg3h4p";

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
      style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)", opacity: hovered ? 1 : 0.3 }}
      onClick={onClick || (() => window.location.href = '/')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <path clipRule="evenodd" d={svgPaths.p1deead90} fill="white" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function AmazonLogo() {
  return (
    <div className="overflow-clip relative shrink-0" style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)" }}>
      <div className="absolute inset-[0_2.22%_1.92%_2.61%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.4883 50.9991">
          <path d={svgPaths.p22df4f00} fill="white" fillOpacity="0.3" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="white" fillOpacity="0.3" fillRule="evenodd" />
          <path d={svgPaths.p22df4f00} fill="white" fillOpacity="0.3" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="white" fillOpacity="0.3" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export default function HomeProject({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#07ab57] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">
        
        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AmazonLogo />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center w-full flex-1 shrink-0 my-[clamp(24px,4vh,48px)]">
          <p className="font-['Geologica',sans-serif] font-semibold leading-[normal] not-italic text-white max-w-[960px]" style={{ fontSize: "clamp(32px, 6vw, 72px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Defining Iconography Standards for eero Insights
          </p>
        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic whitespace-nowrap"
          style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
        >
          <p className="cursor-pointer text-[rgba(255,255,255,0.5)] hover:text-white transition-colors" onClick={onPreviousClick}>Next project</p>
          <p className="cursor-pointer text-[rgba(255,255,255,0.5)] hover:text-white transition-colors" onClick={onNextClick}>Read more</p>
        </div>

      </div>
    </div>
  );
}
