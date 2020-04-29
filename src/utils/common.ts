import { ToastAndroid, Alert, LayoutAnimation } from 'react-native';
import { Client as BugsnagClient } from 'bugsnag-react-native';
import { BUGSNAG_API_KEY } from 'react-native-dotenv';
import { IS_DEV } from '../common/consts';
import { AbortError } from '../common/error';
import { sortByClosestValue } from './sort';

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

export const cancelablePromise = <T, P extends Promise<T> = Promise<T>>(
  promise: P,
  { signal }: AbortController,
): Promise<T> => {
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

export const bindFormikProps = <
  F extends object,
  K extends keyof F,
>(
  formik: Formik<F>,
  formikProperty: K
) => {
  const isNotExistingProperty = !(formikProperty in formik.values);

  if (isNotExistingProperty) {
    throw new Error(`Unknown formik property "${formikProperty}"`);
  }

  return {
    value: formik.values[formikProperty],
    onChangeText: formik.handleChange(formikProperty as string),
    onBlur: formik.handleBlur(formikProperty as string),
    error: formik.errors[formikProperty],
    isDirty: (formik.touched as any)[formikProperty],
  };
}

interface Formik<F extends object> {
  values: F
  errors: F
  touched: object
  handleChange: (key: string) => any
  handleBlur: (key: string) => any
}

export const findClosestValue = <T extends number>(targetValue: T, values: T[]): T => {
  const [closestValue] = values.sort(sortByClosestValue(targetValue));
  console.log(values.sort(sortByClosestValue(targetValue)))
  return closestValue;
}