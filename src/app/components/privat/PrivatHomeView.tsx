import { useEffect, useRef, useState } from 'react';
import { MeshBackground } from './MeshBackground';
import { CameraLens } from './CameraLens';

function PrivatLogo() {
  return (
    <svg viewBox="0 0 105 37" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: 28, width: 'auto', display: 'block', overflow: 'visible' }}>
      <defs>
        <mask id="pv-i-dot-mask">
          <circle cx="42.6557" cy="6" r="5" fill="white" />
          <circle cx="42.6557" cy="6" r="1.971" fill="black" />
        </mask>
      </defs>
      <circle cx="42.6557" cy="6" r="5" fill="#D9D9D9" mask="url(#pv-i-dot-mask)" />
      <path d="M10.0801 6.46542C12.5333 6.46542 14.6137 6.86471 16.3203 7.66464C18.0536 8.46463 19.3736 9.61176 20.2803 11.1051C21.1869 12.5717 21.6406 14.3186 21.6406 16.3453V16.985C21.6406 19.0116 21.1869 20.7719 20.2803 22.2652C19.3736 23.7318 18.0535 24.878 16.3203 25.7047C14.6136 26.5047 12.5334 26.9049 10.0801 26.9049H5.68066V35.8648H0V6.46542H10.0801ZM5.68066 21.985H10.5605C11.7071 21.9849 12.6671 21.7586 13.4404 21.3053C14.2403 20.852 14.8402 20.2252 15.2402 19.4254C15.6669 18.6254 15.8799 17.7046 15.8799 16.6646C15.8798 15.6248 15.6668 14.7048 15.2402 13.9049C14.8402 13.105 14.2403 12.4917 13.4404 12.065C12.6671 11.6117 11.7071 11.3854 10.5605 11.3853H5.68066V21.985Z" fill="#D9D9D9" />
      <path d="M36.3686 18.7047H34.8491C32.9824 18.7047 31.5287 19.2119 30.4887 20.2252C29.4754 21.2119 28.9682 22.6522 28.9682 24.5455V35.8648H23.4086V14.1451H27.809V21.1939C28.0552 19.1171 28.6814 17.4742 29.6889 16.2652C31.0222 14.6653 32.9821 13.8648 35.5688 13.8648H36.3686V18.7047Z" fill="#D9D9D9" />
      <path d="M46.8881 14.1451V35.8648H41.3286V18.3053H38.2885V14.1451H46.8881Z" fill="#D9D9D9" />
      <path d="M59.5278 31.3053H60.4721L64.8959 14.1451H70.2563L64.3764 35.8648H55.4565L48.6557 14.1451H54.3764L59.5278 31.3053Z" fill="#D9D9D9" />
      <path d="M78.8618 13.8248C81.1018 13.8248 82.9556 14.118 84.4223 14.7047C85.9156 15.2913 87.035 16.2121 87.7817 17.4654C88.555 18.7187 88.9418 20.3587 88.9418 22.3853V35.8648H84.5424V31.6685C84.3634 32.2359 84.1387 32.7557 83.8618 33.2252C83.2752 34.265 82.4487 35.0647 81.3823 35.6246C80.3423 36.1579 79.0623 36.4253 77.5424 36.4254C75.9692 36.4254 74.5822 36.1454 73.3823 35.5855C72.209 35.0256 71.2892 34.225 70.6225 33.1852C69.9825 32.1452 69.6626 30.8919 69.6625 29.4254C69.6625 27.8256 70.0486 26.5187 70.8217 25.5055C71.6217 24.4922 72.7287 23.7319 74.142 23.2252C75.582 22.7185 77.2621 22.4654 79.1821 22.4654H83.6225V22.2652C83.6225 21.0122 83.3156 20.0788 82.7026 19.4654C82.0892 18.8521 81.1418 18.5455 79.8618 18.5455C79.1952 18.5455 78.3954 18.5589 77.4623 18.5855C76.5291 18.6122 75.5824 18.6514 74.6225 18.7047C73.6892 18.7313 72.8487 18.7715 72.102 18.8248V14.1051C72.7153 14.0517 73.4087 13.9982 74.1821 13.9449C74.9554 13.8916 75.7424 13.8648 76.5424 13.8648C77.3688 13.8382 78.1419 13.8248 78.8618 13.8248ZM79.102 25.7848C77.8221 25.7848 76.8353 26.1048 76.142 26.7447C75.4754 27.3581 75.142 28.1584 75.142 29.1451C75.142 30.1318 75.4754 30.9322 76.142 31.5455C76.8353 32.1587 77.8221 32.4654 79.102 32.4654C79.8753 32.4654 80.5821 32.3317 81.2221 32.065C81.8888 31.7717 82.4351 31.2913 82.8618 30.6246C83.315 29.9313 83.5692 28.998 83.6225 27.8248V25.7848H79.102Z" fill="#D9D9D9" />
      <path d="M97.9653 14.1451H104.658V18.2252H97.9575L97.9379 28.065C97.9379 29.1317 98.2178 29.9588 98.7778 30.5455C99.3643 31.1053 100.191 31.3853 101.257 31.3853H104.658V36.1451H101.538C99.5376 36.1451 97.8842 35.892 96.5776 35.3853C95.2976 34.852 94.3377 33.9714 93.6977 32.7447C93.0578 31.4914 92.7377 29.8112 92.7377 27.7047L92.7573 18.2252H89.2973V14.1451H92.7651L92.7778 8.02499H97.978L97.9653 14.1451Z" fill="#D9D9D9" />
    </svg>
  );
}

type CursorPhase = 'enter' | 'start' | 'copy' | 'click' | 'startBtn' | 'startBtnClick' | 'fadeBlack' | 'video' | 'videoPip' | 'fadeOut';

interface PrivatHomeViewProps {
  active?: boolean;
  circleRef?: React.RefObject<HTMLDivElement | null>;
  // Bubble the current cursorPhase up so an external animated cursor can react.
  onPhaseChange?: (phase: CursorPhase) => void;
  // Callback refs for the two click targets — the external cursor reads their
  // getBoundingClientRect to position itself.
  copyRef?: (el: HTMLDivElement | null) => void;
  startBtnRef?: (el: HTMLDivElement | null) => void;
}

export function PrivatHomeView({ active = true, circleRef: externalCircleRef, onPhaseChange, copyRef, startBtnRef }: PrivatHomeViewProps) {
  const internalCircleRef = useRef<HTMLDivElement>(null);
  const circleRef = externalCircleRef ?? internalCircleRef;
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const endTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const loopScheduledRef = useRef(false);
  const [cursorPhase, setCursorPhase] = useState<CursorPhase>('enter');
  const [loopKey, setLoopKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Bubble phase changes to a parent-supplied listener so an external cursor
  // can react to the existing state machine without owning it.
  useEffect(() => { onPhaseChange?.(cursorPhase); }, [cursorPhase, onPhaseChange]);

  // Fade begins a moment before video1 finishes (in PIP). When video1 nears its end,
  // trigger fadeOut AND schedule the loop bump — we can't wait for onEnded because the
  // 'fadeOut' phase pauses video1 before it would naturally end.
  const scheduleLoopReset = () => {
    if (loopScheduledRef.current) return;
    loopScheduledRef.current = true;
    setCursorPhase('fadeOut');
    endTimersRef.current.push(window.setTimeout(() => {
      setCursorPhase('enter');
      setLoopKey(k => k + 1);
    }, 1000));
  };

  const handleVideo1TimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (cursorPhase !== 'videoPip') return;
    const v = e.currentTarget;
    if (v.duration && v.duration - v.currentTime <= 1.0) {
      scheduleLoopReset();
    }
  };

  // Safety net in case video1 plays past the timeupdate threshold without firing it.
  const handleVideo1Ended = () => scheduleLoopReset();

  // Activate / deactivate the loop based on scroll position.
  // When scrolled away (active=false), clear all timers, pause + rewind both
  // videos, and snap back to the enter phase so the next entry starts fresh.
  useEffect(() => {
    if (active) {
      setHasStarted(true);
      return;
    }
    setHasStarted(false);
    setCursorPhase('enter');
    endTimersRef.current.forEach(clearTimeout);
    endTimersRef.current = [];
    loopScheduledRef.current = false;
    if (video1Ref.current) { video1Ref.current.pause(); video1Ref.current.currentTime = 0; }
    if (video2Ref.current) { video2Ref.current.pause(); video2Ref.current.currentTime = 0; }
  }, [active]);

  useEffect(() => {
    if (cursorPhase === 'video' && video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play().catch(() => {});
    }
    let v2Timer: ReturnType<typeof setTimeout> | undefined;
    if (cursorPhase === 'videoPip' && video2Ref.current) {
      video2Ref.current.currentTime = 0;
      // Start video2 a split second after the PIP transition begins.
      v2Timer = window.setTimeout(() => {
        video2Ref.current?.play().catch(() => {});
      }, 400);
    }
    if (cursorPhase === 'fadeOut') {
      // Pause both videos and rewind so they're parked at frame 0 for the next loop.
      if (video1Ref.current) { video1Ref.current.pause(); video1Ref.current.currentTime = 0; }
      if (video2Ref.current) { video2Ref.current.pause(); video2Ref.current.currentTime = 0; }
    }
    return () => { if (v2Timer) clearTimeout(v2Timer); };
  }, [cursorPhase]);

  useEffect(() => {
    if (!hasStarted) return;
    setCursorPhase('enter');
    loopScheduledRef.current = false;
    endTimersRef.current = [];
    const copyMoveDur = 550;                             // matches the cursor's copy slide-in transition
    const startBtnMoveDur = 450;                         // faster move to Start session
    const copyArrivalPause = 80;                         // click right after the cursor arrives at copy
    const arrivalPause = 80;                             // click right after the cursor arrives at Start session
    // First loop slides cursor in quickly; subsequent loops linger in the PWA view 3s before the cursor returns.
    const tCopy = loopKey === 0 ? 300 : 3000;
    const tClick = tCopy + copyMoveDur + copyArrivalPause;
    const tStartBtn = tClick + 800;
    const tStartBtnClick = tStartBtn + startBtnMoveDur + arrivalPause;
    const tFadeBlack = tStartBtnClick + 200;             // jump to black faster after click — but gated on video1 readyState
    const lateTimers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    let canplayHandler: (() => void) | null = null;

    const proceedToFadeBlack = () => {
      if (cancelled) return;
      setCursorPhase('fadeBlack');
      lateTimers.push(window.setTimeout(() => setCursorPhase('video'), 350));
      lateTimers.push(window.setTimeout(() => setCursorPhase('videoPip'), 350 + 750));
    };

    const timers = [
      window.setTimeout(() => setCursorPhase('copy'), tCopy),
      window.setTimeout(() => setCursorPhase('click'), tClick),
      window.setTimeout(() => setCursorPhase('startBtn'), tStartBtn),
      window.setTimeout(() => setCursorPhase('startBtnClick'), tStartBtnClick),
      window.setTimeout(() => {
        if (cancelled) return;
        const v = video1Ref.current;
        // readyState 4 = HAVE_ENOUGH_DATA (fully loaded, can play through end).
        if (!v || v.readyState >= 4) {
          proceedToFadeBlack();
        } else {
          canplayHandler = () => {
            v.removeEventListener('canplaythrough', canplayHandler!);
            canplayHandler = null;
            proceedToFadeBlack();
          };
          v.addEventListener('canplaythrough', canplayHandler);
        }
      }, tFadeBlack),
    ];

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      lateTimers.forEach(clearTimeout);
      if (canplayHandler && video1Ref.current) {
        video1Ref.current.removeEventListener('canplaythrough', canplayHandler);
      }
    };
  }, [loopKey, hasStarted]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 40,
      paddingBottom: 24,
      paddingLeft: 24,
      paddingRight: 24,
      boxSizing: 'border-box',
      userSelect: 'none',
    }}>
      {/* Animated background — also runs inside the frame, in addition to the full-screen one */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <MeshBackground circleRef={circleRef} />
      </div>

      {/* Top row: logo + hamburger */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: (cursorPhase === 'fadeBlack' || cursorPhase === 'video' || cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 0 : 1,
        transition: cursorPhase === 'enter' ? 'opacity 250ms ease-in-out 300ms' : 'opacity 300ms ease-in-out',
      }}>
        <PrivatLogo />
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 15V17H4V15H20ZM20 7V9H4V7H20Z" fill="#A3A3A3" />
        </svg>
      </div>

      {/* Middle: camera lens */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '16px 0',
        opacity: (cursorPhase === 'fadeBlack' || cursorPhase === 'video' || cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 0 : 1,
        transition: cursorPhase === 'enter' ? 'opacity 250ms ease-in-out 300ms' : 'opacity 300ms ease-in-out',
      }}>
        <div style={{
          borderRadius: '50%',
          aspectRatio: '1 / 1',
          position: 'relative',
          padding: 1,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.05), rgba(255,255,255,0.7))',
          height: '100%',
          maxHeight: 228,
          maxWidth: '100%',
          width: 'auto',
        }}>
          <div ref={circleRef} style={{ borderRadius: '50%', overflow: 'hidden', width: '100%', height: '100%' }}>
            <CameraLens />
          </div>
        </div>
      </div>

      {/* Bottom: text + buttons */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        width: '100%',
        opacity: (cursorPhase === 'fadeBlack' || cursorPhase === 'video' || cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 0 : 1,
        transition: cursorPhase === 'enter' ? 'opacity 250ms ease-in-out 300ms' : 'opacity 300ms ease-in-out',
      }}>
        {/* Copy */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, width: '100%' }}>
          <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 24, color: '#D9D9D9', margin: 0, lineHeight: '28px' }}>
            Instant 1:1 Sessions
          </p>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 14, color: '#A3A3A3', margin: 0, lineHeight: '19px' }}>
            Start an encrypted video session in seconds. Share the link with your guest.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
          {/* Start session */}
          <div ref={startBtnRef} style={{
            width: '100%',
            height: 36,
            backgroundColor: cursorPhase === 'startBtnClick' ? 'rgba(200,200,200,0.82)' : 'rgba(255,255,255,0.82)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center',
            transition: 'background-color 220ms ease-out',
            animation: cursorPhase === 'startBtnClick' ? 'p-btn-press 220ms cubic-bezier(0.2, 0.8, 0.4, 1)' : undefined,
          }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 14, color: '#000000' }}>Start session</span>
          </div>
          {/* Copy link bar */}
          <div ref={copyRef} style={{ width: '100%', height: 36, backgroundColor: 'rgba(23,23,23,0.9)', display: 'flex', alignItems: 'center', boxSizing: 'border-box', gap: 2 }}>
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 14, paddingRight: 14, gap: 2, minWidth: 0, overflow: 'hidden' }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 14, color: '#f5f5f5', flexShrink: 0 }}>Guest link</span>
              <div style={{ position: 'relative', flex: 1, height: 14, minWidth: 0, overflow: 'hidden' }}>
                <span style={{
                  position: 'absolute', left: 0, right: 0, top: 0,
                  fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '14px',
                  color: '#737373', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  transform: (cursorPhase === 'click' || cursorPhase === 'startBtn' || cursorPhase === 'startBtnClick') ? 'translateY(-14px)' : 'translateY(0)',
                  opacity: (cursorPhase === 'click' || cursorPhase === 'startBtn' || cursorPhase === 'startBtnClick') ? 0 : 1,
                  transition: 'transform 350ms cubic-bezier(0.2, 0.6, 0.3, 1) 80ms, opacity 250ms ease-out 80ms',
                }}>prvt.cam/s/aLeKs</span>
                <span style={{
                  position: 'absolute', left: 0, right: 0, top: 0,
                  fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 14, lineHeight: '14px',
                  color: '#FCFCFC', whiteSpace: 'nowrap',
                  transform: (cursorPhase === 'click' || cursorPhase === 'startBtn' || cursorPhase === 'startBtnClick') ? 'translateY(0)' : 'translateY(14px)',
                  opacity: (cursorPhase === 'click' || cursorPhase === 'startBtn' || cursorPhase === 'startBtnClick') ? 1 : 0,
                  transition: 'transform 350ms cubic-bezier(0.2, 0.6, 0.3, 1) 80ms, opacity 250ms ease-out 80ms',
                }}>copied</span>
              </div>
            </div>
            <div style={{ width: 44, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'rgba(23,23,23,0.9)' }}>
              {(cursorPhase === 'click' || cursorPhase === 'startBtn' || cursorPhase === 'startBtnClick') ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 10.5 L8.5 15 L16 6"
                    stroke="#4ADE80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray="22"
                    strokeDashoffset="22"
                    style={{ animation: 'p-check-draw 220ms cubic-bezier(0.4, 0, 0.2, 1) 100ms forwards' }}
                  />
                </svg>
              ) : (
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 2H16V12H13V14H18V0H6V5H8V2Z" fill="#A3A3A3" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 8H2V18H10V8ZM0 6V20H12V6H0Z" fill="#A3A3A3" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Terminal fade-out overlay — fades in to black after video2 finishes one playthrough */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 28,
          opacity: cursorPhase === 'fadeOut' ? 1 : 0,
          transition: 'opacity 900ms cubic-bezier(0.33, 0, 0.67, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Black fade overlay — fades in before video, then stays as the solid
          backdrop that video2 fades in over once video1 shrinks to PIP */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 22,
          opacity: (cursorPhase === 'fadeBlack' || cursorPhase === 'video' || cursorPhase === 'videoPip') ? 1 : 0,
          transition: 'opacity 800ms ease-in-out',
          pointerEvents: 'none',
        }}
      />

      {/* Call control button group — fades in alongside video2, at the copy-link bar location */}
      <div key={`call-btns-${loopKey}`} style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 24,
        height: 36,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 26,
        opacity: cursorPhase === 'videoPip' ? 1 : 0,
        transition: 'opacity 600ms ease-in-out 400ms',
        pointerEvents: 'none',
      }}>
        {/* Video toggle */}
        <div style={{ flex: '1 0 0', height: 36, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 1, padding: '0 10px' }}>
          <div style={{ position: 'relative', width: 24, height: 24 }}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', left: 2, top: 5 }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M15 11.0003V14H0V0H15V3.04306L20 0.315782V13.667L15 11.0003ZM2 2H13V12H2V2ZM15 8.73366L18 10.3337V3.68487L15 5.32123V8.73366Z" fill="#0A0A0A"/>
            </svg>
          </div>
        </div>
        {/* Mic toggle */}
        <div style={{ flex: '1 0 0', height: 36, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 1, padding: '0 10px' }}>
          <div style={{ position: 'relative', width: 24, height: 24 }}>
            <svg width="15.5474" height="22" viewBox="0 0 15.5474 21.9999" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', left: 4.23, top: 1 }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M9.77373 10V4C9.77373 2.89543 8.8783 2 7.77373 2C6.66916 2 5.77373 2.89543 5.77373 4V10C5.77373 11.1046 6.66916 12 7.77373 12C8.8783 12 9.77373 11.1046 9.77373 10ZM7.77373 0C5.56459 0 3.77373 1.79086 3.77373 4V10C3.77373 12.2091 5.56459 14 7.77373 14C9.98286 14 11.7737 12.2091 11.7737 10V4C11.7737 1.79086 9.98286 0 7.77373 0Z" fill="#0A0A0A"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M1.84776 11.3721L2.23044 12.296C2.53197 13.024 2.97393 13.6854 3.53108 14.2426C4.08823 14.7997 4.74967 15.2417 5.47762 15.5432C6.20557 15.8447 6.98579 15.9999 7.77372 15.9999C8.56165 15.9999 9.34187 15.8447 10.0698 15.5432C10.7978 15.2417 11.4592 14.7997 12.0164 14.2426C12.5735 13.6854 13.0155 13.024 13.317 12.296L13.6997 11.3721L15.5474 12.1375L15.1648 13.0614C14.7627 14.032 14.1734 14.9139 13.4306 15.6568C12.6877 16.3997 11.8058 16.9889 10.8352 17.391C10.1741 17.6648 9.48069 17.8481 8.77372 17.9372V21.9999H6.77372V17.9372C6.06675 17.8481 5.37334 17.6648 4.71225 17.391C3.74165 16.9889 2.85973 16.3997 2.11687 15.6568C1.374 14.9139 0.784721 14.032 0.382683 13.0614L0 12.1375L1.84776 11.3721Z" fill="#0A0A0A"/>
            </svg>
          </div>
        </div>
        {/* End call */}
        <div style={{ flex: '1 0 0', height: 36, backgroundColor: '#fc4b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 1, padding: '0 10px' }}>
          <div style={{ position: 'relative', width: 24, height: 24 }}>
            <svg width="19.637" height="20.012" viewBox="0 0 19.6369 20.012" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', left: 2.34, top: 2.4 }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M6.33737 15.3371L1.66241 20.012L0.248199 18.5978L17.6624 1.18359L19.0766 2.59781L10.7254 10.949C11.1941 11.2586 11.6949 11.5036 12.2121 11.6674L14.3336 9.54594L19.6369 12.7279L17.6791 19.6355C12.9208 19.083 9.16061 17.6705 6.33737 15.3371ZM9.28869 12.3857L7.75904 13.9154C9.87529 15.6141 12.653 16.7931 16.2315 17.4086L17.2953 13.6553L14.6436 12.0643L12.7668 13.9411L11.6081 13.574C10.7814 13.3121 9.99857 12.9041 9.28869 12.3857Z" fill="#FFFFFF"/>
              <path d="M7.96948 7.4248C8.14547 7.93061 8.38688 8.41756 8.68061 8.87204L7.2416 10.311C6.74994 9.62271 6.35446 8.86926 6.08055 8.08202L5.66839 6.89745L7.57258 4.99327L5.98171 2.34182L2.22717 3.40653C2.84054 6.96998 4.01281 9.7393 5.70059 11.8521L4.27859 13.2741C1.95746 10.454 0.551445 6.7025 0 1.95925L6.90899 0L10.091 5.3033L7.96948 7.4248Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Video2 — fades in to fill the full frame as Video1 shrinks to PIP. Plays once, then fades to black. */}
      <video
        key={`v2-${loopKey}`}
        ref={video2Ref}
        src="/video2.mp4?v=2"
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 24,
          opacity: cursorPhase === 'videoPip' ? 1 : 0,
          pointerEvents: 'none',
          // Hold on the black backdrop while video1 shrinks to PIP, then fade video2 in.
          transition: 'opacity 2000ms ease-in-out 900ms',
        }}
      />

      {/* Video — full-frame after Start session click, animates to PIP circle 2s later.
          Plays once (no loop) so its natural end can drive the fadeOut timing. */}
      <video
        key={`v1-${loopKey}`}
        ref={video1Ref}
        src="/video1.mp4?v=2"
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleVideo1TimeUpdate}
        onEnded={handleVideo1Ended}
        style={{
          position: 'absolute',
          top: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 16 : 0,
          left: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 16 : 0,
          width: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 110 : '100%',
          height: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? 110 : '100%',
          borderRadius: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? '50%' : 0,
          boxShadow: (cursorPhase === 'videoPip' || cursorPhase === 'fadeOut') ? '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.35)' : 'none',
          objectFit: 'cover',
          zIndex: 25,
          opacity: (cursorPhase === 'video' || cursorPhase === 'videoPip') ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 500ms ease-in-out, top 550ms cubic-bezier(0.4, 0, 0.2, 1), left 550ms cubic-bezier(0.4, 0, 0.2, 1), width 550ms cubic-bezier(0.4, 0, 0.2, 1), height 550ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 550ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 550ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Hand cursor — starts above the 'Instant 1:1' line, slides to copy icon, then clicks */}
      <style>{`@keyframes p-cursor-click { 0% { transform: scale(1); } 45% { transform: scale(0.92); } 65% { transform: scale(0.92); } 100% { transform: scale(1); } } @keyframes p-check-draw { to { stroke-dashoffset: 0; } } @keyframes p-btn-press { 0% { transform: scale(1); background-color: rgba(255,255,255,0.82); } 45% { transform: scale(0.97); background-color: rgba(230,230,230,0.82); } 65% { transform: scale(0.97); background-color: rgba(230,230,230,0.82); } 100% { transform: scale(1); background-color: rgba(255,255,255,0.82); } }`}</style>
    </div>
  );
}
