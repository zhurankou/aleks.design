export default function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center leading-[normal] not-italic relative size-full text-white" data-name="Text">
      <p className="font-['Geologica:SemiBold',sans-serif] font-semibold min-w-full relative shrink-0 text-[72px] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Let’s chat!
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold min-w-full relative shrink-0 text-[36px] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        hi@aleks.design
      </p>
      <p className="font-['Geologica:Bold',sans-serif] font-bold relative shrink-0 text-[36px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        linkedin.com/in/zhurankou
      </p>
    </div>
  );
}