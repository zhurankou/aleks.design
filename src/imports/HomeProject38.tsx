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

export default function HomeProject38({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#fdfcff] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center w-full flex-1 shrink-0 my-[clamp(24px,4vh,48px)]">
          <div className="flex flex-col w-full max-w-[1160px]" style={{ gap: "clamp(24px, 4vh, 40px)" }}>
            
            {/* Contribution */}
            <div className="flex w-full" style={{ gap: "clamp(16px, 3vw, 40px)" }}>
              <p
                className="font-['Geologica',sans-serif] font-bold text-[#ffc400] text-right shrink-0"
                style={{ width: "clamp(140px, 25vw, 400px)", fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                Contribution
              </p>
              <p
                className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full max-w-[720px]"
                style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                My design partner and I worked with UX Research to shape the test and create low-fi prototypes. We also took turns interviewing participants and taking notes.
              </p>
            </div>

            {/* UXR */}
            <div className="flex w-full" style={{ gap: "clamp(16px, 3vw, 40px)" }}>
              <p
                className="font-['Geologica',sans-serif] font-bold text-[#ffc400] text-right shrink-0"
                style={{ width: "clamp(140px, 25vw, 400px)", fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                UXR
              </p>
              <div className="flex flex-col w-full max-w-[720px]" style={{ gap: "clamp(12px, 2vh, 24px)" }}>
                <p
                  className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  Low-fi concept testing
                </p>
                <p
                  className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  60-minute sessions
                </p>
                <p
                  className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  11 participants (2 Leads + 9 Endoscopists)
                </p>
                <p
                  className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  2 hospitals (Germany + Spain)
                </p>
              </div>
            </div>

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