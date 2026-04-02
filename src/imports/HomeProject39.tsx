import { useState } from "react";
import svgPaths from "./svg-nnheusnuw6";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgOption41 from "figma:asset/64ebabcbc400d294e4732589c7247a7c0acf62bd.png";
import imgOption1LineChart1 from "figma:asset/79ca77a3386160eac8c0cb3ba29e3e21eae95900.png";
import imgOption2BarsChart1 from "figma:asset/20a08611051f32e6e96ee1de9ef1f7e6b60add6b.png";

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

export default function HomeProject39({ onHomeClick, onPreviousClick, onNextClick }: SlideProps = {}) {
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
          <div className="relative w-full max-w-[1051px] shrink-0" style={{ aspectRatio: "1050.6/697.5" }}>

            {/* Option 4 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "0%", top: "29.25%", width: "47.21%", height: "43.01%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Option 4" className="absolute max-w-none" style={{ height: "151.09%", left: "0", top: "-0.01%", width: "111.69%" }} src={imgOption41} />
              </div>
            </div>

            {/* Option 1_ Line Chart 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "49.97%", top: "52.62%", width: "45.69%", height: "43.01%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Line Chart Option" className="absolute max-w-none" style={{ height: "142.98%", left: "-22.65%", top: "-19.38%", width: "140.38%" }} src={imgOption1LineChart1} />
              </div>
            </div>

            {/* Option 2_ Bars Chart 1 */}
            <div className="absolute rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)]" style={{ left: "49.97%", top: "4.87%", width: "45.69%", height: "43.01%" }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
                <img alt="Bars Chart Option" className="absolute max-w-none" style={{ height: "120.63%", left: "-22.63%", top: "-20.57%", width: "140.35%" }} src={imgOption2BarsChart1} />
              </div>
            </div>

            {/* Annotation: Breakdown */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "70.44%", top: "0%", width: "12.95%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Breakdown by sections is essential
            </p>
            {/* Arrow to Breakdown */}
            <div className="absolute flex items-center justify-center" style={{ left: "65.68%", top: "5.74%", width: "5.24%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[80.13deg]">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotation: Simpler charts */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f]" style={{ left: "86.29%", top: "90.54%", width: "13.71%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Simpler charts beat dense dashboards
            </p>
            {/* Arrow to Simpler charts */}
            <div className="absolute flex items-center justify-center" style={{ left: "81.73%", top: "87.96%", width: "4.53%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -rotate-90">
                <div className="relative size-full">
                  <div className="absolute inset-0 overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotation: Reasons */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "28.27%", top: "21.22%", width: "14.66%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              Reasons for not reaching the cecum are very actionable
            </p>
            {/* Arrow to Reasons */}
            <div className="absolute flex items-center justify-center" style={{ left: "29.03%", top: "31.25%", width: "4.53%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full rotate-90">
                <div className="relative size-full">
                  <div className="absolute inset-[0_10.51%_0_-10.51%] overflow-clip">
                    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]"><ArrowSvg /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annotation: Line chart */}
            <p className="absolute font-['Figma_Hand',sans-serif] font-bold leading-[normal] not-italic text-[#0f0f0f] text-right -translate-x-full" style={{ left: "19.99%", top: "67.38%", width: "17.89%", fontSize: "clamp(12px, 1.25vw, 16px)" }}>
              A simple line chart over time is easy to read
            </p>
            {/* Arrow to Line chart */}
            <div className="absolute flex items-center justify-center" style={{ left: "19.99%", top: "64.37%", width: "4.92%", aspectRatio: "1/1" }}>
              <div className="flex-none w-full h-full -scale-y-100 rotate-[-95.18deg]">
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