import { useEffect, useMemo, useRef, useState } from 'react';

type UseInfiniteScrollOptions<T> = {
  items: T[];
  pageSize: number;
  resetKeys?: unknown[];
  rootMargin?: string;
};

export function useInfiniteScroll<T>({
  items,
  pageSize,
  resetKeys = [],
  rootMargin = '160px 0px',
}: UseInfiniteScrollOptions<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const resetKey = useMemo(() => resetKeys.join('|'), [resetKeys]);
  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [pageSize, resetKey]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + pageSize, items.length));
        }
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, items.length, pageSize, rootMargin]);

  return {
    hasMore,
    loadMoreRef,
    visibleItems,
  };
}
