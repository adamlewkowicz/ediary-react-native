import React from 'react';
import styled from 'styled-components/native';
import { Title, Text } from '../Elements';

interface LabeledValueProps {
  value: string
  label: string
  size?: 'medium' | 'large'
}

export const LabeledValue: React.FC<LabeledValueProps> = (props) => {
  return (
    <Container>
      <Value>{props.value}</Value>
      <Title>{props.label}</Title>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`

const Value = styled(Text)`
  font-size: 35px;
`