import { useEffect, useRef, useState } from 'react';
import {
  OlysenseBar,
  Header,
  Controls,
  FullSizeReport,
  BarChartCard,
  DataTable,
  Footer,
  DETECTED,
  RETRIEVED,
  PAGE_BG,
} from './polyps/PolypsDashboard';
import { HAND_CURSOR } from './LoFiPolypsCharts';
import {
  VerticalPairedBarsCard,
  DonutChartCard,
  HistogramCard,
  ByTypeTable,
  LOCATION_DATA_HIFI,
  BY_NUMBER_DATA,
  BY_NUMBER_MONTHS,
  BY_SIZE_HISTOGRAM,
  HISTOGRAM_BLUE,
  BY_SIZE_PIE_RENDER,
  BY_SIZE_PIE_LEGEND,
  BY_RESECTION_HIFI,
  BY_RESECTION_LEGEND,
  DETECTED_TIME_PIE_RENDER,
  DETECTED_TIME_PIE_LEGEND,
  RETRIEVED_TIME_PIE_RENDER,
  RETRIEVED_TIME_PIE_LEGEND,
  BY_RESECTION_TABLE_COLS,
  BY_RESECTION_TABLE_ROWS,
  BY_RESECTION_TABLE_TOTAL,
  BY_TIME_TABLE_COLS,
  BY_TIME_TABLE_ROWS,
} from './HiFiCharts';

// Hi-Fi study — square 5. Recreates Figma 15861:3403 (Option 1 — tabs) and
// 15861:3390 (Option 2 — scroll) as full dashboards at their native 1026 width,
// then displays ONE rectangle at a time inside the square. The two options
// auto-cycle with the same fade/scale pattern the polyp-morphology carousel
// uses in square 2. A label below the rectangle ("Option 1" / "Option 2") in
// the polyp-card body style names whichever option is on screen.

export const NATIVE_W = 1026;

// Same wide-rectangle aspect across both options so they swap into an
// identically-shaped frame. 616 (= 696 square − 2×40 padding) × 500 leaves
// room for the rectangle to show more of the dashboard "above the fold"
// while still keeping the label + bottom padding visible inside the square.
export const RECT_W = 616;
export const RECT_H = 500;

// Two-card carousel keyframe — modeled on `polyp-morph-carousel` in
// OlySensePage. CYCLE_S is the full loop; each option owns half of it
// (one fade-in, one hold, one fade-out per slot). The cycle is sized so
// Option 1's cursor animation can fully play out (fade in → travel → click
// → fade out → ~1.5 s post-click hold) before the carousel transitions to
// Option 2.
const CYCLE_S = 14;
const hifiAnim = `
@keyframes hifi-option-carousel {
  0%   { opacity: 0; transform: scale(0.96); }
  4%   { opacity: 1; transform: scale(1); }
  46%  { opacity: 1; transform: scale(1); }
  50%  { opacity: 0; transform: scale(0.96); }
  100% { opacity: 0; transform: scale(0.96); }
}
/* Cursor enter + click keyframes — identical bodies to square 4's
   oly-lofi-cursor-enter / oly-lofi-cursor-click so the two squares animate
   identically. The cursor's position is driven by inline left/top + CSS
   transitions (also matching square 4); these keyframes only handle the
   fade-in pop and the click squeeze/rebound. */
@keyframes hifi-cursor-enter {
  0%   { opacity: 0; transform: translate(-10px, 14px) scale(0.82); }
  100% { opacity: 1; transform: translate(-10px, -2px) scale(1); }
}
@keyframes hifi-cursor-click {
  0%   { transform: translate(-10px, -2px) scale(1); }
  35%  { transform: translate(-10px, -2px) scale(0.8); }
  65%  { transform: translate(-10px, -2px) scale(1.08); }
  100% { transform: translate(-10px, -2px) scale(1); }
}
`;

// Fingertip target positions in rectangle pixel coords. PRR_START sits just
// below the PRR tab so the cursor's `enter` slide-up lands cleanly in place;
// PRR_TAB and PDR_TAB are the click targets mid-tab on each.
const PRR_START = { x: 190, y: 203 };
const PRR_TAB = { x: 190, y: 148 };
const PDR_TAB = { x: 80, y: 148 };

// Cursor flow:
//   idle → enter (below PRR) → travel-prr → click-prr (chart flips → PRR)
//      → travel-pdr → click-pdr (chart flips → PDR) → done
type CursorPhase =
  | 'idle'
  | 'enter'
  | 'travel-prr'
  | 'click-prr'
  | 'travel-pdr'
  | 'click-pdr'
  | 'done';

const contentStackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: '24px 24px 0',
  boxSizing: 'border-box',
};

export function HiFiOption1({
  tab,
  hoveredTab = null,
  footer,
}: {
  tab: 0 | 1;
  hoveredTab?: 0 | 1 | null;
  /** Override the default Footer — pass a compact one for square 6 where
   *  the standard footer reads as too tall after the long content stack. */
  footer?: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: PAGE_BG, fontFamily: "'Noto Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <OlysenseBar />
      <div style={contentStackStyle}>
        <Header />
        <Controls />
        <FullSizeReport lockedTab={tab} hoveredTab={hoveredTab} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
          <VerticalPairedBarsCard
            title="Polyps by Number"
            data={BY_NUMBER_DATA}
            months={BY_NUMBER_MONTHS}
            legend={[
              { color: DETECTED, label: 'Detected polyps' },
              { color: RETRIEVED, label: 'Retrieved polyps' },
            ]}
          />
          <BarChartCard
            title="Polyps by Location"
            data={LOCATION_DATA_HIFI}
            legend={[
              { color: DETECTED, label: 'Detected polyps' },
              { color: RETRIEVED, label: 'Retrieved polyps' },
            ]}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
          <BarChartCard
            title="Polyps by Resection Method"
            data={BY_RESECTION_HIFI}
            legend={BY_RESECTION_LEGEND}
          />
          <HistogramCard
            title="Detected Polyps by Size"
            values={BY_SIZE_HISTOGRAM}
            color={HISTOGRAM_BLUE}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
          <DonutChartCard
            title="Detected Polyps by Time of the Day"
            renderSegments={DETECTED_TIME_PIE_RENDER}
            legendSegments={DETECTED_TIME_PIE_LEGEND}
          />
          <DonutChartCard
            title="Retrieved Polyps by Time of the Day"
            renderSegments={RETRIEVED_TIME_PIE_RENDER}
            legendSegments={RETRIEVED_TIME_PIE_LEGEND}
          />
        </div>
        <ByTypeTable />
      </div>
      {footer ?? <Footer />}
    </div>
  );
}

function HiFiOption2() {
  return (
    <div style={{ backgroundColor: PAGE_BG, fontFamily: "'Noto Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <OlysenseBar />
      <div style={contentStackStyle}>
        <Header />
        <Controls />
        <FullSizeReport lockedTab={0} hideTabs />
        <FullSizeReport lockedTab={1} hideTabs />
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', width: '100%' }}>
          <BarChartCard
            title="Polyps by Location"
            data={LOCATION_DATA_HIFI}
            legend={[
              { color: DETECTED, label: 'Detected polyps' },
              { color: RETRIEVED, label: 'Retrieved polyps' },
            ]}
          />
          <DonutChartCard
            title="Detected Polyps by Size"
            renderSegments={BY_SIZE_PIE_RENDER}
            legendSegments={BY_SIZE_PIE_LEGEND}
          />
        </div>
        <ByTypeTable />
        <DataTable
          title="Polyps by Resection Method"
          columns={BY_RESECTION_TABLE_COLS}
          rows={BY_RESECTION_TABLE_ROWS}
          total={BY_RESECTION_TABLE_TOTAL}
        />
        <DataTable
          title="Polyps by Time of the day"
          columns={BY_TIME_TABLE_COLS}
          rows={BY_TIME_TABLE_ROWS}
          total={['', '', '', '', '']}
        />
      </div>
      <Footer />
    </div>
  );
}

// The native dashboard (1026 wide × ~2700–3160 tall) is rendered at full
// width, then this wrapper scales it down to RECT_W and clips vertically to
// RECT_H so only the "above the fold" portion shows in the rectangle.
// `overlay` is rendered on top of the scaled dashboard, in rectangle pixel
// coordinates — used for the animated cursor in Option 1.
// `scrollY` translates the scaled dashboard upward by that many rectangle
// pixels — used by Option 2 to scroll down to the PRR chart and back.
export function OptionRectangle({
  children,
  overlay,
  scrollY = 0,
  stickyBar,
}: {
  children: React.ReactNode;
  overlay?: React.ReactNode;
  scrollY?: number;
  /** Rendered ABOVE the scrolled content at the top of the rectangle so it
   *  stays fixed while the dashboard scrolls underneath. Used to keep the
   *  OlysenseBar visible at the top of the visible area. */
  stickyBar?: React.ReactNode;
}) {
  const scale = RECT_W / NATIVE_W;
  return (
    <div
      style={{
        width: RECT_W,
        height: RECT_H,
        overflow: 'hidden',
        backgroundColor: PAGE_BG,
        borderRadius: 16,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: NATIVE_W,
          // translateY first, then scale (transforms apply right to left,
          // so the translate is in unscaled local px). The visible scroll
          // amount in rectangle px is `scrollY` (since translateY × scale
          // would change it; here we translate AFTER scale conceptually by
          // dividing — but with `top left` origin and translate ordering
          // applied last, we use raw rect px on the outer transform).
          transform: `translateY(${-scrollY}px) scale(${scale})`,
          transformOrigin: 'top left',
          transition: 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </div>
      {/* Sticky bar overlay — rendered ABOVE the scrolled content, scaled to
          match the dashboard's render scale so it visually replaces (and
          covers) the dashboard's own OlysenseBar as it scrolls past. High
          z-index beats the dashboard bar's own `zIndex: 10` so any flicker
          from the inner bar's `position: sticky` inside the transformed
          dashboard wrapper is hidden behind this fixed overlay. */}
      {stickyBar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: NATIVE_W,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          {stickyBar}
        </div>
      )}
      {overlay}
    </div>
  );
}

// Animated cursor that mirrors square 4's StageCursor pattern: position is
// driven by inline left/top + CSS transitions (so the travel is smooth and
// the easing matches square 4's spring-out), while the enter and click
// keyframes handle the fade-in pop and the squeeze/rebound. Same easings
// and durations as square 4: enter 0.8 s, click 0.28 s, travel 0.8 s.
function PdrTabCursor({ phase }: { phase: CursorPhase }) {
  const enter = phase === 'enter';
  const click = phase === 'click-prr' || phase === 'click-pdr';
  // Current target — drives left/top so CSS transitions glide between tabs.
  const atPdr = phase === 'travel-pdr' || phase === 'click-pdr';
  const atPrr = phase === 'travel-prr' || phase === 'click-prr';
  const target = atPdr ? PDR_TAB : atPrr ? PRR_TAB : PRR_START;
  const showing = phase !== 'idle' && phase !== 'done';
  const animation = enter
    ? 'hifi-cursor-enter 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards'
    : click
      ? 'hifi-cursor-click 0.55s cubic-bezier(0.45, 0, 0.25, 1)'
      : undefined;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: target.x,
        top: target.y,
        transform: 'translate(-10px, -2px)',
        // Anchor scale/click squeeze at the fingertip so the cursor stays
        // glued to its target as it taps.
        transformOrigin: '10px 2px',
        // Cursor stays at full opacity through the click pulse (so the
        // squeeze + rebound reads clearly); it only fades back out when the
        // phase moves to 'done' at the end of the cycle.
        opacity: showing ? 1 : 0,
        transition:
          'opacity 0.55s cubic-bezier(0.32, 0.72, 0, 1), left 0.8s cubic-bezier(0.32, 0.72, 0, 1), top 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
        animation,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {HAND_CURSOR}
    </div>
  );
}

// Scroll-gesture cursor used by Option 2 — distinct artwork from the click
// cursor: a flat hand showing the swipe lines. 26 × 24 viewBox, fingertip
// not anchored (this one is centred on its bounding box).
export const SCROLL_CURSOR = (
  <svg width={26} height={24} viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }} aria-hidden>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.519 1.6378C4.09351 2.17808 3.49401 3.2278 3.45465 4.33635C3.42886 5.06644 3.58249 5.75694 3.89796 6.65732C3.84816 6.51521 4.08354 7.2299 4.13033 7.38791C4.22724 7.71874 3.19721 7.27321 2.56961 7.40241C1.87221 7.54152 0.943559 8.15197 0.459809 8.96195C-0.108718 9.91117 -0.136577 11.0028 0.301852 12.9671C0.541432 14.0374 1.00326 14.9389 1.66502 15.7946C1.95903 16.1747 2.76083 17.0602 2.82164 17.1391L4.44905 18.9784C4.73827 19.2441 4.94376 19.4403 5.55356 20.0305C6.15723 20.6147 6.44481 20.887 6.71022 21.1176C6.82234 21.2139 6.91705 21.4691 6.95457 21.8482C6.98544 22.1602 6.9747 22.5083 6.93727 22.8436C6.92433 22.9596 6.91184 23.0432 6.90469 23.0831C6.82435 23.5307 7.15919 23.9441 7.60552 23.9483C8.01951 23.9522 8.34446 23.9574 9.18234 23.9725C9.36422 23.9757 9.36422 23.9757 9.5466 23.979C11.7882 24.0181 12.9088 24.0079 13.7239 23.9035C14.5952 23.7915 15.5008 22.7087 16.2689 21.3698C16.9265 22.5642 17.8389 23.7276 18.7613 23.8767C19.0509 23.9245 19.4045 23.9398 19.8138 23.9307C20.122 23.9238 20.4481 23.9033 20.777 23.8733C21.0219 23.851 21.2168 23.8286 21.3332 23.8132C21.7664 23.7558 22.0499 23.3212 21.9341 22.8917C21.9091 22.7989 21.8689 22.6287 21.8284 22.4143C21.7813 22.1646 21.7472 21.9207 21.7319 21.6986C21.7222 21.5592 21.7204 21.4328 21.7266 21.3234C21.7379 21.1316 21.7415 21.0242 21.7473 20.7736C21.7494 20.6859 21.7494 20.6859 21.752 20.6084C21.7624 20.3416 21.7969 20.0904 21.9083 19.5434C21.9563 19.3085 22.1909 18.8547 22.5602 18.293C22.6698 18.1264 22.7895 17.9523 22.9178 17.7727C23.1618 17.431 23.4244 17.0857 23.6871 16.7553C23.8445 16.5573 23.9661 16.4092 24.0339 16.3288C24.603 15.5002 25.2092 14.1422 25.4323 13.3461C25.6466 12.5805 25.8204 11.1462 25.9201 9.7933C25.9775 9.01174 25.9989 8.37794 25.9989 7.38791C25.999 7.19709 25.999 7.19709 25.9995 7.04238C26.0001 6.82503 26.0001 6.82503 25.9997 6.63738C25.998 6.33069 25.9891 6.02487 25.96 5.27821C25.8999 3.68859 25.0448 2.65968 23.7841 2.46126C22.7118 2.29248 21.7539 2.62138 21.3332 3.07968C21.1883 3.23755 21.3403 2.53572 20.9191 1.86114C20.6037 1.35582 19.7814 0.709277 19.1528 0.58316C18.5094 0.455363 17.7424 0.469517 17.0399 0.596213C16.4243 0.708511 15.724 1.25601 15.3679 1.86114C15.1299 2.26564 15.4424 1.84955 15.1882 1.40354C14.8386 0.789097 14.023 0.240332 13.2433 0.0777728C12.5789 -0.0618329 11.8206 -0.00930044 11.1347 0.201722C10.3035 0.454189 9.18234 1.40354 9.31461 2.46126C8.65533 1.40354 6.91674 1.10932 5.519 1.6378Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9539 1.51446C13.3511 1.59727 13.8116 1.90717 13.9441 2.14001C14.1053 2.42284 14.2426 2.85206 14.3478 3.38486C14.4041 3.66975 14.5814 5.75586 14.9114 5.97325C15.703 6.0619 15.703 6.0619 15.9213 5.73147C15.9893 5.58709 15.9893 5.58709 16.0023 5.53024C16.0295 5.41273 16.0496 5.28233 16.0697 5.10486L16.0861 4.95008L16.087 4.93164L16.0933 4.86971C16.1141 4.64632 16.1735 4.02651 16.1966 3.83266C16.2693 3.22277 16.3648 2.80102 16.4641 2.63228C16.6008 2.3999 17.0767 2.0794 17.2916 2.04018C17.8295 1.94319 18.422 1.93226 18.8763 2.02247C19.0842 2.0642 19.5877 2.46007 19.7054 2.64869C19.953 3.04525 20.1896 4.30864 20.324 5.57597C20.3044 5.66639 20.3044 5.66639 20.6386 6.14273C21.7593 6.01215 21.7593 6.01215 21.7325 5.80072C21.7631 5.72531 21.7871 5.63854 21.8206 5.50508C21.9019 5.19047 21.9544 5.01223 22.0336 4.80993C22.089 4.66861 22.1474 4.54806 22.2072 4.45252C22.4391 4.08038 23.0387 3.82797 23.5645 3.91073C24.129 3.99959 24.4883 4.43192 24.5225 5.33564C24.551 6.06765 24.5595 6.36012 24.5611 6.64581L24.5603 7.38798C24.5603 8.34284 24.5402 8.94035 24.4856 9.68365C24.3934 10.9344 24.227 12.3077 24.049 12.9435C23.8675 13.5912 23.3266 14.8028 22.8975 15.4327C22.8665 15.4636 22.7361 15.6223 22.5695 15.8319C22.2922 16.1807 22.0148 16.5454 21.7548 16.9096C21.616 17.1039 21.4857 17.2932 21.3653 17.4764C20.8973 18.1881 20.5971 18.7689 20.4999 19.2448C20.3734 19.8652 20.3285 20.1932 20.3146 20.5502C20.3113 20.6462 20.3113 20.6462 20.3091 20.7393C20.3037 20.9729 20.3006 21.0661 20.2905 21.2371C20.2804 21.4157 20.2832 21.6034 20.2968 21.8017C20.3167 22.0886 20.4999 22.4819 20.4999 22.4819C20.4999 22.4819 20.0547 22.4585 19.7822 22.4645C19.4527 22.4719 19.1785 22.46 18.9886 22.4287C18.7123 22.384 17.9718 21.4398 17.5926 20.7037C17.0129 19.5765 15.6056 19.6312 15.0287 20.6266C14.5137 21.5245 13.7645 22.4202 13.5441 22.4485C12.8268 22.5403 11.729 22.5504 9.57106 22.5127C9.38923 22.5095 8.68877 22.4875 8.3321 22.4819C7.97543 22.4763 8.42816 22.1318 8.38554 21.7011C8.31407 20.9789 8.09545 20.39 7.63992 19.9988C7.40514 19.7947 7.12641 19.5309 6.55613 18.979C5.91703 18.3604 5.70773 18.1605 5.45737 17.9362L3.92057 16.1944C3.8447 16.0933 3.04193 15.2067 2.79434 14.8866C2.256 14.1905 1.89173 13.4795 1.70413 12.6413C1.34123 11.0154 1.36019 10.2724 1.68772 9.72557C1.95131 9.28423 2.52805 8.9051 2.84988 8.8409C3.1791 8.77314 3.90765 8.80867 4.04241 8.8845C4.23232 8.99011 4.29858 9.02725 4.35654 9.06239C4.42506 9.10394 4.47096 9.13668 4.51348 9.17402C4.57919 9.23173 4.65224 9.31424 4.75168 9.44865C4.82095 9.54292 4.90141 9.65475 5.02475 9.82614C5.14087 9.98583 5.20088 10.0622 5.28115 10.1371C5.81891 10.6389 6.59282 10.2004 6.52877 9.49946C6.5179 9.38045 6.48651 9.25123 6.42408 9.03586C6.37534 8.86452 6.38629 8.85791 6.30324 8.68282L6.20545 8.4837C6.14146 8.35573 6.05214 8.17933 5.92539 7.92827C5.75813 7.59698 5.65773 7.36441 5.59113 7.13707L5.52568 6.93725C5.45206 6.72098 5.34236 6.41213 5.28378 6.24895L5.24523 6.14205L5.24907 6.15769L5.13448 5.81058C4.95741 5.24728 4.87722 4.80632 4.89195 4.38935C4.91191 3.82713 5.19954 3.32351 6.01949 3.01273C6.78938 2.72165 8.0867 3.01502 8.3321 3.55745C8.41495 3.74067 8.50331 3.97199 8.59869 4.2508L8.67408 4.4792C8.78033 4.80691 8.93244 5.29057 8.93991 5.31644C8.99216 5.47962 9.0304 5.58748 9.07308 5.67705C9.07726 5.80028 9.07726 5.80028 9.75258 6.13027C10.5523 5.56019 10.5523 5.56019 10.4817 5.39649C10.4927 5.22493 10.4963 5.0571 10.5003 4.66677C10.5049 4.20915 10.5084 4.01846 10.5193 3.76794C10.5446 3.19002 10.6033 2.7679 10.6975 2.51912C10.8732 2.05371 11.1823 1.71753 11.5476 1.60657C12.0167 1.46226 12.5347 1.42638 12.9539 1.51446ZM15.2813 9.87724C14.8841 9.87911 14.5636 10.2089 14.5655 10.6139L14.5961 17.4051C14.598 17.81 14.9214 18.1368 15.3187 18.135C15.7159 18.1331 16.0364 17.8033 16.0345 17.3983L16.0038 10.6071C16.002 10.2022 15.6785 9.87537 15.2813 9.87724ZM19.181 9.88173C18.7838 9.88173 18.4618 10.21 18.4618 10.615V17.3788C18.4618 17.7838 18.7838 18.1121 19.181 18.1121C19.5782 18.1121 19.9002 17.7838 19.9002 17.3788V10.615C19.9002 10.21 19.5782 9.88173 19.181 9.88173ZM11.4826 9.93904C11.0854 9.94152 10.7654 10.2718 10.7679 10.6768L10.8081 17.3761C10.8106 17.781 11.1345 18.1073 11.5317 18.1048C11.9289 18.1024 12.249 17.772 12.2465 17.3671L12.2062 10.6678C12.2038 10.2628 11.8798 9.93655 11.4826 9.93904Z"
      fill="white"
    />
  </svg>
);

// Option 2's scroll demo: cursor fades in, slides DOWN while the dashboard
// scrolls UP to the PRR chart, holds, then slides back UP while the dashboard
// scrolls back. State-driven like the click cursor but only translates Y;
// CSS transitions on `top` + the dashboard `transform` handle smoothing.
type ScrollCursorPhase = 'idle' | 'enter' | 'down' | 'hold' | 'up' | 'done';

// Vertical positions for the cursor (rectangle-local px). x stays centred.
const SCROLL_CURSOR_X = 308; // 616 / 2
const SCROLL_TOP_Y = 200;
const SCROLL_BOTTOM_Y = 340;

// How far Option 2 scrolls (rectangle px). 400 puts the PRR chart in the
// middle of the visible 500-px rectangle (PRR's scaled top sits at y≈476).
const OPTION2_SCROLL_Y = 400;

function ScrollGestureCursor({ phase }: { phase: ScrollCursorPhase }) {
  const showing = phase !== 'idle' && phase !== 'done';
  const atBottom = phase === 'down' || phase === 'hold' || phase === 'up';
  const cy = atBottom ? SCROLL_BOTTOM_Y : SCROLL_TOP_Y;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: SCROLL_CURSOR_X,
        top: cy,
        // Centre the SVG on (left, top) — the scroll cursor isn't anchored
        // to a fingertip like the click cursor; centring reads as "the hand
        // is here, now swiping".
        transform: 'translate(-13px, -12px)',
        transformOrigin: '13px 12px',
        opacity: showing ? 1 : 0,
        transition:
          'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {SCROLL_CURSOR}
    </div>
  );
}

const OPTION_LABELS = ['Tabs', 'Scroll'];

export function HiFiCompare() {
  // The carousel is gated on viewport entry: it does NOT animate on page
  // load. An IntersectionObserver bumps `revealCount` every time the square
  // scrolls back into view; that count keys the carousel subtree so the CSS
  // animations and HiFiOption1's tab-cycle effect all restart from frame 0
  // on each entry. Before the first entry the carousel renders statically
  // (Option 1 visible, Option 2 hidden, no cursor, no tab-flip).
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealCount((c) => c + 1); },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const playing = revealCount > 0;

  // Cursor + chart-tab orchestration. Lives at the HiFiCompare level so a
  // single timer chain drives both the cursor phase (idle → enter → travel
  // → click → done) and the chart's tab flip (PDR → PRR), keeping them in
  // lock-step. Restarts on every reveal because `revealCount` is in the
  // dependency array — `cycle()` plays once immediately, then setInterval
  // re-runs it every CYCLE_S seconds.
  const [tab, setTab] = useState<0 | 1>(0);
  // Which tab the animated cursor is hovering (tints its label blue, mimicking
  // a real :hover). Turns on as the cursor lands on a tab, off when the click
  // flips that tab to selected.
  const [hoveredTab, setHoveredTab] = useState<0 | 1 | null>(null);
  const [cursorPhase, setCursorPhase] = useState<CursorPhase>('idle');
  const [scrollPhase, setScrollPhase] = useState<ScrollCursorPhase>('idle');
  const [option2ScrollY, setOption2ScrollY] = useState(0);
  useEffect(() => {
    if (!playing) return;
    let timers: number[] = [];
    const cycle = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
      setTab(0);
      setHoveredTab(null);
      setCursorPhase('idle');
      setScrollPhase('idle');
      setOption2ScrollY(0);
      // ── Option 1 (first half) ─────────────────────────────────────────
      // Cursor enters below PRR, clicks PRR (chart flips to PRR), travels
      // back left and clicks PDR (chart flips back to PDR), then fades out.
      timers.push(window.setTimeout(() => setCursorPhase('enter'),       600));
      timers.push(window.setTimeout(() => setCursorPhase('travel-prr'), 1500));
      // Tint the PRR tab on hover as the cursor lands on it (~0.4 s into the
      // ease-out travel), until the click flips it to selected at 2500.
      timers.push(window.setTimeout(() => setHoveredTab(1),             1900));
      timers.push(window.setTimeout(() => setCursorPhase('click-prr'),  2400));
      // Flip the chart to PRR mid-click so the change lands as the cursor
      // rebounds — matches square 4's "click then reveal" feel.
      timers.push(window.setTimeout(() => { setTab(1); setHoveredTab(null); }, 2500));
      // Hold on PRR briefly, then travel back to the PDR tab.
      timers.push(window.setTimeout(() => setCursorPhase('travel-pdr'), 3500));
      // Tint the PDR tab on hover as the cursor lands back on it.
      timers.push(window.setTimeout(() => setHoveredTab(0),             3900));
      timers.push(window.setTimeout(() => setCursorPhase('click-pdr'),  4400));
      // Reset chart back to PDR mid-click — finishes the demo on its
      // initial state.
      timers.push(window.setTimeout(() => { setTab(0); setHoveredTab(null); }, 4500));
      timers.push(window.setTimeout(() => setCursorPhase('done'),       4900));
      // ── Option 2 (second half, 7-14 s) ────────────────────────────────
      // Scroll cursor fades in at top of the rectangle, slides down while
      // the dashboard scrolls up to the PRR chart, holds, then both
      // animate back to the start position.
      timers.push(window.setTimeout(() => setScrollPhase('enter'),    7800));
      timers.push(window.setTimeout(() => {
        setScrollPhase('down');
        setOption2ScrollY(OPTION2_SCROLL_Y);
      }, 8500));
      timers.push(window.setTimeout(() => setScrollPhase('hold'),     9900));
      timers.push(window.setTimeout(() => {
        setScrollPhase('up');
        setOption2ScrollY(0);
      }, 11000));
      timers.push(window.setTimeout(() => setScrollPhase('done'),    12500));
    };
    cycle();
    // Play once per scroll-in. Re-entry bumps revealCount and re-runs the
    // effect, so the cycle replays from frame 0 then rests on Option 2.
    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [playing, revealCount]);

  return (
    <div
      ref={containerRef}
      data-name="hifi-compare"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{hifiAnim}</style>
      {/* Carousel slot — each option-card stacks at (0,0) inside this fixed-
          size box and fades in/out via the keyframe with a half-cycle
          negative delay per card, exactly like the polyp morphology
          carousel in square 2. Keyed on revealCount so the subtree remounts
          (and CSS animations + tab cycle restart) on each viewport entry. */}
      <div
        key={revealCount}
        style={{ position: 'relative', width: RECT_W, height: RECT_H + 24 + 30 /* rect + gap + label */ }}
      >
        {OPTION_LABELS.map((label, i) => {
          const isOption1 = i === 0;
          const node = isOption1 ? <HiFiOption1 tab={tab} hoveredTab={hoveredTab} /> : <HiFiOption2 />;
          const overlay = playing
            ? isOption1
              ? <PdrTabCursor phase={cursorPhase} />
              : <ScrollGestureCursor phase={scrollPhase} />
            : null;
          const rectScrollY = isOption1 ? 0 : option2ScrollY;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
                // Before the first reveal show Option 1 statically and hide
                // Option 2 — no carousel motion until the user scrolls here.
                // After reveal, the carousel keyframe owns opacity + scale.
                opacity: playing ? 0 : (isOption1 ? 1 : 0),
                animation: playing
                  ? `hifi-option-carousel ${CYCLE_S}s linear ${(-i * CYCLE_S) / OPTION_LABELS.length}s infinite`
                  : 'none',
              }}
            >
              <OptionRectangle overlay={overlay} scrollY={rectScrollY} stickyBar={<OlysenseBar />}>{node}</OptionRectangle>
              {/* Label — same style as the polyp-morphology card body
                  (Manrope Regular 18 / leading-normal / centred / #000000). */}
              <p
                style={{
                  margin: 0,
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 400,
                  fontSize: 18,
                  lineHeight: 'normal',
                  color: '#000000',
                  textAlign: 'center',
                }}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
