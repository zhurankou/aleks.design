export default function Copyright() {
  return (
    <div className="content-stretch flex font-['Geologica:Bold',sans-serif] font-bold gap-[8px] items-center justify-end not-italic relative size-full text-[36px] text-right" data-name="copyright">
      <p className="leading-[normal] relative shrink-0 text-[rgba(255,255,255,0.5)] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        @ 2026, with
      </p>
      <div className="flex flex-col h-full justify-center leading-[0] relative shrink-0 text-white w-[36px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal]">❤️</p>
      </div>
    </div>
  );
}