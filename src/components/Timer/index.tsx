import React from 'react';
import styled from 'styled-components/native';

interface TimerProps {
  duration: number
  percentage?: number
}

export const Timer = (props: TimerProps) => {
  return (
    <Container>
      <Duration>
        {props.duration}
      </Duration>
    </Container>
  );
}

const Container = styled.View`

`

const Duration = styled.Text`
  font-size: ${props => props.theme.fontSize.huge};
`