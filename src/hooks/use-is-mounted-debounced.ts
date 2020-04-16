import { useState, useEffect } from 'react'
import { useDebouncedValue } from './use-debounced-value';

export const useIsMountedDebounced = (delay = 500): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  const isMountedDebounced = useDebouncedValue(isMounted, delay);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMountedDebounced;
}