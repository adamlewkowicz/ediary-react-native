import React, { useRef, useEffect } from 'react';
import NativeActionSheet from 'react-native-actionsheet';

interface ActionSheetProps<T extends string> {
  title: string
  options: T[]
  onDismiss: () => void
  onAction: (option: T) => void
}

export const ActionSheet = <T extends string>(props: ActionSheetProps<T>) => {
  const actionSheet = useRef<NativeActionSheet>(null);
  const options = [...props.options, 'Anuluj'];
  const cancelButtonIndex = options.length - 1;

  useEffect(() => {
    actionSheet.current?.show();
  }, []);

  const handleOnPress = (index: number): void => {
    const option = props.options[index];

    if (index === cancelButtonIndex) {
      props.onDismiss();
    } else if (option) {
      props.onAction(option);
    }
  }

  return (
    <NativeActionSheet
      ref={actionSheet}
      title={props.title}
      options={options}
      cancelButtonIndex={cancelButtonIndex}
      onPress={handleOnPress}
    />
  );
}