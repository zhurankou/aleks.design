function Home() {
  return (
    <div className="absolute bg-white h-[1117px] left-0 overflow-clip top-0 w-[1728px]" data-name="Home">
      <p className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[normal] left-[160px] not-italic text-[128px] text-black top-[calc(50%-79.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Alex
      </p>
    </div>
  );
}

function Project() {
  return (
    <div className="absolute bg-[#4b49ff] h-[1117px] left-0 overflow-clip top-[1117px] w-[1728px]" data-name="Project 10">
      <p className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[normal] left-[160px] not-italic text-[128px] text-white top-[calc(50%-102.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        OneDrive
        <br aria-hidden="true" />
        Sharing Redesign
      </p>
    </div>
  );
}

function Project1() {
  return (
    <div className="absolute bg-[#07ab57] h-[1117px] left-0 overflow-clip top-[3351px] w-[1728px]" data-name="Project 11">
      <div className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[0] left-[160px] not-italic text-[128px] text-white top-[calc(50%-102.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Iconography</p>
        <p className="leading-[normal]">for eero Insight</p>
      </div>
    </div>
  );
}

function Project2() {
  return (
    <div className="absolute bg-[#ffcb00] h-[1117px] left-0 overflow-clip top-[2234px] w-[1728px]" data-name="Project 12">
      <div className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[0] left-[160px] not-italic text-[#0f0f0f] text-[128px] top-[calc(50%-102.5px)] w-[1200px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] mb-0">Colonoscopy</p>
        <p className="leading-[normal]">Quality Metrics</p>
      </div>
    </div>
  );
}

function Home1() {
  return (
    <div className="absolute bg-[#0f0f0f] h-[1117px] left-0 overflow-clip top-[4468px] w-[1728px]" data-name="Home">
      <p className="absolute font-['Geologica:Medium',sans-serif] font-medium leading-[normal] left-[160px] not-italic text-[128px] text-white top-[calc(50%-102.5px)] w-[1200px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        {`Let’s `}
        <br aria-hidden="true" />
        Get in Touch!
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative size-full" data-name="Home page">
      <Home />
      <Project />
      <Project1 />
      <Project2 />
      <Home1 />
    </div>
  );
}