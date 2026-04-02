function Text() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col font-['Geologica:Medium',sans-serif] font-medium gap-[33px] items-start leading-[normal] left-[160px] not-italic text-black top-1/2 w-[800px]" data-name="Text">
      <p className="relative shrink-0 text-[96px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Hi 👋,
      </p>
      <p className="relative shrink-0 text-[48px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        I’m Alex, a designer based in Seattle, WA. I care deeply about craft and create clear, polished product experiences that feel simple, useful, and human.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white relative size-full" data-name="Home">
      <Text />
    </div>
  );
}