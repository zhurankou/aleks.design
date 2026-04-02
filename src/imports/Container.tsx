import svgPaths from "./svg-teup3vhex6";
import imgAvatar from "figma:asset/3a4d39604614af272de57a9d18d3b3977387939f.png";

function Mail() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="mail">
          <g id="base">
            <path d={svgPaths.p3a8665f2} fill="var(--fill-0, #B2B2B2)" />
            <path d={svgPaths.p3a372780} fill="var(--fill-0, #B2B2B2)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Contact() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="contact">
      <Mail />
      <p className="font-['Geologica:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[36px] text-[rgba(0,0,0,0.3)] text-right whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Email me
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[120px]" data-name="avatar">
        <img alt="" className="absolute block max-w-none size-full" height="120" src={imgAvatar} width="120" />
      </div>
      <Contact />
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

export default function Container() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between relative size-full" data-name="Container">
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