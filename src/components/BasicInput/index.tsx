import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';
import { Theme } from '../../common/theme';

interface BasicInputProps extends TextInputProps {
  label?: string
}
export const BasicInput = ({
  label,
  onBlur,
  onFocus,
  ...props
}: BasicInputProps) => {
  const [isFocused, setFocused] = useState(false);
  return (
    <Container isFocused={isFocused}>
      {label && <Label>{label}:</Label>}
      <Input
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
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.isFocused ? props.theme.focusColor : '#D7D7D7'};
  font-size: 15px;
  font-weight: 900;
  margin: 20px;
`

const Label = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: #D0CFD2;
  font-size: 15px;
  color: #BCBCBC;
`

const Input = styled.TextInput`
  font-family: DMSans-Regular;
  font-weight: 600;
  font-size: 15px;
  padding: 15px 0;
`