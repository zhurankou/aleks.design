import svgPaths from "./svg-tupss9jrpr";
import imgProceduresCecalIntubationRate11 from "figma:asset/7f5fb4b62115c7636e924273485e77f51834de3f.png";
import imgProceduresCecalIntubationRate1 from "figma:asset/c7cfa983deba79d56c40ace9af3bb2cfb545ea90.png";
import imgProceduresBowelPreparation1 from "figma:asset/3aa7bb43202a6f8cf158e22aea08fd7a38f052ea.png";

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

function Images() {
  return (
    <div className="h-[526px] relative shrink-0 w-[471px]" data-name="Images">
      <div className="absolute h-[360px] left-[98px] rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)] top-0 w-[373px]" data-name="Procedures - Cecal Intubation Rate-1 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgProceduresCecalIntubationRate11} />
      </div>
      <div className="absolute h-[360px] left-[49px] rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)] top-[83px] w-[373px]" data-name="Procedures - Cecal Intubation Rate 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgProceduresCecalIntubationRate1} />
      </div>
      <div className="absolute h-[360px] left-0 rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)] top-[166px] w-[373px]" data-name="Procedures - Bowel Preparation 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgProceduresBowelPreparation1} />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Images />
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Let’s chat!
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
      <Container1 />
      <Menu1 />
    </div>
  );
}

export default function HomeProject() {
  return (
    <div className="bg-[#ffc400] content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full" data-name="home-project-3">
      <Container />
    </div>
  );
}