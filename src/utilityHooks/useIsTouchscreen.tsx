import { useEffect, useState } from 'react';

export default function useIsTouchscreen() {
  const [isTouchscreen, setIsTouchscreen] = useState(false);

  useEffect(() => {
    setIsTouchscreen(
      (window !== undefined && 'ontouchstart' in window) ||
        navigator.maxTouchPoints > 0,
    );
  }, []);

  return isTouchscreen;
}
