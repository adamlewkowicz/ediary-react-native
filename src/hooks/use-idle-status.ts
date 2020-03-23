import { useState, useEffect } from 'react';

export function useIdleStatus(): boolean {
  const [idle, setIdle] = useState(false);
  
  useEffect(() => {
    const idleCallback = global.requestIdleCallback(() => setIdle(true));
    return () => global.cancelIdleCallback(idleCallback);
  }, []);

  return idle;
}