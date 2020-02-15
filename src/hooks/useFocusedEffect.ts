import { useFocusState } from 'react-navigation-hooks';
import { useEffect, EffectCallback, DependencyList } from 'react';

/** 
 * Behaves as component did mount lifecycle for react navigation,
 * since screens in react-navigation are not being unmounted,
 * although they are preserved between screen changes.
 */
export const useFocusedEffect = (
  effect: EffectCallback,
  dependencies: DependencyList = []
): void => {
  const { isFocused } = useFocusState();

  useEffect(effect, [isFocused, ...dependencies]);
}