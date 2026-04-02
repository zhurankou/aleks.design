import svgPaths from "./svg-u28l5fnmln";
import imgAvatar from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";
import imgProceduresCecalIntubationRate11 from "figma:asset/7f5fb4b62115c7636e924273485e77f51834de3f.png";
import imgProceduresCecalIntubationRate1 from "figma:asset/c7cfa983deba79d56c40ace9af3bb2cfb545ea90.png";
import imgProceduresBowelPreparation1 from "figma:asset/3aa7bb43202a6f8cf158e22aea08fd7a38f052ea.png";

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
          <span className="leading-[normal]">I’m a product designer who</span>
          <span className="leading-[normal]">{` love`}</span>
          <span className="leading-[normal]">s making complex things feel</span>
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
    <div className="aspect-[1728/1139] bg-[#fdfcff] relative shrink-0 w-full" data-name="home-landing">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[80px] relative size-full">
          <Container />
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

function MsftLogo() {
  return (
    <div className="relative shrink-0 size-[52px]" data-name="msft-logo 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
        <g id="msft-logo 1">
          <path d="M25 5H5V25H25V5Z" fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path d="M25 27H5V47H25V27Z" fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector_2" />
          <path d="M47 5H27V25H47V5Z" fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector_3" />
          <path d="M47 27H27V47H47V27Z" fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Menu1() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav />
      <MsftLogo />
    </div>
  );
}

function Menu2() {
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

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu1 />
      <p className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[72px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        OneDrive
        <br aria-hidden="true" />
        Sharing Redesign
      </p>
      <Menu2 />
    </div>
  );
}

function HomeProject() {
  return (
    <div className="aspect-[1728/1139] bg-[#4b49ff] relative shrink-0 w-full" data-name="home-project-1">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[80px] relative size-full">
          <Container1 />
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
          <path clipRule="evenodd" d={svgPaths.p1deead90} fill="var(--fill-0, white)" fillOpacity="0.3" fillRule="evenodd" id="base" />
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

function Group() {
  return (
    <div className="absolute inset-[0_2.22%_1.92%_2.61%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.4883 50.9991">
        <g id="Group">
          <path d={svgPaths.p22df4f00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="var(--fill-0, white)" fillOpacity="0.3" fillRule="evenodd" id="Vector_2" />
          <path d={svgPaths.p22df4f00} fill="var(--fill-0, white)" fillOpacity="0.3" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p91a5e80} fill="var(--fill-0, white)" fillOpacity="0.3" fillRule="evenodd" id="Vector_4" />
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

function Menu3() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav1 />
      <AmazonLogo />
    </div>
  );
}

function Menu4() {
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

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu3 />
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[72px] text-white w-[800px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Iconography</p>
        <p className="leading-[normal]">for eero Insight</p>
      </div>
      <Menu4 />
    </div>
  );
}

function HomeProject1() {
  return (
    <div className="aspect-[1728/1139] bg-[#07ab57] relative shrink-0 w-full" data-name="home-project-2">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[80px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function House2() {
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

function TopNav2() {
  return (
    <div className="content-stretch flex h-[45px] items-center relative shrink-0" data-name="Top nav">
      <House2 />
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

function Menu5() {
  return (
    <div className="content-stretch flex h-[80px] items-center justify-between relative shrink-0 w-full" data-name="Menu">
      <TopNav2 />
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

function Container4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Images />
    </div>
  );
}

function Menu6() {
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

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu5 />
      <Container4 />
      <Menu6 />
    </div>
  );
}

function HomeProject2() {
  return (
    <div className="aspect-[1728/1139] bg-[#ffc400] relative shrink-0 w-full" data-name="home-project-3">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[80px] relative size-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function House3() {
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

function TopNav3() {
  return (
    <div className="content-stretch flex h-[45px] items-center relative shrink-0" data-name="Top nav">
      <House3 />
    </div>
  );
}

function Menu7() {
  return (
    <div className="content-stretch flex h-[80px] items-center relative shrink-0 w-full" data-name="Menu">
      <TopNav3 />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center leading-[normal] not-italic relative shrink-0 w-[800px]" data-name="Text">
      <p className="font-['Geologica:SemiBold',sans-serif] font-semibold min-w-full relative shrink-0 text-[72px] text-white w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Let’s chat!
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold min-w-full relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        alex.zhurankou@icloud.com
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
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

function Menu8() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between not-italic relative shrink-0 text-[36px] w-full" data-name="Menu">
      <p className="leading-[normal] relative shrink-0 text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @2026
      </p>
      <Copyright />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <Menu7 />
      <Text1 />
      <Menu8 />
    </div>
  );
}

function HomeContactMe() {
  return (
    <div className="aspect-[1728/1139] bg-[#0f0f0f] relative shrink-0 w-full" data-name="home-contact-me">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[80px] relative size-full">
          <Container5 />
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