import svgPaths from "./svg-rq3ytfyyr1";
import imgAvatar from "figma:asset/3a4d39604614af272de57a9d18d3b3977387939f.png";

function Mail() {
  return (
    <div className="relative shrink-0 size-[56px]" data-name="mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 56">
        <g id="mail">
          <g id="base">
            <path d={svgPaths.p3f714900} fill="var(--fill-0, #B2B2B2)" />
            <path d={svgPaths.p280d080} fill="var(--fill-0, #B2B2B2)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Contact() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="contact">
      <Mail />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative size-full">
      <div className="relative shrink-0 size-[120px]" data-name="avatar">
        <img alt="" className="absolute block max-w-none size-full" height="120" src={imgAvatar} width="120" />
      </div>
      <Contact />
    </div>
  );
}