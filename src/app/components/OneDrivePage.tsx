import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { WaveLabel } from './ui/WaveLabel';
import { ScrollFadeIn } from './ui/ScrollFadeIn';

const TITLE = "'Stack Sans Notch', sans-serif";
const BODY = "'Manrope', sans-serif";
const BLUE = '#0078D4';
const GREY = '#A8AFB6';
const SURFACE = '#F5F5F7';

const process = [
  {
    id: 'model',
    title: 'Simplifying the sharing model',
    body: 'We compared unified and separated sharing models across OneDrive and Office. The trade-off was adding a step while making each decision easier: first choose how to share, then set permissions only when needed.',
    visual: '/onedrive/exploration.svg',
    alt: 'OneDrive unified and separated sharing model explorations',
  },
  {
    id: 'permissions',
    title: 'Clarifying audience and permissions',
    body: 'People struggled to understand who each link option was for. We renamed the experience, simplified audience names, surfaced descriptions, and made permission controls consistent.',
    visual: '/onedrive/permissions.svg',
    alt: 'OneDrive redesigned sharing settings and permission controls',
  },
  {
    id: 'constraints',
    title: 'Designing within constraints',
    body: 'We explored showing existing access directly in Share. Users liked the idea, but live face-piles in the menu were not technically feasible, so we kept the intent and simplified the implementation.',
    visual: '/onedrive/access-constraints.svg',
    alt: 'OneDrive existing-access exploration that was constrained by engineering feasibility',
  },
  {
    id: 'entry',
    title: 'Creating a clear entry point',
    body: 'Manage Access had been buried in overflow menus and the details pane. We brought it directly into the sharing experience so people could quickly answer: who already has access?',
    visual: '/onedrive/access-solution.svg',
    alt: 'OneDrive Manage Access and Shared with entry-point solution',
  },
  {
    id: 'delivery',
    title: 'Scaling the experience',
    body: 'Because sharing is high-traffic, we rolled the redesign out in stages and monitored telemetry. I also documented accessibility requirements, mobile behavior, and reusable patterns for partner teams.',
    visual: '/onedrive/accessibility.svg',
    alt: 'OneDrive accessibility specifications',
  },
];

function ResearchBars() {
  const rows = [
    { name: 'OneDrive', completion: 89, satisfaction: 73 },
    { name: 'Google Drive', completion: 81, satisfaction: 80 },
    { name: 'Box', completion: 74, satisfaction: 79 },
  ];
  return (
    <div style={{ width: 696, height: 696, borderRadius: 40, background: SURFACE, padding: 56, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <p style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 42, lineHeight: 1.05 }}>Research signal</p>
        <div style={{ display: 'flex', gap: 18, fontFamily: BODY, fontSize: 12, color: '#666' }}>
          <span>■ Completion</span><span style={{ color: BLUE }}>■ Satisfaction</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        {rows.map((r) => (
          <div key={r.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: BODY, fontSize: 16, fontWeight: 600 }}>
              <span>{r.name}</span><span>{r.completion}% / {r.satisfaction}%</span>
            </div>
            <div style={{ height: 18, background: '#E2E4E8', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${r.completion}%`, height: '100%', background: '#000', borderRadius: 999 }} />
            </div>
            <div style={{ height: 18, background: '#E2E4E8', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${r.satisfaction}%`, height: '100%', background: BLUE, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, fontFamily: BODY, fontWeight: 500, fontSize: 18, lineHeight: '28px' }}>
        Users could complete sharing tasks, but satisfaction with the experience was low.
      </p>
    </div>
  );
}

function ProcessSection() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers = refs.current.map((el, index) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(index); },
        { rootMargin: '-28% 0px -28% 0px', threshold: 0.05 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, []);

  return (
    <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto', padding: '150px 0 40px', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 64, alignItems: 'start' }} className="od-process">
      <div style={{ position: 'sticky', top: 90, minHeight: 640, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ScrollFadeIn><h2 style={{ margin: '0 0 36px', fontFamily: TITLE, fontWeight: 300, fontSize: 48, lineHeight: 1 }}>Process</h2></ScrollFadeIn>
        {process.map((item, i) => (
          <div key={item.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB', padding: '20px 0' }}>
            <div style={{ fontFamily: BODY, fontWeight: active === i ? 650 : 500, fontSize: 21, color: active === i ? '#000' : GREY, transition: 'color .35s ease' }}>{item.title}</div>
            <div style={{ display: 'grid', gridTemplateRows: active === i ? '1fr' : '0fr', transition: 'grid-template-rows .45s ease' }}>
              <div style={{ overflow: 'hidden', minHeight: 0 }}>
                <p style={{ margin: active === i ? '12px 12px 0 0' : '0 12px 0 0', opacity: active === i ? 1 : 0, transition: 'opacity .3s ease, margin .45s ease', fontFamily: BODY, fontSize: 16, lineHeight: '24px' }}>{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {process.map((item, i) => (
          <div key={item.id} ref={(el) => { refs.current[i] = el; }} style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 40, background: SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', padding: i === 4 ? 34 : 42 }}>
            <img src={item.visual} alt={item.alt} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        ))}
        <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 40, background: SURFACE, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, padding: 42, boxSizing: 'border-box', overflow: 'hidden' }}>
          <img src="/onedrive/mobile.svg" alt="OneDrive mobile sharing specifications" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <img src="/onedrive/illustrations.svg" alt="OneDrive first-run sharing illustrations" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  );
}

function ResearchSummary() {
  const studies = [
    ['Share dialog', 'Users discovered Share, understood Email link, and completed the tested tasks.'],
    ['Link settings', 'External sharing was easy; “People with access” and hidden descriptions needed refinement.'],
    ['Shared with', 'Participants understood the face-piles and valued seeing who already had access.'],
  ];
  return (
    <section style={{ padding: '150px 0 0' }}>
      <div style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto' }}>
        <ScrollFadeIn>
          <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 54px' }}>
            <WaveLabel text="RESEARCH" fontSize={16} />
            <h2 style={{ margin: '18px 0 20px', fontFamily: TITLE, fontWeight: 300, fontSize: 56, lineHeight: 1 }}>Research shaped what we removed, not just what we added</h2>
            <p style={{ margin: 0, fontFamily: BODY, fontSize: 19, lineHeight: '30px' }}>Each round narrowed the experience: simplify the flow, clarify the language, and expose the access information people needed at the moment of sharing.</p>
          </div>
        </ScrollFadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {studies.map(([title, body], i) => (
            <ScrollFadeIn key={title} delay={i * 90}>
              <div style={{ minHeight: 230, borderRadius: 32, background: SURFACE, padding: 30, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: BODY, fontSize: 13, color: GREY }}>0{i + 1}</span>
                <div><h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 30 }}>{title}</h3><p style={{ margin: '14px 0 0', fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>{body}</p></div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OneDrivePage() {
  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#fff', color: '#000', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 820px) {
          .od-process { grid-template-columns: 1fr !important; max-width: calc(100vw - 40px) !important; padding-top: 96px !important; }
          .od-process > div:first-child { position: static !important; min-height: auto !important; }
          .od-process > div:first-child > div { display: none; }
          .od-process > div:first-child h2 { margin-bottom: 0 !important; text-align:center; }
          .od-process > div:last-child { gap: 18px !important; }
          .od-process > div:last-child > div { border-radius: 28px !important; padding: 22px !important; }
        }
      `}</style>

      <Link to="/" style={{ position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 50, border: '2px solid #000', borderRadius: 999, padding: '6px 15px', textDecoration: 'none', color: '#000', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', fontFamily: TITLE, fontSize: 15 }}>← Home</Link>

      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 70px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 920 }}>
          <WaveLabel text="CASE STUDY" fontSize={16} />
          <h1 style={{ margin: '18px 0 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 'clamp(56px, 7vw, 88px)', lineHeight: .95, letterSpacing: '-.035em' }}>OneDrive<br />Sharing Experience</h1>
          <p style={{ margin: '0 auto', maxWidth: 760, fontFamily: BODY, fontWeight: 500, fontSize: 20, lineHeight: '31px' }}>How might we simplify a powerful but complex sharing experience so people can share confidently and stay in control of access?</p>
        </div>
      </section>

      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto', paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="od-intro">
          <ScrollFadeIn>
            <div>
              <WaveLabel text="MY CONTRIBUTION" fontSize={15} />
              <h2 style={{ margin: '18px 0 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 50, lineHeight: 1 }}>Designing a core Microsoft 365 journey</h2>
              <p style={{ margin: 0, fontFamily: BODY, fontSize: 18, lineHeight: '29px' }}>I led the redesign across OneDrive web and mobile, partnering with Office designers, Product, UX Research, and Engineering. The sharing experience appeared across more than 40 product entry points, so every decision had to work at scale.</p>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn delay={100}><ResearchBars /></ScrollFadeIn>
        </div>
      </section>

      <section style={{ padding: '160px 24px 20px', textAlign: 'center' }}>
        <ScrollFadeIn>
          <WaveLabel text="PROBLEM" fontSize={16} />
          <h2 style={{ maxWidth: 900, margin: '18px auto 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 60, lineHeight: 1 }}>Powerful sharing had become hard to understand</h2>
          <p style={{ maxWidth: 760, margin: '0 auto', fontFamily: BODY, fontSize: 19, lineHeight: '30px' }}>The same flexibility that made OneDrive sharing powerful also created friction: inconsistent experiences, confusing link types, hidden controls, and access management that was difficult to find.</p>
        </ScrollFadeIn>
      </section>

      <ProcessSection />
      <ResearchSummary />

      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto', padding: '160px 0 0' }}>
        <ScrollFadeIn>
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 56px' }}>
            <WaveLabel text="OUTCOME" fontSize={16} />
            <h2 style={{ margin: '18px 0 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 60, lineHeight: 1 }}>Clearer sharing at Microsoft 365 scale</h2>
            <p style={{ margin: 0, fontFamily: BODY, fontSize: 19, lineHeight: '30px' }}>We unified the sharing model, clarified permissions and access choices, and used telemetry to guide a staged rollout across a high-traffic experience.</p>
          </div>
        </ScrollFadeIn>

        <div style={{ borderRadius: 40, background: SURFACE, padding: 52, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="od-metrics">
          {[['+34%','Completed sharing actions'],['+3.9%','Permission changes'],['+27%','Copy Link setting changes'],['+64%','Manage Access engagement']].map(([value,label],i)=>(
            <ScrollFadeIn key={label} delay={i*80}><div style={{ minHeight: 170, borderRadius: 28, background: '#fff', padding: 28, boxSizing: 'border-box' }}><div style={{ fontFamily: TITLE, fontWeight: 300, fontSize: 48, lineHeight: 1, color: BLUE }}>{value}</div><p style={{ margin: '18px 0 0', fontFamily: BODY, fontSize: 15, lineHeight: '22px' }}>{label}</p></div></ScrollFadeIn>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '170px 24px 130px' }}>
        <WaveLabel text="THANK YOU!" fontSize={16} />
        <h2 style={{ maxWidth: 820, margin: '18px auto 26px', fontFamily: TITLE, fontWeight: 300, fontSize: 64, lineHeight: 1 }}>Make the decision simple.<br />Keep the system powerful.</h2>
        <Link to="/" style={{ display: 'inline-block', marginTop: 12, border: '2px solid #000', borderRadius: 999, padding: '8px 18px', color: '#000', textDecoration: 'none', fontFamily: TITLE, fontSize: 16 }}>Back home</Link>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .od-intro { grid-template-columns: 1fr !important; gap: 36px !important; }
          .od-intro > div:last-child > div { transform-origin: left top; }
          .od-metrics { grid-template-columns: 1fr 1fr !important; padding: 28px !important; border-radius: 28px !important; }
        }
        @media (max-width: 520px) {
          .od-metrics { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
