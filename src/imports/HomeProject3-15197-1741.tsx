import { useState } from 'react';
import imgProfile from 'figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png';
import imgDoctor from '../assets/doctor-lead.png';
import svgPathsHome from './svg-m8dddxl8st';
import svgPathsHomeFilled from './svg-qqcrbrue9h';

interface SlideProps {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

export default function HomeProject3Slide5({ onHomeClick, onPreviousClick, onNextClick }: SlideProps) {
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

        {/* Center content: text left, image right */}
        <div
          className="content-stretch flex items-center relative shrink-0 w-full"
          style={{ gap: 'clamp(32px, 5vw, 64px)', paddingLeft: '160px', paddingRight: '160px' }}
        >
          {/* Text */}
          <div
            className="content-stretch flex flex-col items-start flex-1 min-w-0"
            style={{ gap: 'clamp(12px, 2vh, 24px)' }}
          >
            <p
              className="font-['Geologica',sans-serif] font-bold text-[#0f0f0f] w-full"
              style={{ fontSize: 'clamp(18px, min(2.5vw, 4vh), 36px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Endoscopy Lead–Senior clinician, leading service governance, quality, and training.
            </p>
            <p
              className="font-['Geologica',sans-serif] font-bold text-[#fdfcff] w-full"
              style={{ fontSize: 'clamp(18px, min(2.5vw, 4vh), 36px)', fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              "I need oversight dashboards for service metrics, staff scheduling, quality audits, and compliance training tracking."
            </p>
          </div>

          {/* Doctor illustration */}
          <div
            className="relative shrink-0 overflow-hidden"
            style={{
              width: 'clamp(180px, 30vw, 445px)',
              height: 'clamp(200px, 35vw, 480px)',
            }}
          >
            <img
              alt="Endoscopy Lead illustration"
              className="absolute max-w-none"
              style={{
                width: '240.1%',
                height: '121.49%',
                left: '-127.13%',
                top: '-11.21%',
              }}
              src={imgDoctor}
            />
          </div>
        </div>

        {/* Bottom nav */}
        <div
          className="content-stretch flex font-['Geologica',sans-serif] font-bold items-center justify-between leading-[normal] relative shrink-0 text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap"
          style={{ fontSize: 'clamp(16px, 3.8vh, 36px)' }}
        >
          <p
            onClick={onPreviousClick}
            className="relative shrink-0 cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            Previous
          </p>
          {onNextClick && (
            <p
              onClick={onNextClick}
              className="relative shrink-0 text-right cursor-pointer hover:text-[rgba(0,0,0,0.5)] transition-colors"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Next
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
