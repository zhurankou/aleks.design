// Shared CSS for the mobile stacked pages (injected via <style> in each page's
// mobile root, which carries className="m-root").
//
// .m-press — touch feedback for tappable pills/links (mobile has no hover).
// The reduced-motion block collapses all CSS animations/transitions under the
// mobile root for users with "Reduce Motion" enabled (marquees, wave labels,
// entrance reveals); JS-driven content like the typing hero is left alone.
export const mobileCss = `
  .m-press { transition: transform 0.15s ease, background-color 0.2s ease; }
  .m-press:active { transform: scale(0.96); background-color: rgba(0, 0, 0, 0.06); }
  @media (prefers-reduced-motion: reduce) {
    .m-root *, .m-root *::before, .m-root *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
