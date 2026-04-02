import { useState } from "react";
import HouseOutline from "./House-52-233";
import HouseFilled from "./House-52-237";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";

interface HomeProject32Props {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

function House({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{
        width: "clamp(32px, 3.5vw, 52px)",
        height: "clamp(32px, 3.5vw, 52px)",
        ["--fill-0" as string]: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? <HouseFilled /> : <HouseOutline />}
    </div>
  );
}

function Avatar() {
  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden"
      style={{ width: "clamp(40px, 5.5vw, 80px)", height: "clamp(40px, 5.5vw, 80px)" }}
    >
      <img
        alt="Avatar"
        className="absolute block max-w-none size-full object-cover"
        src={imgAvatar}
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)] rounded-full" />
    </div>
  );
}

export default function HomeProject32({ onHomeClick, onPreviousClick, onNextClick }: HomeProject32Props = {}) {
  return (
    <div
      className="bg-[#ffc400] flex flex-col items-start relative w-full min-h-screen"
      style={{ padding: "clamp(16px, 6vh, 80px) clamp(20px, 8vw, 120px)" }}
    >
      <div className="flex flex-col flex-1 items-start justify-between w-full min-h-[calc(100vh-clamp(32px,12vh,160px))]">

        {/* Top nav */}
        <div
          className="flex items-center justify-between w-full shrink-0"
          style={{ minHeight: "clamp(32px, 5vh, 80px)" }}
        >
          <House onClick={onHomeClick} />
          <Avatar />
        </div>

        {/* Main text — centered with constrained width like Figma */}
        <div
          className="flex items-center justify-center w-full shrink-0"
        >
          <div
            className="flex items-center justify-end"
            style={{ padding: "0 clamp(12px, 5vw, 80px)", maxWidth: "1200px", width: "100%" }}
          >
            <p
              className="font-['Geologica',sans-serif] font-semibold not-italic text-[#0f0f0f] w-full"
              style={{
                fontSize: "clamp(22px, min(4.17vw, 7.5vh), 72px)",
                lineHeight: "normal",
                fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
              }}
            >
              Boston Bowel Preparation Score and Cecal Intubation Rate are{" "}
              <span className="text-[#fdfcff]">two of the highest‑value</span>
              {" "}colonoscopy quality metrics in Clinical Insights.
            </p>
          </div>
        </div>

        {/* Bottom menu */}
        <div
          className="flex items-center justify-between w-full shrink-0 font-['Geologica',sans-serif] font-bold leading-[normal] not-italic text-[rgba(0,0,0,0.3)] whitespace-nowrap"
          style={{
            fontSize: "clamp(16px, min(2.5vw, 3.8vh), 36px)",
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
          }}
        >
          <p
            className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors"
            onClick={onPreviousClick}
          >
            Previous
          </p>
          <p
            className="cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors text-right"
            onClick={onNextClick}
          >
            Next
          </p>
        </div>
      </div>
    </div>
  );
}