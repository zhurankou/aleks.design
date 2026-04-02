import { useState } from "react";
import svgPaths from "./svg-jclqq8ucqv";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgBbps1 from "figma:asset/79ca77a3386160eac8c0cb3ba29e3e21eae95900.png";
import imgCir1 from "figma:asset/64ebabcbc400d294e4732589c7247a7c0acf62bd.png";

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

function ArrowSvg() {
  return (
    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.9755 39.7343">
      <path d={svgPaths.p89d5280} fill="#0F0F0F" stroke="#0F0F0F" />
    </svg>
  );
}

export default function HomeProject37({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
  return (
    <div className="bg-[#ffc400] flex flex-col items-start relative w-full min-h-screen" style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}>
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div className="flex items-center justify-between w-full shrink-0" style={{ minHeight: "clamp(32px, 5vh, 80px)" }}>
          <HouseBtn onClick={onHomeClick} />
          <AvatarImg />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center w-full flex-1 shrink-0 my-[clamp(24px,4vh,48px)]">
          <div className="relative w-full max-w-[1252px] shrink-0" style={{ aspectRatio: "1252/660" }}>
            
            {/* BBPS 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "7.35%", top: "0", width: "51.36%", height: "82.58%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="BBPS 1" className="absolute max-w-none" style={{ height: "117.49%", left: "0", top: "-17.46%", width: "100%" }} src={imgBbps1} />
              </div>
            </div>

            {/* CIR 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "48.64%", top: "17.42%", width: "51.36%", height: "82.58%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="CIR 1" className="absolute max-w-none" style={{ height: "117.49%", left: "0", top: "-17.46%", width: "100%" }} src={imgCir1} />
              </div>
            </div>

            {/* Annotation: Cecum */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "62.54%", top: "7.58%", width: "14.22%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              It is not<br />easy to see why the cecum wasn’t reached
            </p>
            {/* Arrow to CIR */}
            <div className="absolute flex items-center justify-center" style={{ left: "58.63%", top: "14.24%", width: "3.87%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[91.13deg]">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotation: Columns */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "12.30%", top: "45.91%", width: "12.30%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              What do all these columns even mean?
            </p>
            {/* Arrow to BBPS */}
            <div className="absolute flex items-center justify-center" style={{ left: "10.54%", top: "38.48%", width: "4.09%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[-94.59deg]">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic whitespace-nowrap"
          style={{ fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)", fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
        >
          <p className="cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-1 text-left" onClick={onPreviousClick}>Previous</p>
          <p className="text-[#0f0f0f] text-center shrink-0 px-4">Problems</p>
          <p className="cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-1 text-right" onClick={onNextClick}>Next</p>
        </div>

      </div>
    </div>
  );
}