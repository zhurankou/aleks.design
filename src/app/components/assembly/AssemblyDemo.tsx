import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// A scripted web recreation of the Assembly iPhone app's conversation, looping
// through a few language pairs, half in dark mode and half in light. Copy, sizes
// and colours come from the app's SwiftUI (HomeView's DemoScript, ConversationView,
// ConversationViews, SpeakerPalette).

const FONT = "ui-rounded, 'SF Pro Rounded', 'Manrope', sans-serif";

// `speakers` is SpeakerPalette, `neutral` the primary label, as r,g,b.
const DARK = {
  background: '#000000',
  label: '#FFFFFF',
  secondary: 'rgba(235,235,245,0.6)',
  accent: '#0A84FF',
  accentRgb: '10,132,255',
  glass: 'rgba(255,255,255,0.12)',
  speakers: ['64,219,224', '196,163,255', '255,184,102', '255,143,179'],
  neutral: '255,255,255',
  bubbleFill: 0.06,
};
const LIGHT: typeof DARK = {
  background: '#FFFFFF',
  label: '#000000',
  secondary: 'rgba(60,60,67,0.6)',
  accent: '#007AFF',
  accentRgb: '0,122,255',
  glass: 'rgba(118,118,128,0.12)',
  speakers: ['0,99,107', '110,64,173', '153,79,18', '173,36,92'],
  neutral: '0,0,0',
  bubbleFill: 0.035,
};

type LangCode = 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'de' | 'zh';
const LANGUAGE_NAMES: Record<LangCode, string> = {
  en: 'English', es: 'Spanish', fr: 'French', ja: 'Japanese', ko: 'Korean', de: 'German', zh: 'Chinese',
};
const PAIRS: { spoken: LangCode; target: LangCode; theme: typeof DARK }[] = [
  { spoken: 'en', target: 'es', theme: DARK },
  { spoken: 'fr', target: 'ja', theme: LIGHT },
  { spoken: 'ko', target: 'en', theme: DARK },
  { spoken: 'de', target: 'zh', theme: LIGHT },
];

// DemoScript from HomeView.swift.
const STEPS: { speaker: number | null; name: string; isReply: boolean }[] = [
  { speaker: 0, name: 'Anna', isReply: false },
  { speaker: 1, name: 'Luis', isReply: false },
  { speaker: null, name: 'Me', isReply: true },
  { speaker: 2, name: 'Mei', isReply: false },
  { speaker: 3, name: 'Pierre', isReply: false },
  { speaker: null, name: 'Me', isReply: true },
];

const LINES: Record<LangCode, string>[] = [
  { en: 'Where should we eat today?', es: '¿Dónde comemos hoy?', fr: 'Où est-ce qu’on mange aujourd’hui ?', ja: '今日はどこで食べましょうか？', ko: '오늘은 어디에서 먹을까요?', de: 'Wo essen wir heute?', zh: '今天我们去哪儿吃饭？' },
  { en: 'I know a little place near the river.', es: 'Conozco un pequeño lugar cerca del río.', fr: 'Je connais un petit endroit près de la rivière.', ja: '川の近くに小さなお店を知っています。', ko: '강 근처에 작은 식당을 알아요.', de: 'Ich kenne ein kleines Lokal am Fluss.', zh: '我知道河边有家小店。' },
  { en: 'Can we sit outside?', es: '¿Podemos sentarnos fuera?', fr: 'On peut s’asseoir dehors ?', ja: '外に座れますか？', ko: '밖에 앉아도 될까요?', de: 'Können wir draußen sitzen?', zh: '我们可以坐在外面吗？' },
  { en: 'Sounds good! The weather is lovely today.', es: '¡Perfecto! Hoy hace un tiempo precioso.', fr: 'Bonne idée ! Il fait très beau aujourd’hui.', ja: 'いいですね！今日はいい天気です。', ko: '좋아요! 오늘 날씨가 정말 좋네요.', de: 'Klingt gut! Das Wetter ist heute herrlich.', zh: '好啊！今天天气真好。' },
  { en: 'Yes, they have a terrace with a beautiful view.', es: 'Sí, tienen una terraza con una vista preciosa.', fr: 'Oui, ils ont une terrasse avec une belle vue.', ja: 'はい、景色のきれいなテラスがあります。', ko: '네, 전망이 아름다운 테라스가 있어요.', de: 'Ja, sie haben eine Terrasse mit schöner Aussicht.', zh: '有的，他们有个露台，风景很美。' },
  { en: 'Perfect, let’s go!', es: '¡Perfecto, vamos!', fr: 'Parfait, allons-y !', ja: '完璧です、行きましょう！', ko: '완벽해요, 가요!', de: 'Perfekt, los geht’s!', zh: '太好了，我们走吧！' },
];

// A spoken line shows the spoken language above its translation; a reply shows
// what the user said above its translation back.
function textsFor(index: number, { spoken, target }: { spoken: LangCode; target: LangCode }) {
  const line = LINES[index];
  return STEPS[index].isReply
    ? { original: line[target], text: line[spoken] }
    : { original: line[spoken], text: line[target] };
}

// Timing of one conversation line. Recognition reveals the words over
// REVEAL_STEPS ticks, then the translation lands, then the voice settles.
const REVEAL_STEPS = 8;
const REVEAL_MS = 90;
const TRANSLATED_MS = 900;
const SETTLED_MS = 1700;
const LINE_MS = 2600;
const STAGE_TRANSLATED = REVEAL_STEPS;
const STAGE_SETTLED = REVEAL_STEPS + 1;
// The start of `text`; Japanese and Chinese have no spaces, so they're revealed by character.
function revealed(text: string, fraction: number) {
  if (!text.includes(' ')) return text.slice(0, Math.ceil(text.length * fraction));
  const words = text.split(' ');
  return words.slice(0, Math.ceil(words.length * fraction)).join(' ');
}

// SpeechBubble from ConversationViews.swift: the tail is inside the shape.
function bubblePath(w: number, h: number) {
  const bottom = h - 9;
  const r = Math.min(24, w / 4, h / 4);
  return `M${r} 0 L${w - r} 0 Q${w} 0 ${w} ${r} L${w} ${bottom - r} Q${w} ${bottom} ${w - r} ${bottom} `
    + `L29 ${bottom} Q18 ${h} 10 ${h} Q14 ${bottom + 3} 14 ${bottom - 3} Q0 ${bottom - 8} 0 ${bottom - r} `
    + `L0 ${r} Q0 0 ${r} 0 Z`;
}

// Eases numbers toward a moving target, frame by frame. Sizes and scroll go
// through this because SVG paths can't CSS-transition in Safari, and targets
// change mid-move while text is still arriving.
function follower(apply: (values: number[]) => void, tau: number) {
  let current: number[] | null = null;
  let target: number[] = [];
  let frame = 0;
  let last = 0;
  const step = (now: number) => {
    const dt = Math.min(50, now - last);
    last = now;
    const k = 1 - Math.exp(-dt / tau);
    let moving = false;
    current = (current ?? target).map((value, i) => {
      const distance = target[i] - value;
      if (Math.abs(distance) < 0.2) return target[i];
      moving = true;
      return value + distance * k;
    });
    apply(current);
    frame = moving ? requestAnimationFrame(step) : 0;
  };
  return {
    set(next: number[], from?: number[]) {
      target = next;
      if (!current) {
        current = from ?? next;
        apply(current);
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
    stop() {
      cancelAnimationFrame(frame);
    },
  };
}

function WorkingText({ text, working, color }: { text: string; working: boolean; color: string }) {
  const base = working ? text.replace(/[.… ]+$/, '') : text;
  // While text arrives, each new word (or character, without spaces) fades in.
  const pieces = !working ? [base] : base.includes(' ') ? base.split(/(?<= )/) : Array.from(base);
  return (
    <span style={{ color, transition: 'color 500ms ease' }}>
      {pieces.map((piece, i) => (
        <span key={i} style={{ animation: working ? 'as-fade 240ms ease-out' : undefined }}>{piece}</span>
      ))}
      {working && [0, 1, 2].map(i => (
        <span key={i} style={{ animation: `as-dot 1.2s linear ${i * 0.18}s infinite`, opacity: 0.2 }}>.</span>
      ))}
    </span>
  );
}

interface BubbleProps {
  original: string;
  text: string;
  rgb: string;
  secondary: string;
  fillOpacity: number;
  isReply: boolean;
  name?: string;
  nameWorking?: boolean;
  originalWorking?: boolean;
  textWorking?: boolean;
  isProvisional?: boolean;
  // A reply's finished text: it sizes the bubble's slot, so a reply grows left to
  // right from a fixed left edge while still ending flush right.
  finalTexts?: { original: string; text: string };
}

const CONTENT_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 9,
  width: 'max-content',
  padding: '16px 18px 24px',
  boxSizing: 'border-box',
};
const ORIGINAL_STYLE: CSSProperties = { fontSize: 17, lineHeight: '22px', fontWeight: 400 };
const TEXT_STYLE: CSSProperties = { fontSize: 22, lineHeight: '28px', fontWeight: 600 };

function ConversationBubble({ original, text, rgb, secondary, fillOpacity, isReply, name, nameWorking, originalWorking, textWorking, isProvisional, finalTexts }: BubbleProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // The content is laid out at its final size; the shell eases to that size and
  // clips it, so new lines are revealed as the bubble grows, as in the app.
  useLayoutEffect(() => {
    const row = rowRef.current;
    const shell = shellRef.current;
    const content = contentRef.current;
    const path = pathRef.current;
    if (!row || !shell || !content || !path) return;
    const size = follower(([w, h]) => {
      shell.style.width = `${w}px`;
      shell.style.height = `${h}px`;
      path.setAttribute('d', bubblePath(w, h));
    }, 90);
    // offset* are layout pixels, so they're unaffected by the page's scale(k).
    const measure = () => {
      const maxWidth = `${row.offsetWidth - 16}px`;
      content.style.maxWidth = maxWidth;
      const sizer = sizerRef.current;
      const slot = slotRef.current;
      if (sizer && slot) {
        sizer.style.maxWidth = maxWidth;
        slot.style.width = `${sizer.offsetWidth}px`;
      }
      const w = content.offsetWidth;
      const h = content.offsetHeight;
      size.set([w, h], [w, Math.min(h, 44)]);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    ro.observe(row);
    return () => {
      ro.disconnect();
      size.stop();
    };
  }, []);

  const color = `rgb(${rgb})`;
  return (
    <div ref={rowRef} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isReply ? 'flex-end' : 'flex-start',
      gap: 4,
      width: '100%',
      boxSizing: 'border-box',
      [isReply ? 'paddingLeft' : 'paddingRight']: 16,
    }}>
      <div ref={slotRef} style={{ position: 'relative' }}>
      {finalTexts && (
        <div ref={sizerRef} aria-hidden style={{ ...CONTENT_STYLE, position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}>
          <span style={ORIGINAL_STYLE}>{finalTexts.original}</span>
          <span style={TEXT_STYLE}>{finalTexts.text}</span>
        </div>
      )}
      <div ref={shellRef} style={{ position: 'relative' }}>
        <svg aria-hidden style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          transform: isReply ? 'scaleX(-1)' : undefined,
        }}>
          <path ref={pathRef} style={{
            fill: `rgba(${rgb},${fillOpacity})`,
            stroke: `rgba(${rgb},0.25)`,
            strokeWidth: 1,
            transition: 'fill 500ms ease, stroke 500ms ease',
          }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div ref={contentRef} style={{ ...CONTENT_STYLE, position: 'absolute', top: 0, left: 0 }}>
            <span style={ORIGINAL_STYLE}>
              <WorkingText text={original} working={!!originalWorking} color={secondary} />
            </span>
            {/* Remounts when the translation lands, so it fades in over the dots. */}
            <span key={textWorking ? 'waiting' : 'translated'} style={{
              ...TEXT_STYLE,
              opacity: isProvisional ? 0.7 : 1,
              animation: textWorking ? undefined : 'as-fade 400ms ease-out',
              transition: 'opacity 400ms ease',
            }}>
              <WorkingText text={text} working={!!textWorking} color={color} />
            </span>
          </div>
        </div>
      </div>
      </div>
      {(name || nameWorking) && (
        <span style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600 }}>
          <WorkingText text={name ?? ''} working={!!nameWorking} color={color} />
        </span>
      )}
    </div>
  );
}

function GlassCircle({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div style={{
      width: 38,
      height: 38,
      borderRadius: '50%',
      backgroundColor: background,
      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  );
}

function Waveform({ color, height }: { color: string; height: number }) {
  return (
    <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, height }}>
      {[0.5, 0.85, 1, 0.7, 0.45].map((h, i) => (
        <span key={i} style={{
          width: 1.5,
          height: height * h,
          borderRadius: 1,
          backgroundColor: color,
          animation: `as-wave 1s ease-in-out ${i * 0.12}s infinite`,
        }} />
      ))}
    </span>
  );
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="16" viewBox="0 0 14 19" fill="none" aria-hidden>
      <rect x="3.5" y="0" width="7" height="12" rx="3.5" fill={color} />
      <path d="M1 8.5a6 6 0 0 0 12 0M7 14.5V18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PillButton({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div style={{
      flex: 1,
      height: 44,
      borderRadius: 22,
      backgroundColor: background,
      boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontSize: 15,
      fontWeight: 600,
      transition: 'background-color 300ms ease',
    }}>
      {children}
    </div>
  );
}

// The hardware cutout, drawn over the screen like the status bar around it.
function StatusBar() {
  return (
    <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 2, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: 36, top: 17, fontSize: 16, lineHeight: '21px', fontWeight: 600 }}>9:41</span>
      <div style={{
        position: 'absolute',
        top: 11,
        left: '50%',
        width: 104,
        height: 30,
        marginLeft: -52,
        borderRadius: 15,
        backgroundColor: '#000000',
        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.08)',
      }}>
        <div style={{
          position: 'absolute',
          top: 9,
          right: 9,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 38%, #27324A 0, #101522 45%, #05060A 100%)',
        }} />
      </div>
      <svg width="68" height="13" viewBox="0 0 68 13" style={{ position: 'absolute', right: 28, top: 21 }}>
        {[[0, 8, 4], [5, 6, 6], [10, 3.5, 8.5], [15, 1, 11]].map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="3.2" height={h} rx="0.8" fill="currentColor" />
        ))}
        <path d="M24 4.6a8.6 8.6 0 0 1 12 0M26.3 7a5.3 5.3 0 0 1 7.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="10" r="1.6" fill="currentColor" />
        <rect x="42.5" y="1" width="22" height="11" rx="3.4" stroke="currentColor" strokeOpacity="0.4" fill="none" />
        <rect x="44" y="2.5" width="19" height="8" rx="2.2" fill="currentColor" />
        <path d="M66 4.5v4a2 2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

// The phone's body around the frame: titanium band and side buttons, outside
// the screen, so it sits behind the frame and doesn't scale with its contents.
export function IPhoneBody({ opacity = 1 }: { opacity?: number }) {
  const button = (side: 'left' | 'right', top: number, height: number) => (
    <div key={`${side}${top}`} style={{
      position: 'absolute',
      [side]: -2.5,
      top,
      width: 3,
      height,
      borderRadius: 1.5,
      background: 'linear-gradient(to bottom, #6E6C68, #B4B1AA 12%, #8E8B85 50%, #B4B1AA 88%, #6E6C68)',
    }} />
  );
  return (
    <div aria-hidden style={{ position: 'absolute', inset: -4, opacity, pointerEvents: 'none' }}>
      {/* Its own element, inset so the box stays hidden behind the band's corners. */}
      <div style={{ position: 'absolute', inset: 18, borderRadius: 40, boxShadow: '0 18px 44px 14px rgba(0,0,0,0.28)' }} />
      {button('left', 130, 28)}
      {button('left', 182, 56)}
      {button('left', 250, 56)}
      {button('right', 214, 92)}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 58,
        background: 'linear-gradient(135deg, #D2CFC8 0%, #8C8982 18%, #BDB9B1 42%, #7F7C76 62%, #C6C2BA 84%, #8F8C85 100%)',
        boxShadow: 'inset 0 0 0 0.75px rgba(255,255,255,0.45), inset 0 0 2px 1px rgba(0,0,0,0.35)',
      }} />
      {/* Behind the screen, so the band can't show through the seam at its edge. */}
      <div style={{ position: 'absolute', inset: 4, borderRadius: 54, backgroundColor: '#000000' }} />
    </div>
  );
}

export function AssemblyDemo({ active = true }: { active?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [loopKey, setLoopKey] = useState(0);
  const [pairIndex, setPairIndex] = useState(0);
  // The line being spoken and how far along it is; -1 before the first line.
  const [convo, setConvo] = useState({ line: -1, stage: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const pair = PAIRS[pairIndex];
  const theme = pair.theme;

  useEffect(() => {
    setConvo({ line: -1, stage: 0 });
    // Scrolled away: stop and snap back so the next entry starts fresh.
    if (!active) {
      setVisible(false);
      setPairIndex(0);
      return;
    }
    setVisible(true);

    const tLines = 500;
    const tFadeOut = tLines + STEPS.length * LINE_MS + 2200;
    const at = (ms: number, fn: () => void) => window.setTimeout(fn, ms);
    const timers = [
      at(tFadeOut, () => setVisible(false)),
      at(tFadeOut + 700, () => {
        setPairIndex(i => (i + 1) % PAIRS.length);
        setLoopKey(k => k + 1);
      }),
    ];
    STEPS.forEach((_, line) => {
      const start = tLines + line * LINE_MS;
      for (let stage = 0; stage < REVEAL_STEPS; stage++) {
        timers.push(at(start + stage * REVEAL_MS, () => setConvo({ line, stage })));
      }
      timers.push(at(start + TRANSLATED_MS, () => setConvo({ line, stage: STAGE_TRANSLATED })));
      timers.push(at(start + SETTLED_MS, () => setConvo({ line, stage: STAGE_SETTLED })));
    });
    return () => timers.forEach(clearTimeout);
  }, [loopKey, active]);

  // The conversation glides up as it outgrows the screen, following the list's
  // height continuously rather than stepping once per line.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return;
    const scroll = follower(([y]) => { list.style.transform = `translateY(${-y}px)`; }, 130);
    const measure = () => scroll.set([Math.max(0, list.offsetHeight - viewport.offsetHeight)]);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => {
      ro.disconnect();
      scroll.stop();
    };
  }, []);

  const replying = convo.line >= 0 && convo.stage < STAGE_SETTLED && STEPS[convo.line].isReply;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
      overflow: 'hidden',
      fontFamily: FONT,
      color: theme.label,
      // While the conversation is faded out between loops.
      transition: 'background-color 350ms ease-in-out, color 350ms ease-in-out',
      userSelect: 'none',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <style>{`
        @keyframes as-dot { 0%, 50%, 100% { opacity: 0.2; } 25% { opacity: 1; } }
        @keyframes as-wave { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
        @keyframes as-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes as-line-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>

      <StatusBar />
      <div aria-hidden style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        width: 134,
        height: 5,
        marginLeft: -67,
        borderRadius: 3,
        backgroundColor: 'currentColor',
        zIndex: 2,
      }} />

      {/* Conversation */}
      <div ref={viewportRef} style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 350ms ease-in-out',
      }}>
        <div ref={listRef} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          // The bar and controls overlay the list, so it clears both.
          padding: '118px 22px 120px',
        }}>
          {convo.line >= 0 && STEPS.slice(0, convo.line + 1).map((step, i) => {
            const stage = i < convo.line ? STAGE_SETTLED : convo.stage;
            const texts = textsFor(i, pair);
            const translated = stage >= STAGE_TRANSLATED;
            const settled = stage === STAGE_SETTLED;
            const speakerRgb = step.isReply ? theme.accentRgb : settled ? theme.speakers[step.speaker ?? 0] : theme.neutral;
            return (
              <div key={i} style={{ animation: 'as-line-in 500ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
                <ConversationBubble
                  original={translated ? texts.original : revealed(texts.original, (stage + 1) / REVEAL_STEPS)}
                  text={translated ? texts.text : ''}
                  rgb={speakerRgb}
                  secondary={theme.secondary}
                  fillOpacity={theme.bubbleFill}
                  isReply={step.isReply}
                  name={step.isReply || settled ? step.name : undefined}
                  nameWorking={!step.isReply && !settled}
                  originalWorking={!translated}
                  textWorking={!translated}
                  isProvisional={!translated}
                  finalTexts={step.isReply ? texts : undefined}
                />
              </div>
            );
          })}
        </div>

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 118,
          padding: '54px 16px 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: `linear-gradient(to bottom, ${theme.background} 70%, transparent)`,
        }}>
          <GlassCircle background={theme.glass}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </GlassCircle>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, paddingTop: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 17, lineHeight: '22px', fontWeight: 600 }}>Translating</span>
              <Waveform color={theme.secondary} height={11} />
            </div>
            <span style={{ fontSize: 12, lineHeight: '16px', color: theme.secondary }}>{LANGUAGE_NAMES[pair.spoken]} → {LANGUAGE_NAMES[pair.target]}</span>
          </div>
          <div style={{ width: 38 }} />
        </div>

        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          gap: 12,
          padding: '18px 24px 30px',
          background: `linear-gradient(to top, ${theme.background} 80%, transparent)`,
        }}>
          <PillButton background={theme.glass}>
            <svg width="10" height="12" viewBox="0 0 12 14" aria-hidden>
              <rect x="0" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="8" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
            Pause
          </PillButton>
          <PillButton background={replying ? theme.accent : theme.glass}>
            {replying ? <Waveform color="#FFFFFF" height={14} /> : <MicIcon color={theme.accent} />}
            <span style={{ color: replying ? '#FFFFFF' : theme.accent, transition: 'color 300ms ease' }}>{replying ? 'Replying' : 'Reply'}</span>
          </PillButton>
        </div>
      </div>
    </div>
  );
}
