import svgPaths from "./svg-kxg3wlvxau";

function House() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="house">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="house">
          <path clipRule="evenodd" d={svgPaths.p1deead90} fill="var(--fill-0, white)" fillOpacity="0.5" fillRule="evenodd" id="base" />
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

function Menu() {
  return (
    <div className="content-stretch flex h-[80px] items-center relative shrink-0 w-full" data-name="Menu">
      <TopNav />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center leading-[normal] not-italic relative shrink-0 text-white w-[800px]" data-name="Text">
      <p className="font-['Geologica:SemiBold',sans-serif] font-semibold min-w-full relative shrink-0 text-[72px] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Let’s chat!
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold min-w-full relative shrink-0 text-[36px] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        alex.zhurankou@icloud.com
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold relative shrink-0 text-[36px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        linkedin.com/in/zhurankou
      </p>
    </div>
  );
}

function Copyright() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 text-right" data-name="copyright">
      <p className="leading-[normal] relative shrink-0 text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        with
      </p>
      <div className="flex flex-col h-full justify-center leading-[0] relative shrink-0 text-white w-[36px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal]">❤️</p>
      </div>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between not-italic relative shrink-0 text-[36px] w-full" data-name="Menu">
      <p className="leading-[normal] relative shrink-0 text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @2026
      </p>
      <Copyright />
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

export default function HomeContactMe() {
  return (
    <div className="bg-[#0f0f0f] content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full" data-name="home-contact-me">
      <Container />
    </div>
  );
}