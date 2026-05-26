// Rolling-digit (odometer) display for the PDR rate. Each digit is a vertical
// reel of 0–9 that translates to the active digit, so value changes roll.

const FONT = "'Manrope', sans-serif";
const SIZE = 120;
const WEIGHT = 400;
const DIGIT_H = 124; // height of one digit cell = roll distance per digit
const COLOR = '#000000';
const ROLL = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

function Reel({ digit }: { digit: number }) {
  return (
    <span style={{ display: 'inline-block', height: DIGIT_H, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{ display: 'block', transform: `translateY(${-digit * DIGIT_H}px)`, transition: ROLL }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} style={{ display: 'block', height: DIGIT_H, lineHeight: `${DIGIT_H}px`, textAlign: 'center' }}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function OdometerRate({ value }: { value: number }) {
  const digits = String(Math.round(value)).padStart(2, '0').split('').map(Number);
  return (
    <div style={{ display: 'flex', fontFamily: FONT, fontWeight: WEIGHT, fontSize: SIZE, color: COLOR, whiteSpace: 'nowrap' }}>
      {digits.map((d, i) => (
        <Reel key={i} digit={d} />
      ))}
      <span style={{ height: DIGIT_H, lineHeight: `${DIGIT_H}px` }}>%</span>
    </div>
  );
}
