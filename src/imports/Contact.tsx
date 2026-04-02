import svgPaths from "./svg-ri89u30ejd";

function Mail() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 52">
        <g id="mail">
          <g id="base">
            <path d={svgPaths.pf220d00} fill="var(--fill-0, #B2B2B2)" />
            <path d={svgPaths.p11a47800} fill="var(--fill-0, #B2B2B2)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="contact">
      <Mail />
    </div>
  );
}