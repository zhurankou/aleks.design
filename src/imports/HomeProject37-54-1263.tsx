import svgPaths from "./svg-vrnniars8x";
import imgAvatar from "figma:asset/76d0fb1ae5045a34be679b2dc62b6fbea21b101e.png";
import imgBbps1 from "figma:asset/b2af641012093044af9271cdd7465b283d9fd2c9.png";
import imgCir1 from "figma:asset/5b17955aa91bf08a0b812fdf791907603bbe3983.png";

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

function Group() {
  return (
    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.9755 39.7343">
        <g id="Group">
          <path d={svgPaths.p89d5280} fill="var(--fill-0, #0F0F0F)" id="Vector" stroke="var(--stroke-0, #0F0F0F)" />
        </g>
      </svg>
    </div>
  );
}

function Arrow1() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Arrow">
      <Group />
    </div>
  );
}

function Arrow() {
  return (
    <div className="relative size-[47.56px]" data-name="Arrow">
      <Arrow1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.2%_13.23%_8.26%_13.23%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.9755 39.7343">
        <g id="Group">
          <path d={svgPaths.p89d5280} fill="var(--fill-0, #0F0F0F)" id="Vector" stroke="var(--stroke-0, #0F0F0F)" />
        </g>
      </svg>
    </div>
  );
}

function Arrow3() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Arrow">
      <Group1 />
    </div>
  );
}

function Arrow2() {
  return (
    <div className="relative size-[47.56px]" data-name="Arrow">
      <Arrow3 />
    </div>
  );
}

function Content() {
  return (
    <div className="h-[660px] relative shrink-0 w-[1252px]" data-name="Content">
      <div className="absolute h-[545px] left-[92px] rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)] top-0 w-[643px]" data-name="BBPS 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
          <img alt="" className="absolute h-[117.49%] left-0 max-w-none top-[-17.46%] w-full" src={imgBbps1} />
        </div>
      </div>
      <div className="absolute h-[545px] left-[609px] rounded-[12px] shadow-[0px_10px_25px_5px_rgba(0,0,0,0.1)] top-[115px] w-[643px]" data-name="CIR 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
          <img alt="" className="absolute h-[117.49%] left-0 max-w-none top-[-17.46%] w-full" src={imgCir1} />
        </div>
      </div>
      <p className="absolute font-['Figma_Hand:Bold',sans-serif] leading-[normal] left-[783px] not-italic text-[#0f0f0f] text-[16px] top-[50px] w-[178px]">
        It is not
        <br aria-hidden="true" />
        easy to see why the cecum wasn’t reached
      </p>
      <p className="-translate-x-full absolute font-['Figma_Hand:Bold',sans-serif] leading-[normal] left-[154px] not-italic text-[#0f0f0f] text-[16px] text-right top-[303px] w-[154px]">What do all these columns even mean?</p>
      <div className="absolute flex items-center justify-center left-[132px] size-[51.215px] top-[254px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-scale-y-100 flex-none rotate-[-94.59deg]">
          <Arrow />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[734px] size-[48.489px] top-[94px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-scale-y-100 flex-none rotate-[91.13deg]">
          <Arrow2 />
        </div>
      </div>
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
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] w-full" data-name="Menu">
      <p className="relative shrink-0 text-[rgba(0,0,0,0.3)] w-[160px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Previous
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Problems
      </p>
      <p className="relative shrink-0 text-[rgba(0,0,0,0.3)] text-right w-[160px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
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
    <div className="bg-[#ffc400] content-stretch flex flex-col items-start px-[120px] py-[80px] relative size-full" data-name="home-project-3-7">
      <Container />
    </div>
  );
}