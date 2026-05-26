import { StatCard } from './StatCard';
import { DayBars, DETECTED_BARS } from './DayBars';
import { useFocusPlay } from './useFocusPlay';

// "Detected polyps" card (Figma 15768:2888): shared header/pill/number specs with
// a blue, rising 7-day vertical bar chart (detection up, like PDR).
export function DetectedCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  return (
    <StatCard
      title="Detected polyps"
      value="206"
      change="24%"
      trend="up"
      accentColor="#34C759"
      tagBg="rgba(179,239,189,0.41)"
      play={play}
      subtleCount
      chart={<DayBars rgb="0,122,255" days={DETECTED_BARS} play={play} />}
    />
  );
}
