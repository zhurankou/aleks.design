import { useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import { StatCard } from './StatCard';
import { LineChart } from './LineChart';
import { Odometer } from './CountUp';
import { chartPaths } from './chartPaths';
import { useFocusPlay } from './useFocusPlay';

// y is top-down in the chart viewBox, so larger y = lower value.
const PRR_KNOTS: [number, number][] = [[0, 48], [120, 18], [230, 52], [300, 64], [362.884, 92]];
const PRR = chartPaths(PRR_KNOTS);
const KPI = 91; // = Retrieved 187 / Detected 206 (matches the 52/48 pie)
const RATE_START = 95; // < 100 so the read-out's rise to the peak never clamps
const Y_START = PRR_KNOTS[0][1];
const Y_END = PRR_KNOTS[PRR_KNOTS.length - 1][1];

// Rate read off the dot's height: start→end anchored to the KPI, following the curve.
const rateAt = (v: number) => {
  const y = PRR.sampleY(v);
  const r = RATE_START + (KPI - RATE_START) * ((Y_START - y) / (Y_START - Y_END));
  return Math.max(0, Math.min(100, r));
};

export function PrrCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  const [{ p }, api] = useSpring(() => ({ p: 1 }));
  useEffect(() => {
    if (play) api.start({ from: { p: 0 }, to: { p: 1 }, config: { tension: 26, friction: 22 } });
    else api.set({ p: 1 });
  }, [play, api]);

  return (
    <StatCard
      title="Polyps Retrieval Rate"
      value="91%"
      change="9%"
      trend="down"
      accentColor="#FF383C"
      tagBg="rgba(235,72,80,0.1)"
      play={play}
      valueNode={<Odometer value={p.to(rateAt)} places={2} suffix="%" />}
      chart={
        <LineChart strokeColor="#FF3B30" fillColor="#E83C5C" gradientId="prrFill" linePath={PRR.linePath} fillPath={PRR.fillPath} sampleY={PRR.sampleY} p={p} />
      }
    />
  );
}
