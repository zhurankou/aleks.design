function Text() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col gap-[33px] items-start left-[160px] top-1/2 w-[800px]" data-name="Text">
      <p className="relative shrink-0 text-[96px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Hi, I’m Alex 👋
      </p>
      <p className="relative shrink-0 text-[48px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Seattle-based designer who cares deeply about craft and creates clear, polished experiences that feel simple, useful, and human.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white font-['Geologica:Medium',sans-serif] font-medium leading-[normal] not-italic relative size-full text-black" data-name="Home">
      <Text />
      <p className="absolute left-[1375px] text-[48px] top-[976px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        About me
      </p>
      <p className="absolute left-[160px] text-[48px] top-[976px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Email me
      </p>
    </div>
  );
}