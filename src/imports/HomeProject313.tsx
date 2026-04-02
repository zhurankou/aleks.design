import { useState } from "react";
import svgPaths from "./svg-ocwnb6qt3x";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgChartCardEndoscopist1 from "figma:asset/64ebabcbc400d294e4732589c7247a7c0acf62bd.png";
import imgTable2 from "figma:asset/f673e119587ae2dc5b6b7ad63395d1b004255598.png";

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

export default function HomeProject313({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
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
          <div className="relative w-full max-w-[1251px] shrink-0" style={{ aspectRatio: "1251/694" }}>

            {/* Endoscopist 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "13.35%", top: "0%", width: "51.16%", height: "60.95%" }}>
              <img alt="Chart card" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgChartCardEndoscopist1} />
            </div>

            {/* Table 2 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "48.84%", top: "39.63%", width: "51.16%", height: "60.37%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Table" className="absolute max-w-none" style={{ height: "185.68%", left: "-0.02%", top: "0", width: "100.04%" }} src={imgTable2} />
              </div>
            </div>

            {/* Text: Easy to understand */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "15.27%", top: "16.28%", width: "15.27%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Easy to understand CIR score changes over time
            </p>
            {/* Arrow 4 */}
            <div className="absolute flex items-center justify-center" style={{ left: "15.27%", top: "23.86%", width: "3.80%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full rotate-90">
                <div className="relative size-full">
                  <div className="absolute inset-[0_10.51%_0_-10.51%] overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text: Breakdown by reasons */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "60.35%", top: "17.72%", width: "15.19%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Breakdown by reasons is essencial
            </p>
            {/* Arrow 2 */}
            <div className="absolute flex items-center justify-center" style={{ left: "56.11%", top: "22.50%", width: "4.00%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[93.06deg]">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text: Leads found breakdown */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "46.12%", top: "66.43%", width: "19.42%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Leads found breakdown by doctor useful, but it requires more context.
            </p>
            {/* Arrow 1 */}
            <div className="absolute flex items-center justify-center" style={{ left: "46.40%", top: "66.40%", width: "4.07%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[-85.83deg]">
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
          <p className="text-[#0f0f0f] text-center shrink-0 px-4">Feedback</p>
          <p className="cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors flex-1 text-right" onClick={onNextClick}>Next</p>
        </div>

      </div>
    </div>
  );
}