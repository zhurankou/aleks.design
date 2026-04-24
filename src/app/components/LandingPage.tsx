import React, { useState, useEffect, type AnchorHTMLAttributes } from 'react';
import { MeshBackground } from './MeshBackground';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";

// Toolset imports — hidden but kept for when the section returns
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

// Suppress unused import warnings for hidden sections
void FigmaIcon, ClaudeCodeIcon, GeminiIcon, imgSpline;
void ChatGPTIconLight, JitterIconLight, CursorIconLight, GitHubIconLight, App8IconLight, NotebookLMIconLight;
void ChatGPTIconDark, JitterIconDark, CursorIconDark, GitHubIconDark, App8IconDark, NotebookLMIconDark;
void BananaIcon;

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
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </a>
  );
}

export function LandingPage() {
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

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

  const glassCard: React.CSSProperties = {
    borderRadius: 24,
    background: 'rgba(255,255,255,0.10)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.28)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
    flexShrink: 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: "'Lato', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: t.pageBg,
        transition: 'background-color 0.3s ease',
      }}
    >
      <MeshBackground isDark={isDark} />

      <div
        style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 20,
          paddingRight: 20,
          boxSizing: 'border-box' as const,
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 24,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header row: bio on left, empty on right */}
        <div style={{ display: 'flex', height: 320 }}>
          <div
            style={{
              flex: '1 0 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              justifyContent: 'center',
              paddingLeft: 14,
              paddingRight: 14,
            }}
          >
            {/* Account */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                <img
                  src={imgProfile}
                  alt="Aleks"
                  style={{ width: 56, height: 56, borderRadius: '50%', display: 'block', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    backgroundColor: t.avatarOverlay,
                    transition: 'background-color 0.3s ease',
                  }}
                />
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 20,
                  lineHeight: '22px',
                  letterSpacing: '0.2px',
                  fontWeight: 500,
                }}
              >
                <span style={{ color: t.textPrimary, transition: 'color 0.3s ease' }}>Aleks</span>
                <AnimatedLink
                  href="mailto:hi@aleks.design"
                  style={{ color: t.textMuted, fontWeight: 500 }}
                >
                  hi@aleks.design
                </AnimatedLink>
              </div>
            </div>

            {/* Bio */}
            <p
              style={{
                fontWeight: 400,
                fontSize: 18,
                lineHeight: '26px',
                color: t.textPrimary,
                margin: 0,
                transition: 'color 0.3s ease',
              }}
            >
              I'm a product designer based in Seattle, WA, but living in code. I love making complex things feel simple and care deeply about craft, the details, and products with taste.
            </p>
          </div>

          {/* Right half: empty — gradient shows through */}
          <div style={{ flex: '1 0 0', minWidth: 0 }} />
        </div>

        {/* Projects row 1: large + small */}
        <div style={{ display: 'flex', gap: 24, height: 400 }}>
          <div style={{ ...glassCard, flex: '1 0 0' }} />
          <div style={{ ...glassCard, width: 240 }} />
        </div>

        {/* Projects row 2: small + large */}
        <div style={{ display: 'flex', gap: 24, height: 400 }}>
          <div style={{ ...glassCard, width: 240 }} />
          <div style={{ ...glassCard, flex: '1 0 0' }} />
        </div>

        {/* Footer row: empty on left, story + links on right */}
        <div style={{ display: 'flex', height: 320 }}>
          {/* Left half: empty */}
          <div style={{ flex: '1 0 0', minWidth: 0 }} />

          <div
            style={{
              flex: '1 0 0',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              justifyContent: 'center',
              paddingLeft: 14,
              paddingRight: 14,
            }}
          >
            <p
              style={{
                fontWeight: 400,
                fontSize: 18,
                lineHeight: '26px',
                color: t.textPrimary,
                margin: 0,
                transition: 'color 0.3s ease',
              }}
            >
              My path into design wasn't traditional. I worked as an investigator, a turret machine operator, a janitor, and served in the US Navy before choosing what I'd always been passionate about.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontSize: 18,
                lineHeight: '22px',
                fontWeight: 400,
                letterSpacing: '0.18px',
              }}
            >
              <AnimatedLink
                href="https://www.instagram.com/zooruncow/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.textMuted }}
              >
                Life
              </AnimatedLink>
              <AnimatedLink
                href="https://www.linkedin.com/in/zhurankou/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.textMuted }}
              >
                Work
              </AnimatedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
