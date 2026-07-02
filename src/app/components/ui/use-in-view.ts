import * as React from "react";

// Tracks whether an element is near the viewport. Used on the mobile stacked
// pages to gate videos / WebGL / scripted demos so only the section on screen
// burns battery — desktop gates the same props via its scroll stages instead.
// rootMargin pre-triggers slightly before entry so playback is running by the
// time the element is actually visible.
export function useInView<T extends HTMLElement>(rootMargin = "15% 0px"): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}
