function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 text-right">
      <p className="relative shrink-0 text-[rgba(255,255,255,0.5)]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @ 2026, w/
      </p>
      <p className="relative shrink-0 text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        ❤️
      </p>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold items-center justify-between relative shrink-0 text-[36px] w-full whitespace-nowrap" data-name="Menu">
      <p className="relative shrink-0 text-[rgba(255,255,255,0.5)]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Back home
      </p>
      <Frame />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start justify-between leading-[normal] not-italic pt-[320px] relative size-full">
        <p className="font-['Geologica:SemiBold',sans-serif] font-semibold relative shrink-0 text-[72px] text-white w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          {`Let’s `}
          <br aria-hidden="true" />
          Get in Touch!
        </p>
        <Menu />
      </div>
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