import { useState } from "react";
import svgPaths from "./svg-js04xm8zqp";
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
      style={{ width: "clamp(32px, 3.5vw, 52px)", height: "clamp(32px, 3.5vw, 52px)" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g>
          <path 
            clipRule="evenodd" 
            d={svgPaths.p1deead90} 
            fill={hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)"} 
            fillRule="evenodd" 
          />
        </g>
      </svg>
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

export default function HomeProject316({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
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
          <div className="flex flex-col w-full max-w-[800px]" style={{ gap: "clamp(20px, 4vh, 40px)" }}>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#ffc400] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Next steps
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Add side-by-side time comparisons to track the impact of protocol or training changes
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Introduce filters to exclude valid non-reach CIR cases so quality rates are more accurate
            </p>
            <p className="font-['Geologica',sans-serif] font-bold not-italic leading-[normal] text-[#0f0f0f] w-full"
              style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Tanks for reading 🙏
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic whitespace-nowrap" style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p 
            className={`flex-1 text-left ${onPreviousClick ? 'cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors' : 'text-[rgba(0,0,0,0.3)]'}`}
            onClick={onPreviousClick}
          >
            Previous
          </p>
          <div className="shrink-0 px-4" /> {/* Spacer */}
          <p 
            className="cursor-pointer text-[#ffc400] hover:text-[#ffcd33] transition-colors flex-1 text-right"
            onClick={onHomeClick}
          >
            Back to Home
          </p>
        </div>

      </div>
    </div>
  );
}