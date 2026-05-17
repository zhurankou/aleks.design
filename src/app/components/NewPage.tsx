import { useState, useEffect, useRef, memo } from 'react';
import imgProfile from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";
import { PrivatHomeView } from './privat/PrivatHomeView';
import { AnimatedCursor, type CursorPhase } from './privat/AnimatedCursor';
import { BaseIconsCanvas } from './BaseIconsCanvas';
import FigmaLogo from '../../assets/tool-figma.svg?react';

// Module-load timestamp — used as the swing's reference t=0. SVG3D's internal
// elapsed clock starts when each canvas first renders (close to module load),
// so this approximates the swing's actual phase well enough to align direction.
const APP_START_TIME = performance.now();
const SWING_SPEED = 0.75;     // must match the animateSpeed prop on SVG3D
const SWING_OMEGA = 1.5;      // matches the constant inside 3dsvg's swing formula

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(hex1: string, hex2: string, t: number) {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const [r, g, b] = [0, 1, 2].map(i => Math.round(lerp(p(hex1, i), p(hex2, i), t)));
  return `rgb(${r},${g},${b})`;
}

// Hex-format lerp — needed for paletteFromColor (darkenHex expects #rrggbb).
function lerpHex(hex1: string, hex2: string, t: number) {
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const ch = (i: number) => Math.round(lerp(p(hex1, i), p(hex2, i), t)).toString(16).padStart(2, '0');
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

// HSL-space lerp — routes hue along the shortest path around the colour wheel
// so intermediates stay vibrant (yellow → orange → red → magenta → blue) instead
// of muddying through grey RGB midpoints.
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0; let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s, l];
}
function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0; let g1 = 0; let b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  const ch = (v: number) => Math.round(Math.max(0, Math.min(255, (v + m) * 255))).toString(16).padStart(2, '0');
  return `#${ch(r1)}${ch(g1)}${ch(b1)}`;
}
function lerpHsl(from: string, to: string, t: number): string {
  const [h1, s1, l1] = hexToHsl(from);
  const [h2, s2, l2] = hexToHsl(to);
  let dh = h2 - h1;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return hslToHex(h1 + dh * t, lerp(s1, s2, t), lerp(l1, l2, t));
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

const homeLoadAnim = `
  @keyframes home-load {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes panel-load {
    from { opacity: 0; transform: translateY(-50%) scale(0.9); }
    to   { opacity: 1; transform: translateY(-50%) scale(1); }
  }
  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes arrow-nudge-diag {
    0%, 100% { transform: translate(0, 0); }
    50%       { transform: translate(2px, -2px); }
  }
  @keyframes arrow-nudge-right {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(3px); }
  }
  /* SELECTED WORK letter wave — pulses each letter from the silver frame-stroke
     colour to a darker slate grey and back, with a per-letter stagger to make
     the colour shift sweep across the word. */
  @keyframes selected-wave {
    0%, 100% { color: #A8AFB6; }
    50%       { color: #5A626B; }
  }
`;

const NAME = 'Aleks Zhurankou';
// avatar1: plays while the name types in. avatar2: plays while the name deletes.
const AVATAR_VIDEOS = ['/avatar1.mp4', '/avatar2.mp4'];
const PAUSE_MS = 1000; // beat held after each full type / delete pass

// Background typography layer on home — words ticker upward. Sourced from
// Figma node 15606:828; font is Stack Sans Notch Bold, transparent fill +
// thin stroke.
const BG_WORDS = ['THINK', 'DISCOVER', 'DEFINE', 'SKETCH', 'SIMPLIFY', 'DESIGN', 'ITERATE', 'POLISH', 'BUILD', 'LAUNCH', 'TEST', 'ITERATE', 'ITERATE', 'ITERATE', 'GOSLEEP', 'GETUP'];
const BG_GAP = 16; // px gap between words
const BG_PAD = 8; // px top + bottom inset so words don't touch viewport edges
const BG_CYCLE_MS = 2500; // one cycle = slide + hold
const BG_TILT = 20; // deg — V-shape: top slot at -BG_TILT°, bottom slot at +BG_TILT°
const TEXT_SPAN_MS = 900; // the name types / deletes over this window at the start of each video, then holds

// 16 base-view icons in grid order (top-left → bottom-right, row by row):
// 1: cloud.sunny, 2: cloud.drizzle, 3: cloud.thunder, 4: cloud.rain
// 5: leaf,        6: tree.evergreen, 7: flower,        8: tree
// 9: car,        10: template (airplane), 11: business, 12: bed
// 13: fire,      14: compass,      15: location,    16: globe
const ICONS_16: string[] = [
  // 1: cloud.sunny
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.366 3.93767C20.6422 3.45937 20.4783 2.84778 20 2.57164C19.5217 2.2955 18.9101 2.45937 18.634 2.93767L18.134 3.80369C17.8578 4.28198 18.0217 4.89358 18.5 5.16972C18.9783 5.44586 19.5899 5.28199 19.866 4.80369L20.366 3.93767Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M22.5 15.9999C22.5 13.8758 21.3963 12.0095 19.7311 10.9433C20.4331 9.13513 19.7319 7.03562 18 6.0357C16.1888 4.99004 13.8999 5.52171 12.7238 7.20449C11.498 6.44095 10.0505 5.99986 8.5 5.99986C4.08172 5.99986 0.5 9.58159 0.5 13.9999C0.5 18.4181 4.08172 21.9999 8.5 21.9999H16.5C19.8137 21.9999 22.5 19.3136 22.5 15.9999ZM17 7.76775C17.8467 8.25662 18.2008 9.27118 17.8878 10.1612C17.4424 10.0557 16.9777 9.99986 16.5 9.99986C16.152 9.99986 15.8109 10.0295 15.4791 10.0864C15.1488 9.49857 14.7463 8.95672 14.2838 8.47283C14.8433 7.53709 16.0524 7.22069 17 7.76775ZM14.4266 12.296L13.7355 11.0662C12.7047 9.23186 10.7449 7.99986 8.5 7.99986C5.18629 7.99986 2.5 10.6862 2.5 13.9999C2.5 17.3136 5.18629 19.9999 8.5 19.9999H16.5C18.7091 19.9999 20.5 18.209 20.5 15.9999C20.5 13.7907 18.7091 11.9999 16.5 11.9999C16.2657 11.9999 16.0376 12.0198 15.817 12.0576L14.4266 12.296Z" fill="black"/><path d="M24.0001 9.49986C24.0001 10.0521 23.5523 10.4999 23.0001 10.4999H22.0001C21.4478 10.4999 21.0001 10.0521 21.0001 9.49986C21.0001 8.94758 21.4478 8.49986 22.0001 8.49986H23.0001C23.5523 8.49986 24.0001 8.94758 24.0001 9.49986Z" fill="black"/><path d="M12.134 4.80376C12.4102 5.28205 13.0218 5.44593 13.5001 5.16979C13.9784 4.89364 14.1422 4.28205 13.8661 3.80376L13.3661 2.93774C13.0899 2.45944 12.4784 2.29557 12.0001 2.57171C11.5218 2.84785 11.3579 3.45944 11.634 3.93774L12.134 4.80376Z" fill="black"/></svg>`,
  // 2: cloud.drizzle (cloud + dashes + dots)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.9791 6.08651C14.6086 3.64768 11.9967 2 9 2C4.58172 2 1 5.58172 1 10C1 10.0073 1.00001 10.0147 1.00003 10.022C1.00541 12.0172 1.74113 13.8406 2.95394 15.239C3.30118 15.6394 3.90981 15.6215 4.28456 15.2467C4.62884 14.9024 4.65986 14.3742 4.44185 13.9486C4.42233 13.9105 4.40081 13.8732 4.37733 13.8369C4.35718 13.8058 4.33558 13.7754 4.31258 13.7459C4.30991 13.7425 4.30723 13.7391 4.30453 13.7357C3.48798 12.7107 3 11.4123 3 10C3 6.68629 5.68629 4 9 4C11.2449 4 13.2047 5.23199 14.2355 7.06631L14.9266 8.2961L16.317 8.05776C16.5376 8.01993 16.7657 8 17 8C19.2091 8 21 9.79086 21 12C21 13.0342 20.6075 13.9767 19.9634 14.6867C19.9611 14.6893 19.9587 14.6919 19.9563 14.6946C19.9188 14.7366 19.8838 14.7809 19.8516 14.827C19.8163 14.8774 19.7843 14.93 19.7557 14.9843C19.5212 15.43 19.5214 15.9862 19.8792 16.3441C20.2074 16.6722 20.7301 16.7226 21.071 16.4077C22.2119 15.3534 22.9426 13.8618 22.9967 12.199C22.9989 12.1329 23 12.0666 23 12C23 8.68629 20.3137 6 17 6C16.652 6 16.3109 6.02963 15.9791 6.08651Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 15C12.5523 15 13 15.4477 13 16V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V16C11 15.4477 11.4477 15 12 15Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 13C8.55228 13 9 13.4477 9 14V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V14C7 13.4477 7.44772 13 8 13Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 13C16.5523 13 17 13.4477 17 14V15C17 15.5523 16.5523 16 16 16C15.4477 16 15 15.5523 15 15V14C15 13.4477 15.4477 13 16 13Z" fill="black"/><path d="M13.5 21.5C13.5 22.3284 12.8284 23 12 23C11.1716 23 10.5 22.3284 10.5 21.5C10.5 20.6716 11.1716 20 12 20C12.8284 20 13.5 20.6716 13.5 21.5Z" fill="black"/><path d="M17.5 19.5C17.5 20.3284 16.8284 21 16 21C15.1716 21 14.5 20.3284 14.5 19.5C14.5 18.6716 15.1716 18 16 18C16.8284 18 17.5 18.6716 17.5 19.5Z" fill="black"/><path d="M9.5 19.5C9.5 20.3284 8.82843 21 8 21C7.17157 21 6.5 20.3284 6.5 19.5C6.5 18.6716 7.17157 18 8 18C8.82843 18 9.5 18.6716 9.5 19.5Z" fill="black"/></svg>`,
  // 3: cloud.thunder (cloud + lightning bolt)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.9791 6.38339C14.6086 3.94455 11.9967 2.29688 9 2.29688C4.58172 2.29688 1 5.8786 1 10.2969C1 10.3042 1.00001 10.3116 1.00003 10.3189C1.00541 12.314 1.74113 14.1375 2.95394 15.5359C3.30118 15.9363 3.90981 15.9183 4.28456 15.5436C4.62884 15.1993 4.65986 14.6711 4.44185 14.2455C4.42233 14.2073 4.40081 14.17 4.37733 14.1338C4.35718 14.1026 4.33558 14.0723 4.31258 14.0428C4.30991 14.0394 4.30723 14.0359 4.30453 14.0326C3.48798 13.0076 3 11.7092 3 10.2969C3 6.98317 5.68629 4.29688 9 4.29688C11.2449 4.29688 13.2047 5.52887 14.2355 7.36318L14.9266 8.59297L16.317 8.35463C16.5376 8.31681 16.7657 8.29688 17 8.29688C19.2091 8.29688 21 10.0877 21 12.2969C21 13.331 20.6075 14.2735 19.9634 14.9836C19.9611 14.9862 19.9587 14.9888 19.9563 14.9915C19.9188 15.0335 19.8838 15.0777 19.8516 15.1238C19.8163 15.1743 19.7843 15.2269 19.7557 15.2812C19.5212 15.7269 19.5214 16.2831 19.8792 16.6409C20.2074 16.9691 20.7301 17.0195 21.071 16.7045C22.2119 15.6503 22.9426 14.1586 22.9967 12.4959C22.9989 12.4298 23 12.3635 23 12.2969C23 8.98317 20.3137 6.29688 17 6.29688C16.652 6.29688 16.3109 6.32651 15.9791 6.38339Z" fill="black"/><path d="M12.8016 15.9612V12.3755C12.8016 11.8858 12.1705 11.688 11.891 12.0901L8.55422 16.8901C8.32375 17.2216 8.561 17.6755 8.96477 17.6755H11.2016V21.2031C11.2016 21.6911 11.8291 21.89 12.1103 21.4912L15.4527 16.7493C15.6862 16.4181 15.4493 15.9612 15.0441 15.9612H12.8016Z" fill="black"/></svg>`,
  // 4: cloud.rain (cloud + 3 long vertical dashes)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.9791 6.08651C14.6086 3.64768 11.9967 2 9 2C4.58172 2 1 5.58172 1 10C1 10.0073 1.00001 10.0147 1.00003 10.022C1.00541 12.0172 1.74113 13.8406 2.95394 15.239C3.30118 15.6394 3.90981 15.6215 4.28456 15.2467C4.62884 14.9024 4.65986 14.3742 4.44185 13.9486C4.42233 13.9105 4.40081 13.8732 4.37733 13.8369C4.35718 13.8058 4.33558 13.7754 4.31258 13.7459C4.30991 13.7425 4.30723 13.7391 4.30453 13.7357C3.48798 12.7107 3 11.4123 3 10C3 6.68629 5.68629 4 9 4C11.2449 4 13.2047 5.23199 14.2355 7.06631L14.9266 8.2961L16.317 8.05776C16.5376 8.01993 16.7657 8 17 8C19.2091 8 21 9.79086 21 12C21 13.0342 20.6075 13.9767 19.9634 14.6867C19.9611 14.6893 19.9587 14.6919 19.9563 14.6946C19.9188 14.7366 19.8838 14.7809 19.8516 14.827C19.8163 14.8774 19.7843 14.93 19.7557 14.9843C19.5212 15.43 19.5214 15.9862 19.8792 16.3441C20.2074 16.6722 20.7301 16.7226 21.071 16.4077C22.2119 15.3534 22.9426 13.8618 22.9967 12.199C22.9989 12.1329 23 12.0666 23 12C23 8.68629 20.3137 6 17 6C16.652 6 16.3109 6.02963 15.9791 6.08651Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 15C12.5523 15 13 15.4477 13 16V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V16C11 15.4477 11.4477 15 12 15Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8 13C8.55228 13 9 13.4477 9 14V20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20V14C7 13.4477 7.44772 13 8 13Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 13C16.5523 13 17 13.4477 17 14V20C17 20.5523 16.5523 21 16 21C15.4477 21 15 20.5523 15 20V14C15 13.4477 15.4477 13 16 13Z" fill="black"/></svg>`,
  // 5: leaf
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.72525 19.6157C4.98877 18.3974 3.68734 16.5678 3.19085 14.3458C2.67344 12.0301 3.13126 9.72063 4.28803 7.83326C5.6058 5.68322 7.88934 4.35928 10.292 3.5321C12.7089 2.70001 15.3775 2.32498 17.6478 2.16194C19.3149 2.04222 20.6852 3.34434 20.7517 4.96727C20.8086 6.35346 20.8778 8.35946 20.9137 10.5932C20.9591 13.4247 20.3829 15.8104 19.184 17.619C17.9737 19.4447 16.1797 20.603 13.9652 21.042C12.1093 21.4541 10.2568 21.276 8.61573 20.6311C8.56344 21.13 8.52716 21.629 8.5025 22.1278C8.47523 22.6794 8.00595 23.1045 7.45434 23.0772C6.90273 23.0499 6.47767 22.5806 6.50494 22.029C6.54438 21.2314 6.61257 20.4258 6.72525 19.6157ZM5.99324 8.87838C6.96352 7.29528 8.74196 6.18095 10.943 5.42317C13.1298 4.67031 15.6065 4.31369 17.7911 4.1568C18.2858 4.12128 18.7311 4.50665 18.7534 5.04921C18.8098 6.42385 18.8784 8.41257 18.9139 10.6253C18.955 13.1853 18.4293 15.1378 17.517 16.5139C16.6184 17.8695 15.2965 18.7415 13.5664 19.0821L13.554 19.0846L13.5415 19.0874C11.9168 19.4504 10.3077 19.2378 8.93041 18.591C9.56102 15.5792 10.9983 12.595 14.2181 9.73413C14.6309 9.36729 14.6682 8.73523 14.3014 8.32237C13.9346 7.90952 13.3025 7.87221 12.8896 8.23905C9.56387 11.1941 7.93739 14.3069 7.15474 17.3972C6.1727 16.4896 5.45212 15.2944 5.14272 13.9096C4.74443 12.1271 5.09367 10.3461 5.99324 8.87838Z" fill="black"/></svg>`,
  // 6: tree.evergreen
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.8 12.4013L12.8 3.06797C12.4 2.53464 11.6 2.53464 11.2 3.06797L4.19998 12.4013C3.70555 13.0605 4.17593 14.0013 4.99998 14.0013H5.57141L3.12944 17.4201C2.65667 18.0819 3.1298 19.0013 3.94317 19.0013H11V21.001C11 21.5533 11.4477 22.001 12 22.001C12.5523 22.001 13 21.5533 13 21.001V19.0013H20.0568C20.8702 19.0013 21.3433 18.0819 20.8705 17.4201L18.4286 14.0013H19C19.824 14.0013 20.2944 13.0605 19.8 12.4013ZM13 17.0013H18.1136L14.5422 12.0013H17L12 5.33464L6.99998 12.0013H9.45779L5.88636 17.0013H11V15.001C11 14.4487 11.4477 14.001 12 14.001C12.5523 14.001 13 14.4487 13 15.001V17.0013Z" fill="black"/></svg>`,
  // 7: flower
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.0837 16.7701C19.0526 16.8459 17.9788 17.1104 17.1776 17.7175C16.3763 18.3246 15.8312 19.2868 15.4793 20.259C16.5104 20.1832 17.5842 19.9187 18.3854 19.3116C19.1866 18.7045 19.7318 17.7422 20.0837 16.7701ZM22.2213 16.6458C22.495 15.6638 21.801 14.748 20.7816 14.7458C19.3993 14.7429 17.4722 14.9849 15.9697 16.1234C14.4671 17.262 13.7128 19.0517 13.3417 20.3833C13.068 21.3653 13.762 22.2811 14.7814 22.2832C16.1637 22.2862 18.0908 22.0442 19.5933 20.9056C21.0959 19.7671 21.8502 17.9773 22.2213 16.6458Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.29134 16.7701C5.32244 16.8459 6.39628 17.1104 7.19748 17.7175C7.99869 18.3246 8.54383 19.2868 8.89575 20.259C7.86465 20.1832 6.79082 19.9187 5.98961 19.3116C5.1884 18.7045 4.64326 17.7422 4.29134 16.7701ZM2.15377 16.6458C1.88007 15.6638 2.57402 14.748 3.59344 14.7458C4.97573 14.7429 6.90282 14.9849 8.40536 16.1234C9.9079 17.262 10.6622 19.0517 11.0333 20.3833C11.307 21.3653 10.6131 22.2811 9.59365 22.2832C8.21136 22.2862 6.28427 22.0442 4.78173 20.9056C3.27919 19.7671 2.52488 17.9773 2.15377 16.6458Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0535 4C11.3767 4 10.8022 4.44895 10.6165 5.0675L10.34 5.98837L9.40894 5.74822C8.77242 5.58403 8.08019 5.85624 7.73643 6.45164C7.39808 7.03768 7.49959 7.75962 7.94234 8.22976L8.60148 8.92967L7.92802 9.61582C7.46754 10.085 7.35715 10.8206 7.70091 11.416C8.03927 12.002 8.71527 12.2751 9.34379 12.1267L10.2794 11.9058L10.537 12.8321C10.7131 13.4654 11.2949 13.9287 11.9824 13.9287C12.6591 13.9287 13.2335 13.4799 13.4193 12.8615L13.696 11.9408L14.6268 12.1809C15.2634 12.3451 15.9556 12.0729 16.2994 11.4775C16.6378 10.8915 16.5363 10.1695 16.0935 9.69939L15.4344 8.99948L16.1078 8.31333C16.5683 7.84418 16.6787 7.10857 16.3349 6.51316C15.9966 5.92713 15.3206 5.65407 14.6921 5.80241L13.7564 6.02327L13.4989 5.09689C13.3229 4.46346 12.741 4 12.0535 4ZM9.05067 3.70135C9.66212 2.68255 10.7772 2 12.0535 2C13.3553 2 14.4896 2.71022 15.0926 3.76336C16.2805 3.78362 17.4289 4.40804 18.067 5.51316C18.7179 6.64053 18.67 7.97786 18.0596 9.02659C18.636 10.0655 18.6695 11.3724 18.0315 12.4775C17.3806 13.6049 16.1984 14.2321 14.9849 14.2278C14.3734 15.2464 13.2584 15.9287 11.9824 15.9287C10.6807 15.9287 9.54657 15.2187 8.94353 14.1658C7.75555 14.1456 6.60695 13.5212 5.96886 12.416C5.31797 11.2886 5.36584 9.95129 5.97628 8.90257C5.39982 7.86368 5.36632 6.5568 6.00438 5.45164C6.65524 4.32431 7.83728 3.69711 9.05067 3.70135Z" fill="black"/><path d="M13.9995 9C13.9995 10.1046 13.1041 11 11.9995 11C10.895 11 9.99953 10.1046 9.99953 9C9.99953 7.89543 10.895 7 11.9995 7C13.1041 7 13.9995 7.89543 13.9995 9Z" fill="black"/></svg>`,
  // 8: tree
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 19H9C5.68629 19 3 16.3137 3 13C3 10.7778 4.20805 8.83779 6.00324 7.80082C6.10832 4.57931 8.75294 2 12 2C15.2471 2 17.8917 4.57931 17.9968 7.80082C19.792 8.83779 21 10.7778 21 13C21 16.3137 18.3137 19 15 19H13V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19ZM15.9978 7.86602L16.034 8.97678L16.9964 9.53266C18.1984 10.227 19 11.5211 19 13C19 15.2091 17.2091 17 15 17H13V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V17H9C6.79086 17 5 15.2091 5 13C5 11.5211 5.8016 10.227 7.00361 9.53266L7.96595 8.97678L8.00218 7.86602C8.07219 5.71958 9.83568 4 12 4C14.1643 4 15.9278 5.71958 15.9978 7.86602Z" fill="black"/></svg>`,
  // 9: car
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.55739 8.04914L4.58555 4.45056C4.83087 3.59196 5.61564 3 6.5086 3H17.4914C18.3844 3 19.1691 3.59195 19.4144 4.45056L20.4426 8.04914C21.3342 8.25057 22 9.04753 22 10V19C22 19.5523 21.5523 20 21 20H19C18.4477 20 18 19.5523 18 19V18H6V19C6 19.5523 5.55228 20 5 20H3C2.44772 20 2 19.5523 2 19V10C2 9.04753 2.66581 8.25057 3.55739 8.04914ZM6.5086 5H17.4914L18.3485 8H5.65146L6.5086 5ZM20 16V10H4V16H20Z" fill="black"/><path d="M18.5 13C18.5 13.8284 17.8284 14.5 17 14.5C16.1716 14.5 15.5 13.8284 15.5 13C15.5 12.1716 16.1716 11.5 17 11.5C17.8284 11.5 18.5 12.1716 18.5 13Z" fill="black"/><path d="M8.5 13C8.5 13.8284 7.82843 14.5 7 14.5C6.17157 14.5 5.5 13.8284 5.5 13C5.5 12.1716 6.17157 11.5 7 11.5C7.82843 11.5 8.5 12.1716 8.5 13Z" fill="black"/></svg>`,
  // 10: template (airplane silhouette)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6803 9.82633L12.7839 4L11.2156 4L10.3192 9.82633L4.38013 12.7959L4.24664 14.1308L10.0858 13.2325L11.1996 18.8013L9.7013 20H14.2982L12.7999 18.8013L13.9136 13.2325L19.7528 14.1308L19.6194 12.7959L13.6803 9.82633ZM8.99974 18L7.25035 19.3995C6.77592 19.7791 6.49974 20.3537 6.49974 20.9613V21C6.49974 21.5523 6.94746 22 7.49974 22H16.4997C17.052 22 17.4997 21.5523 17.4997 21V20.9613C17.4997 20.3537 17.2236 19.7791 16.7491 19.3995L14.9997 18L15.4997 15.5L20.7242 16.3038C21.3702 16.4032 21.9364 15.8663 21.8713 15.2159L21.6094 12.5969C21.5411 11.914 21.1276 11.3139 20.5138 11.007L15.4997 8.5L14.7606 3.69589C14.6105 2.72022 13.771 2 12.7839 2H11.2156C10.2284 2 9.38894 2.72022 9.23883 3.69588L8.49974 8.5L3.4857 11.007C2.87192 11.3139 2.45834 11.914 2.39005 12.5969L2.12815 15.2159C2.06312 15.8663 2.62924 16.4032 3.27524 16.3038L8.49974 15.5L8.99974 18Z" fill="black"/></svg>`,
  // 11: business (bar-chart building)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 13V5L5 5V19H19V13H13ZM19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H13C14.1046 3 15 3.89543 15 5V11H19Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 7H11V9H7V7Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 11H11V13H7V11Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 15H11V17H7V15Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13 15H17V17H13V15Z" fill="black"/></svg>`,
  // 12: bed (two pillows + base)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7C3 5.89543 3.89543 5 5 5H9C10.1046 5 11 5.89543 11 7V9H3V7Z" fill="black"/><path d="M13 7C13 5.89543 13.8954 5 15 5H19C20.1046 5 21 5.89543 21 7V9H13V7Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19 18V19C19 19.5523 19.4477 20 20 20C20.5523 20 21 19.5523 21 19V18C22.1046 18 23 17.1046 23 16V12C23 10.8954 22.1046 10 21 10H3C1.89543 10 1 10.8954 1 12V16C1 17.1046 1.89543 18 3 18V19C3 19.5523 3.44772 20 4 20C4.55228 20 5 19.5523 5 19V18H19ZM21 12H3V16H21V12Z" fill="black"/></svg>`,
  // 13: fire (flame)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 19.9992C8.68629 19.9992 6 17.3129 6 13.9992C6 12.4642 6.63362 11.4875 7.9666 10.1153C8.22198 9.85242 8.50801 9.5723 8.81539 9.27126C9.82587 8.28163 11.0671 7.06606 12.2082 5.49451C12.4704 5.99129 12.5751 6.3876 12.612 6.6919C12.675 7.21048 12.5688 7.67798 12.3544 8.20858C12.2633 8.43405 12.1689 8.63457 12.0564 8.87332C12.0252 8.93958 11.9926 9.00878 11.9583 9.08229C11.8241 9.37 11.6293 9.79344 11.5135 10.2421C11.3916 10.7139 11.3051 11.402 11.5896 12.1419C11.878 12.8923 12.4282 13.3885 12.971 13.7142C13.6706 14.1339 14.4796 14.3514 15.3317 14.2209C16.1561 14.0946 16.792 13.6775 17.2427 13.2528C17.4673 13.0412 17.6683 12.8065 17.848 12.5614C17.9575 13.0668 18 13.553 18 13.9992C18 17.3129 15.3137 19.9992 12 19.9992ZM12 21.9992C7.58172 21.9992 4 18.4175 4 13.9992C4 11.1928 5.57514 9.64658 7.48769 7.76909C8.73871 6.54101 10.1341 5.17122 11.3274 3.21434C11.6828 2.6316 12.5033 2.49877 12.9366 3.02609C15.5343 6.18681 14.5485 8.27781 13.8545 9.74972C13.3925 10.7296 13.0599 11.4351 14 11.9992C15.4995 12.8989 16.4812 11.2803 17.0268 9.84067C17.3135 9.08434 18.3164 8.82021 18.742 9.50797C19.7152 11.0805 20 12.6936 20 13.9992C20 18.4175 16.4183 21.9992 12 21.9992Z" fill="black"/></svg>`,
  // 14: compass (circle with needle)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.6339 14.019C14.5334 14.3071 14.307 14.5335 14.0189 14.634L8.76237 16.4667C7.99018 16.7359 7.26421 16.01 7.53343 15.2378L9.36611 9.98133C9.46656 9.69323 9.69304 9.46675 9.98114 9.3663L15.2376 7.53355C16.0098 7.26433 16.7358 7.9903 16.4666 8.76249L14.6339 14.019ZM12 13.5001C12.8284 13.5001 13.5 12.8285 13.5 12.0001C13.5 11.1717 12.8284 10.5001 12 10.5001C11.1716 10.5001 10.5 11.1717 10.5 12.0001C10.5 12.8285 11.1716 13.5001 12 13.5001Z" fill="black"/></svg>`,
  // 15: location (pin)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.8155 15.1809C17.1642 13.3295 18 11.5157 18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10C6 11.5157 6.8358 13.3295 8.18446 15.1809C9.43418 16.8965 10.9402 18.3959 12 19.3621C13.0598 18.3959 14.5658 16.8965 15.8155 15.1809ZM13.192 20.981C15.4216 18.9728 20 14.3229 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.3229 8.57839 18.9728 10.808 20.981C11.4933 21.5982 12.5067 21.5982 13.192 20.981Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8ZM8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10Z" fill="black"/></svg>`,
  // 16: globe (world)
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 20C12.2151 20 12.9482 19.7737 13.7467 18.1766C14.0532 17.5635 14.3212 16.8293 14.5298 16H9.4702C9.6788 16.8293 9.94677 17.5635 10.2533 18.1766C11.0518 19.7737 11.7849 20 12 20ZM9.11146 14C9.03919 13.3641 9 12.6949 9 12C9 11.3051 9.03919 10.6359 9.11146 10H14.8885C14.9608 10.6359 15 11.3051 15 12C15 12.6949 14.9608 13.3641 14.8885 14H9.11146ZM16.584 16C16.3182 17.2166 15.9348 18.307 15.4627 19.2138C16.9162 18.5149 18.1259 17.3895 18.9297 16H16.584ZM19.748 14H16.9C16.9656 13.3538 17 12.6849 17 12C17 11.3151 16.9656 10.6462 16.9 10H19.748C19.9125 10.6392 20 11.3094 20 12C20 12.6906 19.9125 13.3608 19.748 14ZM7.10002 14H4.25203C4.08751 13.3608 4 12.6906 4 12C4 11.3094 4.08751 10.6392 4.25203 10H7.10002C7.03443 10.6462 7 11.3151 7 12C7 12.6849 7.03443 13.3538 7.10002 14ZM5.07026 16H7.41605C7.68183 17.2166 8.06515 18.307 8.53731 19.2138C7.0838 18.5149 5.87406 17.3895 5.07026 16ZM9.4702 8H14.5298C14.3212 7.17074 14.0532 6.43647 13.7467 5.82336C12.9482 4.22632 12.2151 4 12 4C11.7849 4 11.0518 4.22632 10.2533 5.82336C9.94677 6.43647 9.6788 7.17074 9.4702 8ZM16.584 8H18.9297C18.1259 6.61047 16.9162 5.48514 15.4627 4.78617C15.9348 5.69296 16.3182 6.78337 16.584 8ZM8.53731 4.78617C8.06515 5.69296 7.68183 6.78337 7.41604 8H5.07026C5.87406 6.61047 7.08379 5.48514 8.53731 4.78617Z" fill="black"/></svg>`,
];

// Transpose the 4x4 grid: original top row becomes the new first column, row 2
// becomes column 2, etc. Reading row-by-row, the new sequence indexes into
// ICONS_16 as [0,4,8,12, 1,5,9,13, 2,6,10,14, 3,7,11,15].
const ICONS_16_BY_COL: string[] = (() => {
  const out: string[] = new Array(16);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[c * 4 + r] = ICONS_16[r * 4 + c];
  return out;
})();

// Base view palette — derived from the active icon colour. Layers stay in the
// same darkness ratio as the original neutral grid (bg 8%, mid-dot 15%,
// drift-dot 30%), shifted toward the icon hue.
type BasePalette = {
  icon: string;
  pageBg: string;   // sticky-parent bg behind the rectangle — darker than gridBg
  gridBg: string;
  dotMid: string;
  dotLight: string;
};

// Scale a hex by a factor (0=black, 1=original) — used to derive grid shades.
function darkenHex(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const ch = (v: number) => Math.round(Math.max(0, Math.min(255, v * factor))).toString(16).padStart(2, '0');
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

function paletteFromColor(color: string): BasePalette {
  return {
    icon: color,
    pageBg: darkenHex(color, 0.17), // darker than gridBg — for the page behind the rectangle
    gridBg: darkenHex(color, 0.22),
    dotMid: darkenHex(color, 0.30),
    dotLight: darkenHex(color, 0.55),
  };
}

// Icons stay fixed; only the colour cycles. Sequence walks the colour wheel
// through saturated rainbow hues so each HSL-lerp step is a short forward arc
// (red → orange → yellow → green → cyan → indigo → pink → back to red).
// Interval between target colour swaps on the base view. Lower = faster cycle.
const COLOR_CYCLE_MS = 3500;
const COLOR_THEMES: string[] = [
  '#FF3B30', // red
  '#FF9500', // orange
  '#FFC400', // yellow
  '#34C759', // green
  '#00D9FF', // cyan
  '#4B49FF', // indigo
  '#FF2D92', // pink
];

// Render BG_WORDS twice so a single long CSS animation can loop seamlessly:
// at 100% the stack is shifted by exactly N×(slot+gap), and the second copy
// occupies the same slots that the first copy did at 0%. No React state
// updates during the animation, which avoids the per-iteration jerk.
const BG_KEYFRAME = (() => {
  const N = BG_WORDS.length;
  const slide = 0.4; // fraction of each segment spent sliding; rest is hold
  let css = '@keyframes home-bg-slide {\n';
  for (let i = 0; i <= N; i++) {
    const start = (i / N) * 100;
    css += `  ${start.toFixed(4)}% { transform: translateY(calc(-${i} * (var(--slot) + var(--gap)))); animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1); }\n`;
    if (i < N) {
      const slideEnd = ((i + slide) / N) * 100;
      css += `  ${slideEnd.toFixed(4)}% { transform: translateY(calc(-${i + 1} * (var(--slot) + var(--gap)))); animation-timing-function: steps(1, end); }\n`;
    }
  }
  css += '}';
  return css;
})();

function HomeBgWords({ active, progress }: { active: boolean; progress: number }) {
  const items = [...BG_WORDS, ...BG_WORDS];
  const totalMs = BG_WORDS.length * BG_CYCLE_MS;

  // Two independent clipped tickers — one per slot. The slot wrapper carries the
  // tilt; the inner stack slides up vertically through the words. Because the
  // rotation lives on the wrapper (not the word), the word never rotates while
  // sliding — it just enters at the slot's bottom edge, holds at centre, exits
  // at the top edge, all at the slot's constant angle.
  const slotStack = (offsetCycles: number) => (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: BG_GAP,
        animation: `home-bg-slide ${totalMs}ms linear infinite`,
        animationDelay: `${-offsetCycles * BG_CYCLE_MS}ms`,
        animationPlayState: active ? 'running' : 'paused',
        willChange: 'transform',
      }}
    >
      {items.map((w, i) => (
        <div
          key={i}
          style={{
            height: 'var(--slot)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={`/words/${w.toLowerCase()}.svg`}
            alt=""
            aria-hidden
            style={{ height: '100%', width: 'auto', display: 'block' }}
          />
        </div>
      ))}
    </div>
  );

  // Scroll-exit: top slot slides up off-screen, bottom slides down. Translate
  // applied after the rotateX so the tilt is preserved as the slot ejects.
  return (
    <div
      style={{
        position: 'absolute',
        top: BG_PAD,
        bottom: BG_PAD,
        left: 0,
        right: 0,
        pointerEvents: 'none',
        perspective: '1200px',
        ['--slot' as never]: `calc((100vh - ${2 * BG_PAD + 1 * BG_GAP}px) / 2)`,
        ['--gap' as never]: `${BG_GAP}px`,
      }}
    >
      <style>{BG_KEYFRAME}</style>
      {/* Top slot — top edge tipped toward viewer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--slot)',
          overflow: 'hidden',
          transform: `translateY(${-progress * 100}vh) rotateX(-${BG_TILT}deg)`,
          willChange: 'transform',
        }}
      >
        {slotStack(0)}
      </div>
      {/* Bottom slot — bottom edge tipped toward viewer (V bent inwards) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--slot)',
          overflow: 'hidden',
          transform: `translateY(${progress * 100}vh) rotateX(${BG_TILT}deg)`,
          willChange: 'transform',
        }}
      >
        {slotStack(1)}
      </div>
    </div>
  );
}

function HomeContent({ active }: { active: boolean }) {
  // Loop: pausedFull -> deleting (avatar2) -> pausedEmpty -> typing (avatar1) -> ...
  // The name shows on load (pausedFull); the loop runs while home is on screen.
  const [displayed, setDisplayed] = useState(NAME);
  const [phase, setPhase] = useState<'pausedFull' | 'deleting' | 'pausedEmpty' | 'typing'>('pausedFull');
  const [avatarReady, setAvatarReady] = useState(false);
  // Which video is on screen: 0 = avatar1 (typing pass), 1 = avatar2 (deleting pass).
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null]);

  // Play the phase's video from frame 0. The pause phases leave both videos parked.
  useEffect(() => {
    if (!active) return;
    const which = phase === 'deleting' ? 1 : phase === 'typing' ? 0 : -1;
    const vid = which >= 0 ? videoRefs.current[which] : null;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }
  }, [active, phase]);

  // 1s beat after each full pass, then start the next phase + crossfade to its video.
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'pausedFull') {
      timer = setTimeout(() => { setActiveVideo(1); setPhase('deleting'); }, PAUSE_MS);
    } else if (phase === 'pausedEmpty') {
      timer = setTimeout(() => { setActiveVideo(0); setPhase('typing'); }, PAUSE_MS);
    }
    return () => clearTimeout(timer);
  }, [active, phase]);

  // When home scrolls off screen, reset the loop: pause + rewind both videos and
  // return to the name-shown state. It restarts fresh when home is back.
  useEffect(() => {
    if (active) return;
    videoRefs.current.forEach(v => {
      if (v) { v.pause(); v.currentTime = 0; }
    });
    setDisplayed(NAME);
    setPhase('pausedFull');
    setActiveVideo(0);
  }, [active]);

  // Type / delete the name over TEXT_SPAN_MS with a rAF loop — smooth, wall-clock paced,
  // independent of the video's coarse timeupdate events. Starts with the phase (and so
  // with its video), then stops once complete and the name just holds.
  useEffect(() => {
    if (!active || (phase !== 'typing' && phase !== 'deleting')) return;
    const typing = phase === 'typing';
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / TEXT_SPAN_MS);
      const shown = typing ? progress : 1 - progress;
      setDisplayed(NAME.slice(0, Math.round(shown * NAME.length)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, phase]);

  // avatar1 ends -> name fully typed, hold. avatar2 ends -> name cleared, hold.
  const handleVideoEnded = (which: number) => {
    if (!active) return;
    if (which === 0 && phase === 'typing') {
      setDisplayed(NAME);
      setPhase('pausedFull');
    } else if (which === 1 && phase === 'deleting') {
      setDisplayed('');
      setPhase('pausedEmpty');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, animation: 'home-load 0.45s ease-out both' }}>
      <div style={{
        position: 'relative',
        width: 180,
        height: 180,
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
      }}>
        {[0, 1].map((i) => (
          <video
            key={i}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={AVATAR_VIDEOS[i]}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={i === 0 ? () => setAvatarReady(true) : undefined}
            onEnded={() => handleVideoEnded(i)}
            style={{
              position: 'absolute',
              inset: 0,
              width: 180,
              height: 180,
              objectFit: 'cover',
              // avatar1 (i=0) sits ~7.5% further left than avatar2.
              objectPosition: i === 0 ? '37% center' : '29.5% center',
              // avatar2 (i=1) is zoomed in ~5%.
              transform: i === 1 ? 'scale(1.05)' : undefined,
              opacity: i === activeVideo ? 1 : 0,
              transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </div>
      <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontSize: 80, fontWeight: 400, lineHeight: 'normal', letterSpacing: '-1.92px', color: '#000000', textAlign: 'center', whiteSpace: 'nowrap', margin: 0 }}>
        {displayed}
        <span style={{ display: 'inline-block', width: 3, height: '0.72em', backgroundColor: '#000000', marginLeft: 4, verticalAlign: 'middle', animation: 'cursor-blink 0.75s ease-in-out infinite' }} />
      </p>
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 20, fontWeight: 500, lineHeight: '34px', color: '#000000', textAlign: 'center', width: 440, margin: 0 }}>
        I'm a product designer based in Seattle, WA, but living in code. I care deeply about craft, the details, and products with taste.
      </p>
    </div>
  );
}

const FRAME_H = 792;
const FRAME_W = 360;
const PEEK = 40;
const LIGHT_BLUE = '#BAE6FD'; // stage 2 frame fill + stroke
// Screen-x offset (from viewport centre) of the base title + description. Sits
// 16px outside the 640×640 icon grid: half the grid width (320) + 16 = 336.
const BASE_LABEL_OFFSET = 640 / 2 + 16;

// Olysense fill: a soft, slowly drifting gradient — white base with a light-blue
// and a very-light-reddish radial blob, each easing around on its own slow loop.
const olyGlowAnim = `
  @keyframes oly-glow-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16%,13%)} }
  @keyframes oly-glow-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14%,11%)} }
  @keyframes oly-glow-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12%,-15%)} }
  @keyframes oly-col-a {
    0%,100% { background: radial-gradient(circle at 30% 28%, rgba(150,190,240,0.85) 0%, rgba(150,190,240,0.35) 38%, rgba(150,190,240,0) 70%); }
    30%     { background: radial-gradient(circle at 30% 28%, rgba(165,185,236,0.85) 0%, rgba(165,185,236,0.35) 38%, rgba(165,185,236,0) 70%); }
    65%     { background: radial-gradient(circle at 30% 28%, rgba(140,195,245,0.85) 0%, rgba(140,195,245,0.35) 38%, rgba(140,195,245,0) 70%); }
  }
  @keyframes oly-col-b {
    0%,100% { background: radial-gradient(circle at 72% 34%, rgba(245,180,170,0.82) 0%, rgba(245,180,170,0.32) 40%, rgba(245,180,170,0) 72%); }
    38%     { background: radial-gradient(circle at 72% 34%, rgba(240,175,195,0.82) 0%, rgba(240,175,195,0.32) 40%, rgba(240,175,195,0) 72%); }
    70%     { background: radial-gradient(circle at 72% 34%, rgba(250,190,170,0.82) 0%, rgba(250,190,170,0.32) 40%, rgba(250,190,170,0) 72%); }
  }
  @keyframes oly-col-c {
    0%,100% { background: radial-gradient(circle at 50% 84%, rgba(195,170,235,0.85) 0%, rgba(195,170,235,0.35) 38%, rgba(195,170,235,0) 70%); }
    33%     { background: radial-gradient(circle at 50% 84%, rgba(210,175,228,0.85) 0%, rgba(210,175,228,0.35) 38%, rgba(210,175,228,0) 70%); }
    68%     { background: radial-gradient(circle at 50% 84%, rgba(180,175,240,0.85) 0%, rgba(180,175,240,0.35) 38%, rgba(180,175,240,0) 70%); }
  }
`;

// Base fill: lighter dots drift across the #262626 grid in soft waves. Each masked layer
// animates its mask-position on its own slow, non-harmonic loop so the waves never sync up.
const baseDotsAnim = `
  @keyframes base-dots-a {
    0%,100% { -webkit-mask-position: 6% 16%; mask-position: 6% 16%; }
    50%     { -webkit-mask-position: 92% 78%; mask-position: 92% 78%; }
  }
  @keyframes base-dots-b {
    0%,100% { -webkit-mask-position: 90% 12%; mask-position: 90% 12%; }
    50%     { -webkit-mask-position: 18% 88%; mask-position: 18% 88%; }
  }
  @keyframes base-dots-c {
    0%,100% { -webkit-mask-position: 42% 94%; mask-position: 42% 94%; }
    50%     { -webkit-mask-position: 68% 8%; mask-position: 68% 8%; }
  }
`;

// Metallic-silver shine: a diagonal highlight sweeps across the frame surface, looped slowly.
const frameShineAnim = `
  @keyframes frame-shine {
    0%   { background-position: 200% 0; }
    100% { background-position: -100% 0; }
  }
`;

const SquareGlow = memo(function SquareGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', overflow: 'hidden' }}>
      <style>{olyGlowAnim}</style>
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 30% 28%, rgba(150,190,240,0.85) 0%, rgba(150,190,240,0.35) 38%, rgba(150,190,240,0) 70%)', animation: 'oly-glow-a 7s ease-in-out infinite, oly-col-a 9s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 72% 34%, rgba(245,180,170,0.82) 0%, rgba(245,180,170,0.32) 40%, rgba(245,180,170,0) 72%)', animation: 'oly-glow-b 9s ease-in-out infinite, oly-col-b 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: '-30%', background: 'radial-gradient(circle at 50% 84%, rgba(195,170,235,0.85) 0%, rgba(195,170,235,0.35) 38%, rgba(195,170,235,0) 70%)', animation: 'oly-glow-c 8s ease-in-out infinite, oly-col-c 11s ease-in-out infinite' }} />
    </div>
  );
});

export function NewPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sharedCircleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [vh, setVh] = useState(() => window.innerHeight);
  const [vw, setVw] = useState(() => window.innerWidth);
  // Cursor wiring — phase is bubbled up from PrivatHomeView; copyEl/startBtnEl
  // are live DOM nodes the animated cursor targets via getBoundingClientRect.
  // frameElRef points at the outer PWA-frame container so a ResizeObserver can
  // reposition the cursor on every frame size change.
  const [cursorPhase, setCursorPhase] = useState<CursorPhase>('enter');
  const [copyEl, setCopyEl] = useState<HTMLElement | null>(null);
  const [startBtnEl, setStartBtnEl] = useState<HTMLElement | null>(null);
  const frameElRef = useRef<HTMLDivElement | null>(null);
  const [visitHovered, setVisitHovered] = useState(false);
  const [olyVisitHovered, setOlyVisitHovered] = useState(false);
  const [baseVisitHovered, setBaseVisitHovered] = useState(false);
  // Colour cycling for the base view — icons stay fixed, only the palette changes.
  // themeIndex is the *target*; displayedColor lerps toward COLOR_THEMES[themeIndex]
  // through HSL space, so intermediates pass through vibrant hues instead of
  // muddy RGB midpoints.
  const [themeIndex, setThemeIndex] = useState(0);
  const [displayedColor, setDisplayedColor] = useState(COLOR_THEMES[0]);

  useEffect(() => {
    const onResize = () => { setVh(window.innerHeight); setVw(window.innerWidth); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Three-stage scroll: 0→⅓ home → Privat, ⅓→⅔ Privat → Olysense, ⅔→1 Olysense → base.
  const pStage1 = smoothstep(Math.min(1, progress * 3));
  const pStage2 = smoothstep(Math.min(1, Math.max(0, (progress - 1 / 3) * 3)));
  const pStage3 = smoothstep(Math.min(1, Math.max(0, (progress - 2 / 3) * 3)));

  // Stage 2 sub-phases.
  const pPanelFade = Math.min(1, pStage2 / 0.2);
  const pBgWhite = Math.min(1, Math.max(0, (pStage2 - 0.1) / 0.25));
  // Frame morph: spread across most of stage 2 with smoothstep for a slow, gentle morph.
  const pFrameMorph = smoothstep(Math.min(1, Math.max(0, (pStage2 - 0.30) / 0.70)));
  // Inner content fade-out: completes quicker than the frame morph so the PWA contents
  // clear out before the frame finishes expanding to a square.
  const pContentFade = smoothstep(Math.min(1, Math.max(0, (pStage2 - 0.30) / 0.30)));

  // Stage 3 sub-phases — Olysense → base.
  const pOlyFadeOut = Math.min(1, pStage3 / 0.25); // Olysense name + description clear out first
  const baseVisible = pStage3 >= 0.85;             // base title + description appear once the square is essentially grown

  // Active palette — derived from displayedColor (which lerps toward the target
  // theme), so icon material + grid bg + dot tints all change in lockstep.
  const palette = paletteFromColor(displayedColor);

  // Cycle colours timed to one full swing oscillation. 3dsvg's swing uses
  // sin(elapsed * 1.5), and elapsed is scaled by `animateSpeed` (0.75 here),
  // so one full back-and-forth cycle = (2π / 1.5) / 0.75 ≈ 5585 ms in real time.
  useEffect(() => {
    if (!baseVisible || COLOR_THEMES.length < 2) return;
    const id = window.setInterval(() => {
      setThemeIndex(prev => (prev + 1) % COLOR_THEMES.length);
    }, COLOR_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [baseVisible]);


  // Smooth colour blend: lerp displayedColor through HSL (vibrant intermediates)
  // over the full swing period via rAF. transitionProgress mirrors `t` so the
  // material flicker can fire at the midpoint.
  useEffect(() => {
    const target = COLOR_THEMES[themeIndex % COLOR_THEMES.length];
    const start = displayedColor;
    if (start === target) return;
    const startTime = performance.now();
    const SWING_PERIOD_MS = COLOR_CYCLE_MS;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / SWING_PERIOD_MS);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setDisplayedColor(lerpHsl(start, target, eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeIndex]);

  // Frame and its contents are rendered 1:1 — no scaling anywhere. Source
  // pixels = display pixels.
  const frameScale = 1;
  // Stage 2 morphs the PWA rectangle into a square (FRAME_H × FRAME_H). Stage 3
  // widens it to display width = vw - 240 (i.e. 120px inset left + right).
  const baseWidthSource = vw - 240;
  const frameWidth = lerp(lerp(FRAME_W, FRAME_H, pFrameMorph), baseWidthSource, pStage3);
  const frameHeight = FRAME_H;
  // Stage 2 fades the border out; stage 3 keeps it at 0 (base view has no stroke).
  const frameBorderWidth = lerp(5, 0, pFrameMorph);
  // Home start position is shifted 38px lower (less peek visible) than the raw
  // PEEK; the lerp still ends at centred on Privat.
  const frameTop = lerp(vh - PEEK, (vh - frameHeight) / 2, pStage1);
  // Panels fade in like the home-load intro (opacity 0→1, scale 0.9→1, 700ms)
  // when the showcase is reached, and fade back out when scrolling away or into stage 2.
  const panelsVisible = pStage1 >= 0.9 && pPanelFade === 0;
  const panelOpacity = panelsVisible ? 1 : 0;
  const panelScale = panelsVisible ? 1 : 0.9;
  // Avoid chaining lerpColor — it returns rgb() format and would re-parse as hex (NaN).
  // Stage 2 ramps the page bg black → white; stage 3 ramps it white → palette.pageBg
  // (a darker tint of the active icon colour, so the page behind the rectangle is a
  // matched darker version of the dotted-grid bg instead of pure black).
  const bg = pStage3 > 0
    ? lerpColor('#ffffff', palette.pageBg, pStage3)
    : pBgWhite > 0
    ? lerpColor('#000000', '#ffffff', pBgWhite)
    : lerpColor('#ffffff', '#000000', pStage1);
  // Border: silver #A8AFB6 from home onwards (matches the Privat phone bezel,
  // no stage-1 colour shift); stage 2 → light blue; stage 3 → dark grey.
  const borderColor = pStage3 > 0
    ? lerpColor(LIGHT_BLUE, '#333333', pStage3)
    : pFrameMorph > 0
    ? lerpColor('#A8AFB6', LIGHT_BLUE, pFrameMorph)
    : '#A8AFB6';
  const contentOpacity = 1 - pStage1;
  // OlySense label appears once the square is essentially formed.
  const olySenseVisible = pFrameMorph >= 0.9;
  const frameContentOpacity = 1 - pContentFade;
  const pwaActive = pStage1 >= 0.95 && pStage2 < 0.05;
  // Home is "active" only at the top snap point — gates the avatar video loop.
  const homeActive = pStage1 < 0.05;

  return (
    <div
      ref={scrollRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'none',
        scrollSnapType: 'y mandatory',
      }}
    >
      {/* Scroll track — 400vh: stage 1 home→Privat, stage 2 Privat→Olysense, stage 3 Olysense→base */}
      <div style={{ height: '400vh', position: 'relative' }}>
        {/* Native CSS scroll-snap targets at 0vh, 100vh, 200vh, 300vh.
            `scroll-snap-stop: always` forces a stop at each — momentum can't skip mid. */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${i * 100}vh`,
              left: 0,
              width: 1,
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Sticky visual layer */}
        <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: bg }}>
          <style>{homeLoadAnim}</style>
          {/* Background typography layer — outlined ticker. On scroll-away,
              top words slide up, bottom slide down, middle fades. */}
          {pStage1 < 1 && <HomeBgWords active={homeActive} progress={pStage1} />}
          {/* White radial-fade halo behind avatar/name/intro to lift them off the ticker.
              Fades 2× faster than the content so the ticker is revealed sooner during scroll. */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.max(0, 1 - pStage1 * 2), pointerEvents: 'none' }}>
            <div style={{
              width: 880,
              height: 880,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,0) 72%)',
            }} />
          </div>
          {/* Home content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: contentOpacity, pointerEvents: contentOpacity < 0.01 ? 'none' : 'auto' }}>
            <HomeContent active={homeActive} />
          </div>
          {/* Selected work label */}
          <div style={{ position: 'absolute', bottom: PEEK + 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: contentOpacity, pointerEvents: 'none' }}>
            {/* Tag: 18px. Sits outside the scale(1.15) frame, so source size == final size.
                Each character is its own span so we can stagger a colour-pulse
                across the word (silver-stroke ↔ darker slate, looping). */}
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: '34px', color: '#A8AFB6', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, animation: 'home-load 0.45s 0.08s ease-out both' }}>
              {Array.from('SELECTED WORK').map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre', // preserve the space character
                    animation: 'selected-wave 2s ease-in-out infinite',
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  {ch}
                </span>
              ))}
            </p>
          </div>
          {/* PWA frame + label */}
          <div ref={frameElRef} style={{
            position: 'absolute',
            top: frameTop,
            left: '50%',
            transform: `translateX(-50%) scale(${frameScale})`,
            transformOrigin: 'center center',
            width: frameWidth,
            height: frameHeight,
            willChange: 'transform, top, width',
          }}>
            {/* Privat label — project name, styled like the Olysense label */}
            <div style={{
              position: 'absolute',
              right: 'calc(100% + 40px)',
              top: '50%',
              transform: `translateY(-50%) scale(${panelScale})`,
              transformOrigin: 'center center',
              opacity: panelOpacity,
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: "'Stack Sans Notch', sans-serif",
                fontWeight: 300,
                fontSize: 48, // project name
                lineHeight: 'normal',
                color: '#fcfcfc',
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                Privat
              </p>
            </div>
            {/* OlySense label — appears on the left of the final blue square */}
            <div style={{
              position: 'absolute',
              right: 'calc(100% + 40px)',
              top: '50%',
              transform: `translateY(-50%) scale(${olySenseVisible ? 1 : 0.9})`,
              transformOrigin: 'center center',
              opacity: olySenseVisible ? 1 - pOlyFadeOut : 0,
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
              pointerEvents: 'none',
            }}>
              <p style={{
                fontFamily: "'Stack Sans Notch', sans-serif",
                fontWeight: 300,
                fontSize: 48, // project name
                lineHeight: 'normal',
                color: '#000000',
                textAlign: 'center',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                OlySense
              </p>
            </div>
            {/* Right panel — 80px to the right, vertically centered */}
            <div style={{
              position: 'absolute',
              left: 'calc(100% + 40px)',
              top: '50%',
              transform: `translateY(-50%) scale(${panelScale})`,
              transformOrigin: 'center center',
              width: 264,
              display: 'flex',
              flexDirection: 'column',
              opacity: panelOpacity,
              gap: 24,
              pointerEvents: panelsVisible ? 'auto' : 'none',
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            }}>
              {/* Tag: 18px final ÷ 1.15 frame scale. */}
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 400, fontSize: 18, lineHeight: 'normal', color: '#FCFCFC', whiteSpace: 'nowrap', margin: 0 }}>
                WIP PROJECT
              </p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#959595', margin: 0 }}>
                Designing and building <span style={{ color: '#FCFCFC' }}>Privat</span>, an application for instant 1:1 video sessions.
              </p>
              <a
                href="https://goprivat.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setVisitHovered(true)}
                onMouseLeave={() => setVisitHovered(false)}
                style={{
                  border: '2px solid #FCFCFC', // renders 2px at the 1.15 frame scale
                  borderRadius: 32, // 32 ÷ 1.15 frame scale
                  padding: '12px 20px', // 12px 20px ÷ 1.15 frame scale
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: 'fit-content',
                  textDecoration: 'none',
                  backgroundImage: 'linear-gradient(to right, #FCFCFC, #FCFCFC)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 0',
                  backgroundSize: visitHovered ? '100% 100%' : '0% 100%',
                  transition: 'background-size 0.4s ease-out',
                }}>
                <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 16, letterSpacing: '0.14px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 4 }}>
                  {'Visit goprivat.com'.split('').map((char, i) => {
                    const total = 'Visit goprivat.com'.length;
                    const delay = visitHovered ? i * 22 : (total - 1 - i) * 22;
                    return (
                      <span
                        key={i}
                        style={{
                          color: visitHovered ? '#000000' : '#FFFFFF',
                          fontSize: 16, // CTA: 16px final ÷ 1.15 frame scale
                          lineHeight: '34px', // 34px ÷ 1.15 frame scale
                          transition: `color 80ms linear ${delay}ms`,
                        }}
                      >
                        {char === ' ' ? ' ' : char}
                      </span>
                    );
                  })}
                </p>
                <div style={{ position: 'relative', flexShrink: 0, width: 24, height: 24, animation: visitHovered ? 'arrow-nudge-diag 0.7s ease-in-out infinite' : 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.75736 7.75737C6.75736 7.20508 7.20507 6.75737 7.75736 6.75737L16.2426 6.75737C16.7949 6.75737 17.2426 7.20508 17.2426 7.75737V16.2427C17.2426 16.7949 16.7949 17.2427 16.2426 17.2427C15.6904 17.2427 15.2426 16.7949 15.2426 16.2427V10.1716L8.46447 16.9498C8.07394 17.3403 7.44078 17.3403 7.05025 16.9498C6.65973 16.5592 6.65973 15.9261 7.05025 15.5355L13.8284 8.75737L7.75736 8.75737C7.20507 8.75737 6.75736 8.30965 6.75736 7.75737Z" style={{ fill: visitHovered ? '#000000' : '#FFFFFF' }} />
                  </svg>
                </div>
              </a>
            </div>
            {/* OlySense description + Visit button — right of the blue square (reversed colors) */}
            <div style={{
              position: 'absolute',
              left: 'calc(100% + 40px)',
              top: '50%',
              transform: `translateY(-50%) scale(${olySenseVisible ? 1 : 0.9})`,
              transformOrigin: 'center center',
              width: 264,
              display: 'flex',
              flexDirection: 'column',
              opacity: olySenseVisible ? 1 - pOlyFadeOut : 0,
              gap: 24,
              pointerEvents: olySenseVisible && pOlyFadeOut < 1 ? 'auto' : 'none',
              transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            }}>
              {/* Tag: 18px final ÷ 1.15 frame scale. */}
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: 'normal', color: '#000000', whiteSpace: 'nowrap', margin: 0 }}>
                CASE STUDY
              </p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#000000', margin: 0 }}>
                Led 0→1 research and design for <span style={{ color: '#000000', fontWeight: 700 }}>OlySense</span>, an endoscopy KPI dashboard.
              </p>
              <a
                href="https://olysense.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setOlyVisitHovered(true)}
                onMouseLeave={() => setOlyVisitHovered(false)}
                style={{
                  border: '2px solid #000000', // renders 2px at the 1.15 frame scale
                  borderRadius: 32, // 32 ÷ 1.15 frame scale
                  padding: '12px 20px', // 12px 20px ÷ 1.15 frame scale
                  display: 'flex',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: 'fit-content',
                  textDecoration: 'none',
                  backgroundImage: 'linear-gradient(to right, #000000, #000000)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 0',
                  backgroundSize: olyVisitHovered ? '100% 100%' : '0% 100%',
                  transition: 'background-size 0.4s ease-out',
                }}>
                <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 16, letterSpacing: '0.14px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 4 }}>
                  {'Read case study'.split('').map((char, i) => (
                    <span
                      key={i}
                      style={{
                        color: olyVisitHovered ? '#FFFFFF' : '#000000',
                        fontSize: 16, // CTA: 16px final ÷ 1.15 frame scale
                        lineHeight: '34px', // 34px ÷ 1.15 frame scale
                        transition: `color 0.35s ease-out ${i * 22}ms`,
                      }}
                    >
                      {char === ' ' ? ' ' : char}
                    </span>
                  ))}
                </p>
                <div style={{ position: 'relative', flexShrink: 0, width: 24, height: 24, animation: olyVisitHovered ? 'arrow-nudge-right 0.7s ease-in-out infinite' : 'none' }}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 4.58579L19.4142 12L12 19.4142L10.5858 18L15.5858 13H5V11H15.5858L10.5858 6L12 4.58579Z" style={{ fill: olyVisitHovered ? '#FFFFFF' : '#000000' }} />
                  </svg>
                </div>
              </a>
            </div>
            {/* Frame */}
            <div style={{
              width: '100%',
              height: '100%',
              border: `${frameBorderWidth}px solid ${borderColor}`,
              borderRadius: 40,
              overflow: 'hidden',
              boxSizing: 'border-box',
              position: 'relative',
            }}>
              <div style={{ width: '100%', height: '100%', opacity: frameContentOpacity }}>
                <PrivatHomeView
                  active={pwaActive}
                  circleRef={sharedCircleRef}
                  onPhaseChange={setCursorPhase}
                  copyRef={setCopyEl}
                  startBtnRef={setStartBtnEl}
                />
              </div>
              {/* Silver shine — a diagonal highlight sweeps the frame, fades in only while the silver border is visible. */}
              {pFrameMorph > 0 && pStage3 < 1 && (
                <>
                  <style>{frameShineAnim}</style>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: pFrameMorph * (1 - pStage3),
                    background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 44%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.25) 56%, transparent 70%)',
                    backgroundSize: '280% 100%',
                    animation: 'frame-shine 4s ease-in-out infinite',
                    mixBlendMode: 'overlay',
                  }} />
                </>
              )}
              {/* Stage 2 — soft animated gradient fill (fades back out during stage 3) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: pFrameMorph * (1 - pStage3),
                pointerEvents: 'none',
              }}>
                {pFrameMorph > 0.01 && pStage3 < 1 && <SquareGlow />}
                {/* Liquid-glass chrome (iOS 26 inspired): 32px inset / 32px radius.
                    Layers:
                    - Backdrop blur + saturation: frosts what's behind, lifts colour
                    - Layered linear gradients: top crown highlight, soft diagonal
                      sheen, bottom rim bounce
                    - Subtle white veil for body
                    - Inset shadows: bright 1px crown, faint dark bottom, soft inner
                      luminescence, gentle refractive corner glow
                    Three macOS dots are punched out via CSS mask so the blobs read
                    through unobstructed. */}
                {pFrameMorph > 0.01 && pStage3 < 1 && (() => {
                  const holeMask = [32, 54, 76]
                    .map(cx => `radial-gradient(circle at ${cx}px 32px, transparent 8px, black 9px)`)
                    .join(', ');
                  return (
                    <div style={{
                      position: 'absolute',
                      inset: 32,
                      pointerEvents: 'none',
                      borderRadius: 32,
                      backdropFilter: 'blur(8px) saturate(1.25)',
                      WebkitBackdropFilter: 'blur(8px) saturate(1.25)',
                      background: [
                        // Top crown highlight — bright at the very top edge
                        'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 10%, rgba(255,255,255,0.01) 22%, transparent 36%)',
                        // Diagonal specular sheen — the liquid shimmer
                        'linear-gradient(122deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 14%, transparent 36%, transparent 64%, rgba(255,255,255,0.06) 82%, rgba(255,255,255,0.14) 98%)',
                        // Bottom rim bounce — subtle warm lift
                        'linear-gradient(180deg, transparent 72%, rgba(255,255,255,0.03) 85%, rgba(255,255,255,0.12) 100%)',
                        // Faint translucent body
                        'rgba(255,255,255,0.07)',
                      ].join(', '),
                      boxShadow: [
                        // Bright crown rim — defines the upper bezel
                        'inset 0 1px 0 rgba(255,255,255,0.78)',
                        // Faint dark base — depth at the bottom
                        'inset 0 -0.5px 0 rgba(0,0,0,0.05)',
                        // Hairline highlight ring — wraps the entire bezel
                        'inset 0 0 0 0.5px rgba(255,255,255,0.12)',
                        // Soft inner luminescence — the volumetric body of the glass
                        'inset 0 6px 24px rgba(255,255,255,0.16)',
                        // Original Figma refraction glow, dialled down
                        'inset 6px -3px 28px rgba(255,255,255,0.22)',
                      ].join(', '),
                      overflow: 'hidden',
                      maskImage: holeMask,
                      maskComposite: 'intersect',
                      WebkitMaskImage: holeMask,
                      WebkitMaskComposite: 'source-in',
                    }} />
                  );
                })()}
              </div>
              {/* Stage 3 — base fill: dotted grid coloured from the active theme palette.
                  Three masked drifting wave layers reveal a lighter dot tint. */}
              <div style={{
                position: 'absolute',
                inset: 0,
                opacity: pStage3,
                backgroundColor: palette.gridBg,
                backgroundImage: `radial-gradient(${palette.dotMid} 2px, transparent 2px)`,
                backgroundSize: '20px 20px',
                pointerEvents: 'none',
                // bg colour comes from the rAF-lerped `displayedColor` upstream — no
                // CSS transition needed (it would fight the per-frame state updates).
              }}>
                {pStage3 > 0.01 && (
                  <>
                    <style>{baseDotsAnim}</style>
                    {[
                      'base-dots-a 13s ease-in-out infinite',
                      'base-dots-b 17s ease-in-out infinite',
                      'base-dots-c 21s ease-in-out infinite',
                    ].map((anim, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        inset: 0,
                        // Lighter dots on the same 20px grid, so they sit exactly on the base dots.
                        backgroundImage: `radial-gradient(${palette.dotLight} 2px, transparent 2px)`,
                        backgroundSize: '20px 20px',
                        // Soft drifting blob reveals a patch of lighter dots; edges blend the greys.
                        WebkitMaskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
                        maskImage: 'radial-gradient(circle, #000 0%, #000 12%, transparent 58%)',
                        WebkitMaskSize: '65% 65%',
                        maskSize: '65% 65%',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        animation: anim,
                      }} />
                    ))}
                  </>
                )}
              </div>
              {/* 3D SVG — 2×2 grid of extruded icons, centred in the base rectangle.
                  Always mounted so the 4 WebGL canvases warm up + compile shaders in the
                  background during earlier scenes; by the time the base view appears
                  they're all ready, and the wrapper opacity fade reveals them in unison
                  with the base title + panel.  */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: baseVisible ? 1 : 0,
                // Asymmetric fade: subtle on entry (700ms), snappy on exit (150ms) so the
                // icons don't linger over the rectangle as it morphs back to OlySense.
                transition: baseVisible ? 'opacity 700ms ease-out' : 'opacity 150ms ease-in',
              }}>
                  <div style={{
                    width: 640,
                    height: 640,
                    pointerEvents: 'auto',
                  }}>
                    <BaseIconsCanvas icons={ICONS_16_BY_COL} color={palette.icon} />
                  </div>
                </div>
            </div>
            {/* Stroke shine — a bright highlight sweeps along the silver bezel
                ring on home + stage 1. The CSS mask-composite trick clips the
                moving gradient to just the border ring (between border-box
                and content-box). Fades out before stage 2 so the existing
                surface shine takes over once the morph starts. */}
            {(1 - Math.min(1, pFrameMorph * 4)) > 0.001 && (
              <>
                <style>{frameShineAnim}</style>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 40,
                  padding: frameBorderWidth,
                  background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 44%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.35) 56%, transparent 70%)',
                  backgroundSize: '280% 100%',
                  animation: 'frame-shine 5s ease-in-out infinite',
                  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 1 - Math.min(1, pFrameMorph * 4),
                  pointerEvents: 'none',
                }} />
              </>
            )}
          </div>
          {/* base title — fades in at the Olysense title's old screen spot, now inside the 1200px square */}
          <div style={{
            position: 'absolute',
            right: `calc(50% + ${BASE_LABEL_OFFSET}px)`,
            top: '50%',
            transform: `translateY(-50%) scale(${baseVisible ? 1 : 0.9})`,
            transformOrigin: 'center center',
            opacity: baseVisible ? 1 : 0,
            transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            pointerEvents: 'none',
          }}>
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 48, lineHeight: 'normal', color: '#A8A8A8', textAlign: 'center', margin: 0, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#FFFFFF' }}>base</span>.24
            </p>
          </div>
          {/* base tag + description + CTA — fades in at the Olysense panel's old screen spot, now inside the rectangle */}
          <div style={{
            position: 'absolute',
            left: `calc(50% + ${BASE_LABEL_OFFSET}px)`,
            top: '50%',
            transform: `translateY(-50%) scale(${baseVisible ? 1 : 0.9})`,
            transformOrigin: 'center center',
            width: 264,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            opacity: baseVisible ? 1 : 0,
            transition: 'opacity 450ms ease-out, transform 450ms ease-out',
            pointerEvents: baseVisible ? 'auto' : 'none',
          }}>
            {/* Tag */}
            <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 600, fontSize: 18, lineHeight: 'normal', color: '#FFFFFF', whiteSpace: 'nowrap', margin: 0 }}>
              RESOURCE
            </p>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: 20, lineHeight: '34px', color: '#A8A8A8', margin: 0 }}>
              Created <span style={{ color: '#FFFFFF' }}>base.24</span>, an open source icon set for Figma Design Community
            </p>
            <a
              href="#"
              onMouseEnter={() => setBaseVisitHovered(true)}
              onMouseLeave={() => setBaseVisitHovered(false)}
              style={{
                border: '2px solid #FCFCFC',
                borderRadius: 32,
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                width: 'fit-content',
                textDecoration: 'none',
                backgroundImage: 'linear-gradient(to right, #FCFCFC, #FCFCFC)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 0',
                backgroundSize: baseVisitHovered ? '100% 100%' : '0% 100%',
                transition: 'background-size 0.4s ease-out',
              }}>
              <p style={{ fontFamily: "'Stack Sans Notch', sans-serif", fontWeight: 300, fontSize: 16, letterSpacing: '0.16px', textAlign: 'center', whiteSpace: 'nowrap', margin: 0, flexShrink: 0, paddingLeft: 4 }}>
                {'View on '.split('').map((char, i) => (
                  <span
                    key={i}
                    style={{
                      color: baseVisitHovered ? '#000000' : '#FFFFFF',
                      fontSize: 16,
                      lineHeight: '34px',
                      transition: `color 0.35s ease-out ${i * 22}ms`,
                    }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
                {/* Figma logo — sized to the 16px text height, sits before "Community" */}
                <FigmaLogo style={{ width: 13.79, height: 20.66, display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: -2, marginLeft: 3, marginRight: 5 }} />
                {'Community'.split('').map((char, i) => (
                  <span
                    key={`community-${i}`}
                    style={{
                      color: baseVisitHovered ? '#000000' : '#FFFFFF',
                      fontSize: 16,
                      lineHeight: '34px',
                      transition: `color 0.35s ease-out ${(i + 8) * 22}ms`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </p>
              <div style={{ position: 'relative', flexShrink: 0, width: 24, height: 24, animation: baseVisitHovered ? 'arrow-nudge-diag 0.7s ease-in-out infinite' : 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.75736 7.75737C6.75736 7.20508 7.20507 6.75737 7.75736 6.75737L16.2426 6.75737C16.7949 6.75737 17.2426 7.20508 17.2426 7.75737V16.2427C17.2426 16.7949 16.7949 17.2427 16.2426 17.2427C15.6904 17.2427 15.2426 16.7949 15.2426 16.2427V10.1716L8.46447 16.9498C8.07394 17.3403 7.44078 17.3403 7.05025 16.9498C6.65973 16.5592 6.65973 15.9261 7.05025 15.5355L13.8284 8.75737L7.75736 8.75737C7.20507 8.75737 6.75736 8.30965 6.75736 7.75737Z" style={{ fill: baseVisitHovered ? '#000000' : '#FFFFFF' }} />
                </svg>
              </div>
            </a>
          </div>
        </div>
        {/* Animated cursor — lives outside the frame container so it isn't
            clipped by overflow:hidden and doesn't inherit frameScale. Position
            is tracked in screen space via the targets' getBoundingClientRect,
            so resizing the frame keeps the cursor pinned. */}
        {pwaActive && (
          <AnimatedCursor
            phase={cursorPhase}
            copyEl={copyEl}
            startBtnEl={startBtnEl}
            frameEl={frameElRef.current}
          />
        )}
      </div>
    </div>
  );
}
