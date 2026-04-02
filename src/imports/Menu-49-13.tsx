import svgPaths from "./svg-o0jw9obx78";

function House() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="house">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="house">
          <path clipRule="evenodd" d={svgPaths.p1deead90} fill="var(--fill-0, black)" fillOpacity="0.3" fillRule="evenodd" id="base" />
        </g>
      </svg>
    </div>
  );
}

function TopNav() {
  return (
    <div className="content-stretch flex h-[45px] items-center relative shrink-0" data-name="Top nav">
      <House />
    </div>
  );
}

function OlympusLogo() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="olympus-logo">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="olympus-logo">
          <g id="Vector">
            <path d={svgPaths.p302f5200} fill="var(--fill-0, black)" fillOpacity="0.3" />
            <path clipRule="evenodd" d={svgPaths.p11f3de00} fill="var(--fill-0, black)" fillOpacity="0.3" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="content-stretch flex items-center justify-between relative size-full" data-name="Menu">
      <TopNav />
      <OlympusLogo />
    </div>
  );
}