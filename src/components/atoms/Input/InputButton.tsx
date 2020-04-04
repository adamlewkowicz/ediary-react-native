import React, { RefObject } from 'react';
import styled from 'styled-components/native';
import { ButtonSecondary, InputRef, InputProps } from '../../index';
import { TouchableOpacityProps, TextInput } from 'react-native';

interface InputButtonProps extends InputProps {
  buttonText: string
  buttonLabel?: string
  onButtonPress: TouchableOpacityProps['onPress']
}

export const InputButton = (props: InputButtonProps) => {
  const {
    buttonText,
    buttonLabel = buttonText,
    onButtonPress,
    forwardedRef, 
    ...inputProps
  } = props;

  return (
    <InputRef
      {...inputProps}
      ref={forwardedRef}
      rightContent={(
        <ButtonSecondaryStyled
          onPress={onButtonPress}
          accessibilityLabel={buttonLabel}
        >
          {buttonText}
        </ButtonSecondaryStyled>
      )}
    />
  );
}

export const InputButtonRef = React.forwardRef<TextInput, InputButtonProps>(
  (props, ref) => <InputButton {...props} forwardedRef={ref as RefObject<TextInput>} />
);

const ButtonSecondaryStyled = styled(
  (props => <ButtonSecondary {...props} />) as IButtonSecondary
)`
  margin-left: ${props => props.theme.spacing.small};
  min-width: 100px;
` as IButtonSecondary;

type IButtonSecondary = typeof ButtonSecondary;