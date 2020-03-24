import React from 'react';
import styled from 'styled-components/native';
import { H2 } from '../../atoms/Text';

interface RadioInputProps {
  value: boolean
  onChange: (value: boolean) => void
  text: string
}

export const RadioInput = ({ value, text, onChange, ...inputProps }: RadioInputProps) => {
  return (
    <Container
      isActive={value}
      onPress={() => onChange(value)}
      {...inputProps}
    >
      <Title isActive={value}>{text}</Title>
    </Container>
  );
}

const SIZE = 42 as const;

const Container = styled.TouchableOpacity<{
  isActive: boolean
}>`
  border-radius: 50;
  border: ${props => `1px solid ${props.theme.color[props.isActive ? 'highlight' : 'tertiary']}`};
  width: ${SIZE};
  height: ${SIZE};
  align-items: center;
  justify-content: center;
`

const Title = styled(H2)<{
  isActive: boolean
}>`
  color: ${props => props.theme.color[props.isActive ? 'highlight' : 'secondary']};
`
