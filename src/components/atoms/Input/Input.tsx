import React, { ReactNode } from 'react';
import styled from 'styled-components/native'
import { TextInputProps, TextInput as NativeTextInput } from 'react-native';
import { THEME } from '../../../common/theme';
import { InputLabel, TextPrimary } from '../index';

export interface InputProps extends TextInputProps  {
  label: string
  rightContent?: ReactNode
  error?: string
  isDirty?: boolean
}

export const Input = React.forwardRef((
  props: InputProps,
  ref: React.Ref<NativeTextInput>
) => {
  const {
    rightContent,
    label,
    accessibilityLabel = label,
    ...inputProps
  } = props;

  const validationStatus: ValidationStatus = props.isDirty ? props.error?.length ? (
    'error'
  ) : (
    'success'
  ) : (
    'neutral'
  );

  return (
    <Container>
      <InputLabel>{label}</InputLabel>
      <Content>
        <TextInput
          status={validationStatus}
          accessibilityLabel={accessibilityLabel}
          ref={ref}
          {...inputProps}
        />
        {rightContent}
      </Content>
      {props.error?.length && (
        <ErrorMessage>
          {props.error}
        </ErrorMessage>
      )}
    </Container>
  );
});

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacing.small};
  flex: 1;
`

const TextInput = styled.TextInput.attrs(props => ({
  placeholderTextColor: THEME.color.tertiary as string
}))<{
  status: ValidationStatus
}>`
  border-bottom-color: ${props => {
    const colorName = props.status === 'neutral' ? 'tertiary' : props.status;
    return props.theme.color[colorName];
  }};
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

const ErrorMessage = styled(TextPrimary)`
  margin-top: ${props => props.theme.spacing.micro};
  color: ${props => props.theme.color.error};
`

type ValidationStatus = 'error' | 'success' | 'neutral';