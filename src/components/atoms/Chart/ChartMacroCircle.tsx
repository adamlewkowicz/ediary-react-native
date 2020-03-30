import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle, ChartCircleProps } from './ChartCircle';
import { H4, TextSecondary } from '../Text';

interface ChartMacroCircleProps extends ChartCircleProps {
  title: string
  value: number
}

export const ChartMacroCircle = (props: ChartMacroCircleProps) => {
  return (
    <Container>
      <ChartCircle
        percentage={props.percentage}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentage}%</H4>
      </ChartCircle>
      <TextSecondary>{props.value.toFixed(1)}g</TextSecondary>
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`