import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { WaveLabel } from './ui/WaveLabel';
import { ScrollFadeIn } from './ui/ScrollFadeIn';

function SectionHead({ label, title, body }: { label: string; title: string; body?: string }) {
  return (
    <ScrollFadeIn>
      <div className="od-section-head">
        <WaveLabel text={label} fontSize={16} />
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
    </ScrollFadeIn>
  );
}

function Visual({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <ScrollFadeIn>
      <figure className="od-visual">
        <img src={src} alt={alt} />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </ScrollFadeIn>
  );
}

function Chapter({
  number,
  eyebrow,
  title,
  body,
  children,
  reverse = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  body: ReactNode;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className={"od-chapter" + (reverse ? " od-reverse" : "")}>
      <ScrollFadeIn>
        <div className="od-chapter-copy">
          <span className="od-number">{number}</span>
          <p className="od-eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
          <div className="od-body">{body}</div>
        </div>
      </ScrollFadeIn>
      <div>{children}</div>
    </section>
  );
}

function Study({
  title,
  settings,
  findings,
  quote,
}: {
  title: string;
  settings: string[];
  findings: string[];
  quote?: string;
}) {
  return (
    <ScrollFadeIn>
      <div className="od-study">
        <div className="od-study-title">
          <p className="od-eyebrow">Research</p>
          <h3>{title}</h3>
        </div>
        <div className="od-study-col">
          <p className="od-small-label">Settings</p>
          {settings.map((x) => <p key={x}>{x}</p>)}
        </div>
        <div className="od-study-col">
          <p className="od-small-label">What we learned</p>
          {findings.map((x) => <p key={x}>{x}</p>)}
          {quote ? <blockquote>{quote}</blockquote> : null}
        </div>
      </div>
    </ScrollFadeIn>
  );
}

function Benchmark() {
  return (
    <section className="od-benchmark">
      <ScrollFadeIn>
        <div className="od-metric-card od-black">
          <p>Task completion</p>
          <strong>89%</strong>
          <span>OneDrive</span>
        </div>
      </ScrollFadeIn>
      <ScrollFadeIn>
        <div className="od-metric-card od-blue">
          <p>Experience satisfaction</p>
          <strong>73%</strong>
          <span>OneDrive</span>
        </div>
      </ScrollFadeIn>
      <ScrollFadeIn>
        <div className="od-benchmark-copy">
          <span className="od-gap">16 pt gap</span>
          <h3>People could finish sharing tasks, but the experience still felt difficult.</h3>
          <p>Google Drive measured 81% completion / 80% satisfaction. Box measured 74% / 79%. OneDrive stood out for the gap between functional success and satisfaction.</p>
        </div>
      </ScrollFadeIn>
    </section>
  );
}

function ComparativeTest() {
  return (
    <ScrollFadeIn>
      <div className="od-comparison">
        <div className="od-comparison-head">
          <div>
            <p className="od-eyebrow">Scaled comparative test</p>
            <h3>Copy Link: simpler vs. clearer</h3>
          </div>
          <p>60 participants · unmoderated · counterbalanced order</p>
        </div>
        <div className="od-comparison-grid">
          <div className="od-option">
            <span>A</span>
            <h4>“Copy link” text button</h4>
            <p>People did not associate Link Settings with “Copy this link.”</p>
            <ul>
              <li>“Not immediately obvious what action to take”</li>
              <li>“The blue ‘Copy this link’ needs to be distinctly separated”</li>
              <li>“Less clear”</li>
            </ul>
          </div>
          <div className="od-option od-option-good">
            <span>B</span>
            <h4>Dedicated “Copy link” section</h4>
            <p>All participants completed the tasks and found settings easier to locate.</p>
            <ul>
              <li>“Easier to find how to change Link settings for ‘Copy link’”</li>
              <li>“This separation is more clear”</li>
              <li>Trade-off: “More info made me think harder”</li>
            </ul>
          </div>
        </div>
        <div className="od-tradeoff"><b>Trade-off:</b> the clearer structure added information, but made the relationship between Copy Link and its settings understandable.</div>
      </div>
    </ScrollFadeIn>
  );
}

export function OneDrivePage() {
  const principles = [
    'Recognizable across platforms',
    'Familiar OneDrive sharing patterns',
    'Clear options and decisions',
    'Flexible across different use cases',
  ];

  return (
    <main className="od-root">
      <style>{`
        .od-root{background:#fff;color:#000;min-height:100vh;overflow-x:clip;font-family:'Manrope',sans-serif}
        .od-wrap{width:min(1120px,calc(100vw - 80px));margin:0 auto}
        .od-home{position:fixed;top:22px;left:50%;transform:translateX(-50%);z-index:50;border:2px solid #000;border-radius:999px;padding:6px 15px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);color:#000;text-decoration:none;font-family:'Stack Sans Notch',sans-serif;font-size:15px}
        .od-hero{min-height:92vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:100px 24px 70px;box-sizing:border-box}
        .od-hero h1,.od-section-head h2,.od-chapter h3,.od-study h3,.od-benchmark-copy h3,.od-comparison h3,.od-option h4{font-family:'Stack Sans Notch',sans-serif;font-weight:300}
        .od-hero h1{margin:18px auto 22px;font-size:clamp(56px,7vw,88px);line-height:.95;letter-spacing:-.035em;max-width:930px}
        .od-hero p{max-width:760px;margin:0 auto;font-size:20px;line-height:31px;font-weight:500}
        .od-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:54px;text-align:left}
        .od-meta>div{background:#F5F5F7;border-radius:30px;padding:26px}
        .od-eyebrow,.od-small-label{margin:0 0 9px;text-transform:uppercase;letter-spacing:.08em;color:#9AA1A8;font-size:12px;font-weight:700}
        .od-meta p:last-child{margin:0;font-size:16px;line-height:24px}
        .od-section{padding-top:150px}
        .od-section-head{text-align:center;max-width:900px;margin:0 auto 60px}
        .od-section-head h2{font-size:clamp(46px,5vw,64px);line-height:1;margin:18px 0 22px;letter-spacing:-.025em}
        .od-section-head>p{font-size:19px;line-height:30px;max-width:780px;margin:0 auto}
        .od-benchmark{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .od-metric-card{height:360px;border-radius:40px;padding:36px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}
        .od-metric-card p{margin:0;font-size:17px;font-weight:600}
        .od-metric-card strong{font-family:'Stack Sans Notch',sans-serif;font-weight:300;font-size:112px;line-height:.8;letter-spacing:-.06em}
        .od-metric-card span{font-size:14px}
        .od-black{background:#000;color:#fff}
        .od-blue{background:rgba(0,120,212,.12);color:#0078D4}
        .od-benchmark-copy{grid-column:1/-1;display:grid;grid-template-columns:180px 1fr 1fr;gap:28px;align-items:start;padding:44px 0}
        .od-gap{font-family:'Stack Sans Notch',sans-serif;font-size:42px;font-weight:300}
        .od-benchmark-copy h3{margin:0;font-size:34px;line-height:1.1}
        .od-benchmark-copy p{margin:0;color:#6E6E73;font-size:16px;line-height:25px}
        .od-feedback{background:#F0F1FA;border-radius:40px;padding:36px;margin-top:30px}
        .od-feedback img{display:block;width:100%;border-radius:22px}
        .od-feedback figcaption{text-align:center;color:#6E6E73;font-size:14px;margin-top:18px}
        .od-principles{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:30px}
        .od-principle{border:1px solid #E5E7EB;border-radius:28px;padding:28px;font-size:17px;line-height:24px;min-height:120px;box-sizing:border-box}
        .od-chapter{width:min(1120px,calc(100vw - 80px));margin:0 auto;padding-top:150px;display:grid;grid-template-columns:360px minmax(0,1fr);gap:70px;align-items:start}
        .od-reverse{grid-template-columns:minmax(0,1fr) 360px}
        .od-reverse>div:first-child{order:2}.od-reverse>div:last-child{order:1}
        .od-chapter-copy{padding-top:18px}
        .od-number{display:inline-block;font-family:'Stack Sans Notch',sans-serif;font-size:26px;color:#A8AFB6;margin-bottom:42px}
        .od-chapter h3{font-size:42px;line-height:1.03;margin:10px 0 20px}
        .od-body{font-size:17px;line-height:27px}
        .od-body p{margin:0 0 18px}.od-body ul{padding-left:20px;margin:18px 0}.od-body li{margin:8px 0}
        .od-trade{margin-top:24px;padding:20px 22px;border-left:4px solid #0078D4;background:rgba(0,120,212,.06);border-radius:0 18px 18px 0;font-size:15px;line-height:23px}
        .od-visual{margin:0;background:#F5F5F7;border-radius:40px;padding:38px;box-sizing:border-box;overflow:hidden}
        .od-visual img{display:block;width:100%;max-height:760px;object-fit:contain}
        .od-visual figcaption{text-align:center;color:#6E6E73;font-size:14px;margin-top:20px}
        .od-study{width:min(1120px,calc(100vw - 80px));margin:90px auto 0;background:#F5F5F7;border-radius:40px;padding:42px;display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:34px;box-sizing:border-box}
        .od-study-title h3{font-size:32px;line-height:1.08;margin:8px 0 0}
        .od-study-col p{margin:0 0 10px;font-size:15px;line-height:23px}
        .od-study blockquote{margin:18px 0 0;font-size:17px;line-height:25px;font-weight:600}
        .od-comparison{width:min(1120px,calc(100vw - 80px));margin:90px auto 0;background:#F3F3FB;border-radius:40px;padding:44px;box-sizing:border-box}
        .od-comparison-head{display:flex;justify-content:space-between;gap:40px;align-items:end}
        .od-comparison-head h3{font-size:38px;margin:8px 0 0}.od-comparison-head>p{max-width:300px;text-align:right;color:#6E6E73;font-size:14px}
        .od-comparison-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:34px}
        .od-option{background:#fff;border-radius:28px;padding:28px;border:1px solid #FFB3AA}.od-option-good{border-color:#7EDC9B}
        .od-option>span{font-family:'Stack Sans Notch',sans-serif;font-size:28px}.od-option h4{font-size:27px;margin:18px 0 12px}.od-option p,.od-option li{font-size:15px;line-height:23px}.od-option ul{padding-left:20px}
        .od-tradeoff{margin-top:20px;font-size:15px;line-height:23px}
        .od-delivery-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .od-small-card{background:#F5F5F7;border-radius:34px;padding:30px;min-height:210px;box-sizing:border-box}
        .od-small-card h4{font-family:'Stack Sans Notch',sans-serif;font-weight:300;font-size:30px;margin:0 0 14px}.od-small-card p{font-size:15px;line-height:23px;margin:0}
        .od-outcome{margin-top:60px;background:#F5F5F7;border-radius:40px;padding:46px}
        .od-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .od-metric{background:#fff;border-radius:26px;padding:26px;min-height:160px;box-sizing:border-box}
        .od-metric strong{display:block;color:#0078D4;font-family:'Stack Sans Notch',sans-serif;font-weight:300;font-size:46px;line-height:1}.od-metric p{font-size:14px;line-height:20px;margin:16px 0 0}
        .od-end{text-align:center;padding:170px 24px 120px}.od-end h2{font-family:'Stack Sans Notch',sans-serif;font-weight:300;font-size:64px;line-height:1;margin:18px auto 24px;max-width:850px}
        @media(max-width:900px){
          .od-wrap,.od-chapter,.od-study,.od-comparison{width:min(100% - 40px,680px)}
          .od-meta,.od-benchmark,.od-chapter,.od-study,.od-comparison-grid,.od-delivery-grid{grid-template-columns:1fr}
          .od-benchmark-copy{grid-template-columns:1fr;gap:12px}.od-reverse>div:first-child,.od-reverse>div:last-child{order:initial}
          .od-principles,.od-metrics{grid-template-columns:1fr 1fr}
          .od-comparison-head{display:block}.od-comparison-head>p{text-align:left}
        }
        @media(max-width:520px){.od-meta,.od-principles,.od-metrics{grid-template-columns:1fr}.od-metric-card strong{font-size:86px}}
      `}</style>

      <Link to="/" className="od-home">← Home</Link>

      <section className="od-hero">
        <div className="od-wrap">
          <WaveLabel text="CASE STUDY" fontSize={16} />
          <h1>OneDrive Sharing Experience</h1>
          <p>How might we simplify a powerful but complex sharing experience so people can share confidently and stay in control of access?</p>
          <div className="od-meta">
            <div><p className="od-eyebrow">Role</p><p>UX/UI Designer<br/>OneDrive web + mobile</p></div>
            <div><p className="od-eyebrow">Scope</p><p>Core Microsoft 365 sharing journey across 40+ product entry points.</p></div>
            <div><p className="od-eyebrow">Team</p><p>Office designers, Product, UX Research, Engineering, and partner teams.</p></div>
          </div>
        </div>
      </section>

      <section className="od-section od-wrap">
        <SectionHead label="PROBLEM" title="A successful flow that users still disliked" body="Sharing worked, but the benchmark and customer feedback showed that functionality alone was not enough." />
        <Benchmark />
        <ScrollFadeIn>
          <figure className="od-feedback">
            <img src="/onedrive/twitter-feedback.svg" alt="Twitter feedback criticizing OneDrive sharing and comparing it with Google Drive" />
            <figcaption>Public feedback reinforced the benchmark signal: people described OneDrive sharing as clunky, confusing, and less user-friendly than Google Drive.</figcaption>
          </figure>
        </ScrollFadeIn>
        <div className="od-principles">
          {principles.map((p) => <ScrollFadeIn key={p}><div className="od-principle">{p}</div></ScrollFadeIn>)}
        </div>
      </section>

      <section className="od-section od-wrap">
        <SectionHead label="ALIGNMENT" title="One redesign had to work across Microsoft 365" body="The Sharing Dialog appeared across dozens of entry points, platforms, and partner products. We aligned teams around a consistent model while leaving room for product-specific needs." />
      </section>

      <Chapter number="01" eyebrow="Exploration" title="Unified dialog or separated sharing actions?" body={<>
        <p>Office explored combining sharing actions into one dialog. OneDrive explored separating the first choice into a Share menu and moving deeper configuration into the dialog.</p>
        <p>We compared the models with partner teams instead of treating the problem as a single-screen redesign.</p>
        <div className="od-trade"><b>Trade-off:</b> the separated flow introduced an extra step, but reduced the number of decisions users had to make at once.</div>
      </>}>
        <Visual src="/onedrive/exploration.svg" alt="Unified and separated sharing model explorations" caption="Unified sharing dialog (Office) versus separated sharing actions (OneDrive)." />
      </Chapter>

      <Chapter number="02" eyebrow="Interaction model" title="One decision at a time" reverse body={<>
        <p>The new flow broke sharing into progressive decisions:</p>
        <ul><li>Choose a file</li><li>Open Share</li><li>Choose how to share</li><li>Set audience and permissions</li></ul>
        <p>This preserved OneDrive's powerful sharing model without exposing every option at once.</p>
      </>}>
        <Visual src="/onedrive/flow.svg" alt="Progressive OneDrive sharing flow" caption="A progressive flow moved users from the sharing method to permissions only when needed." />
      </Chapter>

      <Study title="Share Dialog usability study" settings={['1:1 moderated remote sessions via Flash Feedback','40-minute sessions','Figma click-through prototype','Office 365 and GSuite users']} findings={['All participants completed the tasks','All participants discovered Share','Participants understood Email link','Email link and Copy link were described as intuitive']} quote="“Sharing via Email link and Copy link was very intuitive.”" />

      <ComparativeTest />

      <Chapter number="03" eyebrow="Sharing settings" title="Clarifying audience and permissions" body={<>
        <p>Link Settings combined audience scope, editing rights, and security controls such as Block download and expiration dates. Research showed that the name itself was unclear and the audience labels were difficult to distinguish.</p>
        <p>We renamed the experience to <b>Sharing settings</b>, shortened scope names, added descriptions, brought the role selector into the flow, and designed a one-click external-sharing path.</p>
      </>}>
        <Visual src="/onedrive/permissions.svg" alt="Redesigned OneDrive Sharing settings" caption="Audience, role, and security controls were reorganized into a clearer hierarchy." />
      </Chapter>

      <Study title="Link Settings usability study" settings={['Unmoderated remote study via UserTesting','12 participants','Figma click-through prototype','OneDrive and Google Drive users']} findings={['External sharing was easy and seamless','“People with access” was still confusing','Tooltip descriptions were useful but too hidden','Block download wording needed improvement']} />

      <Chapter number="04" eyebrow="Iteration" title="Research changed what stayed on the surface" reverse body={<>
        <p>The first concept relied on info buttons for scope descriptions. Testing showed the explanations were useful, but people did not always discover them.</p>
        <p>We surfaced selected descriptions directly, refined the labels again, and made existing access easier to understand.</p>
        <div className="od-trade"><b>Decision:</b> use more visible explanatory copy where it reduced ambiguity, instead of optimizing only for visual simplicity.</div>
      </>}>
        <Visual src="/onedrive/direction.svg" alt="Refined OneDrive sharing direction" caption="The final direction surfaced critical information rather than hiding it behind secondary controls." />
      </Chapter>

      <Chapter number="05" eyebrow="Manage Access" title="A familiar pattern wasn't technically feasible" body={<>
        <p>Manage Access was buried in the overflow menu and details pane. We explored showing profiles of everyone who already had access directly in Share—the pattern users already recognized from other cloud products.</p>
        <p>An engineering wall review showed that live face-piles inside the Share menu were not feasible with the underlying sharing architecture.</p>
        <div className="od-trade"><b>Trade-off:</b> preserve discoverability and context without depending on a technically expensive live-access treatment.</div>
      </>}>
        <Visual src="/onedrive/access-constraints.svg" alt="Manage Access face-pile exploration constrained by engineering feasibility" caption="The richer face-pile concept communicated access clearly, but could not be supported in the menu." />
      </Chapter>

      <Chapter number="06" eyebrow="Design direction" title="Turn the constraint into a clear entry point" reverse body={<>
        <p>We narrowed the work to two related ideas: a direct <b>Manage Access</b> item in the Share menu, and a <b>Shared with</b> section in the dialog.</p>
        <p>The goal was simple: make access management visible and help users quickly answer who already had access.</p>
      </>}>
        <Visual src="/onedrive/access-solution.svg" alt="Manage Access and Shared with final directions" caption="A simple entry point preserved the user need while reducing implementation complexity." />
      </Chapter>

      <Study title="“Shared with” usability study" settings={['1:1 moderated remote sessions','60-minute sessions','Figma click-through prototype','Sharing-savvy and sharing-unfamiliar users']} findings={['All participants understood the intent of the face-piles','The feature made existing access clear','Participants said the context would make sharing decisions easier']} quote="“This will help me to make quick decisions [who to share with].”" />

      <section className="od-section od-wrap">
        <SectionHead label="DELIVERY" title="Ship carefully, then scale the system" body="Sharing is a high-traffic Microsoft 365 experience. We rolled changes out incrementally so we could monitor telemetry, reduce risk, and continue refining the design." />
        <Visual src="/onedrive/testing.svg" alt="OneDrive sharing flow and implementation stages" caption="Validated interaction patterns moved into staged implementation rather than a single high-risk release." />
        <div className="od-delivery-grid" style={{marginTop:20}}>
          <ScrollFadeIn><div className="od-small-card"><h4>Accessibility</h4><p>I documented keyboard order, screen-reader roles, zoom behavior, and high-contrast requirements for the sharing surface.</p></div></ScrollFadeIn>
          <ScrollFadeIn><div className="od-small-card"><h4>Mobile</h4><p>I created iOS and Android design specifications so the progressive sharing model stayed coherent across platforms.</p></div></ScrollFadeIn>
          <ScrollFadeIn><div className="od-small-card"><h4>Design system</h4><p>The validated patterns became reusable components and guidelines that partner teams could apply across Microsoft 365.</p></div></ScrollFadeIn>
          <ScrollFadeIn><div className="od-small-card"><h4>Visual design</h4><p>I also designed first-run experiences for family and group sharing and contributed to a premium OneDrive email campaign.</p></div></ScrollFadeIn>
        </div>
        <div className="od-delivery-grid" style={{marginTop:20}}>
          <Visual src="/onedrive/mobile.svg" alt="OneDrive mobile sharing design specifications" />
          <Visual src="/onedrive/illustrations.svg" alt="OneDrive family sharing first-run illustrations" />
        </div>
      </section>

      <section className="od-section od-wrap">
        <SectionHead label="OUTCOME" title="Clearer sharing at Microsoft 365 scale" body="The work connected research, technical constraints, interaction design, accessibility, and system-level rollout—not just a visual redesign of one dialog." />
        <ScrollFadeIn>
          <div className="od-outcome">
            <div className="od-metrics">
              <div className="od-metric"><strong>+34%</strong><p>Completed sharing actions</p></div>
              <div className="od-metric"><strong>+3.9%</strong><p>Permission changes</p></div>
              <div className="od-metric"><strong>+27%</strong><p>Copy Link setting changes</p></div>
              <div className="od-metric"><strong>+64%</strong><p>Manage Access engagement</p></div>
            </div>
          </div>
        </ScrollFadeIn>
      </section>

      <section className="od-end">
        <WaveLabel text="THANK YOU!" fontSize={16} />
        <h2>Make each decision simpler without making the system less powerful.</h2>
        <Link to="/" className="od-back-home">Back home</Link>
      </section>
      <style>{`.od-back-home{display:inline-block;border:2px solid #000;border-radius:999px;padding:8px 18px;color:#000;text-decoration:none;font-family:'Stack Sans Notch',sans-serif;font-size:16px}`}</style>
    </main>
  );
}
