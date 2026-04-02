export default function Home() {
  return (
    <div className="bg-white relative size-full" data-name="Home">
      <div className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[0] left-[160px] not-italic text-[96px] text-black top-[calc(50%-230.5px)] w-[819px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Hi 👋,</p>
        <p className="leading-[normal]">
          {`I’m Alex, `}
          <br aria-hidden="true" />a Designer based in Seattle, WA
        </p>
      </div>
    </div>
  );
}