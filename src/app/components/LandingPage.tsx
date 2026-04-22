import { useState, useEffect, type AnchorHTMLAttributes } from 'react';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";

const light = {
  pageBg: '#ffffff',
  cardBg: '#fafafa',
  textPrimary: '#3a3a3a',
  textMuted: '#959595',
  avatarOverlay: 'rgba(0,0,0,0.1)',
  dotBorder: '#ffffff',
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
          style={hovered ? { animation: `letterWave 0.6s ${i * 0.06}s ease-in-out infinite` } : undefined}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </a>
  );
}

export function LandingPage() {
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [olympusHovered, setOlympusHovered] = useState(false);
  const [eeroHovered, setEeroHovered] = useState(false);
  const [microsoftHovered, setMicrosoftHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Desktop: pr 24 → 8 on hover (compensates for card's 16px padding so company stays pinned)
  // Mobile: no pr
  const rowStyle = (hovered: boolean) => ({
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-between' as const,
    fontSize: 18,
    lineHeight: '26px',
    paddingRight: isMobile ? 0 : (hovered ? 8 : 24),
    transition: 'padding-right 0.25s ease',
  });

  // Desktop: title+date left, company right
  // Mobile: company left, title+date right
  const renderRowContent = (company: string, title: string, years: string) => {
    if (isMobile) {
      return (
        <>
          <span style={{ fontWeight: 500, color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>{company}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', textAlign: 'right' }}>
            <span style={{ fontWeight: 700, color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>{title}</span>
            <span style={{ fontWeight: 500, color: t.textMuted, transition: 'color 0.3s ease' }}>{years}</span>
          </div>
        </>
      );
    }
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 700, color: t.textPrimary, whiteSpace: 'nowrap', transition: 'color 0.3s ease' }}>{title}</span>
          <span style={{ fontWeight: 500, color: t.textMuted, transition: 'color 0.3s ease' }}>{years}</span>
        </div>
        <span style={{ fontWeight: 500, color: t.textPrimary, whiteSpace: 'nowrap', textAlign: 'right', transition: 'color 0.3s ease' }}>{company}</span>
      </>
    );
  };

  return (
    <div
      style={{
        backgroundColor: t.pageBg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: "'Lato', sans-serif",
        transition: 'background-color 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          paddingLeft: 16,
          paddingRight: 16,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
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
            <AnimatedLink href="mailto:hi@aleks.design" style={{ fontWeight: 500, color: t.textMuted }}>hi@aleks.design</AnimatedLink>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textPrimary, margin: 0, transition: 'color 0.3s ease' }}>
          I'm a product designer based in Seattle, WA, but living in code. I love making complex things feel simple and care deeply about craft, the details, and products with taste.
        </p>

        {/* Olympus */}
        <div onMouseEnter={() => setOlympusHovered(true)} onMouseLeave={() => setOlympusHovered(false)} style={hoverCardStyle(olympusHovered, t)}>
          <div style={rowStyle(olympusHovered)}>
            {renderRowContent('Olympus', 'Product Designer III', '2024-2026')}
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
          <div style={rowStyle(eeroHovered)}>
            {renderRowContent('Amazon', 'Sr Product Designer', '2022-2023')}
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
          <div style={rowStyle(microsoftHovered)}>
            {renderRowContent('Microsoft', 'UX Designer', '2019-2022')}
          </div>
          <div style={descriptionReveal(microsoftHovered)}>
            <p style={descriptionStyle}>
              I led design for cloud collaboration across web, desktop, and mobile, making{' '}
              <AnimatedLink href="https://support.microsoft.com/en-us/office/share-files-and-folders-in-microsoft-onedrive-9fcc2f7d-de0c-4cec-93b0-a82024800c07" target="_blank" rel="noopener noreferrer" style={linkStyle}>OneDrive</AnimatedLink>
              {' '}permissions and file-sharing workflows simpler for millions of users.
            </p>
          </div>
        </div>

        {/* UW */}
        <div style={rowStyle(false)}>
          {renderRowContent('UW', 'Bachelors in Design', '2016-2019')}
        </div>

        {/* Background */}
        <p style={{ fontWeight: 400, fontSize: 18, lineHeight: '26px', color: t.textPrimary, margin: 0, transition: 'color 0.3s ease' }}>
          My path into design wasn't traditional. I worked as an investigator, a turret machine operator, a janitor, and served in the Navy before eventually choosing what I'd always been passionate about.
        </p>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, fontSize: 18, lineHeight: '26px', fontWeight: 500 }}>
          <AnimatedLink href="https://www.instagram.com/zooruncow/" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted }}>Life</AnimatedLink>
          <AnimatedLink href="https://www.linkedin.com/in/zhurankou/" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted }}>Work</AnimatedLink>
        </div>
      </div>
    </div>
  );
}
