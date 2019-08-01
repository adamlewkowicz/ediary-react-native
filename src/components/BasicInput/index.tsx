import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TextInputProps, TextInput } from 'react-native';
import { Theme } from '../../common/theme';
import { TextAlignProperty } from 'csstype';

export interface BasicInputProps extends TextInputProps {
  label?: string
  minWidth?: number
  textAlign?: TextAlignProperty
  forwardedRef?: React.Ref<TextInput>
}
export const BasicInput = ({
  label,
  onBlur,
  onFocus,
  forwardedRef,
  textAlign,
  minWidth,
  ...props
}: BasicInputProps) => {
  const [isFocused, setFocused] = useState(false);
  return (
    <Container isFocused={isFocused} minWidth={minWidth}>
      {label && <Label>{label}:</Label>}
      <Input
        textAlign={textAlign}
        ref={forwardedRef}
        onFocus={(event) => {
          setFocused(true);
          onFocus && onFocus(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur && onBlur(event);
        }}
        {...props}
      />
    </Container>
  );
}

const Container = styled.View<{
  isFocused: boolean
  minWidth?: number
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.isFocused ? props.theme.focusColor : '#D7D7D7'};
  font-size: 15px;
  font-weight: 900;
  margin-bottom: 20px;
  min-width: ${props => props.minWidth || '100%'};
`

const Label = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: #D0CFD2;
  font-size: 15px;
  color: #BCBCBC;
`

const Input = styled.TextInput<{
  textAlign?: TextAlignProperty
}>`
  font-family: DMSans-Regular;
  font-weight: 600;
  font-size: 15px;
  padding: 8px 0;
  text-align: ${props => props.textAlign || 'left'};
`

export const BasicInputRef = React.forwardRef<
  TextInput,
  BasicInputProps
>((props, ref) => (
  <BasicInput {...props} forwardedRef={ref} />
));