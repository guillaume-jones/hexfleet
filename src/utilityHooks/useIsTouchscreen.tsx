import { useMemo } from 'react';

export default function useIsTouchscreen() {
  return useMemo(
    () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    [],
  );
}
