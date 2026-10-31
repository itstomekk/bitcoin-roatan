import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const IslandMap = lazy(() => import('./IslandMap'));

// Leaflet and the places request only load once the visitor scrolls near the map,
// so the landing page's first paint stays light.
export function LazyIslandMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative z-10 w-full min-h-[700px]">
      {near && (
        <Suspense fallback={null}>
          <IslandMap />
        </Suspense>
      )}
    </div>
  );
}
