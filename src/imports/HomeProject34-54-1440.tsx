import svgPaths from "./svg-uagnf7hky9";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgAdobeExpressFile4 from "figma:asset/72662ce3cbe9a03e58efa85fe1ff49c2a1dd5cdb.png";

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

function Text() {
  return (
    <div className="content-stretch flex flex-col font-['Geologica:Bold',sans-serif] font-bold gap-[24px] items-start leading-[normal] not-italic relative shrink-0 text-[36px] w-[720px]" data-name="Text">
      <p className="relative shrink-0 text-[#0f0f0f] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>{`Cecal Intubation Rate (CIR) `}</p>
      <p className="relative shrink-0 text-[#fdfcff] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        The percentage of colonoscopies where the scope successfully reaches and visualizes the cecum, indicating a complete examination.
      </p>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[48px] items-center relative shrink-0" data-name="Content">
      <div className="h-[400px] relative shrink-0 w-[352px]" data-name="Adobe Express - file 4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[110.82%] left-[-120.59%] max-w-none top-[-5.84%] w-[230.84%]" src={imgAdobeExpressFile4} />
        </div>
      </div>
      <Text />
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[80px] relative w-full">
          <Content1 />
        </div>
      </div>
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
      <Content />
      <Menu1 />
    </div>
  );
}

export default function HomeProject() {
  return (
    <div className="bg-[#ffc400] content-stretch flex flex-col items-start px-[120px] py-[80px] relative size-full" data-name="home-project-3-4">
      <Container />
    </div>
  );
}