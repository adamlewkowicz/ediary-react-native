import { ToastAndroid, Alert, LayoutAnimation } from 'react-native';

export const debounce = () => {
  let timeout: NodeJS.Timeout;
  return (callback: () => void, delay = 250) => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
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