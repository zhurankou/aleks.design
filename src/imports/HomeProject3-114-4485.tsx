import { useState } from 'react';
import imgProfile from 'figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png';
import svgPathsHome from './svg-m8dddxl8st';
import svgPathsHomeFilled from './svg-qqcrbrue9h';

interface SlideProps {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

export default function HomeProject3Slide15({ onHomeClick, onPreviousClick, onNextClick }: SlideProps) {
  const [houseHovered, setHouseHovered] = useState(false);

  return (
    <div
      className="bg-[#ffc400] content-stretch flex flex-col items-start relative size-full"
      style={{ padding: '80px' }}
    >
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full">

        {/* Top nav */}
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div
            className="relative shrink-0 cursor-pointer transition-opacity duration-200"
            style={{
              width: 'clamp(32px, 3.5vw, 52px)',
              height: 'clamp(32px, 3.5vw, 52px)',
              
            }}
            onClick={onHomeClick}
            onMouseEnter={() => setHouseHovered(true)}
            onMouseLeave={() => setHouseHovered(false)}
          >
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
              <path clipRule="evenodd" d={houseHovered ? svgPathsHomeFilled.p1422e970 : svgPathsHome.p1deead90} fill={houseHovered ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'} fillRule="evenodd" />
            </svg>
          </div>

          <div
            className="relative shrink-0 rounded-full overflow-hidden"
            style={{ width: 'clamp(48px, 5.5vw, 80px)', height: 'clamp(48px, 5.5vw, 80px)' }}
          >
            <img alt="Alex's profile" className="absolute block size-full" src={imgProfile} />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.15)] rounded-full" />
          </div>
        </div>

        {/* Center — laptop mockup image */}
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full min-h-0 flex-1">
          {/* Replace src with the actual laptop mockup image once available */}
          {/* <img
            alt="Design — Bowel Preparation screen in OLYSENSE Insights"
            className="max-w-full object-contain"
            style={{ maxHeight: 'clamp(300px, 55vh, 720px)' }}
            src={imgContent}
          /> */}
          <div
            className="bg-[rgba(0,0,0,0.08)] rounded-xl flex items-center justify-center"
            style={{ width: '100%', maxHeight: 'clamp(300px, 55vh, 720px)', aspectRatio: '16/9' }}
          >
            <p
              className="font-['Geologica',sans-serif] font-bold text-[rgba(0,0,0,0.3)]"
              style={{ fontSize: 'clamp(14px, 2vw, 24px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Add laptop mockup image (p3-design.png)
            </p>
          </div>
        </div>

        {/* Bottom nav — Previous | Design | Next */}
        <div
          className="content-stretch flex font-['Geologica',sans-serif] font-bold items-center justify-between leading-[normal] relative shrink-0 w-full"
          style={{ fontSize: 'clamp(16px, 3.8vh, 36px)' }}
        >
          <p
            onClick={onPreviousClick}
            className="relative shrink-0 cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
            style={{ width: 'clamp(80px, 10vw, 160px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            Previous
          </p>
          <p
            className="relative shrink-0 text-center text-[#0f0f0f] whitespace-nowrap"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            Design
          </p>
          {onNextClick ? (
            <p
              onClick={onNextClick}
              className="relative shrink-0 text-right cursor-pointer text-[rgba(0,0,0,0.3)] hover:text-[rgba(0,0,0,0.5)] transition-colors"
              style={{ width: 'clamp(80px, 10vw, 160px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Next
            </p>
          ) : (
            <p
              className="relative shrink-0 text-right text-[rgba(0,0,0,0.15)]"
              style={{ width: 'clamp(80px, 10vw, 160px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Next
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
