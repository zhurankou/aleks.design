import { useState, useEffect, useCallback, useRef, type ReactNode, type CSSProperties } from 'react';
import {
  HomeContent,
  FRAME_W,
  FRAME_H,
  BASE_ICON_POOL,
  ICON_COLORS,
  ICON_GRADIENT,
  paletteFromColor,
  EndoLoopVideo,
  olyBgAnim,
} from './NewPage';
import { OlyCarousel } from './OlyCarousel';
import { OlyTraceCanvas } from './OlyTraceCanvas';
import {
  TeamAvatars,
  PortfolioTimeline,
  ContributionVenn,
  PolypMorphologyCarousel,
  EndoLeadDuet,
  PolaroidRow,
  PROCESS_DROPDOWNS,
  loadAnim,
} from './OlySensePage';
import { LoFiPolypsCharts } from './LoFiPolypsCharts';
import { HiFiCompare } from './HiFiCompare';
import { HiFiCorrelated } from './HiFiCorrelated';
import { PolypsDashboard } from './polyps/PolypsDashboard';
import { BrowserFrame } from './BrowserFrame';
import { PrivatHomeView } from './privat/PrivatHomeView';
import { AnimatedCursor, type CursorPhase } from './privat/AnimatedCursor';
import { BaseMatchCanvas } from './BaseMatchCanvas';
import { PolaroidWall } from './PolaroidWall';
import { useBreakpoint } from './ui/use-breakpoint';
import { MobileNotice } from './ui/MobileNotice';

// Portfolio presentation deck. Reuses the home hero, the OlySense case-study
// building blocks (team, timeline, the Process squares) and the Privat / base.24
// project content from NewPage — laid out as discrete, full-screen slides driven
// by Next / Previous (and arrow keys) instead of scroll.

const slideAnim = `
  @keyframes slide-enter-fwd  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slide-enter-back { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slide-tag-wave   { 0%, 100% { color: #A8AFB6; } 50% { color: #5A626B; } }
  /* On-load entrance for each element: a soft, slow rise + fade, gently
     staggered across siblings (easeOutExpo for a smooth settle). */
  @keyframes el-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  /* Pure opacity fade — for WebGL/canvas where a transform makes the fade janky. */
  @keyframes el-fade { from { opacity: 0; } to { opacity: 1; } }
  .slide-stagger > * { animation: el-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .slide-stagger > *:nth-child(1) { animation-delay: 0.10s; }
  .slide-stagger > *:nth-child(2) { animation-delay: 0.22s; }
  .slide-stagger > *:nth-child(3) { animation-delay: 0.34s; }
  .slide-stagger > *:nth-child(4) { animation-delay: 0.46s; }
  .slide-stagger > *:nth-child(5) { animation-delay: 0.58s; }
  .slide-stagger > *:nth-child(6) { animation-delay: 0.70s; }
  .slide-stagger > *:nth-child(7) { animation-delay: 0.82s; }
`;

const FONT_TITLE = "'Stack Sans Notch', sans-serif";
const FONT_BODY = "'Manrope', sans-serif";

// ── Shared layout helpers ───────────────────────────────────────────────────

// Scales fixed-size content to fit BOTH the available width and height of its
// parent (never upscales past 1). The case-study squares and frames are
// fixed-pixel; this keeps them whole on any screen height.
function FitBox({ designW, designH, children, style }: { designW: number; designH: number; children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const s = Math.min(el.clientWidth / designW, el.clientHeight / designH, 1);
      setScale(s > 0 ? s : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designW, designH]);
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <div style={{ width: designW, height: designH, flexShrink: 0, transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        {children}
      </div>
    </div>
  );
}

// Animated per-character section tag (same colour wave as the home / case-study
// "SELECTED WORK" / "CASE STUDY" labels).
function WaveTag({ text, color = '#A8AFB6' }: { text: string; color?: string }) {
  return (
    <p style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 18, lineHeight: '34px', color, whiteSpace: 'nowrap' }}>
      {Array.from(text).map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', animation: 'slide-tag-wave 2s ease-in-out infinite', animationDelay: `${i * 0.12}s` }}>
          {ch}
        </span>
      ))}
    </p>
  );
}

// OlySense Process steps: a fixed text column on the left, the scaled square
// filling the rest on the right.
function SplitSlide({ text, visual }: { text: ReactNode; visual: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: '440px 1fr',
        gap: 56,
        alignItems: 'center',
        padding: '64px 88px',
        boxSizing: 'border-box',
        maxWidth: 1500,
        margin: '0 auto',
      }}
    >
      <div className="slide-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{text}</div>
      <div style={{ height: '100%', minWidth: 0 }}>{visual}</div>
    </div>
  );
}

// Project showcase (OlySense / Privat), reproduced at the /new desktop's exact
// sizes: project name (48px) 40px to the left of the frame, the 264px side
// panel 40px to its right. The whole row is scaled uniformly to fit the slide.
const PANEL_W = 264; // side-panel width (matches /new)
const SHOWCASE_GAP = 40; // gap between name/frame/panel (matches /new)

function ShowcaseSlide({ name, tag, desc, visual, frameW, frameH, bgLayer, nameColor = '#000000', tagWeight = 600, tagColor = '#000000', descColor = '#000000' }: {
  name: ReactNode; tag: string; desc: string; visual: ReactNode; frameW: number; frameH: number; bgLayer?: ReactNode;
  nameColor?: string; tagWeight?: number; tagColor?: string; descColor?: string;
}) {
  // Symmetric row [name 264][frame][panel 264] → the frame is centred. Scaled by
  // FitBox using these exact dimensions (deterministic — no content measuring).
  const designW = frameW + 2 * (PANEL_W + SHOWCASE_GAP);
  return (
    <>
      {bgLayer}
      <div style={{ position: 'absolute', inset: 0, padding: '64px', boxSizing: 'border-box' }}>
        <FitBox designW={designW} designH={frameH}>
          <div className="slide-stagger" style={{ width: designW, height: frameH, display: 'flex', alignItems: 'center', gap: SHOWCASE_GAP }}>
            <p style={{ width: PANEL_W, flexShrink: 0, margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: nameColor, whiteSpace: 'nowrap', textAlign: 'right' }}>{name}</p>
            <div style={{ flexShrink: 0 }}>{visual}</div>
            <div style={{ width: PANEL_W, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: tagWeight, fontSize: 18, lineHeight: 'normal', color: tagColor, whiteSpace: 'nowrap' }}>{tag}</p>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 20, lineHeight: '34px', color: descColor }}>{desc}</p>
            </div>
          </div>
        </FitBox>
      </div>
    </>
  );
}

// Privat showcase — the framed phone with PrivatHomeView's scripted demo plus
// the screen-space AnimatedCursor (rendered OUTSIDE the FitBox transform so its
// position:fixed + getBoundingClientRect targeting stays in true screen coords;
// its size is derived from the frame's on-screen height so it scales with it).
function PrivatShowcase() {
  const [phase, setPhase] = useState<CursorPhase>('enter');
  const [copyEl, setCopyEl] = useState<HTMLElement | null>(null);
  const [startBtnEl, setStartBtnEl] = useState<HTMLElement | null>(null);
  const [cursorSize, setCursorSize] = useState(140);
  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const measure = () => {
      const r = frameRef.current?.getBoundingClientRect();
      if (r?.height) setCursorSize(280 * (r.height / FRAME_H));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const ro = frameRef.current ? new ResizeObserver(measure) : null;
    if (frameRef.current && ro) ro.observe(frameRef.current);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return (
    <>
      <ShowcaseSlide
        name="Privat"
        tag="WIP PROJECT"
        frameW={FRAME_W}
        frameH={FRAME_H}
        desc="Designing and building Privat, an application for instant 1:1 video sessions."
        nameColor="#FFFFFF"
        tagColor="#FCFCFC"
        descColor="#959595"
        visual={
          <div ref={frameRef} style={{ width: FRAME_W, height: FRAME_H, border: '5px solid #A8AFB6', borderRadius: 40, overflow: 'hidden', boxSizing: 'border-box' }}>
            <PrivatHomeView active={true} onPhaseChange={setPhase} copyRef={setCopyEl} startBtnRef={setStartBtnEl} />
          </div>
        }
      />
      <AnimatedCursor phase={phase} copyEl={copyEl} startBtnEl={startBtnEl} frameEl={frameRef.current} size={cursorSize} />
    </>
  );
}

// A case-study Process square. Built at the original 696 box, then scaled up so
// its rendered size matches the 792 OlySense square (content scales with it).
function ProcessSquare({ content, fullBleed }: { content: ReactNode; fullBleed?: boolean }) {
  const k = FRAME_H / 696; // 792 / 696
  return (
    <FitBox designW={FRAME_H} designH={FRAME_H}>
      <div style={{ width: FRAME_H, height: FRAME_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 696,
            height: 696,
            flexShrink: 0,
            transform: `scale(${k})`,
            transformOrigin: 'center center',
            backgroundColor: '#f5f5f7',
            borderRadius: 40,
            boxSizing: 'border-box',
            ...(fullBleed
              ? { padding: 0, overflow: 'hidden' }
              : { padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
          }}
        >
          {content}
        </div>
      </div>
    </FitBox>
  );
}

// Talking-point list: flush-left with the paragraph (no list indent), each item
// prefixed with a "+". Lines starting with "—" render as indented sub-points.
function Bullets({ points, gap = 14, fontSize = 18, lineHeight = '28px' }: { points: string[]; gap?: number; fontSize?: number; lineHeight?: string }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap }}>
      {points.map((p, i) => {
        const sub = p.startsWith('—');
        return (
          <li key={i} style={{ display: 'flex', gap: 10, paddingLeft: sub ? 26 : 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize, lineHeight, color: '#1d1d1f' }}>
            {!sub && <span aria-hidden style={{ flexShrink: 0, fontWeight: 800 }}>_</span>}
            <span>{sub ? p.replace(/^—\s*/, '') : p}</span>
          </li>
        );
      })}
    </ul>
  );
}

function StepText({ title, points }: { title: string; points: string[] }) {
  return (
    <>
      <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 44, lineHeight: 1.05, color: '#000000' }}>{title}</h2>
      <Bullets points={points} gap={16} fontSize={19} lineHeight="30px" />
    </>
  );
}

// ── OlySense Process steps — talking points summarised from PROCESS_DROPDOWNS ──

const PROCESS_SLIDES: { step: string; title: string; points: string[]; square: ReactNode; fullBleed?: boolean }[] = [
  {
    step: '01',
    title: PROCESS_DROPDOWNS[0].title, // Contribution
    points: [
      'Led the end-to-end product design',
      'Translated complex ESGE guidelines into UX requirements',
      'Lo- & hi-fi testing with clinicians across multiple hospitals',
      'Owned the intersection of Design, Research & Product',
    ],
    square: <ContributionVenn />,
    fullBleed: true,
  },
  {
    step: '02',
    title: PROCESS_DROPDOWNS[1].title, // Understanding polyps & users
    points: [
      'Started from a discovery report on ESGE polyp quality metrics',
      'Learned the polyp morphologies clinicians actually care about',
      'Grounded the design in real clinical vocabulary',
    ],
    square: <PolypMorphologyCarousel />,
  },
  {
    step: '02',
    title: PROCESS_DROPDOWNS[1].title, // Understanding polyps & users (personas)
    points: [
      'Two personas: endoscopists improving their own performance, and leads tracking department quality',
      'Distilled three core questions:',
      '— “Am I compliant with ESGE standards?”',
      '— “What am I detecting, resecting & retrieving?”',
      '— “What’s driving high or low scores over time?”',
    ],
    square: <EndoLeadDuet />,
  },
  {
    step: '03',
    title: PROCESS_DROPDOWNS[2].title, // Lo-Fi study and key learnings
    points: [
      'Explored concepts: one page vs. two, charts vs. tables, level of detail',
      'Remote sessions with 10 clinicians across Spain & Germany',
      'Winner: a single Polyps page — detection → resection → retrieval',
      'Charts for Location & Size; tables reserved for deeper analysis',
    ],
    square: <LoFiPolypsCharts />,
    fullBleed: true,
  },
  {
    step: '04',
    title: PROCESS_DROPDOWNS[3].title, // Hi-Fi study and key findings
    points: [
      'Tested a tabbed Polyps page vs. a long-scroll layout',
      'Usability testing with 7 clinicians across 3 hospitals',
      'Tabbed layout cut cognitive overload & prioritised PDR',
      'Graphs for By Size / By Location; tables for dense detail',
    ],
    square: <HiFiCompare />,
  },
  {
    step: '04',
    title: PROCESS_DROPDOWNS[3].title, // Hi-Fi study and key findings (refinements)
    points: [
      'Removed low-value views — By Number, By Time of Day',
      'Grouped sizes into <5, 5–10, 10–20 and >20 mm',
      'Merged small colon segments into broader regions',
    ],
    square: <HiFiCorrelated />,
  },
];

// Full bio — the "My story" narrative, verbatim from HomePage's storyText.
const STORY_PARAGRAPHS = [
  "My path into design wasn’t traditional. I worked as an investigator, a turret machine operator, a janitor, and served in the US Navy before choosing what I’d always been passionate about.",
  "Outside of work, I enjoy hiking, snowboarding, off-roading, and camping. I’m also curious about new technology, especially machine learning, AR, AI tools, vibe coding prototypes, and building UI kits for design systems.",
  "After leaving the Navy, I studied design at the University of Washington, where I learned the foundations of design thinking and got to apply them by improving the Graduate Student Office website and making it easier to use.",
  "At Microsoft, I joined the OneDrive team and led the sharing experience effort. There, I learned how to design for scale, simplify complexity, and balance user needs with business goals.",
  "At eero, I worked on making home networking feel more approachable and helped build the early design system. That experience taught me a lot about consistency, repeatable patterns, and designing systems that can grow over time.",
  "Most recently at Olympus, I focused on data visualization, helping endoscopists improve procedure quality by making complex clinical data easier to understand and act on. There, I learned how important clarity, trust, and usability are in high-stakes environments.",
  "I’m currently exploring what’s next and excited for new opportunities.",
];

// Career — just the places.
const STORY_HIGHLIGHTS = [
  "University of Washington",
  "Microsoft · OneDrive",
  "eero",
  "Olympus",
];

// ── Slide definitions ────────────────────────────────────────────────────────

type Slide = { bg: string; dark?: boolean; render: () => ReactNode };

const SLIDES: Slide[] = [
  // 1 — Home
  {
    bg: '#FFFFFF',
    render: () => (
      <div className="slide-stagger" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', boxSizing: 'border-box' }}>
        <HomeContent active={true} />
      </div>
    ),
  },
  // 2 — My Story (intro + career highlights beside a square of moving polaroids)
  {
    bg: '#FFFFFF',
    render: () => (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: '440px 1fr',
          gap: 56,
          alignItems: 'center',
          padding: '64px 88px',
          boxSizing: 'border-box',
          maxWidth: 1500,
          margin: '0 auto',
        }}
      >
        <div className="slide-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 44, lineHeight: 1.05, color: '#000000' }}>My Story</h2>
          <p style={{ margin: 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 18, lineHeight: '28px', color: '#1d1d1f' }}>
            {STORY_PARAGRAPHS[0]}
          </p>
          <Bullets points={STORY_HIGHLIGHTS} />
        </div>
        <div style={{ height: '100%', minWidth: 0 }}>
          <ProcessSquare
            fullBleed
            content={<div style={{ position: 'relative', width: '100%', height: '100%' }}><PolaroidWall scale={0.85} /></div>}
          />
        </div>
      </div>
    ),
  },
  // 3 — OlySense (the /new desktop view: framed dashboard on a soft gradient)
  {
    bg: '#FBFDFF',
    render: () => (
      <ShowcaseSlide
        name="OlySense"
        tag="CASE STUDY"
        frameW={FRAME_H}
        frameH={FRAME_H}
        desc="Led 0→1 research and design for OlySense, an endoscopy KPI dashboard."
        bgLayer={
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <style>{olyBgAnim}</style>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, #e6ecff 0%, #ffffff 50%, #ffe7ee 100%)' }} />
            <div style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle at 28% 30%, rgba(198,221,255,0.85) 0%, rgba(198,221,255,0) 60%)', animation: 'oly-bg-a 18s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle at 80% 62%, rgba(255,206,211,0.8) 0%, rgba(255,206,211,0) 60%)', animation: 'oly-bg-b 22s ease-in-out infinite' }} />
          </div>
        }
        visual={
          // Real size: the FRAME_H × FRAME_H (792²) OlySense square in a white frame.
          <div style={{ position: 'relative', width: FRAME_H, height: FRAME_H, backgroundColor: '#FBFDFF', borderRadius: 40, overflow: 'hidden', boxShadow: '0 24px 64px rgba(20,24,40,0.14)' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: '-25%', transform: 'translate(-10%, -8%)', background: 'radial-gradient(circle at 32% 34%, rgba(198,221,255,0.7) 0%, rgba(198,221,255,0) 62%)', animation: 'oly-bg-a 16s ease-in-out infinite', willChange: 'transform' }} />
              <div style={{ position: 'absolute', inset: '-25%', transform: 'translate(10%, 8%) scale(1.15)', background: 'radial-gradient(circle at 70% 66%, rgba(255,206,211,0.62) 0%, rgba(255,206,211,0) 62%)', animation: 'oly-bg-b 21s ease-in-out infinite', willChange: 'transform' }} />
            </div>
            <OlyTraceCanvas style={{ position: 'absolute', inset: 0 }} play={true} />
            <OlyCarousel style={{ position: 'absolute', inset: 0 }} blurred={true} playing={true} />
            <EndoLoopVideo
              src="/endo2.mp4"
              loop={false}
              playing={true}
              style={{
                position: 'absolute', left: 12, bottom: 40, width: 164.6,
                aspectRatio: '1080 / 1920', transform: 'scaleX(-1)', pointerEvents: 'none',
                WebkitMaskImage: 'linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 16%, #000 100%)',
                maskImage: 'linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 16%, #000 100%)',
                WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
              }}
            />
          </div>
        }
      />
    ),
  },
  // OlySense case study — intro (title + team + timeline)
  {
    bg: '#FFFFFF',
    render: () => (
      <div style={{ position: 'absolute', inset: 0, padding: '64px 48px', boxSizing: 'border-box' }}>
        <FitBox designW={1000} designH={860}>
          <div className="slide-stagger" style={{ width: 1000, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <h1 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 72, lineHeight: 'normal', color: '#000000', textAlign: 'center' }}>
              Polyps Metrics in<br />OlySense Insights
            </h1>
            <p style={{ margin: 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#000000', textAlign: 'center', width: 440 }}>
              Objective: Helping endoscopists to understand performance across key colonoscopy quality metrics.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 32 }}>
              <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 36, lineHeight: 'normal', color: '#000000' }}>Team</h2>
              <TeamAvatars />
            </div>
            <div style={{ marginTop: 32 }}>
              <PortfolioTimeline />
            </div>
          </div>
        </FitBox>
      </div>
    ),
  },
  // OlySense — PROBLEM (statement + testimonial quote marquee)
  {
    bg: '#FFFFFF',
    render: () => (
      <div className="slide-stagger" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '64px 0', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 24px' }}>
          <WaveTag text="PROBLEM" />
          <p style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 44, lineHeight: 'normal', color: '#000000', textAlign: 'center', maxWidth: 880 }}>
            Clinicians needed a clearer, more actionable way to understand polyp quality metrics and what was driving their results.
          </p>
        </div>
        <div style={{ alignSelf: 'stretch' }}>
          <PolaroidRow />
        </div>
      </div>
    ),
  },
  // OlySense case study — Process steps (one slide per square)
  ...PROCESS_SLIDES.map((s): Slide => ({
    bg: '#FFFFFF',
    render: () => (
      <SplitSlide
        text={<StepText title={s.title} points={s.points} />}
        visual={<ProcessSquare content={s.square} fullBleed={s.fullBleed} />}
      />
    ),
  })),
  // OlySense case study — Final Design (interactive dashboard)
  {
    bg: '#FFFFFF',
    render: () => (
      <div className="slide-stagger" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 48px', boxSizing: 'border-box', gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 44, lineHeight: 'normal', color: '#000000' }}>Final Design</h2>
        <p style={{ margin: 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 18, lineHeight: '28px', color: '#000000', textAlign: 'center', maxWidth: 760 }}>
          Validated before launch through usability evaluation with target users — participants completed 82% of key tasks successfully.
        </p>
        <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
          <FitBox designW={1200} designH={792}>
            <div style={{ width: 1200, height: 792 }}>
              <BrowserFrame expand={1}>
                <PolypsDashboard selfScroll={true} />
              </BrowserFrame>
            </div>
          </FitBox>
        </div>
      </div>
    ),
  },
  // 4 — Privat (the /new desktop view, with the scripted hand cursor)
  {
    bg: '#000000',
    dark: true,
    render: () => <PrivatShowcase />,
  },
  // 5 — base.24 (the /new desktop view: wide dotted frame enclosing the icons)
  // Outer bg a notch darker than the dotted frame (#0c1430).
  {
    bg: '#080e22',
    dark: true,
    render: () => (
      <div style={{ position: 'absolute', inset: 0, padding: '64px 56px', boxSizing: 'border-box' }}>
        <FitBox designW={1472} designH={768}>
          <div
            className="slide-stagger"
            style={{
              width: 1472,
              height: 768,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 56,
              borderRadius: 48,
              padding: '64px 96px',
              backgroundColor: '#0c1430',
              backgroundImage: `radial-gradient(circle, transparent 1.2px, #0c1430 1.7px), ${ICON_GRADIENT}`,
              backgroundSize: '18px 18px, auto',
              backgroundPosition: 'center',
            }}
          >
            <p style={{ width: 264, flexShrink: 0, margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#A8A8A8', textAlign: 'right', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#FFFFFF' }}>base</span>.24
            </p>
            <div style={{ width: 640, height: 640, flexShrink: 0, animation: 'el-fade 0.6s ease-out 0.3s both' }}>
              <BaseMatchCanvas pool={BASE_ICON_POOL} color={paletteFromColor('#5B8DEF').icon} colors={ICON_COLORS} playing={false} spin={false} wobble showTile={false} depth={1.5} cellFit={0.85} roundness={1} shuffleKey={0} />
            </div>
            <div style={{ width: 264, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <p style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 18, lineHeight: 'normal', color: '#FFFFFF', whiteSpace: 'nowrap' }}>RESOURCE</p>
              <p style={{ margin: 0, fontFamily: FONT_BODY, fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#A8A8A8' }}>
                Created base.24, an open source icon set for the Figma Design Community.
              </p>
            </div>
          </div>
        </FitBox>
      </div>
    ),
  },
  // 6 — Thank you
  {
    bg: '#FFFFFF',
    render: () => (
      <div className="slide-stagger" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '64px 24px', boxSizing: 'border-box' }}>
        {/* Looping circular avatar video — same as the about badge in /new. */}
        <EndoLoopVideo
          src="/avatar1.mp4"
          objectPosition="36.5% center"
          fadeSeconds={0.6}
          holdSeconds={0}
          startDelaySeconds={0}
          loop={false}
          playing
          style={{ width: 180, height: 180, borderRadius: '50%', overflow: 'hidden', backgroundColor: '#E0E0E4', marginBottom: 8 }}
        />
        <h1 style={{ margin: 0, fontFamily: FONT_TITLE, fontWeight: 300, fontSize: 88, lineHeight: 'normal', color: '#000000', textAlign: 'center' }}>Thank you!</h1>
        <a
          href="https://aleks.design"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 22, lineHeight: 'normal', color: '#5b5b5b', textDecoration: 'none' }}
        >
          aleks.design
        </a>
      </div>
    ),
  },
];

// ── Navigation chrome ────────────────────────────────────────────────────────

const glassPill: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 8px 32px rgba(20, 24, 40, 0.12)',
  borderRadius: 999,
};

export function SlidesPage() {
  const bp = useBreakpoint();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  // The counter is hidden by default; each arrow stroke fades it in, then it
  // fades back out after a short pause.
  const [counterVisible, setCounterVisible] = useState(false);
  const counterTimer = useRef<number | undefined>(undefined);

  const go = useCallback((delta: number) => {
    setIndex((i) => {
      const n = Math.max(0, Math.min(SLIDES.length - 1, i + delta));
      if (n !== i) setDir(delta > 0 ? 1 : -1);
      return n;
    });
  }, []);

  const pingCounter = useCallback(() => {
    setCounterVisible(true);
    if (counterTimer.current) clearTimeout(counterTimer.current);
    counterTimer.current = window.setTimeout(() => setCounterVisible(false), 1300);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(1); pingCounter(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(-1); pingCounter(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); if (counterTimer.current) clearTimeout(counterTimer.current); };
  }, [go, pingCounter]);

  if (bp === 'mobile') return <MobileNotice />;

  const slide = SLIDES[index];
  const dark = slide.dark;
  // Glass tints to the slide tone so the pill keeps contrast on black/navy.
  const pill: CSSProperties = dark
    ? { ...glassPill, backgroundColor: 'rgba(20, 24, 40, 0.45)', border: '1px solid rgba(255, 255, 255, 0.35)', boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.35)' }
    : glassPill;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: slide.bg, transition: 'background-color 0.45s ease' }}>
      <style>{slideAnim}</style>
      {/* OlySense keyframes (marquee, avatar bounce, timeline reveal, caption fades). */}
      <style>{loadAnim}</style>

      {/* Active slide — remounted per index so reused IntersectionObserver-driven
          entrances (Venn, timeline, video duet) replay on every visit. */}
      <div
        key={index}
        style={{ position: 'absolute', inset: 0, animation: `${dir > 0 ? 'slide-enter-fwd' : 'slide-enter-back'} 0.6s ease both` }}
      >
        {slide.render()}
      </div>

      {/* Slide counter — arrow-keys only; fades in on each stroke, then fades out. */}
      <div style={{ ...pill, position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: counterVisible ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: 'none' }}>
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: dark ? '#E6E8EF' : '#1d1d1f', minWidth: 48, textAlign: 'center' }}>
          {index + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}
