import { useState } from "react";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgPerson from "figma:asset/c35e0311cb982032b2d9b6bab18c8a1f704b90ba.png";

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

export default function HomeProject35({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#ffc400] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content: text left, person image right — centered */}
        <div className="flex items-center justify-center w-full shrink-0">
          <div className="flex items-center overflow-hidden" style={{ gap: "clamp(24px, 4vw, 48px)", paddingLeft: "clamp(12px, 3vw, 40px)" }}>
            {/* Text */}
            <div className="flex flex-col min-w-0" style={{ gap: "clamp(12px, 2.5vh, 24px)", maxWidth: "720px", flex: "1 1 auto" }}>
              <p
                className="font-['Geologica',sans-serif] font-bold not-italic text-[#0f0f0f] leading-[normal] w-full"
                style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                Endoscopy Lead–Senior clinician, leading service governance, quality, and training.
              </p>
              <p
                className="font-['Geologica',sans-serif] font-bold not-italic text-[#fdfcff] leading-[normal] w-full"
                style={{ fontSize: "clamp(14px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              >
                "I need oversight dashboards for service metrics, staff scheduling, quality audits, and compliance training tracking."
              </p>
            </div>
            {/* Person illustration — Endoscopy Lead (doctor with clipboard) */}
            <div className="relative shrink-0 overflow-hidden" style={{ height: "clamp(200px, 50vh, 480px)", width: "clamp(140px, 25vw, 445px)" }}>
              <img
                alt="Endoscopy Lead illustration"
                className="absolute max-w-none pointer-events-none"
                style={{ height: "121.49%", left: "-127.13%", top: "-11.21%", width: "240.1%" }}
                src={imgPerson}
              />
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