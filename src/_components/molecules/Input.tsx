import React, { ReactNode, RefObject } from 'react';
import styled from 'styled-components/native'
import { TextInputProps, TextInput as NativeTextInput } from 'react-native';
import { theme } from '../../common/theme';
import { InputLabel } from '../index';

export interface InputProps extends TextInputProps  {
  label: string
  rightContent?: ReactNode
  type?: 'text' | 'numeric'
  forwardedRef?: RefObject<NativeTextInput>
}

export const Input = (props: InputProps) => {
  const {
    rightContent,
    label,
    accessibilityLabel = label,
    forwardedRef,
    ...inputProps
  } = props;

  return (
    <Container>
      <InputLabel>{label}</InputLabel>
      <Content>
        <TextInput
          accessibilityLabel={accessibilityLabel}
          placeholderTextColor={theme.color.tertiary}
          ref={forwardedRef}
          {...inputProps}
        />
        {rightContent}
      </Content>
    </Container>
  );
};

export const InputRef = React.forwardRef<NativeTextInput, InputProps>(
  (props, ref) => <Input {...props} forwardedRef={ref as RefObject<NativeTextInput>} />
);

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
  flex: 1;
  font-size: 16px;
`

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
`