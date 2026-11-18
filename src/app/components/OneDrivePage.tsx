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
    id: 'sharing-model',
    title: 'Simplifying the sharing model',
    body: 'We started by aligning OneDrive and Office around how sharing should work. We compared a unified dialog with a separated model, then moved toward a progressive flow that asked people to make one decision at a time. The trade-off was an extra step, but each step became easier to understand and the pattern could flex across different Microsoft 365 entry points.',
    visuals: [
      { src: '/onedrive/exploration.svg', alt: 'Unified and separated sharing model explorations', nativeWidth: 1018 },
      { src: '/onedrive/flow.svg', alt: 'Progressive OneDrive sharing flow', nativeWidth: 1038 },
      { src: '/onedrive/direction.svg', alt: 'OneDrive final sharing direction', nativeWidth: 528 },
    ],
  },
  {
    id: 'sharing-settings',
    title: 'Clarifying sharing settings',
    body: 'The next problem was permissions. Link Settings combined audience scope, editing rights, and security controls, and customers struggled to understand the differences between options. We simplified names, surfaced descriptions instead of hiding them behind tooltips, and made roles and permissions more consistent. Research helped us decide which explanations needed to stay visible, even when that meant showing slightly more information.',
    visuals: [
      { src: '/onedrive/permissions.svg', alt: 'OneDrive audience and permission redesign', nativeWidth: 968 },
      { src: '/onedrive/settings-refinement.svg', alt: 'Refined OneDrive sharing settings', nativeWidth: 528 },
    ],
  },
  {
    id: 'manage-access',
    title: 'Making access easier to find',
    body: 'Manage Access was buried in overflow menus and the details pane. We explored a richer approach that showed existing access directly in Share, similar to patterns people already knew from other cloud products. Engineering ruled out live face-piles in the menu, so we preserved the user need while simplifying the implementation: a clear Manage Access entry point in Share and a Shared with section inside the dialog.',
    visuals: [
      { src: '/onedrive/manage-directions.svg', alt: 'Manage Access design directions', nativeWidth: 528 },
      { src: '/onedrive/access-constraints.svg', alt: 'Face-pile exploration constrained by engineering feasibility', nativeWidth: 843 },
      { src: '/onedrive/access-solution.svg', alt: 'Final Manage Access entry point', nativeWidth: 1100 },
    ],
  },
  {
    id: 'scaling',
    title: 'Shipping and scaling the experience',
    body: 'Because sharing is a high-traffic Microsoft 365 experience, we released the redesign incrementally and monitored telemetry rather than shipping everything at once. I also documented accessibility requirements, created mobile specifications, and helped turn validated patterns into reusable components and guidelines for partner teams.',
    visuals: [
      { src: '/onedrive/rollout.svg', alt: 'Incremental OneDrive sharing rollout', nativeWidth: 908 },
      { src: '/onedrive/accessibility.svg', alt: 'OneDrive accessibility specifications', nativeWidth: 1042 },
      { src: '/onedrive/mobile.svg', alt: 'OneDrive mobile sharing specifications', nativeWidth: 946 },
      { src: '/onedrive/design-system.svg', alt: 'Reusable OneDrive sharing design system assets', nativeWidth: 1168 },
    ],
  },
];

function ResearchBars() {
  const rows = [
    {
      name: 'OneDrive',
      completion: 89,
      satisfaction: 73,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Microsoft_Office_OneDrive_%282019%E2%80%932025%29.svg/3840px-Microsoft_Office_OneDrive_%282019%E2%80%932025%29.svg.png',
    },
    {
      name: 'Google Drive',
      completion: 81,
      satisfaction: 80,
      logo: 'https://www.gstatic.com/images/branding/productlogos/drive_2026/v2/web-64dp/logo_drive_2026_color_2x_web_64dp.png',
    },
    {
      name: 'Box',
      completion: 74,
      satisfaction: 79,
      logo: 'https://logowik.com/content/uploads/images/box-inc8610.logowik.com.webp',
    },
  ];

  return (
    <div style={{ width: 696, borderRadius: 40, background: SURFACE, padding: 48, boxSizing: 'border-box' }}>
      <p style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 38, lineHeight: 1 }}>Benchmark</p>

      <div style={{ marginTop: 34 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: 18, padding: '0 8px 12px', borderBottom: '1px solid #D9DCE1' }}>
          <div />
          <div style={{ fontFamily: BODY, fontSize: 12, color: '#8E8E93', textAlign: 'right' }}>Completion</div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: '#8E8E93', textAlign: 'right' }}>Satisfaction</div>
        </div>

        {rows.map((row) => (
          <div
            key={row.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 1fr',
              gap: 18,
              alignItems: 'center',
              padding: '24px 8px',
              minHeight: 92,
              borderBottom: row.name === 'Box' ? 'none' : '1px solid #E5E7EB',
            }}
          >
            <div style={{ width: 76, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
              <img
                src={row.logo}
                alt={row.name}
                style={{
                  display: 'block',
                  maxWidth: row.name === 'Box' ? 68 : 58,
                  maxHeight: row.name === 'Google Drive' ? 38 : 34,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ fontFamily: TITLE, fontWeight: 300, fontSize: 34, lineHeight: 1, textAlign: 'right', color: '#111111' }}>
              {row.completion}%
            </div>

            <div style={{ fontFamily: TITLE, fontWeight: 300, fontSize: 34, lineHeight: 1, textAlign: 'right', color: '#0078D4' }}>
              {row.satisfaction}%
            </div>
          </div>
        ))}
      </div>
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
        { rootMargin: '-30% 0px -30% 0px', threshold: 0.05 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, []);

  return (
    <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto', padding: '180px 0 40px', display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 64, alignItems: 'start', overflow: 'visible' }} className="od-process">
      <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: '100%' }}>
        <div style={{ position: 'sticky', top: 88 }}>
          <ScrollFadeIn><h2 style={{ margin: '0 0 30px', fontFamily: TITLE, fontWeight: 300, fontSize: 48, lineHeight: 1 }}>Process</h2></ScrollFadeIn>
          {process.map((item, i) => (
            <div key={item.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB', padding: '17px 0' }}>
              <div style={{ fontFamily: BODY, fontWeight: active === i ? 650 : 500, fontSize: 19, color: active === i ? '#000' : GREY, transition: 'color .35s ease' }}>{item.title}</div>
              <div style={{ display: 'grid', gridTemplateRows: active === i ? '1fr' : '0fr', transition: 'grid-template-rows .4s ease' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <p style={{ margin: active === i ? '11px 14px 2px 0' : '0 14px 0 0', opacity: active === i ? 1 : 0, transition: 'opacity .3s ease, margin .4s ease', fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
        {process.map((item, i) => (
          <div key={item.id} ref={(el) => { refs.current[i] = el; }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {item.visuals.map((visual) => (
              <div key={visual.src} style={{ width: '100%', height: 540, borderRadius: 40, background: SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', padding: 34 }}>
                <img
                  src={visual.src}
                  alt={visual.alt}
                  style={{
                    display: 'block',
                    width: `min(100%, ${visual.nativeWidth}px)`,
                    height: 'auto',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ResearchSummary() {
  const studies = [
    ['Share dialog', 'Users discovered Share, understood Email link, and completed the tested tasks.', 'rgba(255, 45, 85, 0.16)', '#FF2D55'],
    ['Link settings', 'External sharing was easy; “People with access” and hidden descriptions needed refinement.', 'rgba(48, 176, 199, 0.16)', '#30B0C7'],
    ['Shared with', 'Participants understood the face-piles and valued seeing who already had access.', 'rgba(175, 82, 222, 0.16)', '#AF52DE'],
  ];
  return (
    <section style={{ padding: '210px 0 0' }}>
      <div style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto' }}>
        <ScrollFadeIn>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 64px' }}>
            <WaveLabel text="RESEARCH" fontSize={16} />
            <h2 style={{ margin: '18px 0 20px', fontFamily: TITLE, fontWeight: 300, fontSize: 56, lineHeight: 1 }}>Research shaped what we removed, not just what we added</h2>
            <p style={{ margin: 0, fontFamily: BODY, fontSize: 19, lineHeight: '30px' }}>Each round narrowed the experience: simplify the flow, clarify the language, and expose the access information people needed at the moment of sharing.</p>
          </div>
        </ScrollFadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
          {studies.map(([title, body, background, accent], i) => (
            <ScrollFadeIn key={title}>
              <div style={{ minHeight: 260, borderRadius: 32, background, padding: 32, boxSizing: 'border-box', display: 'grid', gridTemplateRows: '24px 56px 1fr', rowGap: 18 }}>
                <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, color: accent }}>0{i + 1}</span>
                <h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 30, lineHeight: '34px', alignSelf: 'end' }}>{title}</h3>
                <p style={{ margin: 0, fontFamily: BODY, fontSize: 15, lineHeight: '23px', alignSelf: 'start' }}>{body}</p>
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
    <main style={{ width: '100%', minHeight: '100vh', background: '#fff', color: '#000', overflowX: 'clip' }}>
      <style>{`
        @media (max-width: 820px) {
          .od-process { grid-template-columns: 1fr !important; max-width: calc(100vw - 40px) !important; padding-top: 96px !important; }
          .od-process > div:first-child { position: static !important; min-height: auto !important; }
          .od-process > div:first-child > div { position: static !important; transform: none !important; }
          .od-process > div:first-child > div > div { display: none; }
          .od-process > div:first-child h2 { margin-bottom: 0 !important; text-align:center; }
          .od-process > div:last-child { gap: 56px !important; }
          .od-process > div:last-child > div { gap: 14px !important; }
          .od-process > div:last-child > div > div { height: 360px !important; border-radius: 28px !important; padding: 20px !important; }
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
              <h2 style={{ margin: '18px 0 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 50, lineHeight: 1 }}>Leading the sharing redesign</h2>
              <p style={{ margin: 0, fontFamily: BODY, fontSize: 18, lineHeight: '29px' }}>I led the redesign across OneDrive web and mobile, partnering with Office, Product, UX Research, and Engineering. Benchmarking showed high task completion (89%) but lower satisfaction (73%), revealing friction in a core experience used across 40+ Microsoft 365 entry points.</p>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn><ResearchBars /></ScrollFadeIn>
        </div>
      </section>

      <section style={{ padding: '160px 24px 20px', textAlign: 'center' }}>
        <ScrollFadeIn>
          <WaveLabel text="PROBLEM" fontSize={16} />
          <h2 style={{ maxWidth: 900, margin: '18px auto 22px', fontFamily: TITLE, fontWeight: 300, fontSize: 60, lineHeight: 1 }}>Powerful sharing had become hard to understand</h2>
          <p style={{ maxWidth: 760, margin: '0 auto', fontFamily: BODY, fontSize: 19, lineHeight: '30px' }}>The same flexibility that made OneDrive sharing powerful also created friction: inconsistent experiences, confusing link types, hidden controls, and access management that was difficult to find.</p>
        </ScrollFadeIn>
      </section>

      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '90px auto 0' }}>
        <ScrollFadeIn>
          <div>
            <div style={{ maxWidth: 720, marginBottom: 30 }}>
              <h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 42, lineHeight: 1.05 }}>What people were saying</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="od-tweets">
              {[
                ['/onedrive/tweet-noah.svg', 'Noah Wyhof-Rudnick tweet about Google Drive being more user friendly than OneDrive'],
                ['/onedrive/tweet-tim.svg', 'Tim Wagner tweet describing Office 365 and OneDrive sharing as clunky'],
                ['/onedrive/tweet-abbie.svg', 'Abbie tweet saying OneDrive drives her nuts'],
                ['/onedrive/tweet-lino.svg', 'Lino Casas III tweet comparing Google products favorably with OneDrive'],
              ].map(([src, alt]) => (
                <div key={src} style={{ background: '#F0F1FA', borderRadius: 24, padding: 16, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={src} alt={alt} style={{ display: 'block', width: '100%', height: 'auto' }} />
                </div>
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      <ProcessSection />
      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '120px auto 0' }}>
        <ScrollFadeIn>
          <div style={{ background: '#F3F3FB', borderRadius: 40, padding: 42, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 30, marginBottom: 30 }}>
              <div>
                <p style={{ margin: '0 0 8px', fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: GREY }}>Scaled comparative test</p>
                <h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 38, lineHeight: 1.05 }}>Copy Link: simpler vs. clearer</h3>
              </div>
              <p style={{ margin: 0, fontFamily: BODY, fontSize: 14, color: '#6E6E73', textAlign: 'right' }}>60 participants · unmoderated · counterbalanced order</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="od-copy-test">
              <div style={{ background: '#fff', borderRadius: 28, padding: 28, border: '1px solid #FFB3AA' }}>
                <div style={{ fontFamily: TITLE, fontSize: 28, marginBottom: 14 }}>A</div>
                <h4 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 26 }}>“Copy link” text button</h4>
                <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>People didn’t associate Link Settings with “Copy this link.”</p>
                <p style={{ margin: '16px 0 0', fontFamily: BODY, fontSize: 14, lineHeight: '22px', color: '#6E6E73' }}>“Not immediately obvious what action to take” · “Less clear”</p>
              </div>
              <div style={{ background: '#fff', borderRadius: 28, padding: 28, border: '1px solid #7EDC9B' }}>
                <div style={{ fontFamily: TITLE, fontSize: 28, marginBottom: 14 }}>B</div>
                <h4 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 26 }}>Dedicated “Copy link” section</h4>
                <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>All participants completed the tasks and found the settings easier to locate.</p>
                <p style={{ margin: '16px 0 0', fontFamily: BODY, fontSize: 14, lineHeight: '22px', color: '#6E6E73' }}>“This separation is more clear” · Trade-off: “More info made me think harder”</p>
              </div>
            </div>

            <p style={{ margin: '24px 0 0', fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>
              <b>Trade-off:</b> the clearer structure added more visible information, but it made the relationship between Copy Link and its settings easier to understand.
            </p>
          </div>
        </ScrollFadeIn>
      </section>

      <ResearchSummary />

      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '150px auto 0' }}>
        <ScrollFadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0,1fr)', gap: 64, alignItems: 'center' }} className="od-extension">
            <div>
              <p style={{ margin: '0 0 8px', fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: GREY }}>Visual design</p>
              <h2 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 46, lineHeight: 1.02 }}>Extending sharing</h2>
              <p style={{ margin: '18px 0 0', fontFamily: BODY, fontSize: 17, lineHeight: '27px' }}>I also designed first-run visuals for family and group sharing, extending the core sharing work into new feature onboarding.</p>
            </div>
            <div style={{ height: 540, background: SURFACE, borderRadius: 40, padding: 34, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img src="/onedrive/illustrations.svg" alt="OneDrive family and group sharing illustrations" style={{ display: 'block', width: 'min(100%, 998px)', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </ScrollFadeIn>
      </section>

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
            <ScrollFadeIn key={label}><div style={{ minHeight: 170, borderRadius: 28, background: '#fff', padding: 28, boxSizing: 'border-box' }}><div style={{ fontFamily: TITLE, fontWeight: 300, fontSize: 48, lineHeight: 1, color: BLUE }}>{value}</div><p style={{ margin: '18px 0 0', fontFamily: BODY, fontSize: 15, lineHeight: '22px' }}>{label}</p></div></ScrollFadeIn>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '170px 24px 130px' }}>
        <WaveLabel text="THANK YOU!" fontSize={16} />
        <h2 style={{ maxWidth: 820, margin: '18px auto 26px', fontFamily: TITLE, fontWeight: 300, fontSize: 64, lineHeight: 1 }}>Make the decision simple.<br />Keep the system powerful.</h2>
        <Link to="/" style={{ display: 'inline-block', marginTop: 12, border: '2px solid #000', borderRadius: 999, padding: '8px 18px', color: '#000', textDecoration: 'none', fontFamily: TITLE, fontSize: 16 }}>Back home</Link>
      </section>

      <style>{`
        mark{background:linear-gradient(transparent 20%,#F4E6A6 20%,#F4E6A6 92%,transparent 92%);padding:0 .03em;color:inherit}
        @media (max-width: 900px) {          .od-tweets { grid-template-columns: 1fr !important; }
          .od-copy-test, .od-delivery, .od-extension { grid-template-columns: 1fr !important; }
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
