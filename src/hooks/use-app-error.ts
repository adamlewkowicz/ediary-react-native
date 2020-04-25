import { ToastAndroid } from 'react-native';
import * as Utils from '../utils';
import { useCallback } from 'react';

export const useAppError = () => {

  const setAppError = useCallback((
    error: Error,
    userFriendlyMessage = 'Wystąpił nieoczekiwany błąd'
  ): void => {
    Utils.handleError(error);

    ToastAndroid.showWithGravity(
      userFriendlyMessage,
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }, []);

  return { setAppError };
}