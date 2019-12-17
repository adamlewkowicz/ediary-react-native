import { Alert as NativeAlert, AlertButton, AlertOptions } from 'react-native';

export const AsyncAlert = (
  title: string,
  message: string,
  buttons: AlertButton[],
  options?: AlertOptions
): Promise<void> => {
  return new Promise<void>((resolve) => {
    const wrappedButtons: AlertButton[] = buttons.map(button => {
      const newOnPress = () => {
        resolve();
        button.onPress?.();
      }

      const newButton: AlertButton = {
        ...button,
        onPress: newOnPress
      }
      
      return newButton;
    });

    NativeAlert.alert(
      title,
      message,
      wrappedButtons,
      { cancelable: false, ...options }
    );
  });
}