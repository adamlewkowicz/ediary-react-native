import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TextInputProps, ActivityIndicator } from 'react-native';
import { Theme } from '../../common/theme';
import { LoupeIcon } from '../Icons';
import { _InputSearcherLoupe } from '../../common/zIndex';

const LOUPE_SIZE = 18;

interface InputSearcherProps extends TextInputProps {
  showLabel?: boolean
  isLoading?: boolean
}
export const InputSearcher = ({
  placeholder,
  onBlur,
  onFocus,
  showLabel = false,
  isLoading = false,
  ...props
}: InputSearcherProps) => {
  const [isFocused, setFocused] = useState(false);

  return (
    <Container>
      <Input
        placeholder={placeholder}
        onFocus={(event) => {
          if (onFocus) onFocus(event);
          setFocused(true);
        }}
        onBlur={(event) => {
          if (onBlur) onBlur(event);
          setFocused(false);
        }}
        {...props}
      />
      {placeholder && showLabel && (
        <Label isFocused={isFocused}>
          {placeholder}
        </Label>
      )}
      {isLoading && <Spinner />}
      <StyledLoupeIcon
        fill="#272733"
        width={LOUPE_SIZE}
        height={LOUPE_SIZE}
        zIndex={_InputSearcherLoupe}
        style={{ transform: [{ translateY: -LOUPE_SIZE / 2 }] }}
      />
    </Container>
  );
}

const Container = styled.View`
  position: relative;
`

const Spinner = styled(ActivityIndicator)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-10px);
`

const StyledLoupeIcon = styled(LoupeIcon)`
  position: absolute;
  top: 50%;
  left: 15px;
`

const Input = styled.TextInput<{
  theme: Theme
}>`
  background-color: #E3E3E3;
  border-radius: 30;
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize};
  padding-left: 45px;
`

const Label = styled.Text<{
  theme: Theme
  isFocused: boolean
}>`
  position: absolute;
  left: ${45};
  font-family: ${props => props.theme.fontFamily};
  font-size: ${props => props.theme.fontSize};
  top: 50%;
  height: 20px;
  color: #8F8F8F;
  color: ${props => props.isFocused ? props.theme.focusColor : '#8F8F8F'};
  transform: ${props => `translateY(${props.isFocused ? -50 : -10}px)`};
`