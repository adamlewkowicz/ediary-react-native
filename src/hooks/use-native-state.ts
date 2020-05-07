import { useState, useCallback } from 'react'

/**
 * Native React's Class setState equivalent with partial state updates.
 * Better performance than regular multi-hook solution, since updates are "batched" together.
 */
export const useNativeState = <T extends object>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);

  const handlePartialSetState = useCallback((nextState: Partial<T>): void => {
    setState(prevState => ({ ...prevState, ...nextState }));
  }, []);

  return [state, handlePartialSetState] as const;
}