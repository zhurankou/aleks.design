import { useState } from "react";
import svgPaths from "./svg-ob4dh46786";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgColon from "figma:asset/72662ce3cbe9a03e58efa85fe1ff49c2a1dd5cdb.png";

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
        <path
          clipRule="evenodd"
          d={svgPaths.p1deead90}
          fill="black"
          fillOpacity={hovered ? 0.5 : 0.3}
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

function AvatarImg() {
  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden"
      style={{ width: "clamp(40px, 5.5vw, 80px)", height: "clamp(40px, 5.5vw, 80px)" }}
    >
      <img alt="Avatar" className="absolute block max-w-none size-full object-cover" src={imgAvatar} />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)] rounded-full" />
    </div>
  );
}

export default function HomeProject34({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div
      className="bg-[#ffc400] flex flex-col items-start relative w-full min-h-screen"
      style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}
    >
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content: image left (CIR crop), text right */}
        <div className="flex items-center justify-center w-full shrink-0">
          <div
            className="flex items-center justify-center relative w-full"
            style={{ paddingLeft: "clamp(20px, 5vw, 80px)" }}
          >
            <div
              className="content-stretch flex items-center relative shrink-0"
              style={{ gap: "clamp(32px, 4vw, 64px)" }}
            >
              {/* CIR colon image — scope/clean crop */}
              <div
                className="relative shrink-0"
                style={{ height: "clamp(240px, 50vh, 480px)", width: "clamp(188px, 30vw, 422px)" }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    alt="CIR colon illustration"
                    className="absolute max-w-none pointer-events-none"
                    style={{ height: "110.82%", left: "-120.59%", top: "-5.84%", width: "230.84%" }}
                    src={imgColon}
                  />
                </div>
              </div>

              {/* Text */}
              <div
                className="flex flex-col min-w-0"
                style={{ gap: "clamp(12px, 2.5vh, 24px)", maxWidth: "720px", width: "100%" }}
              >
                <p
                  className="font-['Geologica',sans-serif] font-bold not-italic text-[#0f0f0f] leading-[normal] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  Cecal Intubation Rate (CIR)
                </p>
                <p
                  className="font-['Geologica',sans-serif] font-bold not-italic text-[#fdfcff] leading-[normal] w-full"
                  style={{ fontSize: "clamp(20px, min(3.5vw, 4vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  The percentage of colonoscopies where the scope successfully reaches and visualizes the cecum, indicating a complete examination.
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
