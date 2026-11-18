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
    id: 'explorations',
    title: 'Explorations',
    body: 'We compared unified and separated sharing actions to find a simpler, flexible model across OneDrive and Office.',
    visual: '/onedrive/exploration.svg',
    alt: 'Unified and separated sharing model explorations',
  },
  {
    id: 'simplified-flow',
    title: 'Simplified flow',
    body: 'We broke sharing into progressive steps so people could focus on one decision at a time.',
    visual: '/onedrive/flow.svg',
    alt: 'Progressive OneDrive sharing flow',
  },
  {
    id: 'testing',
    title: 'Testing',
    body: 'We tested whether people could find sharing options and complete common tasks using the new flow.',
    visual: '/onedrive/testing.svg',
    alt: 'OneDrive sharing flow usability testing',
  },
  {
    id: 'design-direction',
    title: 'Design direction',
    body: 'The direction combined a progressive flow, clearer permissions, and a more consistent pattern across products.',
    visual: '/onedrive/direction.svg',
    alt: 'OneDrive sharing design direction',
  },
  {
    id: 'confusing-settings',
    title: 'Confusing settings',
    body: 'Customers struggled to understand audience options and permissions in the existing Link Settings experience.',
    visual: '/onedrive/permissions.svg',
    alt: 'Existing and redesigned OneDrive sharing settings',
  },
  {
    id: 'clarifying-permissions',
    title: 'Clarifying permissions',
    body: 'We simplified names, added clearer descriptions, and made permission controls more consistent.',
    visual: '/onedrive/permissions.svg',
    alt: 'Clarified OneDrive sharing permissions',
  },
  {
    id: 'refinements',
    title: 'Refinements',
    body: 'Research led us to surface descriptions, clarify labels, and make existing access easier to understand.',
    visual: '/onedrive/settings-refinement.svg',
    alt: 'Refined OneDrive sharing settings',
  },
  {
    id: 'discoverability',
    title: 'Discoverability',
    body: 'Manage Access was buried in the overflow menu and details pane, making an important task difficult to find.',
    visual: '/onedrive/manage-directions.svg',
    alt: 'OneDrive Manage Access discoverability explorations',
  },
  {
    id: 'constraints',
    title: 'Constraints',
    body: 'We explored showing existing access directly in Share, but live face-piles in the menu were not technically feasible.',
    visual: '/onedrive/access-constraints.svg',
    alt: 'Manage Access face-pile exploration constrained by engineering feasibility',
  },
  {
    id: 'design-directions',
    title: 'Design directions',
    body: 'We narrowed the solution to Manage Access in the Share menu and Shared with inside the dialog.',
    visual: '/onedrive/manage-directions.svg',
    alt: 'Manage Access design directions',
  },
  {
    id: 'clear-entry-point',
    title: 'Clear entry point',
    body: 'Manage Access became easier to find directly from Share without adding another complex management surface.',
    visual: '/onedrive/access-solution.svg',
    alt: 'Final Manage Access entry point',
  },
  {
    id: 'incremental-rollout',
    title: 'Incremental rollout',
    body: 'We released the redesign in stages and used telemetry to evaluate behavior and reduce risk.',
    visual: '/onedrive/rollout.svg',
    alt: 'Incremental OneDrive sharing rollout',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    body: 'I documented keyboard, screen-reader, zoom, and high-contrast requirements for the sharing experience.',
    visual: '/onedrive/accessibility.svg',
    alt: 'OneDrive accessibility specifications',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    body: 'I created iOS and Android specifications so the sharing experience stayed consistent across platforms.',
    visual: '/onedrive/mobile.svg',
    alt: 'OneDrive mobile sharing specifications',
  },
  {
    id: 'scaling',
    title: 'Scaling the experience',
    body: 'Validated patterns became reusable components and guidelines for Microsoft 365 partner teams.',
    visual: '/onedrive/design-system.svg',
    alt: 'OneDrive sharing design system assets',
  },
  {
    id: 'illustrations',
    title: 'Illustrations',
    body: 'I also created first-run visuals for family and group sharing.',
    visual: '/onedrive/illustrations.svg',
    alt: 'OneDrive family and group sharing illustrations',
  },
];

function ResearchBars() {
  return (
    <div style={{ width: 696, height: 430, borderRadius: 40, background: SURFACE, padding: 54, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <p style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 38, lineHeight: 1 }}>Research signal</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 48 }}>
        <div style={{ borderRadius: 30, background: 'rgba(52,199,89,.16)', padding: '30px', minHeight: 230, boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontFamily: BODY, fontWeight: 600, fontSize: 15, color: '#248A3D' }}>Task completion</p>
          <div style={{ marginTop: 34, fontFamily: TITLE, fontWeight: 300, fontSize: 92, lineHeight: .86, letterSpacing: '-.05em', color: '#248A3D' }}>89%</div>
        </div>

        <div style={{ borderRadius: 30, background: 'rgba(255,59,48,.14)', padding: '30px', minHeight: 230, boxSizing: 'border-box' }}>
          <p style={{ margin: 0, fontFamily: BODY, fontWeight: 600, fontSize: 15, color: '#D70015' }}>Satisfaction</p>
          <div style={{ marginTop: 34, fontFamily: TITLE, fontWeight: 300, fontSize: 92, lineHeight: .86, letterSpacing: '-.05em', color: '#D70015' }}>73%</div>
        </div>
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
        { rootMargin: '-28% 0px -28% 0px', threshold: 0.05 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, []);

  return (
    <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '0 auto', padding: '220px 0 40px', display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 64, alignItems: 'start', overflow: 'visible' }} className="od-process">
      <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: '100%' }}>
        <div style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ScrollFadeIn><h2 style={{ margin: '0 0 20px', fontFamily: TITLE, fontWeight: 300, fontSize: 42, lineHeight: 1 }}>Process</h2></ScrollFadeIn>
        {process.map((item, i) => (
          <div key={item.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB', padding: '9px 0' }}>
            <div style={{ fontFamily: BODY, fontWeight: active === i ? 650 : 500, fontSize: 16, color: active === i ? '#000' : GREY, transition: 'color .35s ease' }}>{item.title}</div>
            <div style={{ display: 'grid', gridTemplateRows: active === i ? '1fr' : '0fr', transition: 'grid-template-rows .45s ease' }}>
              <div style={{ overflow: 'hidden', minHeight: 0 }}>
                <p style={{ margin: active === i ? '7px 12px 2px 0' : '0 12px 0 0', opacity: active === i ? 1 : 0, transition: 'opacity .3s ease, margin .45s ease', fontFamily: BODY, fontSize: 13, lineHeight: '19px' }}>{item.body}</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {process.map((item, i) => (
          <div key={item.id} ref={(el) => { refs.current[i] = el; }} style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 40, background: SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', padding: i === 4 ? 34 : 42 }}>
            <img src={item.visual} alt={item.alt} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
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
              <p style={{ margin: '0 0 8px', fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: GREY }}>User feedback</p>
              <h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 42, lineHeight: 1.05 }}>What people were saying</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="od-tweets">
              {[
                {
                  initials: 'NW',
                  name: 'Noah Wyhof-Rudnick',
                  meta: '@rudnicknoah · Nov 30, 2018',
                  body: <>I personally like Outlook more than gmail but <mark>google drive is far more user friendly</mark> than <b>one drive</b> or dropbox and as more work becomes online <b>sharing</b> that has made them the overwhelming choice</>,
                },
                {
                  initials: 'TW',
                  name: 'Tim Wagner',
                  meta: '@prranch · Mar 27, 2018',
                  body: <>Google Apps for Business. I'm on Office 365 now, and it all feels so clunky compared to Google Apps. We still end up using Google Docs for <b>sharing</b> files because <mark>nobody really knows how to use MS "One Drive."</mark></>,
                },
                {
                  initials: 'A',
                  name: 'Abbie',
                  meta: '@AbbieReal · May 1, 2019',
                  body: <>Haha. We are baligtad. I hate file <b>sharing</b> that expires (well, this is for work anyway). Different for personal stuff. I have Google and iCloud for that. <mark>One Drive drives me nuts.</mark></>,
                },
                {
                  initials: 'LC',
                  name: 'Lino Casas III',
                  meta: '@HistoryMrCasas · Mar 6, 2019',
                  body: <>Hi! I love Google too. I love how students can share docs for projects. The other day I was <b>sharing</b> my notes to my group members on our project. I think <mark>Google products are better than Windows One Drive.</mark> I feel Windows products are way too slow.</>,
                },
              ].map((tweet) => (
                <div key={tweet.name} style={{ background: '#fff', border: '1px solid #E1E8ED', borderRadius: 18, padding: 20, minHeight: 210, boxSizing: 'border-box', boxShadow: '0 10px 26px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#D9DEE4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BODY, fontWeight: 700, fontSize: 12 }}>{tweet.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 15, lineHeight: '19px' }}>{tweet.name}</div>
                      <div style={{ fontFamily: BODY, fontSize: 13, color: '#657786', lineHeight: '18px' }}>{tweet.meta}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: '#657786', fontFamily: BODY, fontSize: 18 }}>•••</div>
                  </div>

                  <p style={{ margin: '16px 0 18px', fontFamily: BODY, fontSize: 15, lineHeight: '22px', flex: 1 }}>
                    {tweet.body}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#657786', fontFamily: BODY, fontSize: 14, paddingRight: 8 }}>
                    <span>◯</span><span>↻</span><span>♡</span><span>↗</span>
                  </div>
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

      <section style={{ width: 1120, maxWidth: 'calc(100vw - 80px)', margin: '110px auto 0' }}>
        <ScrollFadeIn>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 44px' }}>
            <WaveLabel text="DELIVERY" fontSize={16} />
            <h2 style={{ margin: '18px 0 20px', fontFamily: TITLE, fontWeight: 300, fontSize: 52, lineHeight: 1 }}>More than a dialog redesign</h2>
            <p style={{ margin: 0, fontFamily: BODY, fontSize: 18, lineHeight: '29px' }}>
              The work extended into rollout strategy, accessibility, mobile platforms, reusable components, and first-run visual design.
            </p>
          </div>
        </ScrollFadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 18 }} className="od-delivery">
          {[
            ['Incremental rollout', 'We released changes in phases and monitored telemetry to reduce risk in a high-traffic sharing surface.'],
            ['Accessibility', 'I documented keyboard order, screen-reader roles, zoom behavior, and high-contrast requirements.'],
            ['Mobile', 'I created iOS and Android specs so the same sharing model stayed coherent across platforms.'],
            ['Design system', 'Validated patterns became reusable components and guidelines for Microsoft 365 partner teams.'],
            ['Visual design', 'I also designed first-run experiences for family and group sharing.'],
          ].map(([title, body]) => (
            <ScrollFadeIn key={title}>
              <div style={{ background: SURFACE, borderRadius: 30, padding: 28, minHeight: 180, boxSizing: 'border-box' }}>
                <h3 style={{ margin: 0, fontFamily: TITLE, fontWeight: 300, fontSize: 29 }}>{title}</h3>
                <p style={{ margin: '14px 0 0', fontFamily: BODY, fontSize: 15, lineHeight: '23px' }}>{body}</p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="od-delivery">
          <div style={{ background: SURFACE, borderRadius: 34, padding: 28 }}><img src="/onedrive/mobile.svg" alt="OneDrive mobile sharing specifications" style={{ width: '100%', display: 'block' }} /></div>
          <div style={{ background: SURFACE, borderRadius: 34, padding: 28 }}><img src="/onedrive/illustrations.svg" alt="OneDrive family sharing first-run illustrations" style={{ width: '100%', display: 'block' }} /></div>
        </div>
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
        mark{background:#F2E8A2;padding:0 .08em;color:inherit}
        @media (max-width: 900px) {          .od-tweets { grid-template-columns: 1fr !important; }
          .od-copy-test, .od-delivery { grid-template-columns: 1fr !important; }
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
