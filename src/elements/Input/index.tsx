import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components/native';
import { Text } from '../../elements';
import {
  TextInputProps as NativeTextInputProps,
  TextInput as NativeTextInput,
} from 'react-native';
import { theme } from '../../common/theme';
import { CheckedIcon } from '../../components/Icons';

interface TextInputProps extends NativeTextInputProps {
  label: string
  isValid?: boolean
  rightContent?: ReactNode
}

export const TextInput = (props: TextInputProps) => {
  const {
    label,
    accessibilityLabel = label,
    style,
    isValid,
    rightContent,
    ...inputProps
  } = props;
  const inputRef = useRef<NativeTextInput>(null);

  return (
    <Container
      style={style}
      isValid={isValid}
      onPress={inputRef.current?.focus}
    >
      <Label>{accessibilityLabel}</Label>
      <Content>
        <InputContainer isValid={isValid}>
          <Input
            ref={inputRef}
            accessibilityLabel={accessibilityLabel}
            placeholderTextColor={'#e3e3e3'}
            placeholderTextColor={theme.color.textTernary}
            {...inputProps}
          />
          {isValid && ValidationIcon}
        </InputContainer>
        {rightContent}
      </Content>
    </Container>
  );
}

const InputContainer = styled.View<{
  isValid?: boolean
}>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.isValid ? props.theme.color.success : '#D7D7D7'};
`

const Container = styled.TouchableOpacity<{
  isValid?: boolean
}>` 
  margin: 10px 0 25px 0;
`

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Input = styled.TextInput`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.textDark};
  padding: 15px 0;
  width: auto;
  font-size: 14px;
  flex: 1;
`

const Label = styled(Text)`
  /* color: ${props => props.theme.color.gray20}; */
  /* text-transform: uppercase;
  font-size: ${props => 12};
  letter-spacing: 2px; */
  font-size: 12px;
  /* color: ${props => props.theme.color.textDark}; */
  /* color: #D6D6D6; */
`

const ValidationIcon = (
  <CheckedIcon
    fill={theme.color.success}
    width={14}
    height={14}
  />
);