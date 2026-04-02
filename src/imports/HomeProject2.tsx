import svgPaths from "./svg-19o4l9m7al";

function House() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="house">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="house">
          <path clipRule="evenodd" d={svgPaths.p1deead90} fill="var(--fill-0, white)" fillOpacity="0.3" fillRule="evenodd" id="base" />
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

function Group() {
  return (
    <div className="absolute inset-[0_2.22%_1.92%_2.61%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.4883 50.9991">
        <g id="Group">
          <path d={svgPaths.p22df4f00} fill="var(--fill-0, #FF9900)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="var(--fill-0, #FF9900)" fillRule="evenodd" id="Vector_2" />
          <path d={svgPaths.p22df4f00} fill="var(--fill-0, #FF9900)" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="var(--fill-0, #FF9900)" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function AmazonLogo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[52px]" data-name="amazon-logo 1">
      <Group />
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav />
      <AmazonLogo />
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] w-full whitespace-nowrap" data-name="Menu">
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
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[72px] text-white w-[800px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Iconography</p>
        <p className="leading-[normal]">for eero Insight</p>
      </div>
      <Menu1 />
    </div>
  );
}

export default function HomeProject() {
  return (
    <div className="bg-[#07ab57] content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full" data-name="home-project-2">
      <Container />
    </div>
  );
}