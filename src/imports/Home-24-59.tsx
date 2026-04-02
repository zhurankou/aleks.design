import svgPaths from "./svg-m8dddxl8st";
import imgAvatar from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";

function Avatar() {
  return (
    <div className="relative shrink-0 size-[120px]" data-name="Avatar">
      <div className="absolute left-0 size-[120px] top-0" data-name="avatar">
        <img alt="" className="absolute block max-w-none size-full" height="120" src={imgAvatar} width="120" />
      </div>
      <div className="absolute bg-[rgba(0,0,0,0.15)] left-0 rounded-[60px] size-[120px] top-0" />
    </div>
  );
}

function MailIdle() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="mail-idle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="mail-idle">
          <path clipRule="evenodd" d={svgPaths.p2cac3900} fill="var(--fill-0, #B2B2B2)" fillRule="evenodd" id="base" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Avatar />
      <MailIdle />
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        My work
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        About me
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Frame />
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[0px] text-black w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0 text-[72px]">Hi 👋, I’m Alex.</p>
        <p className="text-[72px]">
          <span className="leading-[normal]">I’m a product designer who enjoys making complex things feel</span>
          <span className="leading-[normal] text-[#ff6613]">{` simpl`}</span>
          <span className="leading-[normal]">e. I care about</span>
          <span className="leading-[normal] text-[#4b49ff]">{` craf`}</span>
          <span className="leading-[normal]">t,</span>
          <span className="leading-[normal] text-[#07ab57]">{` usabilit`}</span>
          <span className="leading-[normal]">y, and creating experiences that feel</span>
          <span className="leading-[normal] text-[#9149ff]">{` clea`}</span>
          <span className="leading-[normal]">r and</span>
          <span className="leading-[normal] text-[#ff00ec]">{` intuitiv`}</span>
          <span className="leading-[normal]">e</span>
          <span className="leading-[normal]">.</span>
        </p>
      </div>
      <Menu />
    </div>
  );
}

function HomeLanding() {
  return (
    <div className="aspect-[1728/1139] bg-white relative shrink-0 w-full" data-name="home-landing">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Next project
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Read more
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between leading-[normal] not-italic pt-[320px] relative size-full">
        <p className="font-['Geologica:SemiBold',sans-serif] font-semibold relative shrink-0 text-[72px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          OneDrive
          <br aria-hidden="true" />
          Sharing Redesign
        </p>
        <Menu1 />
      </div>
    </div>
  );
}

function HomeProject() {
  return (
    <div className="aspect-[1728/1139] bg-[#4b49ff] relative shrink-0 w-full" data-name="home-project-1">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Menu2() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Next project
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Read more
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between not-italic pt-[320px] relative size-full">
        <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[72px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="leading-[normal] mb-0">Iconography</p>
          <p className="leading-[normal]">for eero Insight</p>
        </div>
        <Menu2 />
      </div>
    </div>
  );
}

function HomeProject1() {
  return (
    <div className="aspect-[1728/1139] bg-[#07ab57] relative shrink-0 w-full" data-name="home-project-2">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

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

function Menu3() {
  return (
    <div className="content-stretch flex h-[80px] items-center relative shrink-0 w-full" data-name="Menu">
      <TopNav />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center leading-[0] not-italic relative shrink-0 text-[#0f0f0f] w-[800px]" data-name="Text">
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold relative shrink-0 text-[72px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Colonoscopy</p>
        <p className="leading-[normal]">Quality Metrics</p>
      </div>
      <div className="font-['Geologica:Bold',sans-serif] font-bold relative shrink-0 text-[36px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Redesigning Bowel Prep and Cecal Intubation reports in OlySense Clinical Insights</p>
        <p className="leading-[normal]">&nbsp;</p>
      </div>
    </div>
  );
}

function Menu4() {
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

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu3 />
      <Text />
      <Menu4 />
    </div>
  );
}

function HomeProject2() {
  return (
    <div className="aspect-[1728/1139] bg-[#ffcb00] relative shrink-0 w-full" data-name="home-project-3">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function House1() {
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

function TopNav1() {
  return (
    <div className="content-stretch flex h-[45px] items-center relative shrink-0" data-name="Top nav">
      <House1 />
    </div>
  );
}

function Menu5() {
  return (
    <div className="content-stretch flex h-[80px] items-center relative shrink-0 w-full" data-name="Menu">
      <TopNav1 />
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

function Menu6() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between not-italic relative shrink-0 text-[36px] w-full" data-name="Menu">
      <p className="leading-[normal] relative shrink-0 text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @2026
      </p>
      <Copyright />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu5 />
      <p className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[72px] text-white w-[800px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        {`Let’s `}
        <br aria-hidden="true" />
        Get in Touch!
      </p>
      <Menu6 />
    </div>
  );
}

function HomeContactMe() {
  return (
    <div className="aspect-[1728/1139] bg-[#0f0f0f] relative shrink-0 w-full" data-name="home-contact-me">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="home">
      <HomeLanding />
      <HomeProject />
      <HomeProject1 />
      <HomeProject2 />
      <HomeContactMe />
    </div>
  );
}