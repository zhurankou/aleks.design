import React, { useState, useEffect, type AnchorHTMLAttributes } from 'react';
import { MeshBackground } from './MeshBackground';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";
import FigmaIcon from '../../assets/tool-figma-light.svg?react';
import ClaudeCodeIcon from '../../assets/tool-claudecode-light.svg?react';
import GeminiIcon from '../../assets/tool-gemini-color.svg?react';
import imgSpline from '../../assets/tool-spline-light.png';
import ChatGPTIconLight from '../../assets/tool-chatgpt-light.svg?react';
import JitterIconLight from '../../assets/tool-jitter-light.svg?react';
import CursorIconLight from '../../assets/tool-cursor-light.svg?react';
import GitHubIconLight from '../../assets/tool-github-light.svg?react';
import App8IconLight from '../../assets/tool-app8-light.svg?react';
import NotebookLMIconLight from '../../assets/tool-notebooklm-light.svg?react';
import ChatGPTIconDark from '../../assets/tool-chatgpt-dark.svg?react';
import JitterIconDark from '../../assets/tool-jitter-dark.svg?react';
import CursorIconDark from '../../assets/tool-cursor-dark.svg?react';
import GitHubIconDark from '../../assets/tool-github-dark.svg?react';
import App8IconDark from '../../assets/tool-app8-dark.svg?react';
import NotebookLMIconDark from '../../assets/tool-notebooklm-dark.svg?react';
import BananaIcon from '../../assets/tool-banana.svg?react';

const light = {
  pageBg: '#fcfcfc',
  cardBg: '#f3f3f3',
  textPrimary: '#0f0f0f',
  textMuted: '#959595',
  avatarOverlay: 'rgba(0,0,0,0.1)',
  dotBorder: '#fcfcfc',
};

const dark = {
  pageBg: '#141414',
  cardBg: '#1e1e1e',
  textPrimary: '#e0e0e0',
  textMuted: '#6b6b6b',
  avatarOverlay: 'rgba(255,255,255,0.08)',
  dotBorder: '#141414',
};

const hoverCardStyle = (hovered: boolean, t: typeof light) => ({
  marginTop: hovered ? -16 : 0,
  marginLeft: hovered ? -16 : 0,
  marginRight: hovered ? -16 : 0,
  paddingTop: hovered ? 16 : 0,
  paddingLeft: hovered ? 16 : 0,
  paddingRight: hovered ? 16 : 0,
  paddingBottom: hovered ? 16 : 0,
  borderRadius: 12,
  backgroundColor: hovered ? t.cardBg : 'transparent',
  transition: 'margin 0.25s ease, padding 0.25s ease, background-color 0.25s ease',
  cursor: 'default' as const,
});

const descriptionReveal = (hovered: boolean) => ({
  overflow: 'hidden' as const,
  maxHeight: hovered ? 200 : 0,
  opacity: hovered ? 1 : 0,
  transition: 'max-height 0.3s ease, opacity 0.25s ease',
});

function AnimatedLink({ children, style, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: string }) {
  const [hovered, setHovered] = useState(false);
  const chars = children.split('');
  return (
    <a
      style={{ textDecoration: 'none', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          style={hovered ? { animation: `letterWave 0.6s ease-in-out ${i * 0.06}s infinite backwards` } : undefined}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </a>
  );
}

export function LandingPage() {
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [olympusHovered, setOlympusHovered] = useState(false);
  const [eeroHovered, setEeroHovered] = useState(false);
  const [microsoftHovered, setMicrosoftHovered] = useState(false);
  const [seattleHovered, setSeattleHovered] = useState(false);
  const [uwHovered, setUwHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const t = isDark ? dark : light;

  const descriptionStyle = {
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '26px',
    color: t.textPrimary,
    margin: 0,
    paddingTop: 8,
  };

  const linkStyle = {
    color: t.textMuted,
    textDecoration: 'none' as const,
    transition: 'color 0.15s ease',
  };

  const rowStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  };

  const toggleStyle = {
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '26px',
    color: t.textMuted,
    width: 24,
    height: 24,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexShrink: 0,
    transition: 'color 0.3s ease',
  };

  const narrow: React.CSSProperties = {
    width: '100%',
    maxWidth: 500,
    paddingLeft: 16,
    paddingRight: 16,
    boxSizing: 'border-box',
  };

  const projectCard: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.02)',
    height: 400,
    flexShrink: 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: "'Lato', sans-serif",
        position: 'relative',
      }}
    >
      <MeshBackground isDark={isDark} />

      <div
        style={{
          width: '100%',
          maxWidth: 960,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Account */}
        <div style={narrow}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
              <img
                src={imgProfile}
                alt="Aleks"
                style={{ width: 56, height: 56, borderRadius: '50%', display: 'block', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: t.avatarOverlay, transition: 'background-color 0.3s ease' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 14,
                  height: 14,
                  backgroundColor: '#07AB57',
                  borderRadius: '50%',
                  border: `2px solid ${t.dotBorder}`,
                  animation: 'dotPulse 2s ease-in-out infinite',
                  transition: 'border-color 0.3s ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: 18, lineHeight: '26px' }}>
              <span style={{ fontWeight: 700, color: t.textPrimary, transition: 'color 0.3s ease' }}>Aleks</span>
              <AnimatedLink href="mailto:hi@aleks.design" style={{ fontWeight: 400, color: t.textMuted }}>hi@aleks.design</AnimatedLink>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={narrow}>
          <p style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textPrimary, margin: 0, transition: 'color 0.3s ease' }}>
            I'm a product designer based in Seattle, WA, but living in code. I love making complex things feel simple and care deeply about craft, the details, and products with taste.
          </p>
        </div>

        {/* Projects */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ ...projectCard, flex: '1 0 0' }} />
            <div style={{ ...projectCard, width: 240 }} />
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ ...projectCard, width: 240 }} />
            <div style={{ ...projectCard, flex: '1 0 0' }} />
          </div>
        </div>

        {/* Experience */}
        <div style={{ ...narrow, display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Olympus */}
          <div onMouseEnter={() => setOlympusHovered(true)} onMouseLeave={() => setOlympusHovered(false)} style={hoverCardStyle(olympusHovered, t)}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '26px', color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>Product Designer · Olympus</span>
                <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>2024-2026</span>
              </div>
              <div style={toggleStyle}>{olympusHovered ? '–' : '+'}</div>
            </div>
            <div style={descriptionReveal(olympusHovered)}>
              <p style={descriptionStyle}>
                I designed{' '}
                <AnimatedLink href="https://medical.olympusamerica.com/olysense" target="_blank" rel="noopener noreferrer" style={linkStyle}>OlySense</AnimatedLink>
                {' '}Insights, a clinical analytics tool, making complex healthcare workflows feel clear, scalable, and trustworthy, with a strong focus on patient safety and quality of care.
              </p>
            </div>
          </div>

          {/* Amazon / eero */}
          <div onMouseEnter={() => setEeroHovered(true)} onMouseLeave={() => setEeroHovered(false)} style={hoverCardStyle(eeroHovered, t)}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '26px', color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>Product Designer · Amazon</span>
                <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>2022-2023</span>
              </div>
              <div style={toggleStyle}>{eeroHovered ? '–' : '+'}</div>
            </div>
            <div style={descriptionReveal(eeroHovered)}>
              <p style={descriptionStyle}>
                I worked on{' '}
                <AnimatedLink href="https://eero.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>eero</AnimatedLink>
                {' '}design system across web and mobile, creating more consistent, scalable experiences, improving visual clarity through iconography.
              </p>
            </div>
          </div>

          {/* Microsoft */}
          <div onMouseEnter={() => setMicrosoftHovered(true)} onMouseLeave={() => setMicrosoftHovered(false)} style={hoverCardStyle(microsoftHovered, t)}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '26px', color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>UX Designer · Microsoft</span>
                <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>2019-2022</span>
              </div>
              <div style={toggleStyle}>{microsoftHovered ? '–' : '+'}</div>
            </div>
            <div style={descriptionReveal(microsoftHovered)}>
              <p style={descriptionStyle}>
                I led design for cloud collaboration across web, desktop, and mobile, making{' '}
                <AnimatedLink href="https://support.microsoft.com/en-us/office/share-files-and-folders-in-microsoft-onedrive-9fcc2f7d-de0c-4cec-93b0-a82024800c07" target="_blank" rel="noopener noreferrer" style={linkStyle}>OneDrive</AnimatedLink>
                {' '}permissions and file-sharing workflows simpler for millions of users.
              </p>
            </div>
          </div>

          {/* City of Seattle */}
          <div onMouseEnter={() => setSeattleHovered(true)} onMouseLeave={() => setSeattleHovered(false)} style={hoverCardStyle(seattleHovered, t)}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '26px', color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>UX Design Intern · City of Seattle</span>
                <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>2018-2019</span>
              </div>
              <div style={toggleStyle}>{seattleHovered ? '–' : '+'}</div>
            </div>
            <div style={descriptionReveal(seattleHovered)}>
              <p style={descriptionStyle}>
                I supported the design of public-sector digital services, contributing to the{' '}
                <AnimatedLink href="https://www.seattle.gov" target="_blank" rel="noopener noreferrer" style={linkStyle}>Seattle.gov</AnimatedLink>
                {' '}design system and simplifying complex workflows into accessible, user-friendly experiences.
              </p>
            </div>
          </div>

          {/* UW */}
          <div onMouseEnter={() => setUwHovered(true)} onMouseLeave={() => setUwHovered(false)} style={hoverCardStyle(uwHovered, t)}>
            <div style={rowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: '26px', color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>Bachelors in Design · UW</span>
                <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>2016-2019</span>
              </div>
              <div style={toggleStyle}>{uwHovered ? '–' : '+'}</div>
            </div>
          </div>
        </div>

        {/* Toolset */}
        <div style={{ ...narrow, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            <span style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textMuted, transition: 'color 0.3s ease' }}>Toolset</span>
            <div style={{ overflow: 'hidden', width: '100%', WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0px, black 48px, black calc(100% - 48px), transparent 100%)' }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
                {[0, 1].map(pass => (
                  <React.Fragment key={pass}>
                    {/* 1. Figma */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      <FigmaIcon width={27} height={40} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 2. Claude Code */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      <ClaudeCodeIcon width={45} height={28} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 3. ChatGPT */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      {isDark ? <ChatGPTIconDark width={50} height={50} /> : <ChatGPTIconLight width={50} height={50} />}
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 4. Jitter – full bleed */}
                    <div style={{ width: 64, height: 64, flexShrink: 0 }}>
                      {isDark ? <JitterIconDark width={64} height={64} /> : <JitterIconLight width={64} height={64} />}
                    </div>
                    {/* 5. Cursor */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      {isDark ? <CursorIconDark width={40} height={46} /> : <CursorIconLight width={40} height={46} />}
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 6. GitHub */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
                      {isDark ? <GitHubIconDark width={46} height={46} /> : <GitHubIconLight width={46} height={46} />}
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 7. Spline */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      <img src={imgSpline} alt="" style={{ width: 46, height: 46, display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 8. App8 – full bleed */}
                    <div style={{ width: 64, height: 64, flexShrink: 0 }}>
                      {isDark ? <App8IconDark width={64} height={64} /> : <App8IconLight width={64} height={64} />}
                    </div>
                    {/* 9. NotebookLM */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      {isDark ? <NotebookLMIconDark width={42} height={42} /> : <NotebookLMIconLight width={42} height={42} />}
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 10. Gemini */}
                    <div style={{ position: 'relative', width: 64, height: 64, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(234,234,234,0.1)' : 'transparent' }}>
                      <GeminiIcon width={44} height={44} />
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', boxShadow: 'inset 2px -1px 10.9px 0px rgba(0,0,0,0.15)', pointerEvents: 'none' }} />
                    </div>
                    {/* 11. Banana – full bleed */}
                    <div style={{ width: 64, height: 64, flexShrink: 0 }}>
                      <BananaIcon width={64} height={64} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background */}
        <div style={narrow}>
          <p style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textPrimary, margin: 0, transition: 'color 0.3s ease' }}>
            My path into design wasn't traditional. I worked as an investigator, a turret machine operator, a janitor, and served in the US Navy before choosing what I'd always been passionate about.
          </p>
        </div>

        {/* Footer */}
        <div style={narrow}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, lineHeight: '26px', fontWeight: 400, color: t.textMuted }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <AnimatedLink href="https://www.instagram.com/zooruncow/" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted }}>Life</AnimatedLink>
              <AnimatedLink href="https://www.linkedin.com/in/zhurankou/" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted }}>Work</AnimatedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
