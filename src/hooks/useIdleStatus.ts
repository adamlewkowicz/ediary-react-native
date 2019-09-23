import { useState, useEffect } from 'react';

export function useIdleStatus(): boolean {
  const [idle, setIdle] = useState(false);
  
  useEffect(() => {
    const cancel = global.requestIdleCallback(() => setIdle(true));
    return () => cancel();
  }, []);

  return idle;
}