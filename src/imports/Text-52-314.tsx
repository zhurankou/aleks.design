function Row() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Row">
      <p className="relative shrink-0 text-[#ffc400] text-right w-[400px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Objective
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-[800px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        To help endoscopists and endoscopy leads quickly see if they meet quality standards for two of the most important colonoscopy metrics.
      </p>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Row">
      <p className="relative shrink-0 text-[#ffc400] text-right w-[400px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Contribution
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-[800px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        I co‑led this project with another designer , partnering closely with UX Research across discovery, concept testing, and hi‑fi usability.
      </p>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Row">
      <p className="relative shrink-0 text-[#ffc400] text-right w-[400px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Duration
      </p>
      <p className="relative shrink-0 text-[#0f0f0f] w-[800px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Apr 2024 - Dec 2024
      </p>
    </div>
  );
}

export default function Text() {
  return (
    <div className="content-stretch flex flex-col font-['Geologica:Bold',sans-serif] font-bold gap-[40px] items-start leading-[normal] not-italic relative size-full text-[36px]" data-name="Text">
      <Row />
      <Row1 />
      <Row2 />
    </div>
  );
}