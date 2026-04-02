import imgGeminiGeneratedImageR0Afmhr0Afmhr0Af1 from "figma:asset/e792d0195930355fc3db2a4fcc07f3982b374e6f.png";

function Text() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col font-['Geologica:Medium',sans-serif] font-medium gap-[8px] items-start leading-[normal] left-[160px] not-italic text-black top-[calc(50%+195.5px)] w-[800px]" data-name="Text">
      <p className="relative shrink-0 text-[96px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Hey, I’m Alex 👋
      </p>
      <p className="relative shrink-0 text-[48px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        A designer Designer who cares deeply about craft and creates clear, polished experiences that feel simple, useful, and human.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white relative size-full" data-name="Home">
      <div className="absolute h-[1242px] left-[-348px] top-[-15px] w-[2226px]" data-name="Gemini_Generated_Image_r0afmhr0afmhr0af 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGeminiGeneratedImageR0Afmhr0Afmhr0Af1} />
      </div>
      <Text />
      <p className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[normal] left-[1375px] not-italic text-[48px] text-black top-[1006px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        About me
      </p>
      <p className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[normal] left-[160px] not-italic text-[48px] text-black top-[1006px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Email me
      </p>
    </div>
  );
}