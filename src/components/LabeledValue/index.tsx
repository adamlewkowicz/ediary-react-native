import React from 'react';
import styled from 'styled-components/native';
import { Title, Text } from '../Elements';
import { ViewProps } from 'react-native';

interface LabeledValueProps extends ViewProps {
  value: string
  label: string
  size?: 'medium' | 'large'
}

export const LabeledValue: React.FC<LabeledValueProps> = ({
  value,
  label,
  accessibilityLabel,
  ...props
}) => {
  return (
    <Container {...props}>
      <Value accessibilityLabel={accessibilityLabel}>
        {value}
      </Value>
      <Title>{label}</Title>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`

const Value = styled(Text)`
  font-size: 35px;
`