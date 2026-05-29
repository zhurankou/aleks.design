import { useEffect, useRef, useState } from 'react';
import { PdrChartSmall } from './PdrChartSmall';
import { PdrPrrChartSmall } from './PdrPrrChartSmall';

// Lo-fi study square 4 — composes flow1.1 (PDR-only) and flow2.1 (PDR+PRR) in
// their tilted resting composition, then plays a two-act demo on view:
//
//   ACT 1 — flow1.1 on top:
//     cursor appears next to Jan's PDR dot → clicks → overlay + Modal1 fade
//     in over the chart → fade out
//   SWAP — flow2.1 rises to top
//   ACT 2 — flow2.1 on top:
//     cursor appears next to Jan's PRR dot → clicks → overlay + Modal2 fade
//     in over the chart → fade out
//   SWAP — flow1.1 rises back to top, loop restarts.
//
// Modals and overlays live INSIDE each chart's tilted wrapper, so they
// inherit the chart's rotate + position automatically. The modal content is
// rendered at scale(0.7) so it visually matches the chart's 70% render size.

type Phase =
  | 'idle'
  // Act 1 — flow1.1 on top
  | 'cursor1-enter'
  | 'cursor1-travel'
  | 'cursor1-click'
  | 'modal1-show'
  | 'modal1-hide'
  // Transition — flow2.1 rises to top
  | 'swap-to-flow2'
  // Act 2 — flow2.1 on top
  | 'cursor2-enter'
  | 'cursor2-travel'
  | 'cursor2-click'
  | 'modal2-show'
  | 'modal2-hide'
  // Transition back before the loop restarts
  | 'swap-to-flow1';

// Cursor keyframes:
//   click  — soft squeeze with gentle overshoot (less aggressive than a hard
//            tap; the loop reads as a calm demo, not a click-bait pulse).
//   enter  — slide up from a few px below + fade in with a long settle, so
//            the cursor glides into place rather than popping.
const cursorAnim = `
@keyframes oly-lofi-cursor-click {
  0%   { transform: translate(-10px, -2px) scale(1); }
  40%  { transform: translate(-10px, -2px) scale(0.72); }
  72%  { transform: translate(-10px, -2px) scale(1.04); }
  100% { transform: translate(-10px, -2px) scale(1); }
}
@keyframes oly-lofi-cursor-enter {
  0%   { opacity: 0; transform: translate(-10px, 14px) scale(0.82); }
  100% { opacity: 1; transform: translate(-10px, -2px) scale(1); }
}
`;

// Cursor positions in each chart's WRAPPER-LOCAL coords (pre-transform). The
// cursor lives as a child of the chart's tilted wrapper so it inherits the
// tilt + translate automatically. Both charts share the same PDR Jan dot
// (value 40 → viewBox (176, 198.8) → wrapper (299.4, 353.9)) so both stages
// reuse the same constants — the visible screen position differs only by
// each wrapper's transform.
const CURSOR_START = { x: 299.4, y: 420 }; // same column as Jan, ~66 px below
const CURSOR_JAN = { x: 299.4, y: 353.9 }; // on the PDR Jan dot

const HAND_CURSOR = (
  <svg width={32} height={29} viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} aria-hidden>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.1195 24.2395C8.43891 24.4836 8.65944 24.6588 9.34089 25.2078C10.0084 25.7454 10.3311 25.9994 10.6263 26.212C10.7494 26.2999 10.8543 26.535 10.8959 26.8845C10.9301 27.172 10.9182 27.4928 10.8767 27.8018C10.8624 27.9087 10.8486 27.9858 10.8406 28.0225C10.7517 28.4349 11.1222 28.8157 11.6165 28.82C12.0613 28.8238 12.404 28.8285 13.3112 28.8422C13.5381 28.8456 13.5381 28.8456 13.7659 28.849C16.2318 28.8849 17.4912 28.875 18.3951 28.7787C19.3613 28.6757 20.3563 27.6862 21.2164 26.4446C21.9453 27.5432 22.9562 28.616 23.9771 28.7555C24.3014 28.7994 24.6938 28.8131 25.1485 28.8042C25.4875 28.7976 25.8463 28.7786 26.2084 28.7512C26.4814 28.7305 26.699 28.7097 26.8289 28.6954C27.309 28.6426 27.6232 28.242 27.4949 27.8461C27.4672 27.7606 27.4227 27.6037 27.3778 27.4062C27.3257 27.1772 27.2881 26.9536 27.271 26.7498C27.2602 26.6207 27.258 26.5037 27.2649 26.4026C27.2769 26.2264 27.2806 26.1277 27.2864 25.8997C27.2887 25.8148 27.2887 25.8148 27.2916 25.7406C27.3029 25.4975 27.3414 25.2667 27.466 24.7634C27.5195 24.5449 27.779 24.1269 28.1877 23.6096C28.3094 23.4555 28.4425 23.2946 28.5851 23.1285C28.8554 22.8135 29.1464 22.4952 29.4374 22.1906C29.6118 22.0082 29.7466 21.8717 29.8217 21.7976C30.4512 21.0327 31.1225 19.7806 31.3691 19.0486C31.6059 18.345 31.7953 17.0493 31.9117 15.7758C31.9755 15.0533 31.9991 14.4709 31.9991 13.5573C31.9992 13.3971 31.9992 13.3971 31.9996 13.2648C32.0002 13.048 32.0002 12.9661 31.9994 12.8648C31.9971 12.588 31.9876 12.3137 31.956 11.614C31.8882 10.1477 30.9406 9.19965 29.5442 9.01679C28.3562 8.86122 26.9102 9.69793 26.9102 9.69793C26.9102 9.69793 26.5884 8.75573 26.371 8.46487C26.0178 7.99748 25.1082 7.40189 24.4129 7.28586C23.6978 7.16811 22.85 7.18113 22.0715 7.29789C21.3898 7.40135 20.7106 7.91753 20.3178 8.4743C20.0368 8.87149 20.3011 8.45323 20.02 8.04236C19.631 7.47643 18.725 6.96966 17.8624 6.82008C17.1314 6.6919 16.2939 6.74072 15.529 6.93351C14.5449 7.18286 14.3882 7.8179 14.3491 7.63608C14.2182 7.02651 14.2061 7.06657 14.1246 6.63173C13.8216 5.01829 13.4825 3.90191 12.9683 2.92775C12.9979 2.98375 12.78 2.56344 12.7007 2.41851C12.5634 2.16755 12.4263 1.9404 12.2757 1.72193C11.8113 1.04854 11.2791 0.544369 10.6114 0.257949C9.45187 -0.239982 7.71384 0.00234456 6.89002 0.817793C6.0719 1.62817 5.93549 2.9831 6.14153 4.65975C6.22021 5.31072 6.49599 6.49916 6.74605 7.37766C6.83447 7.68256 6.91194 7.96064 7.05403 8.4743C7.07846 8.56168 7.07846 8.56168 7.10311 8.64908C7.21303 9.03784 7.30942 9.3577 7.42449 9.70869C7.41242 9.67211 7.63067 10.3288 7.67716 10.4741C7.69262 10.5226 7.69262 10.5226 7.70794 10.5714C7.79471 10.8485 7.87953 11.1473 8.01205 11.646C8.08458 11.9202 8.15535 12.2131 8.22457 12.5237C8.41337 13.3706 8.4143 13.1942 8.23256 13.0136C8.10702 12.8889 7.98894 12.7756 7.87487 12.6711C7.66284 12.477 7.46792 12.3165 7.28287 12.1885C5.93464 11.2531 5.10849 10.8397 3.97428 10.7489C2.11382 10.5974 0.348223 11.7118 0.0827428 13.2158C-0.0805319 14.138 -0.0279313 14.5625 0.475136 15.3774C0.751973 15.8177 1.22026 16.3495 2.09398 17.2649C2.14745 17.3209 2.14745 17.3209 2.20089 17.3768C3.27337 18.4975 3.39021 18.622 3.64522 18.9352C4.33455 19.7834 6.01262 22.219 6.31767 22.546L8.1195 24.2395Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.43829 16.525C3.3854 16.4697 3.3854 16.4697 3.33265 16.4145C2.53082 15.5744 2.09114 15.0751 1.88418 14.7459C1.55941 14.2198 1.54174 14.0772 1.65878 13.4161C1.79635 12.6367 2.78901 12.0102 3.82289 12.0944C4.53825 12.1517 5.16324 12.4643 6.27412 13.2351C6.3944 13.3183 6.53941 13.4377 6.70529 13.5896C6.8034 13.6794 6.90747 13.7792 7.01983 13.8909C7.18859 14.0586 7.75734 14.6488 7.67358 14.5629C7.79714 14.6889 7.8855 14.7865 7.98645 14.9061C8.18644 15.1482 8.29896 15.2827 8.45134 15.4549C8.3799 15.3741 8.90769 15.9928 9.01946 16.0832C9.61154 16.5625 10.4689 16.1589 10.4152 15.5202C10.4063 15.4135 10.3767 15.2983 10.315 15.0972C10.0708 13.6208 9.98542 13.147 9.79049 12.2725C9.71807 11.9477 9.64373 11.64 9.56689 11.3495C9.43012 10.8348 9.34086 10.5203 9.24822 10.2244C9.23175 10.172 9.23175 10.172 9.21523 10.1202C9.16633 9.96736 8.94479 9.30076 8.95954 9.34548C8.85043 9.01265 8.75861 8.70797 8.65283 8.33385C8.6288 8.24863 8.6288 8.24863 8.6048 8.16282C8.46349 7.65189 8.38403 7.36669 8.29439 7.0576C8.06064 6.23639 7.79655 5.09828 7.72673 4.52071C7.56635 3.21553 7.67702 2.11627 8.1004 1.6969C8.43097 1.36968 9.3679 1.23905 9.89136 1.46383C10.2337 1.61067 10.5758 1.93477 10.8995 2.40415C11.022 2.5818 11.1369 2.77228 11.2546 2.9873C11.3258 3.11752 11.5371 3.52501 11.5133 3.47995C11.9602 4.32684 12.2673 5.33776 12.5502 6.8441C12.6339 7.29044 12.7375 7.79608 12.8703 8.41471C12.9098 8.59815 12.9098 8.59815 12.9495 8.78081C13.59 11.728 13.5431 11.5046 13.5523 11.7397C13.5859 12.5971 15.0785 12.6172 15.1441 11.7611C15.1649 11.4896 15.1575 11.2472 15.1206 10.551C15.1154 10.4525 15.1154 10.4525 15.1103 10.3544C15.078 9.71297 15.0799 9.34395 15.1246 9.1342C15.2061 8.75172 15.611 8.32326 15.9839 8.22876C16.5076 8.09677 17.0814 8.06333 17.5411 8.14393C17.9811 8.22022 18.4945 8.50746 18.6419 8.72175C18.8194 8.98126 18.9716 9.37662 19.0883 9.86668C19.1825 10.2622 19.2473 10.6866 19.2928 11.1395C19.307 11.2804 19.3163 11.3892 19.3305 11.5694C19.3366 11.6448 19.3366 11.6448 19.3426 11.707C19.346 11.7382 19.346 11.7382 19.3543 11.7875C19.3608 11.822 19.3608 11.822 19.3912 11.9095C19.4066 12.1579 19.4066 12.1579 20.583 12.25C20.9343 11.8899 20.9343 11.8899 20.9247 11.8268C20.9823 11.6135 21.0175 11.3757 21.0677 10.929C21.0997 10.6387 21.1159 10.4959 21.1348 10.3478C21.213 9.73488 21.3123 9.34543 21.4334 9.17424C21.5837 8.96124 22.113 8.66457 22.3504 8.62854C22.9466 8.53912 23.6014 8.52907 24.1069 8.6123C24.3358 8.65051 24.8944 9.01624 25.0266 9.19118C25.298 9.55443 25.562 10.7255 25.7107 11.8875C25.6873 11.9637 25.6873 11.9637 26.0523 12.4058C27.3069 12.2845 27.3069 12.2845 27.2716 12.0924C27.3047 12.0239 27.3311 11.9448 27.3683 11.8218C27.458 11.534 27.5175 11.3669 27.606 11.1796C27.6672 11.05 27.7318 10.9393 27.798 10.8511C28.0545 10.5088 28.7184 10.2763 29.3007 10.3525C29.926 10.4344 30.3245 10.8331 30.363 11.6662C30.3939 12.3518 30.4031 12.6154 30.4052 12.8741C30.406 12.9696 30.406 13.0462 30.4054 13.2617C30.405 13.3949 30.405 13.3949 30.4049 13.5573C30.4049 14.4384 30.3827 14.9873 30.3221 15.673C30.2145 16.8503 30.0329 18.093 29.8362 18.6774C29.6355 19.2732 29.0362 20.3911 28.5616 20.9725C28.528 21 28.3835 21.1463 28.1989 21.3395C27.8916 21.661 27.5842 21.9973 27.296 22.333C27.1418 22.5127 26.997 22.6878 26.8632 22.8572C26.3453 23.5128 26.013 24.0481 25.9055 24.4869C25.7643 25.0572 25.7138 25.3596 25.6987 25.6875C25.695 25.7804 25.695 25.7804 25.6926 25.8704C25.6872 26.0831 25.684 26.1691 25.6734 26.3246C25.6622 26.488 25.6654 26.662 25.6808 26.8457C25.7029 27.1088 25.6808 27.4683 25.6808 27.4683C25.6808 27.4683 25.4117 27.447 25.1116 27.4528C24.7449 27.46 24.44 27.4494 24.2293 27.4209C23.9253 27.3793 23.1043 26.5081 22.684 25.8294C22.0416 24.7906 20.4821 24.841 19.8429 25.7584C19.2663 26.5907 18.441 27.4114 18.196 27.4375C17.3998 27.5224 16.167 27.5321 13.793 27.4974C13.5661 27.4941 13.5661 27.4941 13.3393 27.4907C12.4278 27.4769 12.4628 27.6074 12.4815 27.4683C12.5348 27.0713 12.5287 27.1457 12.4815 26.7487C12.4023 26.0831 12.16 25.5403 11.6553 25.1798C11.3941 24.9918 11.0818 24.746 10.4545 24.2407C9.73783 23.6634 9.51338 23.485 9.23677 23.2788L7.53381 21.6736C7.34688 21.4709 5.70607 19.0894 4.95701 18.1676C4.66562 17.8098 4.55662 17.6936 3.43829 16.525ZM23.6465 16.5318V22.7655C23.6465 23.6666 25.2404 23.6666 25.2404 22.7655V16.5318C25.2404 15.6307 23.6465 15.6307 23.6465 16.5318ZM19.3289 16.5307L19.3629 22.7897C19.3678 23.6908 20.9617 23.6845 20.9568 22.7835L20.9228 16.5245C20.9179 15.6234 19.324 15.6296 19.3289 16.5307ZM16.7593 22.7547L16.7146 16.5804C16.7081 15.6793 15.1142 15.6876 15.1207 16.5887L15.1654 22.763C15.1719 23.664 16.7658 23.6557 16.7593 22.7547Z"
      fill="white"
    />
  </svg>
);

// Shared modal chrome — Figma 15855:976 + 15856:1004 share container,
// typography, column layout, and gaps. Only the top summary differs:
// Modal2 adds "72% Polyp Retrieval Rate" beneath the first two lines.
function ModalPanel({ summary }: { summary: string[] }) {
  const colHeading: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#000000' };
  const colItem: React.CSSProperties = { margin: 0, fontWeight: 400, color: '#000000' };
  const colStyle: React.CSSProperties = {
    width: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  };
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        fontFamily: "'Manrope', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 600,
          fontSize: 16,
          lineHeight: 'normal',
          color: '#1f2124',
          width: '100%',
        }}
      >
        January
      </p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: 12,
          lineHeight: 1.4,
          letterSpacing: '0.24px',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          {summary.map((line) => (
            <p key={line} style={{ margin: 0, fontWeight: 400, color: '#000000' }}>
              {line}
            </p>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={colStyle}>
            <p style={colHeading}>Paris Classification</p>
            <p style={colItem}>3 Sessile</p>
            <p style={colItem}>2 Semi-Pedunculated</p>
            <p style={colItem}>10 Flat elevated</p>
          </div>
          <div style={colStyle}>
            <p style={colHeading}>Location</p>
            <p style={colItem}>3 Descending Colon</p>
            <p style={colItem}>12 Sigmoid Colon</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={colStyle}>
            <p style={colHeading}>Size</p>
            <p style={colItem}>{'5 >5mm'}</p>
            <p style={colItem}>10 5-10mm</p>
          </div>
          <div style={colStyle}>
            <p style={colHeading}>Gender</p>
            <p style={colItem}>6 Females</p>
            <p style={colItem}>9 Males</p>
          </div>
        </div>
        <p style={{ margin: 0, fontWeight: 400, color: '#8e8e93' }}>What else?</p>
      </div>
    </div>
  );
}

const MODAL1_SUMMARY = ['39% Polyp Detection Rate', '45 Total Procedures'];
const MODAL2_SUMMARY = ['39% Polyp Detection Rate', '45 Total Procedures', '72% Polyp Retrieval Rate'];

const FLOW1_TRANSFORM = 'translate(6%, 6%) rotate(7deg)';
const FLOW2_TRANSFORM = 'translate(-6%, -6%) rotate(-7deg)';

// White-panel bounds inside each chart's wrapper (pre-transform): the SVG
// content is 70% of the padded 648 area = 453.6 wide, 390.85 tall (viewBox
// aspect 448/386 with `xMidYMid meet`), positioned at (121.2, 152.575).
const PANEL_LEFT = 121.2;
const PANEL_TOP = 152.575;
const PANEL_W = 453.6;
const PANEL_H = 390.85;

// Cursor rendered inside a chart wrapper — inherits the wrapper's tilt +
// translate so it stays glued to the chart geometry. Position uses
// wrapper-local coords (CURSOR_START → CURSOR_JAN); fingertip offset
// translate(-10, -2) keeps the index finger on the position.
function StageCursor({
  enter,
  travel,
  click,
}: {
  enter: boolean;
  travel: boolean;
  click: boolean;
}) {
  const showing = enter || travel || click;
  const atJan = travel || click;
  // Pick the right keyframe per phase. The enter animation runs `forwards`
  // so the cursor stays at its end state once `enter` flips to `travel`,
  // then the click animation can play cleanly on click.
  const animation = enter
    ? 'oly-lofi-cursor-enter 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards'
    : click
      ? 'oly-lofi-cursor-click 0.42s cubic-bezier(0.4, 0, 0.2, 1)'
      : undefined;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: atJan ? CURSOR_JAN.x : CURSOR_START.x,
        top: atJan ? CURSOR_JAN.y : CURSOR_START.y,
        transform: 'translate(-10px, -2px)',
        opacity: showing && !click ? 1 : 0,
        transition:
          'opacity 0.55s cubic-bezier(0.32, 0.72, 0, 1), left 0.8s cubic-bezier(0.32, 0.72, 0, 1), top 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
        animation,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {HAND_CURSOR}
    </div>
  );
}

export function LoFiPolypsCharts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timers: number[] = [];
    const clear = () => { timers.forEach(window.clearTimeout); timers = []; };
    const cycle = () => {
      clear();
      setPhase('idle');
      // Act 1 — flow1.1. Cursor entrance (0.8 s slide+fade), travel (0.8 s),
      // ~200 ms hover dwell, click pulse (0.42 s), modal (0.5 s). Gaps are
      // sized so every transition has room to settle before the next.
      timers.push(window.setTimeout(() => setPhase('cursor1-enter'),  700));
      timers.push(window.setTimeout(() => setPhase('cursor1-travel'), 1500));
      timers.push(window.setTimeout(() => setPhase('cursor1-click'),  2500));
      timers.push(window.setTimeout(() => setPhase('modal1-show'),    2700));
      timers.push(window.setTimeout(() => setPhase('modal1-hide'),    4800));
      // Swap to flow2.1 — 1.5 s 3D depth interchange.
      timers.push(window.setTimeout(() => setPhase('swap-to-flow2'),  5350));
      // Act 2 — flow2.1. Same beats; click lands on flow2's PDR Jan dot.
      timers.push(window.setTimeout(() => setPhase('cursor2-enter'),  7050));
      timers.push(window.setTimeout(() => setPhase('cursor2-travel'), 7850));
      timers.push(window.setTimeout(() => setPhase('cursor2-click'),  8850));
      timers.push(window.setTimeout(() => setPhase('modal2-show'),    9050));
      timers.push(window.setTimeout(() => setPhase('modal2-hide'),    11150));
      // Swap back and restart.
      timers.push(window.setTimeout(() => setPhase('swap-to-flow1'),  11700));
      timers.push(window.setTimeout(cycle,                             13400));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) cycle();
        else { clear(); setPhase('idle'); }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, []);

  // Which chart sits on top? Flow1 by default; flow2 during act 2 + the
  // swap-to-flow2 transition.
  const flow2OnTop =
    phase === 'swap-to-flow2'
    || phase === 'cursor2-enter'
    || phase === 'cursor2-travel'
    || phase === 'cursor2-click'
    || phase === 'modal2-show'
    || phase === 'modal2-hide';

  const showModal1 = phase === 'modal1-show';
  const showModal2 = phase === 'modal2-show';

  // 3D depth swap — each wrapper sits at its own translateZ. The wrapper
  // "in front" is at +Z (closer to viewer, perspective scales it up slightly);
  // the wrapper "behind" is at 0Z. As Z transitions, the browser handles the
  // layering naturally based on real depth — no z-index flip required, so
  // there's no instantaneous pop. The slight perspective-driven size change
  // gives a genuine sense of depth interchange.
  const FRONT_Z = 60;
  const BACK_Z = 0;
  const flow1Z = flow2OnTop ? BACK_Z : FRONT_Z;
  const flow2Z = flow2OnTop ? FRONT_Z : BACK_Z;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
    >
      <style>{cursorAnim}</style>

      {/* flow1.1 wrapper — stays in its right-tilt resting position the entire
          time. Only translateZ changes during the swap: pushed back during
          act 2, pulled forward otherwise. Browser handles the real 3D
          ordering, so no z-index flip is needed. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `${FLOW1_TRANSFORM} translateZ(${flow1Z}px)`,
          transformOrigin: 'center',
          transformStyle: 'preserve-3d',
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.15, 1)',
        }}
      >
        <PdrChartSmall sizePct={70} />
        {/* Overlay over flow1.1's white panel. */}
        <div
          style={{
            position: 'absolute',
            left: PANEL_LEFT,
            top: PANEL_TOP,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: 'rgba(30,30,30,0.30)',
            opacity: showModal1 ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
          }}
        />
        {/* Modal1 — centred on the chart wrapper, scaled 0.7 to match the
            chart's 70% render size. Inherits the wrapper's tilt. */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: showModal1
              ? 'translate(-50%, -50%) scale(0.7)'
              : 'translate(-50%, -50%) scale(0.6)',
            opacity: showModal1 ? 1 : 0,
            transition:
              'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
          }}
        >
          <ModalPanel summary={MODAL1_SUMMARY} />
        </div>
        <StageCursor
          enter={phase === 'cursor1-enter'}
          travel={phase === 'cursor1-travel'}
          click={phase === 'cursor1-click'}
        />
      </div>

      {/* flow2.1 wrapper — stays in its left-tilt resting position. Pulled
          forward (translateZ) during act 2; pushed back otherwise. The two
          wrappers cross at the midpoint of the Z transition, where DOM
          order (flow2 declared second) determines tie-breaking. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `${FLOW2_TRANSFORM} translateZ(${flow2Z}px)`,
          transformOrigin: 'center',
          transformStyle: 'preserve-3d',
          transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.15, 1)',
        }}
      >
        <PdrPrrChartSmall sizePct={70} />
        <div
          style={{
            position: 'absolute',
            left: PANEL_LEFT,
            top: PANEL_TOP,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: 'rgba(30,30,30,0.30)',
            opacity: showModal2 ? 1 : 0,
            transition: 'opacity 0.35s ease-out',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: showModal2
              ? 'translate(-50%, -50%) scale(0.7)'
              : 'translate(-50%, -50%) scale(0.6)',
            opacity: showModal2 ? 1 : 0,
            transition:
              'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: 'none',
          }}
        >
          <ModalPanel summary={MODAL2_SUMMARY} />
        </div>
        <StageCursor
          enter={phase === 'cursor2-enter'}
          travel={phase === 'cursor2-travel'}
          click={phase === 'cursor2-click'}
        />
      </div>
    </div>
  );
}
