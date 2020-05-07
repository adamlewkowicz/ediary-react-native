import { useEffect, useState } from 'react'

export const useDebouncedValue = <T>(originalValue: T, delay = 700) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(originalValue);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedValue(originalValue),
      delay,
    );

    return () => clearTimeout(timeout);
  }, [originalValue]);

  return debouncedValue;
}