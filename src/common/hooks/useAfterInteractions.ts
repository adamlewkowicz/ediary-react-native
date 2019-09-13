import { InteractionManager } from 'react-native';
import { useEffect } from 'react';

export function useAfterInteractions(callback: () => void) {
  useEffect(() => {
    const { cancel } = InteractionManager.runAfterInteractions(callback);
    return () => cancel();
  }, []);
}