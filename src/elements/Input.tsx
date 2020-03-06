import React from 'react';
import styled from 'styled-components/native'
import { InputLabel } from './Text'
import { TextInputProps } from 'react-native';
import { theme } from '../common/theme';

interface InputProps extends TextInputProps {
  label: string
}

export const Input = (props: InputProps) => {
  return (
    <Container>
      <InputLabel>{props.label}</InputLabel>
      <TextInput 
        {...props}
        placeholderTextColor={theme.color.tertiary}
      />
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: 20px;
  flex: 1;
`

const TextInput = styled.TextInput`
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.primary};
  padding: 11px 0;
`