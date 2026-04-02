export default function Home() {
  return (
    <div className="bg-white not-italic relative size-full" data-name="Home">
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
      <p className="absolute font-['Geologica:Bold',sans-serif] font-bold leading-[normal] left-[1373px] text-[36px] text-[rgba(0,0,0,0.3)] top-[1001px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        About me
      </p>
      <p className="absolute font-['Geologica:Bold',sans-serif] font-bold leading-[normal] left-[160px] text-[36px] text-[rgba(0,0,0,0.3)] top-[1001px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Email me
      </p>
    </div>
  );
}