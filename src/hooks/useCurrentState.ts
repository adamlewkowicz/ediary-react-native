import { useState, useRef } from 'react';

/**
 * Similarly to `useState` causes re-render on updates,
 * but returns ref mutable object and mutates state during update.
 * 
 * Useful in situations where asynchronous nature of React's state
 * causes problems and current (not stale), mutable value is needed.
 */
export const useCurrentState = <T>(initialValue: T) => {
  const [value, setValue] = useState(useRef(initialValue));

  const handleSetValue = (nextValue: T): void => {
    value.current = nextValue;
    setValue({ current: nextValue });
  }

  return [value, handleSetValue] as const;
}