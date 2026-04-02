function Menu() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        My work
      </p>
      <p className="relative shrink-0 text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Email me
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        About me
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between not-italic pt-[200px] relative size-full">
        <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[0px] text-black w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
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

function Menu3() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
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
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between not-italic pt-[320px] relative size-full">
        <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#0f0f0f] text-[72px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="leading-[normal] mb-0">Colonoscopy</p>
          <p className="leading-[normal]">Quality Metrics</p>
        </div>
        <Menu3 />
      </div>
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

function Menu4() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between relative shrink-0 text-[36px] text-[rgba(255,255,255,0.5)] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Back home
      </p>
      <p className="relative shrink-0 text-right" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @ 2026, with ❤️
      </p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between leading-[normal] not-italic pt-[320px] relative size-full">
        <p className="font-['Geologica:SemiBold',sans-serif] font-semibold relative shrink-0 text-[72px] text-white w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          {`Let’s `}
          <br aria-hidden="true" />
          Get in Touch!
        </p>
        <Menu4 />
      </div>
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