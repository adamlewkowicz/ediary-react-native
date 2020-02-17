import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

export const useMountedEffect = (
  effectCallback: EffectCallback,
  deps?: DependencyList,
): void => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return effectCallback();
    } else {
      isMounted.current = true;
    }
  }, deps);
}