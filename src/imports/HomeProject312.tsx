import { useState } from "react";
import svgPaths from "./svg-vvkwwuflxf";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgByScore1 from "figma:asset/79ca77a3386160eac8c0cb3ba29e3e21eae95900.png";
import imgBySegment1 from "figma:asset/20a08611051f32e6e96ee1de9ef1f7e6b60add6b.png";
import imgTable1 from "figma:asset/f64e990640d8db924a174c24e61cd84a3b61bdce.png";

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

export default function HomeProject312({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
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
          <div className="relative w-full max-w-[1318px] shrink-0" style={{ aspectRatio: "1318/724" }}>

            {/* By Score 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "0%", top: "7.46%", width: "48.56%", height: "54.83%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Score chart" className="absolute max-w-none" style={{ height: "102.58%", left: "-1.32%", top: "-0.77%", width: "102.31%" }} src={imgByScore1} />
              </div>
            </div>

            {/* By Segment 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "19.50%", top: "37.57%", width: "48.56%", height: "62.43%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Segment chart" className="absolute max-w-none" style={{ height: "103.69%", left: "-0.96%", top: "-1.17%", width: "101.91%" }} src={imgBySegment1} />
              </div>
            </div>

            {/* Table 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "51.44%", top: "25.00%", width: "48.56%", height: "35.91%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Table" className="absolute max-w-none" style={{ height: "103.11%", left: "-0.82%", top: "-1.17%", width: "101.32%" }} src={imgTable1} />
              </div>
            </div>

            {/* Text: Very useful */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "25.49%", top: "0%", width: "15.78%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Very useful to identify the lowest-performing month
            </p>
            {/* Arrow 1 */}
            <div className="absolute flex items-center justify-center" style={{ left: "21.70%", top: "5.80%", width: "3.61%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-90">
                <div className="relative size-full">
                  <div className="absolute inset-[0_10.51%_0_-10.51%] overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text: Disconnected */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "71.93%", top: "18.51%", width: "13.28%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Disconnected from individual cases
            </p>
            {/* Arrow 4 */}
            <div className="absolute flex items-center justify-center" style={{ left: "67.83%", top: "23.48%", width: "3.80%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[93.06deg]">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text: Adequate */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "24.58%", top: "88.40%", width: "18.06%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              The “Adequate” concept should explicitly say “at least 2 per segment”
            </p>
            {/* Arrow 2 */}
            <div className="absolute flex items-center justify-center" style={{ left: "24.89%", top: "90.75%", width: "4.42%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full rotate-75">
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