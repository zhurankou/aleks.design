import { useState, useEffect, useRef } from 'react';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";

interface HomePageProps {
  onAboutMeClick: () => void;
}

const storyText = `My story

I'm a product designer based in Seattle, WA. My path into design wasn't typical — I've worked as a turret machine operator, a janitor, and a Navy sailor — but each role taught me something about discipline, hard work, and staying grounded. Eventually, I found my way back to what I'd always loved: design.

Outside of work, I enjoy hiking, snowboarding, off-roading, and camping. I'm also curious about new technology, especially machine learning, AR, AI tools, vibe coding prototypes, and building UI kits for design systems.

After leaving the Navy, I studied design at the University of Washington, where I learned the foundations of design thinking and got to apply them by improving the Graduate Student Office website and making it easier to use.

At Microsoft, I joined the OneDrive team and led the sharing experience effort. There, I learned how to design for scale, simplify complexity, and balance user needs with business goals.

At eero, I worked on making home networking feel more approachable and helped build the early design system. That experience taught me a lot about consistency, repeatable patterns, and designing systems that can grow over time.

Most recently at Olympus, I focused on data visualization, helping endoscopists improve procedure quality by making complex clinical data easier to understand and act on. There, I learned how important clarity, trust, and usability are in high-stakes environments.

I'm currently exploring what's next and excited for new opportunities.`;

const landingText = "I'm Aleks — a designer who loves making complex things feel simple. I care about craft, the details, and products with taste.";

function SelectionHandles() {
  return (
    <>
      <div style={{ position: 'absolute', width: 10, height: 10, top: -5, left: -5, backgroundColor: '#FDFCFF', border: '2px solid #2F9AF8', borderRadius: 1, zIndex: 10 }} />
      <div style={{ position: 'absolute', width: 10, height: 10, top: -5, right: -5, backgroundColor: '#FDFCFF', border: '2px solid #2F9AF8', borderRadius: 1, zIndex: 10 }} />
      <div style={{ position: 'absolute', width: 10, height: 10, bottom: -5, left: -5, backgroundColor: '#FDFCFF', border: '2px solid #2F9AF8', borderRadius: 1, zIndex: 10 }} />
      <div style={{ position: 'absolute', width: 10, height: 10, bottom: -5, right: -5, backgroundColor: '#FDFCFF', border: '2px solid #2F9AF8', borderRadius: 1, zIndex: 10 }} />
    </>
  );
}

export function HomePage({ onAboutMeClick }: HomePageProps) {
  // Dark mode state
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Theme colors
  const theme = {
    bg: isDark ? '#1e1e1e' : '#fdfcff',
    text: isDark ? '#e0e0e0' : '#3a3a3a',
    textMuted: isDark ? '#888888' : '#b2b2b2',
    cardText: '#2d2d2d',
    dotColor: isDark ? '#3a3a3a' : '#C0C0C0',
    overlay: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
    greyCard: '#e6e6e6',
    greyCardText: 'hsla(0, 0%, 6%, 0.3)',
    stickyPlaceholder: 'hsla(0, 0%, 6%, 0.3)',
  };

  // Landing handwriting animation state
  const [landingDisplayed, setLandingDisplayed] = useState('');
  const [landingIndex, setLandingIndex] = useState(0);
  const [landingStarted, setLandingStarted] = useState(false);

  // Looping bottom nav text
  const landingNavTexts = ['Draw something', 'or', 'See my work', 'or'];
  const projectNavTexts = ['Leave a note', 'or', 'Read my story', 'or'];
  const [landingNavIndex, setLandingNavIndex] = useState(0);
  const [projectNavIndex, setProjectNavIndex] = useState(0);
  const [landingNavFade, setLandingNavFade] = useState(true);
  const [projectNavFade, setProjectNavFade] = useState(true);
  const landingTypingDone = landingIndex >= landingText.length;
  const navColors = isDark ? ['#a8daff', '#b3efbd', '#ffe299', '#a8f0e8', '#f5a8d8'] : ['#7bbde6', '#7dca8a', '#d4b85e', '#7dd4ca', '#d48ab8'];
  const [landingNavColorIndex, setLandingNavColorIndex] = useState(0);
  const [projectNavColorIndex, setProjectNavColorIndex] = useState(0);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('.snap-y.snap-mandatory') as HTMLElement | null;
    const target = scrollContainer ?? window;
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = setTimeout(() => setIsScrolling(false), 200);
    };
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, []);

  useEffect(() => {
    const projectsEl = document.getElementById('onedrive-project');
    const storyEl = document.getElementById('story-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.id === 'onedrive-project' && entry.isIntersecting) setProjectsVisible(true);
        if (entry.target.id === 'story-section' && entry.isIntersecting) setStoryVisible(true);
      });
    }, { threshold: 0.5 });
    if (projectsEl) observer.observe(projectsEl);
    if (storyEl) observer.observe(storyEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!landingTypingDone) return;
    const interval = setInterval(() => {
      setLandingNavFade(false);
      setTimeout(() => {
        setLandingNavIndex(prev => {
          const next = (prev + 1) % landingNavTexts.length;
          if (next === 0) setLandingNavColorIndex(p => (p + 1) % navColors.length);
          return next;
        });
        setLandingNavFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [landingTypingDone]);

  useEffect(() => {
    if (!projectsVisible) return;
    const interval = setInterval(() => {
      setProjectNavFade(false);
      setTimeout(() => {
        setProjectNavIndex(prev => {
          const next = (prev + 1) % projectNavTexts.length;
          if (next === 0) setProjectNavColorIndex(p => (p + 1) % navColors.length);
          return next;
        });
        setProjectNavFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, [projectsVisible]);

  useEffect(() => {
    if (!storyVisible) return;
    const textarea = storyTextareaRef.current;
    const root = storyScrollRef.current;
    if (!textarea || !root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !storyFocused.current) {
          storyFocused.current = true;
          textarea.focus();
        }
      },
      { root, threshold: 0.5 }
    );
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [storyVisible]);

  // Drawing state
  const drawColors = ['#a8daff', '#b3efbd', '#ffe299', '#a8f0e8', '#f5a8d8'];
  const [drawPaths, setDrawPaths] = useState<{ points: { x: number; y: number }[]; color: string }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawColorIndex = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrawStart = (e: React.MouseEvent) => {
    // Don't draw until text finishes loading
    if (landingIndex < landingText.length) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = drawColors[drawColorIndex.current % drawColors.length];
    drawColorIndex.current += 1;
    setDrawPaths(prev => [...prev, { points: [{ x, y }], color }]);
    setIsDrawing(true);
  };

  const handleDrawMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDrawPaths(prev => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.points = [...last.points, { x, y }];
      updated[updated.length - 1] = last;
      return updated;
    });
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
  };

  // Redraw canvas when paths change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaths.forEach(path => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, [drawPaths]);

  // Sticky notes state
  const stickyColors = ['#a8daff', '#b3efbd', '#ffe299', '#a8f0e8', '#f5a8d8'];
  const [stickies, setStickies] = useState<{ id: number; x: number; y: number; color: string; title: string; body: string; name: string }[]>([]);
  const stickyCounter = useRef(0);
  const stickyColorIndex = useRef(0);

  const wasDragging = useRef(false);
  const prevDraggingCard = useRef<string | null>(null);

  const handleProjectAreaClick = (e: React.MouseEvent) => {
    // Don't create sticky if we just finished dragging
    if (wasDragging.current) return;
    setSelectedCard(null);
    // Don't create sticky when clicking nav links, text inputs, or contentEditable
    const target = e.target as HTMLElement;
    if (target.closest('[data-nav], textarea, [contenteditable]')) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - 120; // offset to center sticky
    const y = e.clientY - rect.top - 120;
    stickyCounter.current += 1;
    const color = stickyColors[stickyColorIndex.current % stickyColors.length];
    stickyColorIndex.current += 1;
    const newSticky = {
      id: stickyCounter.current,
      x,
      y,
      color,
      title: 'Note',
      body: '',
      name: 'Name',
    };
    setStickies(prev => [...prev, newSticky]);
    // Add to card positions and z-indices for dragging
    const stickyId = `sticky-${newSticky.id}`;
    setCardPositions(prev => ({ ...prev, [stickyId]: { x: 0, y: 0 } }));
    setCardZIndices(prev => ({ ...prev, [stickyId]: zCounter.current + 1 }));
    zCounter.current += 1;
  };

  // Story input state
  const [storyInput, setStoryInput] = useState('');
  const [storyTyping, setStoryTyping] = useState(false);
  const storyTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const storyScrollRef = useRef<HTMLDivElement>(null);
  const storyFocused = useRef(false);

  const handleStoryInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
    setStoryInput(target.value);
    setStoryTyping(true);
    if (storyTypingTimeout.current) clearTimeout(storyTypingTimeout.current);
    storyTypingTimeout.current = setTimeout(() => setStoryTyping(false), 500);
  };

  const handleSayHiClick = () => {
    const email = 'hi@aleks.design';
    if (storyInput.trim()) {
      window.location.href = `mailto:${email}?body=${encodeURIComponent(storyInput)}`;
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  // Floating hearts state
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; delay: number; duration: number; drift: number }[]>([]);
  const heartCounter = useRef(0);
  const heartInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHearts = () => {
    if (heartInterval.current) return;
    heartInterval.current = setInterval(() => {
      heartCounter.current += 1;
      const newHeart = {
        id: heartCounter.current,
        x: Math.random() * 40 - 20,
        delay: 0,
        duration: 1.5 + Math.random() * 1.5,
        drift: Math.random() * 60 - 30,
      };
      setFloatingHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, (newHeart.duration) * 1000 + 100);
    }, 150);
  };

  const stopHearts = () => {
    if (heartInterval.current) {
      clearInterval(heartInterval.current);
      heartInterval.current = null;
    }
  };

  // Draggable card state
  const [cardPositions, setCardPositions] = useState<{ [key: string]: { x: number; y: number } }>({
    'project-1': { x: 0, y: 0 },
    'project-2': { x: 0, y: 0 },
    'project-3': { x: 0, y: 0 },
  });
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; origX: number; origY: number } | null>(null);
  const [cardZIndices, setCardZIndices] = useState<{ [key: string]: number }>({
    'project-1': 1,
    'project-2': 1,
    'project-3': 1,
  });
  const zCounter = useRef(1);


  useEffect(() => {
    if (draggingCard) prevDraggingCard.current = draggingCard;
    if (!draggingCard && prevDraggingCard.current) {
      wasDragging.current = true;
      setTimeout(() => { wasDragging.current = false; }, 50);
      prevDraggingCard.current = null;
    }
  }, [draggingCard]);

  const handleMyWorkClick = () => {
    document.getElementById('onedrive-project')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Drag handlers for project cards
  const handleCardMouseDown = (cardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCard(cardId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      origX: cardPositions[cardId].x,
      origY: cardPositions[cardId].y,
    };
    zCounter.current += 1;
    setCardZIndices(prev => ({ ...prev, [cardId]: zCounter.current }));
  };

  useEffect(() => {
    if (!draggingCard) return;
    const onMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setCardPositions(prev => ({
        ...prev,
        [draggingCard]: {
          x: dragStart.current!.origX + dx,
          y: dragStart.current!.origY + dy,
        },
      }));
    };
    const onMouseUp = (e: MouseEvent) => {
      if (dragStart.current) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) {
          setSelectedCard(prev => prev === draggingCard ? null : draggingCard);
        }
      }
      setDraggingCard(null);
      dragStart.current = null;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggingCard]);

  // Update dark class on theme change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Landing handwriting animation — start after a short delay on mount
  useEffect(() => {
    const delay = setTimeout(() => setLandingStarted(true), 400);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!landingStarted) return;
    if (landingIndex >= landingText.length) return;
    // Variable speed for organic handwriting feel
    const char = landingText[landingIndex];
    let delay = 40 + Math.random() * 40; // 40-80ms base
    if (char === '!' || char === '.' || char === ',') delay += 120; // pause at punctuation
    if (char === '\n') delay += 200; // pause at line break
    if (char === ' ') delay = 20 + Math.random() * 20; // faster on spaces
    const timeout = setTimeout(() => {
      setLandingDisplayed(landingText.slice(0, landingIndex + 1));
      setLandingIndex(landingIndex + 1);
    }, delay);
    return () => clearTimeout(timeout);
  }, [landingIndex, landingStarted]);


  const handleMyStoryClick = () => {
    document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(circle, ${theme.dotColor} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        transition: 'background-color 0.5s ease, background-image 0.3s ease',
      }}
    >
      {/* Home Landing */}
      <div
        id="home-landing"
        className="relative h-screen w-full snap-start snap-always select-none"
        style={{ cursor: landingIndex >= landingText.length ? (isDrawing ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><text y='36' font-size='36'>✍️</text></svg>") 6 42, auto` : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>✍️</text></svg>") 4 28, auto`) : 'default' }}
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleDrawStart({ ...e, clientX: touch.clientX, clientY: touch.clientY, currentTarget: e.currentTarget, preventDefault: () => e.preventDefault() } as unknown as React.MouseEvent);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleDrawMove({ ...e, clientX: touch.clientX, clientY: touch.clientY, currentTarget: e.currentTarget } as unknown as React.MouseEvent);
        }}
        onTouchEnd={handleDrawEnd}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 20, pointerEvents: 'none' }}
        />
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-between pointer-events-none" style={{ top: 'clamp(20px, 5vh, 80px)', width: 'min(640px, calc(100% - 48px))' }}>
          <div className="flex gap-[16px] items-center">
            <div className="relative shrink-0" style={{ width: 48, height: 48 }}>
              <img alt="Alex's profile" className="absolute block max-w-none size-full rounded-[60px]" src={imgProfile} />
              <div className="absolute inset-0 rounded-[60px]" style={{ backgroundColor: theme.overlay, transition: 'background-color 0.5s ease' }} />
            </div>
            <div className="flex items-center gap-[4px]">
              <p className="font-['Lato',sans-serif] font-medium leading-[normal] whitespace-nowrap" style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', color: theme.textMuted, transition: 'color 0.5s ease' }}>
                Hi
              </p>
              <span style={{ fontSize: 20, lineHeight: 'normal', display: 'inline-block', animation: landingStarted ? 'wave 2s ease-in-out 1' : 'none', transformOrigin: '70% 70%' }}>👋</span>
            </div>
          </div>
          <span
            className="cursor-pointer pointer-events-auto group flex items-center justify-center"
            style={{ minWidth: 44, minHeight: 44, color: theme.textMuted }}
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <>
                {/* Sun outline - default */}
                <svg className="block group-hover:hidden" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5V3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5Z" fill="currentColor"/>
                  <path d="M11 21V19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21Z" fill="currentColor"/>
                  <path d="M19 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H19C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11Z" fill="currentColor"/>
                  <path d="M3 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11Z" fill="currentColor"/>
                  <path d="M16.2426 6.34334L17.6568 4.92912C18.0474 4.5386 18.6805 4.5386 19.0711 4.92912C19.4616 5.31965 19.4616 5.95281 19.0711 6.34334L17.6568 7.75755C17.2663 8.14807 16.6332 8.14808 16.2426 7.75755C15.8521 7.36703 15.8521 6.73386 16.2426 6.34334Z" fill="currentColor"/>
                  <path d="M4.92893 17.6568L6.34314 16.2426C6.73366 15.8521 7.36683 15.8521 7.75735 16.2426C8.14788 16.6331 8.14788 17.2663 7.75735 17.6568L6.34314 19.071C5.95262 19.4616 5.31945 19.4616 4.92893 19.071C4.5384 18.6805 4.5384 18.0473 4.92893 17.6568Z" fill="currentColor"/>
                  <path d="M17.6568 16.2424L19.0711 17.6567C19.4616 18.0472 19.4616 18.6804 19.0711 19.0709C18.6805 19.4614 18.0474 19.4614 17.6568 19.0709L16.2426 17.6567C15.8521 17.2661 15.8521 16.633 16.2426 16.2424C16.6332 15.8519 17.2663 15.8519 17.6568 16.2424Z" fill="currentColor"/>
                  <path d="M6.34314 4.92897L7.75735 6.34319C8.14788 6.73371 8.14788 7.36688 7.75735 7.7574C7.36683 8.14792 6.73366 8.14792 6.34314 7.7574L4.92893 6.34319C4.5384 5.95266 4.5384 5.3195 4.92893 4.92897C5.31945 4.53845 5.95262 4.53845 6.34314 4.92897Z" fill="currentColor"/>
                  <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12ZM17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" fill="currentColor"/>
                </svg>
                {/* Sun filled - hover */}
                <svg className="hidden group-hover:block" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5V3C11 2.44772 11.4477 2 12 2C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5Z" fill={theme.text}/>
                  <path d="M11 21V19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21Z" fill={theme.text}/>
                  <path d="M19 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H19C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11Z" fill={theme.text}/>
                  <path d="M3 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11Z" fill={theme.text}/>
                  <path d="M16.2426 6.34334L17.6568 4.92912C18.0474 4.5386 18.6805 4.5386 19.0711 4.92912C19.4616 5.31965 19.4616 5.95281 19.0711 6.34334L17.6568 7.75755C17.2663 8.14807 16.6332 8.14808 16.2426 7.75755C15.8521 7.36703 15.8521 6.73386 16.2426 6.34334Z" fill={theme.text}/>
                  <path d="M4.92893 17.6568L6.34314 16.2426C6.73366 15.8521 7.36683 15.8521 7.75735 16.2426C8.14788 16.6331 8.14788 17.2663 7.75735 17.6568L6.34314 19.071C5.95262 19.4616 5.31945 19.4616 4.92893 19.071C4.5384 18.6805 4.5384 18.0473 4.92893 17.6568Z" fill={theme.text}/>
                  <path d="M17.6568 16.2424L19.0711 17.6567C19.4616 18.0472 19.4616 18.6804 19.0711 19.0709C18.6805 19.4614 18.0474 19.4614 17.6568 19.0709L16.2426 17.6567C15.8521 17.2661 15.8521 16.633 16.2426 16.2424C16.6332 15.8519 17.2663 15.8519 17.6568 16.2424Z" fill={theme.text}/>
                  <path d="M6.34314 4.92897L7.75735 6.34319C8.14788 6.73371 8.14788 7.36688 7.75735 7.7574C7.36683 8.14792 6.73366 8.14792 6.34314 7.7574L4.92893 6.34319C4.5384 5.95266 4.5384 5.3195 4.92893 4.92897C5.31945 4.53845 5.95262 4.53845 6.34314 4.92897Z" fill={theme.text}/>
                  <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" fill={theme.text}/>
                </svg>
              </>
            ) : (
              <>
                {/* Moon outline - default */}
                <svg className="block group-hover:hidden" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.0374 14.2734C17.6593 14.3343 17.2719 14.3659 16.8779 14.3659C12.8772 14.3659 9.63406 11.1228 9.63406 7.12216C9.63406 6.72812 9.66567 6.34071 9.72662 5.96256C7.33913 6.91584 5.60973 9.27179 5.60973 11.9513C5.60973 15.5075 8.49254 18.3903 12.0487 18.3903C14.7282 18.3903 17.0841 16.6609 18.0374 14.2734ZM18.7685 12.4311C19.3726 12.216 20.0955 12.6064 19.9896 13.2389C19.3563 17.0223 16.0069 20 12.0487 20C7.60351 20 4 16.3965 4 11.9513C4 7.99317 6.97771 4.64369 10.7612 4.0104C11.3937 3.90453 11.784 4.62736 11.5689 5.23148C11.3584 5.82246 11.2438 6.45892 11.2438 7.12216C11.2438 10.2338 13.7662 12.7562 16.8779 12.7562C17.5411 12.7562 18.1775 12.6416 18.7685 12.4311Z" fill="currentColor" />
                </svg>
                {/* Moon filled - hover */}
                <svg className="hidden group-hover:block" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.9896 13.2389C20.0955 12.6064 19.3726 12.216 18.7685 12.4311C18.1775 12.6416 17.5411 12.7562 16.8779 12.7562C13.7662 12.7562 11.2438 10.2338 11.2438 7.12216C11.2438 6.45892 11.3584 5.82246 11.5689 5.23148C11.784 4.62736 11.3937 3.90453 10.7612 4.0104C6.97771 4.64369 4 7.99317 4 11.9513C4 16.3965 7.60351 20 12.0487 20C16.0069 20 19.3563 17.0223 19.9896 13.2389Z" fill={theme.text} />
                </svg>
              </>
            )}
          </span>
        </div>

        <p className="absolute left-1/2 -translate-x-1/2 font-['Caveat',cursive] font-normal leading-[normal] pointer-events-none" style={{ fontSize: '40px', width: 'min(640px, calc(100% - 48px))', color: theme.text, transition: 'color 0.5s ease', top: 'clamp(80px, calc(50vh - 260px), 300px)' }}>
          {landingDisplayed.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
          {landingIndex < landingText.length && (
            <span
              className="inline-block"
              style={{
                marginLeft: 2,
                fontSize: 20,
                verticalAlign: 'baseline',
                transform: 'rotate(-10deg) translateY(-0.15em)',
                display: 'inline-block',
              }}
            >✍️</span>
          )}
        </p>

        <p
          onClick={landingNavIndex === 2 ? handleMyWorkClick : undefined}
          className="absolute left-1/2 -translate-x-1/2 font-['Lato',sans-serif] font-medium leading-[normal] text-center whitespace-nowrap transition-colors"
          style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', bottom: 'clamp(20px, 5vh, 60px)', zIndex: 30, color: landingNavIndex === 0 ? navColors[landingNavColorIndex] : theme.textMuted, opacity: landingTypingDone && landingNavFade ? 1 : 0, transition: 'color 0.5s ease, opacity 0.4s ease', cursor: landingNavIndex === 2 ? 'pointer' : 'default', minHeight: 44, display: 'flex', alignItems: 'center' }}
          onMouseEnter={(e) => { if (landingNavIndex === 2) e.currentTarget.style.color = theme.text; }}
          onMouseLeave={(e) => { if (landingNavIndex === 2) e.currentTarget.style.color = theme.textMuted; }}
        >
          {landingNavTexts[landingNavIndex]}
        </p>
      </div>

      {/* Projects */}
      <div id="onedrive-project" className="relative h-screen w-full snap-start snap-always" style={{ cursor: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>🟨</text></svg>") 16 16, auto` }} onClick={handleProjectAreaClick}>
        {/* Home link at top */}
        <p
          data-nav
          onClick={() => document.getElementById('home-landing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="absolute left-1/2 -translate-x-1/2 font-['Lato',sans-serif] font-medium leading-[normal] text-center whitespace-nowrap cursor-pointer transition-colors"
          style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', top: 'clamp(20px, 5vh, 60px)', color: theme.textMuted, transition: 'color 0.5s ease, opacity 0.4s ease', minHeight: 44, display: 'flex', alignItems: 'center', opacity: projectsVisible && !isScrolling ? 1 : 0 }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
          onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
        >
          Home
        </p>
        {/* Scattered card layout */}
        {/* Project 1 - Microsoft: upper-left */}
        <div
          className="absolute aspect-square"
          style={{
            width: 'clamp(160px, 16.67vw, 240px)',
            left: 'calc(50% - 108px)',
            top: 'calc(50% - 251px)',
            transform: `translate(${cardPositions['project-1'].x}px, ${cardPositions['project-1'].y}px)`,
            cursor: draggingCard === 'project-1' ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>👌</text></svg>") 16 16, grabbing` : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>🤚</text></svg>") 16 16, grab`,
            zIndex: cardZIndices['project-1'],
            userSelect: 'none',
            outline: selectedCard === 'project-1' ? '2px solid #2F9AF8' : 'none',
          }}
          onMouseDown={(e) => handleCardMouseDown('project-1', e)}
        >
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#a8daff', boxShadow: isDark ? '0px 4px 4px 0px rgba(0,0,0,0.4)' : '0px 4px 4px 0px rgba(0,0,0,0.15)' }}>
            <div className="absolute font-['Lato',sans-serif]" style={{ left: '10%', top: '10%', width: '80%', fontSize: 'clamp(12px, 1.25vw, 18px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              <p className="font-bold mb-0">Microsoft 365</p>
              <p className="font-normal">Simplifying File Sharing and Collaboration in Microsoft 365.</p>
            </div>
            <p className="absolute font-['Lato',sans-serif] font-semibold" style={{ left: '10%', bottom: '10%', fontSize: 'clamp(10px, 0.97vw, 14px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              Jun 2022
            </p>
          </div>
          {selectedCard === 'project-1' && <SelectionHandles />}
        </div>

        {/* Project 2 - eero: right, slightly above center */}
        <div
          className="absolute aspect-square"
          style={{
            width: 'clamp(160px, 16.67vw, 240px)',
            left: 'calc(50% + 84px)',
            top: 'calc(50% - 162px)',
            transform: `translate(${cardPositions['project-2'].x}px, ${cardPositions['project-2'].y}px)`,
            cursor: draggingCard === 'project-2' ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>👌</text></svg>") 16 16, grabbing` : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>🤚</text></svg>") 16 16, grab`,
            zIndex: cardZIndices['project-2'],
            userSelect: 'none',
            outline: selectedCard === 'project-2' ? '2px solid #2F9AF8' : 'none',
          }}
          onMouseDown={(e) => handleCardMouseDown('project-2', e)}
        >
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#b3efbd', boxShadow: isDark ? '0px 4px 4px 0px rgba(0,0,0,0.4)' : '0px 4px 4px 0px rgba(0,0,0,0.15)' }}>
            <div className="absolute font-['Lato',sans-serif]" style={{ left: '10%', top: '10%', width: '80%', fontSize: 'clamp(12px, 1.25vw, 18px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              <p className="font-bold mb-0">eero</p>
              <p className="font-normal">Defining Iconography Standards for eero Insights.</p>
            </div>
            <p className="absolute font-['Lato',sans-serif] font-semibold" style={{ left: '10%', bottom: '10%', fontSize: 'clamp(10px, 0.97vw, 14px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              Aug 2023
            </p>
          </div>
          {selectedCard === 'project-2' && <SelectionHandles />}
        </div>

        {/* Project 3 - Olympus: lower-center */}
        <div
          className="absolute aspect-square"
          style={{
            width: 'clamp(160px, 16.67vw, 240px)',
            left: 'calc(50% - 36px)',
            top: 'calc(50% + 54px)',
            transform: `translate(${cardPositions['project-3'].x}px, ${cardPositions['project-3'].y}px)`,
            cursor: draggingCard === 'project-3' ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>👌</text></svg>") 16 16, grabbing` : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>🤚</text></svg>") 16 16, grab`,
            zIndex: cardZIndices['project-3'],
            userSelect: 'none',
            outline: selectedCard === 'project-3' ? '2px solid #2F9AF8' : 'none',
          }}
          onMouseDown={(e) => handleCardMouseDown('project-3', e)}
        >
          <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#ffe299', boxShadow: isDark ? '0px 4px 4px 0px rgba(0,0,0,0.4)' : '0px 4px 4px 0px rgba(0,0,0,0.15)' }}>
            <div className="absolute font-['Lato',sans-serif]" style={{ left: '10%', top: '10%', width: '80%', fontSize: 'clamp(12px, 1.25vw, 18px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              <p className="font-bold mb-0">Olympus</p>
              <p className="font-normal">Helping Endoscopy Teams to Track Quality Metrics.</p>
            </div>
            <p className="absolute font-['Lato',sans-serif] font-semibold" style={{ left: '10%', bottom: '10%', fontSize: 'clamp(10px, 0.97vw, 14px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', color: theme.cardText, transition: 'color 0.5s ease' }}>
              Oct 2025
            </p>
          </div>
          {selectedCard === 'project-3' && <SelectionHandles />}
        </div>


        {/* User-created sticky notes */}
        {stickies.map(sticky => {
          const stickyId = `sticky-${sticky.id}`;
          return (
            <div
              key={sticky.id}
              className="absolute overflow-hidden aspect-square"
              style={{
                left: sticky.x,
                top: sticky.y,
                width: 'clamp(160px, 16.67vw, 240px)',
                backgroundColor: sticky.color,
                boxShadow: isDark ? '0px 4px 4px 0px rgba(0,0,0,0.4)' : '0px 4px 4px 0px rgba(0,0,0,0.15)',
                transform: `translate(${cardPositions[stickyId]?.x || 0}px, ${cardPositions[stickyId]?.y || 0}px)`,
                cursor: draggingCard === stickyId ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>👌</text></svg>") 16 16, grabbing` : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='24' font-size='24'>🤚</text></svg>") 16 16, grab`,
                zIndex: cardZIndices[stickyId] || 1,
                userSelect: 'none',
              }}
              onMouseDown={(e) => handleCardMouseDown(stickyId, e)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute font-['Lato',sans-serif]" style={{ left: '10%', top: '10%', width: '80%', fontSize: 'clamp(12px, 1.25vw, 18px)', lineHeight: 'clamp(20px, 2.08vw, 30px)' }}>
                <input
                  type="text"
                  placeholder="Note"
                  className="font-bold outline-none bg-transparent border-none w-full font-['Lato',sans-serif] placeholder:text-[var(--sticky-placeholder)]"
                  style={{ color: theme.cardText, fontSize: 'inherit', lineHeight: 'inherit', padding: 0, cursor: 'text', '--sticky-placeholder': theme.stickyPlaceholder } as React.CSSProperties}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <textarea
                  placeholder="Leave me a note..."
                  rows={1}
                  className="font-normal bg-transparent border-none outline-none w-full font-['Lato',sans-serif] resize-none overflow-hidden placeholder:text-[var(--sticky-placeholder)]"
                  style={{ color: theme.cardText, fontSize: 'inherit', lineHeight: 'inherit', padding: 0, maxHeight: 'calc(clamp(20px, 2.08vw, 30px) * 4)', '--sticky-placeholder': theme.stickyPlaceholder } as React.CSSProperties}
                  onMouseDown={(e) => e.stopPropagation()}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Name"
                className="absolute font-['Lato',sans-serif] font-semibold outline-none bg-transparent border-none placeholder:text-[var(--sticky-placeholder)]"
                style={{ left: '10%', bottom: '10%', fontSize: 'clamp(10px, 0.97vw, 14px)', lineHeight: 'clamp(20px, 2.08vw, 30px)', cursor: 'text', color: theme.cardText, padding: 0, '--sticky-placeholder': theme.stickyPlaceholder } as React.CSSProperties}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
          );
        })}

        {/* My story */}
        <p
          data-nav
          onClick={projectNavIndex === 2 ? handleMyStoryClick : undefined}
          className="absolute left-1/2 -translate-x-1/2 font-['Lato',sans-serif] font-medium leading-[normal] text-center whitespace-nowrap transition-colors"
          style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', bottom: 'clamp(20px, 5vh, 60px)', color: projectNavIndex === 0 ? navColors[projectNavColorIndex] : theme.textMuted, opacity: projectNavFade ? 1 : 0, transition: 'color 0.5s ease, opacity 0.4s ease', cursor: projectNavIndex === 2 ? 'pointer' : 'default', minHeight: 44, display: 'flex', alignItems: 'center' }}
          onMouseEnter={(e) => { if (projectNavIndex === 2) e.currentTarget.style.color = theme.text; }}
          onMouseLeave={(e) => { if (projectNavIndex === 2) e.currentTarget.style.color = theme.textMuted; }}
        >
          {projectNavTexts[projectNavIndex]}
        </p>
      </div>

      {/* Story */}
      <div id="story-section" className="relative h-screen w-full snap-start snap-always">
        {/* Home link at top */}
        <p
          onClick={() => document.getElementById('home-landing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="absolute left-1/2 -translate-x-1/2 font-['Lato',sans-serif] font-medium leading-[normal] text-center whitespace-nowrap cursor-pointer transition-colors"
          style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', top: 'clamp(20px, 5vh, 60px)', color: theme.textMuted, transition: 'color 0.5s ease, opacity 0.4s ease', minHeight: 44, display: 'flex', alignItems: 'center', opacity: storyVisible && !isScrolling ? 1 : 0 }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
          onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
        >
          Home
        </p>
        {/* Scrollable text area starting at 240px from top, fade at bottom */}
        <div
          ref={storyScrollRef}
          className="absolute left-1/2 -translate-x-1/2 overflow-y-auto font-['Lato',sans-serif]"
          style={{
            color: theme.text,
            transition: 'color 0.5s ease',
            width: 'min(640px, calc(100% - 48px))',
            top: 'clamp(80px, 15vh, 120px)',
            bottom: 'clamp(100px, 15vh, 140px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)',
          }}
        >
          <div style={{ paddingTop: 40, paddingBottom: 40, paddingRight: 16 }}>
            {storyText.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className={i === 0 ? "font-semibold" : "font-normal"}
                style={{
                  fontSize: i === 0 ? '16px' : 'clamp(14px, 4.5vw, 16px)',
                  lineHeight: '30px',
                  marginBottom: 12,
                }}
              >
                {paragraph}
              </p>
            ))}
            <p className="font-semibold" style={{ fontSize: '16px', lineHeight: '30px', marginTop: 36, marginBottom: 12, color: theme.text }}>New chapter</p>
            <textarea
              ref={storyTextareaRef}
              placeholder="Write the new chapter of my story ..."
              rows={1}
              className="font-normal bg-transparent border-none outline-none w-full font-['Lato',sans-serif] resize-none overflow-hidden placeholder:text-[var(--story-placeholder)]"
              style={{
                fontSize: 'clamp(14px, 4.5vw, 16px)',
                lineHeight: '30px',
                marginBottom: 12,
                color: theme.text,
                '--story-placeholder': theme.textMuted,
              } as React.CSSProperties}
              onInput={handleStoryInput}
            />
          </div>
        </div>

        {/* Bottom Menu */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-row items-center justify-between"
          style={{ width: 'min(640px, calc(100% - 40px))', bottom: 'clamp(20px, 5vh, 60px)' }}
        >
          <div className="flex font-['Lato',sans-serif] font-medium items-center whitespace-nowrap" style={{ gap: 24, fontSize: 'clamp(14px, 4.5vw, 16px)', color: theme.textMuted, transition: 'color 0.5s ease' }}>
            <p
              className="cursor-pointer"
              style={{
                color: storyInput.trim() ? (isDark ? '#a8daff' : '#7bbde6') : undefined,
                transition: 'color 0.15s ease',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={handleSayHiClick}
              onMouseEnter={(e) => { if (!storyInput.trim()) e.currentTarget.style.color = theme.text; }}
              onMouseLeave={(e) => { if (!storyInput.trim()) e.currentTarget.style.color = theme.textMuted; }}
            >{storyInput.trim() ? 'Send it' : 'Say hi!'}</p>
            <p className="cursor-pointer transition-colors" style={{ minHeight: 44, display: 'flex', alignItems: 'center' }} onClick={() => window.open('https://www.instagram.com/zooruncow/', '_blank')} onMouseEnter={(e) => e.currentTarget.style.color = theme.text} onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}>My life</p>
            <p className="cursor-pointer transition-colors" style={{ minHeight: 44, display: 'flex', alignItems: 'center' }} onClick={() => window.open('https://www.linkedin.com/in/zhurankou/', '_blank')} onMouseEnter={(e) => e.currentTarget.style.color = theme.text} onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}>LinkedIn</p>
            <p className="cursor-pointer transition-colors" style={{ minHeight: 44, display: 'flex', alignItems: 'center' }} onClick={() => window.open(isDark ? '/resume-dark.pdf' : '/resume-light.pdf', '_blank')} onMouseEnter={(e) => e.currentTarget.style.color = theme.text} onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}>Resume</p>
          </div>
          <div className="flex items-center gap-[4px] whitespace-nowrap flex-shrink-0">
            <p className="font-['Lato',sans-serif] font-medium text-right" style={{ fontSize: 'clamp(14px, 4.5vw, 16px)', color: theme.textMuted, transition: 'color 0.5s ease' }}>Bye</p>
            <span
              className="relative cursor-pointer select-none hover:animate-[heartBeat_2s_ease-in-out_1]"
              style={{ fontSize: 20, lineHeight: 'normal', display: 'inline-block', transformOrigin: 'center center' }}
              onMouseEnter={startHearts}
              onMouseLeave={stopHearts}
            >
              ❤️
              {floatingHearts.map(heart => (
                <span
                  key={heart.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `calc(50% + ${heart.x}px)`,
                    bottom: '100%',
                    fontSize: `${12 + Math.random() * 10}px`,
                    animation: `floatHeart ${heart.duration}s ease-out forwards`,
                    '--drift': `${heart.drift}px`,
                  } as React.CSSProperties}
                >
                  ❤️
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
