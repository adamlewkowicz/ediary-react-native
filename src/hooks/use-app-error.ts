import { ToastAndroid } from 'react-native';
import * as Utils from '../utils';

export const useAppError = () => {

  const setAppError = (
    error: Error,
    userFriendlyMessage = 'Wystąpił nieoczekiwany błąd'
  ): void => {
    Utils.handleError(error);
    ToastAndroid.showWithGravity(
      userFriendlyMessage,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  }

  return { setAppError };
}