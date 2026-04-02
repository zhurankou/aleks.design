function Menu() {
  return (
    <div className="absolute content-stretch flex font-['Geologica:Bold',sans-serif] font-bold gap-[475px] items-center leading-[normal] left-[160px] text-[36px] text-[rgba(0,0,0,0.3)] top-[1001px] whitespace-nowrap" data-name="Menu">
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

function Home1() {
  return (
    <div className="absolute bg-white h-[1117px] left-0 not-italic overflow-clip top-0 w-[1728px]" data-name="Home">
      <div className="absolute font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] left-[160px] text-[64px] text-black top-[454px] w-[1390px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Hi 👋, I’m Alex.</p>
        <p>
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
          <span className="leading-[normal]">e.</span>
        </p>
      </div>
      <Menu />
    </div>
  );
}

function ContactMe() {
  return (
    <div className="absolute bg-[#0f0f0f] h-[1117px] left-0 overflow-clip top-[4468px] w-[1728px]" data-name="Contact me">
      <p className="absolute font-['Geologica:SemiBold',sans-serif] font-semibold leading-[normal] left-[160px] not-italic text-[64px] text-white top-[calc(50%-79.5px)] w-[1200px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        {`Let’s `}
        <br aria-hidden="true" />
        Get in Touch!
      </p>
    </div>
  );
}

function Project() {
  return (
    <div className="absolute bg-[#4b49ff] h-[1117px] left-0 overflow-clip top-[1117px] w-[1728px]" data-name="Project 1">
      <p className="absolute font-['Geologica:SemiBold',sans-serif] font-semibold leading-[normal] left-[160px] not-italic text-[64px] text-white top-[calc(50%-79.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        OneDrive
        <br aria-hidden="true" />
        Sharing Redesign
      </p>
    </div>
  );
}

function Project1() {
  return (
    <div className="absolute bg-[#07ab57] h-[1117px] left-0 overflow-clip top-[2234px] w-[1728px]" data-name="Project 2">
      <div className="absolute font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] left-[160px] not-italic text-[64px] text-white top-[calc(50%-79.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Iconography</p>
        <p className="leading-[normal]">for eero Insight</p>
      </div>
    </div>
  );
}

function Project2() {
  return (
    <div className="absolute bg-[#ffcb00] h-[1117px] left-0 overflow-clip top-[3351px] w-[1728px]" data-name="Project 3">
      <div className="absolute font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] left-[160px] not-italic text-[#0f0f0f] text-[64px] top-[calc(50%-79.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Colonoscopy</p>
        <p className="leading-[normal]">Quality Metrics</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative size-full" data-name="home">
      <Home1 />
      <ContactMe />
      <Project />
      <Project1 />
      <Project2 />
    </div>
  );
}