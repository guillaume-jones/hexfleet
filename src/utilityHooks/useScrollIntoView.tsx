import { useCallback, useRef } from 'react';

export default function useScrollIntoView() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollIntoView = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scrollRef]);

  return { scrollRef, scrollIntoView };
}
