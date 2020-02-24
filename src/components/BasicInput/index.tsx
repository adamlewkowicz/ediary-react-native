import React, { useState, createRef } from 'react';
import styled from 'styled-components/native';
import {
  TextInputProps,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { TextAlignProperty } from 'csstype';
import { theme } from '../../common/theme';

export interface BasicInputProps extends TextInputProps {
  label?: string
  minWidth?: number
  textAlign?: TextAlignProperty
  forwardedRef?: React.RefObject<TextInput>
}

export const BasicInput = ({
  label,
  onBlur,
  onFocus,
  forwardedRef,
  textAlign,
  minWidth,
  ...inputProps
}: BasicInputProps) => {
  const [isFocused, setFocused] = useState(false);
  const [defaultInputRef] = useState(createRef<TextInput>());
  const genericRef = forwardedRef || defaultInputRef;

  const handleOnFocus = (event?: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    genericRef.current?.focus();

    if (onFocus && event) {
      onFocus(event);
    }
  }

  const handleOnBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur && onBlur(event);
  }

  return (
    <Container
      isFocused={isFocused}
      minWidth={minWidth}
      onPress={() => handleOnFocus()}
    >
      {label && <Label>{label}:</Label>}
      <Input
        textAlign={textAlign}
        ref={genericRef}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        placeholderTextColor={theme.color.gray10}
        {...inputProps}
      />
    </Container>
  );
}

const Container = styled.TouchableOpacity<{
  isFocused: boolean
  minWidth?: number
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.isFocused ? props.theme.color.focus : '#D7D7D7'};
  min-width: ${props => props.minWidth || '100%'};
  margin-bottom: 10px;
`

const Label = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: ${props => props.theme.color.gray30};
`

const Input = styled.TextInput<{
  textAlign?: TextAlignProperty
}>`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  padding: 10px 0;
  text-align: ${props => props.textAlign || 'left'};
`

export const BasicInputRef = React.forwardRef<TextInput, BasicInputProps>(
  (props, ref) => (
    <BasicInput
      {...props}
      forwardedRef={ref as React.RefObject<TextInput>}
    />
  )
);