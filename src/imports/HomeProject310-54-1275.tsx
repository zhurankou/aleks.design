import svgPaths from "./svg-y2gb7cc6mn";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";

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

function Avatar() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Avatar">
      <div className="absolute left-0 size-[80px] top-0" data-name="avatar">
        <img alt="" className="absolute block max-w-none size-full" height="80" src={imgAvatar} width="80" />
      </div>
      <div className="absolute bg-[rgba(0,0,0,0.15)] left-0 rounded-[60px] size-[80px] top-0" />
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav />
      <Avatar />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col font-['Geologica:Bold',sans-serif] font-bold gap-[28px] items-start leading-[normal] not-italic relative shrink-0 text-[36px] w-[720px]" data-name="Content">
      <p className="relative shrink-0 text-[#ffc400] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Design direction
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Define “passing” BBPS more clearly—either as total ≥ 6 or as at least 2 per segment
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Treat scores with 0 or 1 as a distinct risk bucket
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Provide average BBPS over a time period rather than score‑by‑score counts.
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Use the line chart with ESGE benchmark lines and add reasons the cecum wasn’t reached.
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Content />
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Previous
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Next
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu />
      <Container1 />
      <Menu1 />
    </div>
  );
}

export default function HomeProject() {
  return (
    <div className="bg-[#fdfcff] content-stretch flex flex-col items-start px-[120px] py-[80px] relative size-full" data-name="home-project-3-10">
      <Container />
    </div>
  );
}