import React from 'react';
import styled from 'styled-components/native';
import { Input, InputProps } from './Input';
import { TextSecondary } from '../atoms/Text';

interface InputStatusProps extends InputProps {
  error?: string
  isDirty: boolean
}

export const InputStatus = (props: InputStatusProps) => {
  return (
    <Input
      {...props}
      bottomContent={props.error?.length && (
        <ErrorMessage>
          {props.error}
        </ErrorMessage>
      )}
    />
  );
}

const ErrorMessage = styled(TextSecondary)`
  margin-top: 5px;
  color: ${props => props.theme.color.error};
`