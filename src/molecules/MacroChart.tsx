import React from 'react';
import styled from 'styled-components/native';
import { CircleChart, CircleChartProps } from './CircleChart';
import { H4, TextPrimary } from '../elements/Text';

interface MacroChartProps extends CircleChartProps {
  title: string
  value: number
}

export const MacroChart = (props: MacroChartProps) => {
  return (
    <Container>
      <CircleChart
        percentages={props.percentages}
        gradientColors={props.gradientColors}
      >
        <H4>{props.percentages}%</H4>
      </CircleChart>
      <TextPrimary>{props.value}g</TextPrimary>
      <H4>{props.title}</H4>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`