import { useState } from "react";
import svgPaths from "./svg-vud87z2ifx";

import imgOneDrive from "../assets/onedrive-icon.png";
import imgWord from "../assets/word-icon.png";
import imgTeams from "../assets/teams-icon.png";
import imgExcel from "../assets/excel-icon.png";
import imgPowerPoint from "../assets/powerpoint-icon.png";

import iconUsers from "../assets/icon-users.svg";
import iconPen from "../assets/icon-pen.svg";
import iconEyeOff from "../assets/icon-eye-off.svg";
import iconSend from "../assets/icon-send.svg";
import iconLink from "../assets/icon-link.svg";

interface SlideProps {
  onHomeClick?: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

function GridBackground() {
  const cols = 72;
  const rows = 48;
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 24px)`,
        gridTemplateRows: `repeat(${rows}, 24px)`,
      }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          className="rounded-[4px]"
          style={{
            width: 24,
            height: 24,
            backgroundColor: (Math.floor(i / cols) + (i % cols)) % 2 === 0 ? "#1a1a1a" : "#0f0f0f",
          }}
        />
      ))}
    </div>
  );
}

function HouseBtn({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative shrink-0 cursor-pointer transition-opacity duration-200"
      style={{ width: 52, height: 52, opacity: hovered ? 1 : 0.3 }}
      onClick={onClick || (() => (window.location.href = "/"))}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 52 52"
      >
        <path
          clipRule="evenodd"
          d={svgPaths.p1deead90}
          fill="white"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

function MsftLogo() {
  return (
    <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 52 52"
      >
        <path d="M25 5H5V25H25V5Z" fill="white" fillOpacity="0.3" />
        <path d="M25 27H5V47H25V27Z" fill="white" fillOpacity="0.3" />
        <path d="M47 5H27V25H47V5Z" fill="white" fillOpacity="0.3" />
        <path d="M47 27H27V47H47V27Z" fill="white" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

const appIcons = [
  { src: imgOneDrive, alt: "OneDrive" },
  { src: imgWord, alt: "Word" },
  { src: imgTeams, alt: "Teams" },
  { src: imgExcel, alt: "Excel" },
  { src: imgPowerPoint, alt: "PowerPoint" },
];

const actionIcons = [
  { src: iconUsers, alt: "Users" },
  { src: iconPen, alt: "Edit" },
  { src: iconEyeOff, alt: "Visibility" },
  { src: iconSend, alt: "Send" },
  { src: iconLink, alt: "Link" },
];

const buttons = ["Send link", "Copy link", "Share"];

export default function HomeProject({
  onHomeClick,
  onPreviousClick,
  onNextClick,
}: SlideProps = {}) {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: "#0f0f0f" }}
      data-name="home-project-1"
    >
      <GridBackground />

      {/* Navigation frame */}
      <div
        className="absolute flex flex-col justify-between"
        style={{ top: 80, left: 80, right: 80, bottom: 80 }}
      >
        {/* Top Menu */}
        <div className="flex items-center justify-between shrink-0" style={{ height: 80 }}>
          <HouseBtn onClick={onHomeClick} />
          <MsftLogo />
        </div>

        {/* Bottom Menu */}
        <div
          className="flex items-center justify-between shrink-0 whitespace-nowrap"
          style={{
            height: 45,
            fontFamily: "'Geologica', sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
          }}
        >
          <p
            className="cursor-pointer hover:text-white transition-colors"
            onClick={onPreviousClick}
          >
            Next
          </p>
          <p
            className="cursor-pointer hover:text-white transition-colors text-right"
            onClick={onNextClick}
          >
            Read
          </p>
        </div>
      </div>

      {/* Section: Project label + blue card */}
      <div
        className="absolute flex flex-col gap-[8px] items-start justify-end"
        style={{ left: 250, top: 291, width: 812, height: 558 }}
      >
        <p
          style={{
            fontFamily: "'Geologica', sans-serif",
            fontWeight: 400,
            fontSize: 24,
            color: "#D9D9D9",
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
          }}
        >
          Project
        </p>
        <div
          className="relative w-full shrink-0"
          style={{
            height: 520,
            backgroundColor: "#4B49FF",
            border: "4px solid #0F0F0F",
            borderRadius: 16,
          }}
        >
          <p
            className="absolute"
            style={{
              left: 76,
              top: 76,
              width: 652,
              fontFamily: "'Geologica', sans-serif",
              fontWeight: 600,
              fontSize: 72,
              color: "#FDFCFF",
              lineHeight: "normal",
              fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
            }}
          >
            {"Simplifying "}
            <br aria-hidden="true" />
            File Sharing and Collaboration in OneDrive
          </p>
        </div>
      </div>

      {/* App icons column */}
      {appIcons.map((app, i) => (
        <div
          key={app.alt}
          className="absolute rounded-[16px] overflow-hidden"
          style={{
            left: 1102,
            top: 329 + i * 118,
            width: 96,
            height: 96,
          }}
        >
          <img
            src={app.src}
            alt={app.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Action icons column (pink bordered) */}
      {actionIcons.map((icon, i) => (
        <div
          key={icon.alt}
          className="absolute flex items-center justify-center"
          style={{
            left: 1238,
            top: 338 + i * 96,
            width: 59,
            height: 56,
            border: "4px solid #E16FF6",
            padding: 8,
          }}
        >
          <img src={icon.src} alt={icon.alt} className="w-[40px] h-[40px]" />
        </div>
      ))}

      {/* Buttons */}
      {buttons.map((label, i) => (
        <div
          key={label}
          className="absolute flex items-center justify-center cursor-pointer hover:border-white hover:text-white transition-colors"
          style={{
            left: 1337,
            top: 338 + i * 102,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: "#0F0F0F",
            border: "2px solid #D9D9D9",
            borderRadius: 16,
            fontFamily: "'Geologica', sans-serif",
            fontWeight: 500,
            fontSize: 24,
            color: "#D9D9D9",
            whiteSpace: "nowrap",
            fontVariationSettings: "'CRSV' 0, 'SHRP' 0",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
