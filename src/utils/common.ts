import { ToastAndroid, Alert, LayoutAnimation } from 'react-native';
import { Client as BugsnagClient } from 'bugsnag-react-native';
import { BUGSNAG_API_KEY } from 'react-native-dotenv';
import { IS_DEV } from '../common/consts';
import { AbortError } from '../common/error';

export const createDebouncedFunc = <T extends (...args: any) => any>(
  callback: T,
  delay = 250
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args as Parameters<T>[]), delay);
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

const createBugsnagGetter = () => {
  let bugsnag: BugsnagClient | undefined;

  return (): BugsnagClient | undefined => {
    if (!bugsnag && !IS_DEV) {
      bugsnag = new BugsnagClient(BUGSNAG_API_KEY);
    }
    return bugsnag;
  }
}

const getBugsnag = createBugsnagGetter();

export const handleError = (error: Error): void => {
  if (IS_DEV) {
    console.warn(error);
  } else {
    getBugsnag()?.notify(error);
  }
}

export const cancelablePromise = <T, P extends Promise<T>>(promise: P, signal: AbortSignal): Promise<T> => {
  return new Promise<T>(async (resolve, reject) => {
    const abortHandler = () => reject(new AbortError());

    try {
      signal.addEventListener('abort', abortHandler);
    
      const result = await promise;

      resolve(result);

    } catch(error) {
      reject(error);

    } finally {
      signal.removeEventListener('abort', abortHandler);
    }
  });
}