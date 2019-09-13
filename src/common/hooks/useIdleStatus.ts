import { useState, useEffect } from 'react';

export function useIdleStatus(): boolean {
  const [idle, setIdle] = useState(false);
  
  useEffect(() => {
    (global as any).requestIdleCallback(() => setIdle(true));
  }, []);

  return idle;
}