import svgPaths from "./svg-rlpoa19lop";

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
          <path d={svgPaths.p1132b440} fill="var(--fill-0, #334CE1)" id="Layer" />
          <path clipRule="evenodd" d={svgPaths.p2ae4e480} fill="var(--fill-0, #334CE1)" fillRule="evenodd" id="Layer_2" />
        </g>
      </svg>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav />
      <OlympusLogo />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center not-italic relative shrink-0 text-[#0f0f0f] w-[800px]" data-name="Text">
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[72px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Colonoscopy</p>
        <p className="leading-[normal]">Quality Metrics</p>
      </div>
      <p className="font-['Geologica:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[36px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Redesigning Bowel Prep and Cecal Intubation Rate reports in Clinical Insights
      </p>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Next project
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Read more
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu />
      <Text />
      <Menu1 />
    </div>
  );
}

export default function HomeProject() {
  return (
    <div className="bg-[#ffcb00] content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full" data-name="home-project-3">
      <Container />
    </div>
  );
}