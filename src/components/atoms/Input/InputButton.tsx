import React from 'react';
import styled from 'styled-components/native';
import { ButtonSecondary, Input, InputProps } from '../../index';
import { TouchableOpacityProps, TextInput } from 'react-native';

interface InputButtonProps extends InputProps {
  buttonText: string
  buttonLabel?: string
  onButtonPress: TouchableOpacityProps['onPress']
}

export const InputButton = React.forwardRef((
  props: InputButtonProps,
  ref: React.Ref<TextInput>
) => {
  const {
    buttonText,
    buttonLabel = buttonText,
    onButtonPress,
    ...inputProps
  } = props;

  return (
    <Input
      {...inputProps}
      ref={ref}
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
});

const ButtonSecondaryStyled = styled(props => <ButtonSecondary {...props} />)`
  margin-left: ${props => props.theme.spacing.small};
  min-width: 100px;
` as IButtonSecondary;

type IButtonSecondary = typeof ButtonSecondary;