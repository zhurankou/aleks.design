import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { WaveLabel } from './ui/WaveLabel';

const RAW = 'https://raw.githubusercontent.com/zhurankou/portfolio/master/images';
const CSS = `
.od-root{min-height:100vh;overflow-x:hidden;background:#fff;color:#000;font-family:'Manrope',sans-serif}
.od-shell{width:min(1120px,calc(100vw - 80px));margin:0 auto}
.od-back{position:fixed;z-index:20;left:50%;top:22px;transform:translateX(-50%);padding:5px 14px;border:2px solid #000;border-radius:999px;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);color:#000;text-decoration:none;font-family:'Stack Sans Notch',sans-serif;font-size:15px;font-weight:300;box-shadow:0 6px 24px rgba(0,0,0,.08)}
.od-hero{min-height:88vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:92px 20px 72px;box-sizing:border-box}
.od-hero h1,.od-section h2,.od-card h3,.od-study h3{font-family:'Stack Sans Notch',sans-serif;font-weight:300;margin:0}
.od-hero h1{max-width:900px;margin:18px auto 22px;font-size:clamp(52px,7vw,88px);line-height:.95;letter-spacing:-.035em}
.od-hero p{max-width:760px;margin:0 auto;font-size:20px;line-height:1.55;font-weight:500}
.od-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:56px;text-align:left}
.od-meta-card,.od-card,.od-study,.od-visual,.od-impact{background:#f5f5f7;border-radius:40px}
.od-meta-card{padding:28px}
.od-eyebrow{margin:0 0 8px!important;color:#6e6e73;text-transform:uppercase;letter-spacing:.08em;font-size:12px!important;font-weight:700!important}
.od-meta-card p:last-child{margin:0;font-size:17px;line-height:1.5}
.od-section{padding:108px 0 0}
.od-section-head{max-width:860px;margin:0 auto 48px;text-align:center}
.od-section h2{font-size:clamp(42px,5vw,64px);line-height:1;letter-spacing:-.025em}
.od-section-head>p{margin:22px auto 0;max-width:760px;font-size:20px;line-height:1.6}
.od-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.od-card{min-height:280px;padding:36px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between}
.od-card h3{font-size:34px;line-height:1.05}
.od-card p{margin:20px 0 0;font-size:17px;line-height:1.55}
.od-problems{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:24px}
.od-problem{border-radius:24px;padding:28px 24px;background:#fff;border:1px solid #e7e7ea;font-size:17px;line-height:1.35;font-weight:600}
.od-visual{margin:24px 0 0;padding:36px;box-sizing:border-box;overflow:hidden}
.od-visual img{display:block;width:100%;max-height:720px;border-radius:18px;object-fit:contain}
.od-visual figcaption{margin-top:20px;color:#6e6e73;text-align:center;font-size:14px}
.od-step{display:grid;grid-template-columns:360px 1fr;gap:56px;align-items:start;padding:88px 0 0}
.od-step-copy{position:sticky;top:110px}
.od-step-copy h3{font-family:'Stack Sans Notch',sans-serif;font-size:38px;line-height:1.05;font-weight:300;margin:10px 0 18px}
.od-step-copy p{font-size:17px;line-height:1.6;margin:0}
.od-study{margin-top:24px;padding:40px}
.od-study h3{font-size:32px;margin-bottom:28px}
.od-study-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.od-study-grid p{margin:8px 0;font-size:15px;line-height:1.5}
.od-impact{padding:48px;margin-top:32px}
.od-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.od-metric{padding:28px;border-radius:28px;background:#fff;min-height:150px;box-sizing:border-box}
.od-metric>div{font-family:'Stack Sans Notch',sans-serif;font-size:48px;line-height:1;font-weight:300;color:#0078d4}
.od-metric p{margin:16px 0 0;font-size:15px;line-height:1.4}
.od-extra{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:28px}
.od-extra>div{padding:24px;border:1px solid #e7e7ea;border-radius:24px}
.od-extra h4{margin:0 0 8px;font-size:17px}
.od-extra p{margin:0;color:#6e6e73;font-size:14px;line-height:1.45}
.od-end{text-align:center;padding:140px 20px 120px}
.od-end h2{font-family:'Stack Sans Notch',sans-serif;font-size:clamp(48px,7vw,82px);font-weight:300;margin:20px 0 28px;line-height:.98}
.od-end p{max-width:700px;margin:0 auto 32px;font-size:18px;line-height:1.6}
.od-home-link{display:inline-block;border:2px solid #000;border-radius:999px;padding:9px 18px;color:#000;text-decoration:none;font-family:'Stack Sans Notch',sans-serif;font-size:16px}
.od-blue{color:#0078d4}
@media(max-width:820px){.od-shell{width:min(100% - 40px,680px)}.od-hero{min-height:auto;padding-top:120px}.od-hero h1{font-size:clamp(44px,13vw,64px)}.od-hero p,.od-section-head>p{font-size:17px}.od-meta,.od-grid-2,.od-study-grid{grid-template-columns:1fr}.od-problems{grid-template-columns:1fr 1fr}.od-step{grid-template-columns:1fr;gap:24px;padding-top:72px}.od-step-copy{position:static}.od-section{padding-top:88px}.od-visual{padding:18px;border-radius:28px}.od-study,.od-impact{padding:28px;border-radius:28px}.od-metrics,.od-extra{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.od-problems,.od-metrics,.od-extra{grid-template-columns:1fr}.od-meta-card,.od-card{border-radius:28px}.od-section h2{font-size:42px}.od-step-copy h3{font-size:34px}.od-impact{padding:20px}}
`;

function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const ref=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)setVisible(true)},{threshold:.12});io.observe(el);return()=>io.disconnect()},[]);
  return <div ref={ref} style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(24px)',transition:'opacity .7s ease '+delay+'ms, transform .7s cubic-bezier(.22,1,.36,1) '+delay+'ms'}}>{children}</div>;
}

function CaseImage({src,alt,caption}:{src:string;alt:string;caption?:string}){
  return <Reveal><figure className="od-visual"><img src={src} alt={alt}/>{caption?<figcaption>{caption}</figcaption>:null}</figure></Reveal>;
}

function StudyCard({title,settings,results}:{title:string;settings:string[];results:string[]}){
  return <Reveal><div className="od-study"><h3>{title}</h3><div className="od-study-grid"><div><p className="od-eyebrow">Settings</p>{settings.map(item=><p key={item}>{item}</p>)}</div><div><p className="od-eyebrow">Results</p>{results.map(item=><p key={item}>{item}</p>)}</div></div></div></Reveal>;
}

function Metric({value,label}:{value:string;label:string}){
  return <div className="od-metric"><div>{value}</div><p>{label}</p></div>;
}

export function OneDrivePage(){
  return <main className="od-root">
    <style>{CSS}</style>
    <Link to="/" className="od-back">← Home</Link>

    <section className="od-hero"><div className="od-shell">
      <WaveLabel text="CASE STUDY" fontSize={16}/>
      <h1>OneDrive <span className="od-blue">Sharing Experience</span></h1>
      <p>Redesigning a powerful Microsoft 365 sharing system so people could make complex permission decisions with more clarity and confidence.</p>
      <div className="od-meta">
        <div className="od-meta-card"><p className="od-eyebrow">Role</p><p>UX/UI Designer, OneDrive<br/>Web + mobile</p></div>
        <div className="od-meta-card"><p className="od-eyebrow">Scope</p><p>Core Microsoft 365 sharing journey across 40+ product entry points.</p></div>
        <div className="od-meta-card"><p className="od-eyebrow">Collaboration</p><p>Office designers, Product, UX Research, Engineering, and partner teams.</p></div>
      </div>
    </div></section>

    <div className="od-shell">
      <section className="od-section">
        <Reveal><div className="od-section-head"><WaveLabel text="PROBLEM" fontSize={16}/><h2>A successful flow that still felt difficult</h2><p>People could complete sharing tasks, but satisfaction lagged behind. The experience had grown powerful—and fragmented—across Microsoft 365.</p></div></Reveal>
        <div className="od-grid-2">
          <Reveal><div className="od-card"><div><p className="od-eyebrow">Benchmark signal</p><h3>89% completion.<br/><span className="od-blue">73% satisfaction.</span></h3></div><p>OneDrive outperformed comparison products on task completion, while users rated the overall experience lower.</p></div></Reveal>
          <Reveal delay={100}><div className="od-card"><div><p className="od-eyebrow">Customer job</p><h3>Share with the right people and permissions.</h3></div><p>Without losing control of who already has access.</p></div></Reveal>
        </div>
        <div className="od-problems">{['Inconsistent experiences','Confusing link types','Hidden controls','Hard-to-find access management'].map((item,i)=><Reveal key={item} delay={i*70}><div className="od-problem">{item}</div></Reveal>)}</div>
        <CaseImage src={RAW+'/sharing/sharing1.png'} alt="OneDrive sharing benchmark and early sharing experience" caption="The redesign started with a benchmark signal and a detailed review of the existing sharing experience."/>
      </section>

      <section className="od-section">
        <Reveal><div className="od-section-head"><WaveLabel text="APPROACH" fontSize={16}/><h2>Reduce the number of decisions people make at once</h2><p>I worked with Microsoft 365 partner teams to move sharing from a dense, all-in-one dialog toward a progressive flow: choose what to do first, then configure access only when needed.</p></div></Reveal>
        <div className="od-step">
          <div className="od-step-copy"><p className="od-eyebrow">01 · Align the model</p><h3>One experience, flexible across products</h3><p>We compared unified and separated sharing models, balancing a simpler mental model with the different entry points and constraints across OneDrive and Office.</p></div>
          <div>
            <CaseImage src={RAW+'/sharing/sharing8.png'} alt="Exploration of the OneDrive sharing flow" caption="A separated Share menu kept the first decision simple, while the dialog handled the deeper task."/>
            <CaseImage src={RAW+'/sharing/sharing10.png'} alt="OneDrive sharing dialog with clearer role selection" caption="The redesigned dialog surfaced important controls and created a more consistent hierarchy."/>
          </div>
        </div>
        <StudyCard title="Share dialog usability study" settings={['1:1 moderated remote sessions via Flash Feedback','40 minutes','Figma click-through prototype','Office 365 and GSuite users']} results={['All participants completed the given tasks','Participants understood “Email link”','All participants discovered Share','Email link and Copy link were intuitive']}/>
      </section>

      <section className="od-section">
        <div className="od-step">
          <div className="od-step-copy"><p className="od-eyebrow">02 · Clarify settings</p><h3>Make audience and permissions easier to understand</h3><p>“Link settings” mixed audience, editing rights, and security controls. We simplified names, added clearer descriptions, and made permission controls more consistent.</p></div>
          <div>
            <CaseImage src={RAW+'/link-settings/link-settings19.png'} alt="Original OneDrive Link settings dialog" caption="The original settings required users to interpret several similar audience options."/>
            <CaseImage src={RAW+'/link-settings/link-settings13.png'} alt="Redesigned OneDrive sharing settings dialog" caption="We reframed the experience around Sharing settings and clearer audience choices."/>
            <CaseImage src={RAW+'/link-settings/link-settings16.png'} alt="Refined OneDrive sharing settings" caption="Later iterations surfaced descriptions and clarified the selected audience."/>
          </div>
        </div>
        <StudyCard title="Link settings usability study" settings={['Unmoderated remote sessions via UserTesting','12 participants','Figma click-through prototype','OneDrive and Google Drive users']} results={['External sharing was easy and seamless','“People with access” needed clarification','Descriptions were useful but not obvious enough','Block download wording needed improvement']}/>
      </section>

      <section className="od-section">
        <div className="od-step">
          <div className="od-step-copy"><p className="od-eyebrow">03 · Manage existing access</p><h3>Make a buried task visible</h3><p>Manage Access lived behind overflow menus and the details pane. We explored putting existing access directly into Share, but live face-piles in the menu were not technically feasible.</p></div>
          <div>
            <CaseImage src={RAW+'/manage-access/manage-access4.png'} alt="Original hidden Manage Access entry point" caption="The original entry point was easy to miss."/>
            <CaseImage src={RAW+'/manage-access/manage-access6.png'} alt="Manage Access exploration with new entry points" caption="We explored showing access context directly in the sharing experience."/>
            <CaseImage src={RAW+'/manage-access/manage-access7.png'} alt="Manage Access final design" caption="The technically constrained concept became a simple, explicit Manage Access entry point."/>
          </div>
        </div>
        <StudyCard title="“Shared with” usability study" settings={['1:1 moderated remote sessions','60 minutes','Figma click-through prototype','Sharing-savvy and sharing-unfamiliar users']} results={['All participants understood the intent of face-piles','Existing access was clear and useful','Participants said the context would support faster sharing decisions']}/>
      </section>

      <section className="od-section">
        <Reveal><div className="od-section-head"><WaveLabel text="DELIVERY" fontSize={16}/><h2>Roll out carefully, then scale the pattern</h2><p>Sharing is a high-traffic experience, so we released changes in stages, watched telemetry, and documented the system for accessibility, mobile platforms, and partner teams.</p></div></Reveal>
        <CaseImage src={RAW+'/sharing/sharing20.png'} alt="Incremental OneDrive sharing rollout" caption="Incremental rollout let the team learn from production behavior while reducing risk."/>
        <div className="od-extra">
          <Reveal><div><h4>Accessibility</h4><p>Keyboard, screen reader, zoom, and high-contrast requirements.</p></div></Reveal>
          <Reveal delay={70}><div><h4>Mobile</h4><p>Design specifications for iOS and Android sharing flows.</p></div></Reveal>
          <Reveal delay={140}><div><h4>Design system</h4><p>Reusable components and guidelines for Microsoft 365 partner teams.</p></div></Reveal>
          <Reveal delay={210}><div><h4>Visual design</h4><p>First-run experiences for family and group sharing.</p></div></Reveal>
        </div>
        <CaseImage src={RAW+'/illustrations/illustrations3.png'} alt="OneDrive first-run sharing illustration" caption="The broader sharing work also included first-run visual experiences for new sharing features."/>
      </section>

      <section className="od-section">
        <Reveal><div className="od-section-head"><WaveLabel text="OUTCOME" fontSize={16}/><h2>Clearer sharing at Microsoft 365 scale</h2><p>The redesign connected a simpler sharing model, clearer permissions, better access management, and a system that partner teams could adopt.</p></div></Reveal>
        <Reveal><div className="od-impact"><div className="od-metrics"><Metric value="+34%" label="Completed sharing actions"/><Metric value="+3.9%" label="Permission changes"/><Metric value="+27%" label="Copy link setting changes"/><Metric value="+64%" label="Manage Access engagement"/></div></div></Reveal>
        <CaseImage src={RAW+'/manage-access/manage-access12.png'} alt="OneDrive Manage Access redesign outcome" caption="Production telemetry showed stronger engagement with the redesigned sharing and access-management experiences."/>
      </section>
    </div>

    <section className="od-end"><WaveLabel text="THANK YOU!" fontSize={16}/><h2>Turning sharing complexity into clarity.</h2><p>The project reinforced a lesson I still use: simplify the decision in front of the user, while keeping the underlying system powerful enough to scale.</p><Link to="/" className="od-home-link">Back home</Link></section>
  </main>;
}
