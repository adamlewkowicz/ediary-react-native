import React, { useRef, useEffect } from 'react';
import { ActionSheetCustom as NativeActionSheet } from 'react-native-actionsheet';
import { StyleSheet } from 'react-native';
import { THEME } from '../../common/theme';

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
    return () => (actionSheet.current as any)?.hide();
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
      styles={style}
    />
  );
}

const style = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.4,
    backgroundColor: '#000'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    alignSelf: 'flex-end',
    backgroundColor: THEME.color.tertiary,
  },
  titleBox: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  titleText: {
    color: THEME.color.primary,
    fontFamily: THEME.fontWeight.light,
    fontSize: THEME.fontSizeRaw.regular,
  },
  messageBox: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.color.primaryLight
  },
  buttonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.color.primaryLight
  },
  buttonText: {
    fontSize: THEME.fontSizeRaw.regular,
    fontFamily: THEME.fontWeight.regular,
    color: THEME.color.highlight,
  },
});