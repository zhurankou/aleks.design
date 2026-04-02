import imgGeminiGeneratedImagePu88Anpu88Anpu881 from "figma:asset/98042fec8282b76a640f96f2353cd65f7a4574a7.png";

function Menu() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] w-full whitespace-nowrap" data-name="Menu">
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
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative w-full" data-name="Container">
      <div className="relative shrink-0 size-[160px]" data-name="Gemini_Generated_Image_pu88anpu88anpu88 1">
        <img alt="" className="absolute block max-w-none size-full" height="160" src={imgGeminiGeneratedImagePu88Anpu88Anpu881} width="160" />
      </div>
      <div className="font-['Geologica:SemiBold',sans-serif] font-semibold leading-[0] min-w-full not-italic relative shrink-0 text-[0px] text-black w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
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

export default function HomeLanding() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[160px] py-[120px] relative size-full" data-name="home-landing">
      <Container />
    </div>
  );
}