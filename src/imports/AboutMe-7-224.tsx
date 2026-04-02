import imgShutterstock150664154V22109X14061 from "figma:asset/b226069e98c9e23c617a947f327f0adae7dd6335.png";

function Text() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col font-['Geologica:Medium',sans-serif] font-medium items-start leading-[normal] left-[160px] not-italic text-white top-[calc(50%+378.5px)] w-[800px]" data-name="Text">
      <p className="min-w-full relative shrink-0 text-[96px] w-[min-content]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Belarus
      </p>
      <p className="relative shrink-0 text-[64px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Born and raised
      </p>
    </div>
  );
}

export default function AboutMe() {
  return (
    <div className="bg-white relative size-full" data-name="about-me-">
      <div className="absolute h-[1406px] left-[-191px] top-[-145px] w-[2109px]" data-name="shutterstock_150664154v2-2109x1406 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-[0.04%] max-w-none size-full top-[-0.01%]" src={imgShutterstock150664154V22109X14061} />
        </div>
      </div>
      <Text />
    </div>
  );
}