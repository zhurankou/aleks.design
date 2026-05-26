import { StatCard } from './StatCard';
import { DayBars, RETRIEVED_BARS } from './DayBars';
import { useFocusPlay } from './useFocusPlay';

// "retrieved" card (Figma 15768:3840): shared header/pill/number specs with a red,
// rising 7-day vertical bar chart. Retrieved (187) = Detected (206) × the 91%
// retrieval rate; it rose ↑13% as detection climbed faster than the rate dipped.
// The Figma title read "Detected polyps" (a leftover) — corrected to "Retrieved polyps".
export function RetrievedCard({ focused }: { focused: boolean }) {
  const play = useFocusPlay(focused);
  return (
    <StatCard
      title="Retrieved polyps"
      value="187"
      change="13%"
      trend="up"
      accentColor="#34C759"
      tagBg="rgba(179,239,189,0.41)"
      play={play}
      subtleCount
      chart={<DayBars rgb="232,60,92" days={RETRIEVED_BARS} play={play} />}
    />
  );
}
