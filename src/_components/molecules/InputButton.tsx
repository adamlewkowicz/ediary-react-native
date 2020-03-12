import React, { RefObject } from 'react';
import styled from 'styled-components/native';
import { ButtonSecondary, InputRef, InputProps } from '../index';
import { TouchableOpacityProps, TextInput } from 'react-native';

interface InputButtonProps extends InputProps {
  buttonText: string
  onButtonPress: TouchableOpacityProps['onPress']
}

export const InputButton = (props: InputButtonProps) => {
  const { buttonText, onButtonPress, forwardedRef, ...inputProps } = props;

  return (
    <InputRef
      {...inputProps}
      ref={forwardedRef}
      rightContent={(
        <ButtonSecondaryStyled onPress={onButtonPress}>
          {buttonText}
        </ButtonSecondaryStyled>
      )}
    />
  );
}

export const InputButtonRef = React.forwardRef<TextInput, InputButtonProps>(
  (props, ref) => <InputButton {...props} forwardedRef={ref as RefObject<TextInput>} />
);

const ButtonSecondaryStyled = styled(props => <ButtonSecondary {...props} />)`
  margin-left: ${props => props.theme.margin.inputSpace};
  min-width: 100px;
`