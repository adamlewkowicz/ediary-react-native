import { EffectCallback, DependencyList, useRef } from 'react';
import { useMountedEffect } from './useMountedEffect';

export const useDebouncedEffect = (
  effectCallback: EffectCallback,
  deps?: DependencyList,
  delay = 250,
): void => {
  const timeout = useRef<NodeJS.Timeout>();

  useMountedEffect(() => {
    let cleanupCallback: ReturnType<EffectCallback>;

    timeout.current = setTimeout(
      () => cleanupCallback = effectCallback(),
      delay
    );

    return () => {
      clearTimeout(timeout.current as NodeJS.Timeout);
      cleanupCallback && cleanupCallback();
    };
  }, deps);
}