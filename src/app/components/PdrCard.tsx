import { useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import { StatCard } from './StatCard';
import { LineChart } from './LineChart';
import { Odometer } from './CountUp';
import { chartPaths } from './chartPaths';
import { useFocusPlay } from './useFocusPlay';

// Fixed line from the Figma PDR node (knots in the chart viewBox).
const PDR_KNOTS: [number, number][] = [[0, 74], [136, 48], [240, 14], [362.884, 24]];
const PDR = chartPaths(PDR_KNOTS);
const KPI = 54;
const RATE_START = KPI - 17; // ↑17% → grew from 37% up to 54%
const Y_START = PDR_KNOTS[0][1];
const Y_END = PDR_KNOTS[PDR_KNOTS.length - 1][1];

// Rate read off the dot's height: start→end anchored to the KPI, following the
// curve in between (so the number matches where the dot is on the line).
const rateAt = (v: number) => {
  const y = PDR.sampleY(v);
  const r = RATE_START + (KPI - RATE_START) * ((Y_START - y) / (Y_START - Y_END));
  return Math.max(0, Math.min(100, r));
};

export function PdrCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  const [{ p }, api] = useSpring(() => ({ p: 1 }));
  useEffect(() => {
    if (play) api.start({ from: { p: 0 }, to: { p: 1 }, config: { tension: 26, friction: 22 } });
    else api.set({ p: 1 });
  }, [play, api]);

  return (
    <StatCard
      title="Polyps Detection Rate"
      value="54%"
      change="17%"
      trend="up"
      accentColor="#34C759"
      tagBg="rgba(179,239,189,0.41)"
      play={play}
      valueNode={<Odometer value={p.to(rateAt)} places={2} suffix="%" />}
      chart={
        <LineChart strokeColor="#007AFF" fillColor="#007AFF" gradientId="pdrFill" linePath={PDR.linePath} fillPath={PDR.fillPath} sampleY={PDR.sampleY} p={p} />
      }
    />
  );
}
