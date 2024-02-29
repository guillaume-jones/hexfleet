import { useEffect, useState } from 'react';

export default function useDeviceType() {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    try {
      document.createEvent('TouchEvent');
      setIsTouchScreen(true);
    } catch (e) {
      setIsTouchScreen(false);
    }
  }, []);

  return { isTouchScreen };
}
