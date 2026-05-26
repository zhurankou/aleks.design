import { useEffect, useState } from 'react';

// Returns true as soon as `focused` becomes true (so the chart animation is already
// running as the card slides into prominence — "preloaded"), and false immediately
// when focus is lost, so animations replay each time a card returns to prominence.
export function useFocusPlay(focused: boolean, delay = 0): boolean {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!focused) {
      setPlay(false);
      return;
    }
    const id = window.setTimeout(() => setPlay(true), delay);
    return () => window.clearTimeout(id);
  }, [focused, delay]);
  return play;
}
