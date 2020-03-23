import { ToastAndroid, Alert, LayoutAnimation } from 'react-native';
import { Client } from 'bugsnag-react-native';
import { BUGSNAG_API_KEY } from 'react-native-dotenv';
import { IS_DEV } from '../common/consts';

const bugsnag = new Client(BUGSNAG_API_KEY);

export const createDebouncedFunc = <T extends (...args: any) => any>(
  callback: T,
  delay = 250
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(args), delay);
  }
}

export const toastCenter = (message: string): void => {
  ToastAndroid.showWithGravity(
    message,
    ToastAndroid.SHORT,
    ToastAndroid.CENTER
  );
}

export const alertDelete = (
  title: string,
  message: string,
  onDeleteConfirmed: () => void  
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Anuluj',
        style: 'cancel'
      },
      {
        text: 'Usuń',
        onPress: onDeleteConfirmed
      }
    ]
  );
}

export const layoutAnimateEase = (onAnimationDidEnd?: () => void) => {
  LayoutAnimation.configureNext(
    LayoutAnimation.Presets.easeInEaseOut,
    onAnimationDidEnd
  );
}

export const toLocaleString = (value: number) => new Intl.NumberFormat('pl-PL').format(value);

export const handleError = (error: Error): void => {
  if (IS_DEV) {
    throw error;
  } else {
    bugsnag.notify(error);
  }
}